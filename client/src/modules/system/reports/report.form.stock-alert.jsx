import { ArchiveBoxArrowDownIcon, ArrowPathIcon, PresentationChartLineIcon, PrinterIcon } from "@heroicons/react/24/outline"
import { saveAs } from 'file-saver'
import moment from "moment"
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import * as XLSX from 'xlsx'
import { sortBy } from "../../../utilities/functions/array.functions"
import { sqlDate } from "../../../utilities/functions/datetime.functions"
import { cleanDisplay, getBranch, isEmpty } from "../../../utilities/functions/string.functions"
import useAuth from "../../../utilities/hooks/useAuth"
import DataRecords from "../../../utilities/interface/datastack/data.records"
import { useFetchAllBranchMutation } from "../../library/branch/branch.services"
import { useFetchAllCategoryMutation } from "../../library/category/category.services"
import { useStockAlertReportMutation } from "./reports.services"

const ReportsFormStockAlert = () => {
    const auth = useAuth()
    const dispatch = useDispatch()
    const reportSelector = useSelector(state => state.reports)
    const searchSelector = useSelector(state => state.search)
    const [refetch, setRefetch] = useState(false)
    const [data, setdata] = useState()
    const [records, setrecords] = useState()
    const [sorted, setsorted] = useState()
    const [startpage, setstartpage] = useState(1)
    const [showDiscrepancy, setShowDiscrepancy] = useState(false)
    const itemsperpage = 150
    const [filters, setFilters] = useState({ asof: sqlDate(), store: getBranch(auth) || "JT-MAIN", category: "" })
    const [mounted, setMounted] = useState(false)
    const [isPreparing, setIsPreparing] = useState(false)
    useEffect(() => { setMounted(true) }, [])

    useEffect(() => {
        if (mounted) {
            return () => {
                localStorage.removeItem("reports")
            }
        }
    }, [mounted])

    const onChange = (e) => {
        const { name, value } = e.target
        setFilters(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const [libBranches, setLibBranches] = useState()
    const [libCategories, setLibCategoies] = useState()

    const [allBranches] = useFetchAllBranchMutation()
    const [allCategories] = useFetchAllCategoryMutation()
    const [allStocks, { isLoading }] = useStockAlertReportMutation()

    const refetchInstance = async () => {
        if (reportSelector.report === "Stock Alert") {
            await allStocks({ store: filters.store, category: filters.category })
                .unwrap()
                .then(res => {
                    if (res.success) {
                        setdata(
                            res.data
                                ?.filter(item => Number(item.stocks) <= Number(item.alert))
                                ?.map(item => {
                                    return {
                                        ...item,
                                        level: item.stocks < item.alert ? "Yes" : ""
                                    }
                                })
                        )
                    }
                })
                .catch(err => {
                    console.error(err)
                    setIsPreparing(false)
                })
        }
        setRefetch(false)
    }

    useEffect(() => {
        const instantiate = async () => {
            setIsPreparing(true)
            await allBranches()
                .unwrap()
                .then(res => {
                    if (res.success) {
                        if (isEmpty(getBranch(auth))) {
                            setLibBranches(res?.arrayResult.map(item => {
                                return {
                                    key: item.code,
                                    value: item.code
                                }
                            }))
                            return
                        }
                        setLibBranches([{
                            key: auth.store,
                            value: auth.store
                        }])
                    }
                })
                .catch(err => {
                    console.error(err)
                    setIsPreparing(false)
                })
            await allCategories()
                .unwrap()
                .then(res => {
                    if (res.success) {
                        setLibCategoies(res?.arrayResult.map(item => {
                            return {
                                key: item.name,
                                value: item.name
                            }
                        }))
                    }
                })
                .catch(err => {
                    console.error(err)
                    setIsPreparing(false)
                })
            refetchInstance()
        }
        if (!isEmpty(reportSelector.report)) {
            instantiate()
        }
    }, [reportSelector.report])

    useEffect(() => {
        if (refetch) refetchInstance()
    }, [refetch])

    const columns = {
        style: '',
        items: [
            { name: 'Product', stack: false, sort: 'product' },
            { name: 'Variant', stack: true, sort: 'variant', size: 350 },
            { name: 'Category', stack: true, sort: 'category', size: 250 },
            { name: 'Alert Qty', stack: true, sort: 'alert', size: 150, position: "center" },
            { name: 'Current Stocks', stack: true, sort: 'stocks', size: 200, position: "center" },
            { name: 'Critical Level', stack: true, sort: 'level', size: 150, position: "center" },
        ]
    }

    const items = (item) => {
        const cost = item.cost || 0
        return [
            { value: item.product },
            { value: cleanDisplay(item.variant) },
            { value: item.category },
            { value: item.alert },
            { value: item.stocks },
            { value: item.level },
        ]
    }

    const total = (item) => {
        return [
            { value: "OVERALL SUMMARY" },
            { value: "" },
            { value: "" },
            { value: "" },
            { value: item?.reduce((prev, curr) => prev + curr.stocks, 0) },
            { value: item?.reduce((prev, curr) => prev + (curr.level === "Yes" ? 1 : 0), 0) },
        ]
    }

    const hasDiscrepancy = (item) => {
        const totalIn = item.beginning + item.goodsin + item.purchase + item.adjustment + item.unreceived
        const totalOut = item.sold + item.goodsout + item.deducted + item.pending
        const computedEndBalance = totalIn - totalOut
        const validEndBalance = item.endbalance
        return validEndBalance !== computedEndBalance
    }

    useEffect(() => {
        if (data) {
            let filtered = data
            if (showDiscrepancy) {
                filtered = data?.filter(item => hasDiscrepancy(item))
            }
            if (searchSelector.searchKey) {
                let sought = searchSelector.searchKey?.toLowerCase()
                filtered = filtered?.filter(f => (
                    cleanDisplay(f.inventory)?.toLowerCase()?.includes(sought)
                ))
            }
            let tempdata = sorted ? sortBy(filtered, sorted) : filtered
            setrecords(tempdata?.map((item, i) => {
                return {
                    key: item.id,
                    items: items(item),
                }
            }))
            setIsPreparing(false)
        }
    }, [data, sorted, reportSelector.report, showDiscrepancy, searchSelector.searchKey])

    const printData = () => {
        if (records?.length) {
            localStorage.setItem("reports", JSON.stringify({
                title: reportSelector.report,
                subtext1: `as of: ${moment(new Date()).format("MMMM DD, YYYY hh:mm A")}`,
                subtext2: `Branch: ${filters.store || "All"} | Category: ${filters.category || "All"}`,
                columns: columns,
                total: total(data),
                data: records
            }))
            window.open(`/#/print/reports/${moment(new Date()).format("MMDDYYYYHHmmss")}-${filters.store}-${filters.category}`, '_blank')
        }
    }

    const exportData = () => {
        if (data?.length) {
            let type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
            const ws = XLSX.utils.json_to_sheet([{ ...filters, store: filters.store, category: filters.category || "All" }, ...data])
            const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] }
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
            const excelData = new Blob([excelBuffer], { type: type })
            saveAs(excelData, `${reportSelector.report?.toLowerCase()?.replaceAll(" ", "_")}_export_on_${moment(new Date()).format('YYYY_MM_DD_HH_mm_ss')}.xlsx`)
        }
    }

    const toggleDiscrepancies = () => {
        setShowDiscrepancy(prev => !prev)
    }

    const reLoad = () => {
        setRefetch(true)
    }

    return (
        (reportSelector.manager && reportSelector.report === "Stock Alert") ? (
            <>
                <div className="w-full uppercase font-bold flex flex-col lg:flex-row justify-start gap-3 lg:gap-0 lg:justify-between lg:items-center no-select text-base lg:text-lg px-3 lg:px-0">
                    <div className="flex gap-4 ml-14 items-center lg:ml-16 py-2 text-sm lg:text-base">
                        <PresentationChartLineIcon className="w-8 h-8" />
                        {reportSelector.report}
                    </div>
                    <div className="flex flex-wrap lg:flex-nowrap items-center gap-2">
                        {/* <input type="date" name="asof" className="report-select-filter text-sm w-full lg:w-[200px]" value={filters.asof} onChange={onChange} /> */}
                        <select name="store" className="report-select-filter text-sm w-full lg:w-[200px]" value={filters.store} onChange={onChange}>
                            {/* <option value="" className="text-gray-500 font-bold">ALL STORES</option> */}
                            {
                                libBranches?.map(branch => (
                                    <option key={branch.key} value={branch.value}>{branch.key}</option>
                                ))

                            }
                        </select>
                        <select name="category" className="report-select-filter text-sm w-full lg:w-[200px]" value={filters.category} onChange={onChange}>
                            <option value="" className="text-gray-500 font-bold">ALL CATEGORIES</option>
                            {
                                libCategories?.map(category => (
                                    <option key={category.value} value={category.value}>{category.key}</option>
                                ))

                            }
                        </select>
                        <div className="flex gap-2">
                            <button className="button-red py-2" onClick={() => reLoad()}>
                                <ArrowPathIcon className="w-5 h-5" />
                            </button>
                            {
                                isEmpty(getBranch(auth)) ? (
                                    <>
                                        <button className="button-red py-2" onClick={() => printData()}>
                                            <PrinterIcon className="w-5 h-5" />
                                        </button>
                                        <button className="report-button py-2" onClick={() => exportData()}>
                                            <ArchiveBoxArrowDownIcon className="w-5 h-5" />
                                        </button>
                                    </>
                                ) : null
                            }
                        </div>
                    </div>
                </div>
                <div className="flex w-full gap-2 mt-4 overflow-x-auto lg:overflow-x-none">
                    {
                        Array.from({ length: 2 }, (_, i) => i + 4)?.map(n => (
                            <div key={n} className="flex flex-col w-[200px] lg:w-full py-3 px-5 border border-gray-400 hover:bg-gray-200 transition ease-in duration-300 flex-none lg:flex-1">
                                <span className="text-gray-500 no-select">
                                    {columns.items[n].name}
                                </span>
                                <span className="text-lg font-semibold">
                                    {isLoading
                                        ? <div className="skeleton-loading w-1/2"></div>
                                        : total(data)[n]?.value}
                                </span>
                            </div>
                        ))
                    }
                </div>
                <DataRecords
                    page={startpage}
                    columns={columns}
                    records={records}
                    setsorted={setsorted}
                    setPage={setstartpage}
                    itemsperpage={itemsperpage}
                    keeppagination={true}
                    loading={isLoading || isPreparing}
                    total={total(data)}
                />
            </>
        ) : null
    )
}

export default ReportsFormStockAlert
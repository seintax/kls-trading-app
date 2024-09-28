import { ArchiveBoxArrowDownIcon, ArrowPathIcon, PresentationChartLineIcon, PrinterIcon } from "@heroicons/react/24/outline"
import { saveAs } from 'file-saver'
import moment from "moment"
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import * as XLSX from 'xlsx'
import { sortBy } from "../../../utilities/functions/array.functions"
import { shortDate, sqlDate } from "../../../utilities/functions/datetime.functions"
import { NumFn, currency } from "../../../utilities/functions/number.funtions"
import { getBranch, isEmpty } from "../../../utilities/functions/string.functions"
import useAuth from "../../../utilities/hooks/useAuth"
import DataRecords from "../../../utilities/interface/datastack/data.records"
import { useFetchAllBranchMutation } from "../../library/branch/branch.services"
import { useFetchAllCategoryMutation } from "../../library/category/category.services"
import ReportsModalStoreItem from "./reports.modal.store-item"
import { setReportInventory, setReportShowItem } from "./reports.reducer"
import { useInventoryValuationReportMutation } from "./reports.services"

const ReportsFormInventoryValuation = () => {
    const auth = useAuth()
    const dispatch = useDispatch()
    const reportSelector = useSelector(state => state.reports)
    const searchSelector = useSelector(state => state.search)
    const [refetch, setRefetch] = useState(false)
    const [data, setdata] = useState()
    const [records, setrecords] = useState()
    const [sorted, setsorted] = useState()
    const [startpage, setstartpage] = useState(1)
    const itemsperpage = 150
    const [filters, setFilters] = useState({ asof: sqlDate(), store: "", category: "" })
    const [range, setRange] = useState({ startDate: sqlDate(), endDate: sqlDate() })
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

    const [libBranchers, setLibBranches] = useState()
    const [libCategories, setLibCategoies] = useState()

    const [allBranches] = useFetchAllBranchMutation()
    const [allCategories] = useFetchAllCategoryMutation()
    const [allInventory, { isLoading }] = useInventoryValuationReportMutation()

    const refetchInstance = async () => {
        if (reportSelector.report === "Inventory Valuation") {
            await allInventory({ store: filters.store, category: filters.category, asof: filters.asof })
                .unwrap()
                .then(res => {
                    if (res.success) {
                        setdata(res.data)
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
                        setLibBranches(res?.arrayResult.map(item => {
                            return {
                                key: item.code,
                                value: item.code
                            }
                        }))
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
            { name: 'Item', stack: false, sort: 'inventory' },
            { name: 'Part No.', stack: false, sort: 'variant1', size: 120 },
            { name: 'Date', stack: false, sort: 'date', size: 160 },
            { name: 'In Stock', stack: true, sort: 'stocks', size: 80 },
            { name: 'Cost', stack: true, sort: 'cost', size: 80 },
            { name: 'SRP', stack: true, sort: 'price', size: 120 },
            { name: 'Inv. Value', stack: true, size: 130 },
            { name: 'Retail Value', stack: true, size: 150 },
            { name: 'Potential Profit', stack: true, size: 150 },
            { name: 'Margin', stack: true, size: 130 },
        ]
    }

    const reformatCode = (code) => {
        let codeArr = code.split("-")
        let firstTag = codeArr.shift()
        return codeArr.join("-").slice(3, 15)
    }

    const cleanDisplay = (value) => {
        let formatted = value
        if (formatted?.includes("/-")) {
            formatted = value.replaceAll("/-", "")
        }
        if (formatted?.includes("-/")) {
            formatted = formatted.replaceAll("-/", "")
        }
        if (formatted?.slice(-2) === "//") {
            return formatted.replace("//", "")
        }
        if (formatted?.slice(-1) === "/") {
            return formatted.substring(0, formatted.length - 1)
        }
        return formatted
    }

    const items = (item) => {
        return [
            { value: cleanDisplay(item.inventory) },
            { value: item.variant1 },
            { value: shortDate(item.date) },
            { value: currency(item.stocks).replace(".00", "") },
            { value: currency(item.cost) },
            { value: currency(item.price) },
            { value: currency(item.value) },
            { value: currency(item.retail) },
            { value: currency(item.profit) },
            { value: NumFn.acctg.percent(item.profit / item.retail) },
        ]
    }

    const total = (item) => {
        let retail = item?.reduce((prev, curr) => prev + (curr.retail || 0), 0)
        let profit = item?.reduce((prev, curr) => prev + (curr.profit || 0), 0)
        return [
            { value: "OVERALL SUMMARY" },
            { value: "" },
            { value: "" },
            { value: currency(item?.reduce((prev, curr) => prev + (curr.stocks || 0), 0)).replace(".00", "") },
            { value: currency(item?.reduce((prev, curr) => prev + (curr.cost || 0), 0)) },
            { value: currency(item?.reduce((prev, curr) => prev + (curr.price || 0), 0)) },
            { value: currency(item?.reduce((prev, curr) => prev + (curr.value || 0), 0)) },
            { value: currency(retail) },
            { value: currency(profit) },
            { value: NumFn.acctg.percent(profit / retail) },
        ]
    }

    const toggleStoreItem = (item) => {
        dispatch(setReportInventory(item))
        dispatch(setReportShowItem(true))
    }

    useEffect(() => {
        if (data) {
            let filter = data
            if (searchSelector.searchKey) {
                let sought = searchSelector.searchKey?.toLowerCase()
                filter = data?.filter(f => (
                    cleanDisplay(f.inventory)?.toLowerCase()?.includes(sought) ||
                    f.variant1?.toLowerCase()?.includes(sought)
                ))
            }
            let tempdata = sorted ? sortBy(filter, sorted) : filter
            setrecords(tempdata?.map((item, i) => {
                return {
                    key: item.id,
                    items: items(item),
                    onclick: () => toggleStoreItem(item)
                }
            }))
            setIsPreparing(false)
        }
    }, [data, sorted, reportSelector.report, searchSelector.searchKey])

    const printData = () => {
        if (records?.length) {
            localStorage.setItem("reports", JSON.stringify({
                title: reportSelector.report,
                subtext1: `as of: ${moment(filters.asof).format("MMMM DD, YYYY")}`,
                subtext2: `Branch: ${filters.store || "All"} | Category: ${filters.category || "All"}`,
                columns: columns,
                total: total(data),
                data: records
            }))
            window.open(`/#/print/reports/${moment(new Date()).format("MMDDYYYY")}-${filters.store}`, '_blank')
        }
    }

    const exportData = () => {
        if (data?.length) {
            let type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
            const ws = XLSX.utils.json_to_sheet([{ ...filters, store: filters.store || "All" }, ...data])
            const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] }
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
            const excelData = new Blob([excelBuffer], { type: type })
            saveAs(excelData, `${reportSelector.report?.toLowerCase()?.replaceAll(" ", "_")}_export_on_${moment(new Date()).format('YYYY_MM_DD_HH_mm_ss')}.xlsx`)
        }
    }

    const reLoad = () => {
        setRefetch(true)
    }

    return (
        (reportSelector.manager && reportSelector.report === "Inventory Valuation") ? (
            <>
                <div className="w-full uppercase font-bold flex flex-col lg:flex-row justify-start gap-3 lg:gap-0 lg:justify-between lg:items-center no-select text-base lg:text-lg px-3 lg:px-0">
                    <div className="flex gap-4 ml-14 items-center lg:ml-16 py-2 text-sm lg:text-base">
                        <PresentationChartLineIcon className="w-8 h-8" />
                        {reportSelector.report}
                    </div>
                    <div className="flex flex-wrap lg:flex-nowrap items-center gap-2">
                        <input type="date" name="asof" className="report-select-filter text-sm w-full lg:w-[200px]" value={filters.asof} onChange={onChange} />
                        <select name="store" className="report-select-filter text-sm w-full lg:w-[200px]" value={filters.store} onChange={onChange}>
                            <option value="" className="text-gray-500 font-bold">ALL STORES</option>
                            {
                                isEmpty(getBranch(auth))
                                    ? (
                                        libBranchers?.map(branch => (
                                            <option key={branch.key} value={branch.value}>{branch.key}</option>
                                        ))
                                    )
                                    : <option key={auth.store} value={auth.store}>{auth.store}</option>

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
                            <button className="button-red py-2" onClick={() => printData()}>
                                <PrinterIcon className="w-5 h-5" />
                            </button>
                            <button className="report-button py-2" onClick={() => exportData()}>
                                <ArchiveBoxArrowDownIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex w-full gap-2 mt-4 overflow-x-auto lg:overflow-x-none">
                    {
                        Array.from({ length: 7 }, (_, i) => i + 3)?.map(n => (
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
                <ReportsModalStoreItem />
            </>
        ) : null
    )
}

export default ReportsFormInventoryValuation
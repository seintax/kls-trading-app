import { ArchiveBoxArrowDownIcon, ArrowPathIcon, PresentationChartLineIcon, PrinterIcon } from "@heroicons/react/24/outline"
import { saveAs } from 'file-saver'
import moment from "moment"
import { useEffect, useState } from 'react'
import { useSelector } from "react-redux"
import Datepicker from "react-tailwindcss-datepicker"
import * as XLSX from 'xlsx'
import { sortBy } from "../../../utilities/functions/array.functions"
import { longDate, sqlDate } from "../../../utilities/functions/datetime.functions"
import { currency } from "../../../utilities/functions/number.funtions"
import { getBranch, isEmpty } from "../../../utilities/functions/string.functions"
import useAuth from "../../../utilities/hooks/useAuth"
import DataRecords from "../../../utilities/interface/datastack/data.records"
import { useFetchAllBranchMutation } from "../../library/branch/branch.services"
import { useCashierSummaryReportMutation } from "./reports.services"

const ReportsFormCashierSummary = () => {
    const auth = useAuth()
    const reportSelector = useSelector(state => state.reports)
    const [refetch, setRefetch] = useState(false)
    const [data, setdata] = useState()
    const [records, setrecords] = useState()
    const [sorted, setsorted] = useState()
    const [startpage, setstartpage] = useState(1)
    const itemsperpage = 150
    const [filters, setFilters] = useState({ fr: sqlDate(), to: sqlDate(), store: isEmpty(getBranch(auth)) ? "" : auth.store })
    const [range, setRange] = useState({ startDate: sqlDate(), endDate: sqlDate() })
    const [mounted, setMounted] = useState(false)
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

    const onRangeChange = (newValue) => {
        setRange(newValue)
        setFilters(prev => ({
            ...prev,
            fr: newValue.startDate,
            to: newValue.endDate
        }))
    }

    const [libBranchers, setLibBranches] = useState()

    const [allBranches] = useFetchAllBranchMutation()
    const [cashierSummary] = useCashierSummaryReportMutation()

    useEffect(() => {
        const instantiate = async () => {
            await allBranches()
                .unwrap()
                .then(res => {
                    if (res.success) {
                        setLibBranches(res?.arrayResult.map(item => {
                            return {
                                key: item?.code,
                                value: item?.code
                            }
                        }))
                    }
                })
                .catch(err => console.error(err))
            if (reportSelector.report === "Cashier Summary") {
                await cashierSummary({ fr: filters.fr, to: filters.to, store: filters.store })
                    .unwrap()
                    .then(res => {
                        if (res.success) {
                            setdata(res.data)
                        }
                    })
                    .catch(err => console.error(err))
            }
            setRefetch(false)
        }
        if (!isEmpty(reportSelector.report) || refetch) {
            instantiate()
        }
    }, [reportSelector.report, refetch])

    const columns = {
        style: '',
        items: [
            { name: 'Date', stack: false, sort: 'day' },
            { name: 'Branch', stack: true, sort: 'branch', size: 120 },
            { name: 'Gross Sales', stack: true, sort: 'gross_sales', size: 130 },
            { name: 'Discounts', stack: true, sort: 'discounts', size: 130 },
            { name: 'Net Sales', stack: true, sort: 'net_sales', size: 130 },
            { name: 'Cash Sales', stack: true, sort: 'cash_sales', size: 130 },
            { name: 'Credit Sales', stack: true, sort: 'credit_sales', size: 130 },
            { name: 'Partial', stack: true, sort: 'partial', size: 130 },
            { name: 'Credit Collection', stack: true, sort: 'credit_collection', size: 130 },
            { name: 'Refunds', stack: true, sort: 'refunds', size: 130 },
        ]
    }

    const items = (item) => {
        return [
            { value: longDate(item?.day) },
            { value: item?.branch },
            { value: currency(item?.gross_sales) },
            { value: currency(item?.discounts) },
            { value: currency(item?.net_sales) },
            { value: currency(item?.cash_sales) },
            { value: currency(item?.credit_sales) },
            { value: currency(item?.partial) },
            { value: currency((item?.credit_collection - item?.partial) > 0 ? item?.credit_collection - item?.partial : 0) },
            { value: currency(item?.refunds) },
            // isDev(auth) ? {
            //     value: <div className={currency(item?.net_sales) === currency((item?.cash_sales || 0) + (item?.credit_sales || 0) + (item?.partial || 0)) ? "" : "text-red-500"}>
            //         {currency((item?.cash_sales || 0) + (item?.credit_sales || 0) + (item?.partial || 0))}
            //     </div>
            // } : null,
        ]
    }

    const total = (item) => {
        return [
            { value: "OVERALL TOTAL" },
            { value: null },
            { value: currency(item?.reduce((prev, curr) => prev + (curr?.gross_sales || 0), 0)) },
            { value: currency(item?.reduce((prev, curr) => prev + (curr?.discounts || 0), 0)) },
            { value: currency(item?.reduce((prev, curr) => prev + (curr?.net_sales || 0), 0)) },
            { value: currency(item?.reduce((prev, curr) => prev + (curr?.cash_sales || 0), 0)) },
            { value: currency(item?.reduce((prev, curr) => prev + (curr?.credit_sales || 0), 0)) },
            { value: currency(item?.reduce((prev, curr) => prev + (curr?.partial || 0), 0)) },
            { value: currency(item?.reduce((prev, curr) => prev + ((curr?.credit_collection - curr?.partial) > 0 ? curr?.credit_collection - curr?.partial : 0), 0)) },
            { value: currency(item?.reduce((prev, curr) => prev + (curr?.refunds || 0), 0)) },
            // isDev(auth) ? { value: currency(item?.reduce((prev, curr) => prev + ((curr?.cash_sales || 0) + (curr?.credit_sales || 0) + (curr?.partial || 0)), 0)) } : null,
        ]
    }

    useEffect(() => {
        if (data) {
            let tempdata = sorted ? sortBy(data, sorted) : data
            setrecords(tempdata?.map((item, i) => {
                return {
                    key: item?.id,
                    items: items(item)
                }
            }))
        }
    }, [data, sorted, reportSelector.report])

    const printData = () => {
        if (records?.length) {
            localStorage.setItem("reports", JSON.stringify({
                title: "Cashier: Daily Summary",
                subtext1: `Date: ${moment(filters.fr).format("MMMM DD, YYYY")} - ${moment(filters.to).format("MMMM DD, YYYY")}`,
                subtext2: `Branch: ${filters.store || "All"}`,
                columns: columns,
                total: total(data),
                data: records
            }))
            window.open(`/#/print/reports/${moment(filters.fr).format("MMDDYYYY")}-${moment(filters.to).format("MMDDYYYY")}-${filters.store || "All"}`, '_blank')
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
        (reportSelector.manager && reportSelector.report === "Cashier Summary") ? (
            <>
                <div className="w-full uppercase font-bold flex flex-col lg:flex-row justify-start gap-3 lg:gap-0 lg:justify-between lg:items-center no-select text-base lg:text-lg px-3 lg:px-0">
                    <div className="flex gap-4 ml-14 items-center lg:ml-16 py-2 text-sm lg:text-base">
                        <PresentationChartLineIcon className="w-8 h-8" />CASHIER SUMMARY
                    </div>
                    <div className="flex flex-wrap lg:flex-nowrap items-center gap-2">
                        <Datepicker
                            value={range}
                            onChange={onRangeChange}
                            showShortcuts={true}
                            readOnly
                        />
                        <select name="store" className="report-select-filter text-sm w-full lg:w-[200px]" value={filters.store} onChange={onChange}>
                            {
                                isEmpty(getBranch(auth))
                                    ? <option value="">All</option>
                                    : null
                            }
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
                        <div className="flex gap-2">
                            <button className="button-red py-2" onClick={() => reLoad()}>
                                <ArrowPathIcon className="w-5 h-5" />
                            </button>
                            <button className="button-red py-2" onClick={() => printData()}>
                                <PrinterIcon className="w-5 h-5" />
                            </button>
                            <button className="report-button py-2">
                                <ArchiveBoxArrowDownIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex w-full gap-2 mt-4 overflow-x-auto lg:overflow-x-none">
                    {
                        Array.from({ length: 8 }, (_, i) => i + 2)?.map(n => (
                            <div key={n} className="flex flex-col w-[200px] lg:w-full py-3 px-5 border border-gray-400 hover:bg-gray-200 transition ease-in duration-300 flex-none lg:flex-1">
                                <span className="text-gray-500 no-select">
                                    {columns.items[n].name}
                                </span>
                                <span className="text-lg font-semibold">
                                    {total(data)[n]?.value}
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
                    total={total(data)}
                />
            </>
        ) : null
    )
}

export default ReportsFormCashierSummary
import { ArrowPathIcon, PresentationChartLineIcon, PrinterIcon } from "@heroicons/react/24/outline"
import moment from "moment"
import { useEffect, useState } from 'react'
import { useSelector } from "react-redux"
import { longDate, sqlDate } from "../../../utilities/functions/datetime.functions"
import { currency } from "../../../utilities/functions/number.funtions"
import { getBranch, isDev, isEmpty } from "../../../utilities/functions/string.functions"
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
                                key: item.code,
                                value: item.code
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
            { name: 'Branch', stack: true, sort: 'branch', size: 150 },
            { name: 'Gross Sales', stack: true, sort: 'gross_sales', size: 150 },
            { name: 'Discounts', stack: true, sort: 'discounts', size: 150 },
            { name: 'Net Sales', stack: true, sort: 'net_sales', size: 150 },
            { name: 'Cash Sales', stack: true, sort: 'cash_sales', size: 150 },
            { name: 'Credit Sales', stack: true, sort: 'credit_sales', size: 150 },
            { name: 'Partial', stack: true, sort: 'partial', size: 150 },
            { name: 'Refunds', stack: true, sort: 'refunds', size: 150 },
            isDev(auth) ? { name: 'Income', stack: true, size: 150 } : null,
        ]
    }

    const items = (item) => {
        return [
            { value: longDate(item.day) },
            { value: item.branch },
            { value: currency(item.gross_sales) },
            { value: currency(item.discounts) },
            { value: currency(item.net_sales) },
            { value: currency(item.cash_sales) },
            { value: currency(item.credit_sales) },
            { value: currency(item.partial) },
            { value: currency(item.refunds) },
            isDev(auth) ? {
                value: <div className={currency(item.net_sales) === currency(item.cash_sales + item.credit_sales + item.partial) ? "" : "text-red-500"}>
                    {currency(item.cash_sales + item.credit_sales + item.partial)}
                </div>
            } : null,
        ]
    }

    const total = (item) => {
        return [
            { value: "TOTAL" },
            { value: null },
            { value: currency(item?.reduce((prev, curr) => prev + (curr.gross_sales || 0), 0)) },
            { value: currency(item?.reduce((prev, curr) => prev + (curr.discounts || 0), 0)) },
            { value: currency(item?.reduce((prev, curr) => prev + (curr.net_sales || 0), 0)) },
            { value: currency(item?.reduce((prev, curr) => prev + (curr.cash_sales || 0), 0)) },
            { value: currency(item?.reduce((prev, curr) => prev + (curr.credit_sales || 0), 0)) },
            { value: currency(item?.reduce((prev, curr) => prev + (curr.partial || 0), 0)) },
            { value: currency(item?.reduce((prev, curr) => prev + (curr.refunds || 0), 0)) },
            isDev(auth) ? { value: currency(item?.reduce((prev, curr) => prev + (curr.cash_sales + curr.credit_sales + curr.partial), 0)) } : null,
        ]
    }

    useEffect(() => {
        if (data) {
            let tempdata = sorted ? sortBy(data, sorted) : data
            setrecords(tempdata?.map((item, i) => {
                return {
                    key: item.id,
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

    const reLoad = () => {
        setRefetch(true)
    }

    return (
        (reportSelector.manager && reportSelector.report === "Cashier Summary") ? (
            <>
                <div className="w-full text-lg uppercase font-bold flex flex-col lg:flex-row justify-start gap-3 lg:gap-0 lg:justify-between lg:items-center no-select">
                    <div className="flex gap-4">
                        <PresentationChartLineIcon className="w-6 h-6" />
                        {/* {reportSelector.report} */} CASHIER SUMMARY
                    </div>
                    <div className="flex items-center gap-2">
                        <input name="fr" type="date" className="text-sm" value={filters.fr} onChange={onChange} />
                        <input name="to" type="date" className="text-sm" value={filters.to} onChange={onChange} />
                        <select name="store" className="text-sm" value={filters.store} onChange={onChange}>
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
                        <button className="button-red py-2" onClick={() => reLoad()}>
                            <ArrowPathIcon className="w-5 h-5" />
                        </button>
                        <button className="button-red py-2" onClick={() => printData()}>
                            <PrinterIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <DataRecords
                    page={startpage}
                    columns={columns}
                    records={records}
                    setsorted={setsorted}
                    setPage={setstartpage}
                    itemsperpage={itemsperpage}
                    keeppagination={true}
                />
            </>
        ) : null
    )
}

export default ReportsFormCashierSummary
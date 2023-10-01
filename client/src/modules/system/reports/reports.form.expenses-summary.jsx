import { ArrowPathIcon, PresentationChartLineIcon, PrinterIcon } from "@heroicons/react/24/outline"
import moment from "moment"
import { useEffect, useState } from 'react'
import { useSelector } from "react-redux"
import { sqlDate } from "../../../utilities/functions/datetime.functions"
import { currency } from "../../../utilities/functions/number.funtions"
import { isEmpty } from "../../../utilities/functions/string.functions"
import DataRecords from "../../../utilities/interface/datastack/data.records"
import { useFetchAllBranchMutation } from "../../library/branch/branch.services"
import { useExpensesSummaryReportMutation } from "./reports.services"

const ReportsFormExpensesSummary = () => {
    const reportSelector = useSelector(state => state.reports)
    const [refetch, setRefetch] = useState(false)
    const [data, setdata] = useState()
    const [records, setrecords] = useState()
    const [sorted, setsorted] = useState()
    const [startpage, setstartpage] = useState(1)
    const itemsperpage = 150
    const [filters, setFilters] = useState({ fr: sqlDate(), to: sqlDate(), store: "" })
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
    const [expensesReport] = useExpensesSummaryReportMutation()

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
            if (reportSelector.report === "Expenses Summary") {
                await expensesReport({ fr: filters.fr, to: filters.to, store: filters.store })
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
            { name: 'Branch', stack: true, sort: 'branch_name', size: 150 },
            { name: 'No. of Entries', stack: true, sort: 'expense_count', size: 150 },
            { name: 'Net Total', stack: true, sort: 'expense_value', size: 150 },
        ]
    }

    const items = (item) => {
        return [
            { value: item.expense_name },
            { value: item.branch_name },
            { value: item.expense_count },
            { value: currency(item.expense_value) },
        ]
    }

    const total = (item) => {
        return [
            { value: "TOTAL" },
            { value: null },
            { value: item?.reduce((prev, curr) => prev + (curr.expense_count || 0), 0) },
            { value: currency(item?.reduce((prev, curr) => prev + (curr.expense_value || 0), 0)) },
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
                title: reportSelector.report,
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
        (reportSelector.manager && reportSelector.report === "Expenses Summary") ? (
            <>
                <div className="w-full text-lg uppercase font-bold flex flex-col lg:flex-row justify-start gap-3 lg:gap-0 lg:justify-between lg:items-center no-select">
                    <div className="flex gap-4">
                        <PresentationChartLineIcon className="w-6 h-6" />
                        {reportSelector.report}
                    </div>
                    <div className="flex items-center gap-2">
                        <input name="fr" type="date" className="text-sm" value={filters.fr} onChange={onChange} />
                        <input name="to" type="date" className="text-sm" value={filters.to} onChange={onChange} />
                        <select name="store" className="text-sm" value={filters.store} onChange={onChange}>
                            <option value="">All</option>
                            {
                                libBranchers?.map(branch => (
                                    <option key={branch.key} value={branch.value}>{branch.key}</option>
                                ))
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

export default ReportsFormExpensesSummary
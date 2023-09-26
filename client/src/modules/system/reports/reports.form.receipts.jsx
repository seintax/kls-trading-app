import { ArrowPathIcon, PresentationChartLineIcon, PrinterIcon } from "@heroicons/react/24/outline"
import moment from "moment"
import { useEffect, useState } from 'react'
import { useSelector } from "react-redux"
import { longDate, sqlDate } from "../../../utilities/functions/datetime.functions"
import { currency } from "../../../utilities/functions/number.funtions"
import { getBranch, isEmpty } from "../../../utilities/functions/string.functions"
import useAuth from "../../../utilities/hooks/useAuth"
import DataRecords from "../../../utilities/interface/datastack/data.records"
import { useByDateRangeTransactionMutation } from "../../feature/cashering/cashering.services"
import { useFetchAllBranchMutation } from "../../library/branch/branch.services"

const ReportsFormReceipts = () => {
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
    const [receiptSummary] = useByDateRangeTransactionMutation()

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
            if (reportSelector.report === "Receipts Summary") {
                await receiptSummary({ fr: filters.fr, to: filters.to, branch: filters.store })
                    .unwrap()
                    .then(res => {
                        if (res.success) {
                            setdata(res.arrayResult)
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
            { name: 'Receipt No.', stack: false, sort: 'code' },
            { name: 'Date', stack: true, sort: 'date', size: 170 },
            { name: 'Branch', stack: true, sort: 'account_store', size: 150 },
            { name: 'Employee', stack: true, sort: 'account_name', size: 180 },
            { name: 'Customer', stack: true, sort: 'customer_name', size: 250 },
            { name: 'Type', stack: true, sort: 'method', size: 120 },
            { name: 'Total', stack: true, sort: 'total', size: 150 },
        ]
    }

    const reformatCode = (code) => {
        let codeArr = code.split("-")
        let firstTag = codeArr.shift()
        return codeArr.join("-").slice(3, 15)
    }

    const items = (item) => {
        return [
            { value: reformatCode(item.code) },
            { value: longDate(item.date) },
            { value: item.account_store },
            { value: item.account_name },
            { value: item.customer_name },
            { value: item.method },
            { value: currency(item.total) },
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
                data: records
            }))
            window.open(`/#/print/reports/${moment(filters.fr).format("MMDDYYYY")}-${moment(filters.to).format("MMDDYYYY")}-${filters.store || "All"}`, '_blank')
        }
    }

    const reLoad = () => {
        setRefetch(true)
    }

    return (
        (reportSelector.manager && reportSelector.report === "Receipts Summary") ? (
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

export default ReportsFormReceipts
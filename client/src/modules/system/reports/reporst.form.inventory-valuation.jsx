import { ArrowPathIcon, PresentationChartLineIcon, PrinterIcon } from "@heroicons/react/24/outline"
import moment from "moment"
import { useEffect, useState } from 'react'
import { useSelector } from "react-redux"
import { sqlDate } from "../../../utilities/functions/datetime.functions"
import { NumFn, currency } from "../../../utilities/functions/number.funtions"
import { getBranch, isEmpty } from "../../../utilities/functions/string.functions"
import useAuth from "../../../utilities/hooks/useAuth"
import DataRecords from "../../../utilities/interface/datastack/data.records"
import { useFetchAllInventoryBranchMutation } from "../../feature/inventory/inventory.services"
import { useFetchAllBranchMutation } from "../../library/branch/branch.services"

const ReportsFormInventoryValuation = () => {
    const auth = useAuth()
    const reportSelector = useSelector(state => state.reports)
    const [refetch, setRefetch] = useState(false)
    const [data, setdata] = useState()
    const [records, setrecords] = useState()
    const [sorted, setsorted] = useState()
    const [startpage, setstartpage] = useState(1)
    const itemsperpage = 150
    const [filters, setFilters] = useState({ fr: sqlDate(), to: sqlDate(), store: "JT-MAIN" })
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
    const [allInventory] = useFetchAllInventoryBranchMutation()

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
            if (reportSelector.report === "Inventory Valuation") {
                await allInventory({ branch: filters.store })
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
            { name: 'Item', stack: false, sort: 'code' },
            { name: 'In Stock', stack: true, sort: 'stocks', size: 120 },
            { name: 'Cost', stack: true, sort: 'cost', size: 150 },
            { name: 'Inventory Value', stack: true, size: 150 },
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

    const items = (item) => {
        return [
            { value: `${item.product_name} ${item.variant_serial} ${item?.variant_model || ""} ${item?.variant_brand || ""}` },
            { value: item.stocks },
            { value: currency(item.cost) },
            { value: currency(item.stocks * item.cost) },
            { value: currency(item.stocks * item.price) },
            { value: currency((item.stocks * item.price) - (item.stocks * item.cost)) },
            { value: NumFn.acctg.percent((((item.stocks * item.price) - (item.stocks * item.cost)) / (item.stocks * item.price))) },
        ]
    }

    const total = (item) => {
        let retail = item?.reduce((prev, curr) => prev + ((curr.stocks * curr.price) || 0), 0)
        let profit = item?.reduce((prev, curr) => prev + (((curr.stocks * curr.price) - (curr.stocks * curr.cost)) || 0), 0)
        return [
            { value: "OVERALL SUMMARY" },
            { value: item?.reduce((prev, curr) => prev + (curr.stocks || 0), 0) },
            { value: currency(item?.reduce((prev, curr) => prev + (curr.cost || 0), 0)) },
            { value: currency(item?.reduce((prev, curr) => prev + ((curr.stocks * curr.cost) || 0), 0)) },
            { value: currency(retail) },
            { value: currency(profit) },
            { value: NumFn.acctg.percent(profit / retail) },
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
                subtext1: `as of: ${moment(new Date()).format("MMMM DD, YYYY")}`,
                subtext2: `Branch: ${filters.store || "All"}`,
                columns: columns,
                total: total(data),
                data: records
            }))
            window.open(`/#/print/reports/${moment(new Date()).format("MMDDYYYY")}-${filters.store}`, '_blank')
        }
    }

    const reLoad = () => {
        setRefetch(true)
    }

    return (
        (reportSelector.manager && reportSelector.report === "Inventory Valuation") ? (
            <>
                <div className="w-full text-lg uppercase font-bold flex flex-col lg:flex-row justify-start gap-3 lg:gap-0 lg:justify-between lg:items-center no-select">
                    <div className="flex gap-4">
                        <PresentationChartLineIcon className="w-6 h-6" />
                        {reportSelector.report}
                    </div>
                    <div className="flex items-center gap-2">
                        {/* <input name="fr" type="date" className="text-sm" value={filters.fr} onChange={onChange} />
                        <input name="to" type="date" className="text-sm" value={filters.to} onChange={onChange} /> */}
                        <select name="store" className="text-sm" value={filters.store} onChange={onChange}>
                            {/* {
                                isEmpty(getBranch(auth))
                                    ? <option value="">All</option>
                                    : null
                            } */}
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
                    total={total(data)}
                />
            </>
        ) : null
    )
}

export default ReportsFormInventoryValuation
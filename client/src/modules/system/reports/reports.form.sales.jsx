import { ArrowPathIcon, PresentationChartLineIcon, PrinterIcon } from "@heroicons/react/24/outline"
import moment from "moment"
import { useEffect, useState } from 'react'
import { useSelector } from "react-redux"
import { sqlDate } from "../../../utilities/functions/datetime.functions"
import { currency } from "../../../utilities/functions/number.funtions"
import { isEmpty } from "../../../utilities/functions/string.functions"
import DataRecords from "../../../utilities/interface/datastack/data.records"
import { useFetchAllBranchMutation } from "../../library/branch/branch.services"
import { useSalesByCategoryReportMutation, useSalesByCollectionReportMutation, useSalesByItemReportMutation } from "./reports.services"

const ReportsFormSales = () => {
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
    const [salesByItem] = useSalesByItemReportMutation()
    const [salesByCategory] = useSalesByCategoryReportMutation()
    const [salesByCollection] = useSalesByCollectionReportMutation()

    const inclusion = [
        "Daily Sales by Item",
        "Daily Sales by Category",
        "Daily Sales by Collection",
    ]

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
            if (reportSelector.report === "Daily Sales by Item") {
                await salesByItem({ fr: filters.fr, to: filters.to, store: filters.store })
                    .unwrap()
                    .then(res => {
                        if (res.success) {
                            setdata(res.data)
                        }
                    })
                    .catch(err => console.error(err))
            }
            if (reportSelector.report === "Daily Sales by Category") {
                await salesByCategory({ fr: filters.fr, to: filters.to, store: filters.store })
                    .unwrap()
                    .then(res => {
                        if (res.success) {
                            setdata(res.data)
                        }
                    })
                    .catch(err => console.error(err))
            }
            if (reportSelector.report === "Daily Sales by Collection") {
                await salesByCollection({ fr: filters.fr, to: filters.to, store: filters.store })
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

    const byItemColumn = {
        style: '',
        items: [
            { name: 'Product', stack: false, sort: 'product' },
            { name: 'Category', stack: true, sort: 'category', size: 150 },
            { name: 'Item Sold', stack: true, sort: 'item_sold', size: 150 },
            { name: 'Net Sales', stack: true, sort: 'net_sales', size: 150 },
            { name: 'Cost of Goods', stack: true, sort: 'goods_cost', size: 150 },
            { name: 'Gross Profit', stack: true, sort: 'gross_profit', size: 150 },
            { name: 'By Upfront', stack: true, sort: 'sales_type_net', size: 150 },
            { name: 'By Credit', stack: true, sort: 'credit_type_net', size: 150 },
        ]
    }

    const byCategoryColumn = {
        style: '',
        items: [
            { name: 'Category', stack: true, sort: 'category', size: 150 },
            { name: 'Item Sold', stack: true, sort: 'item_sold', size: 150 },
            { name: 'Net Sales', stack: true, sort: 'net_sales', size: 150 },
            { name: 'Cost of Goods', stack: true, sort: 'goods_cost', size: 150 },
            { name: 'Gross Profit', stack: true, sort: 'gross_profit', size: 150 },
        ]
    }

    const byCollectionColumn = {
        style: '',
        items: [
            { name: 'Type of Transaction', stack: true, sort: 'trans_type', size: 250 },
            { name: 'Payment Method', stack: true, sort: 'payment_method', size: 150 },
            { name: 'No. of Transactions', stack: true, sort: 'transaction_count', size: 150 },
            { name: 'Total Collection', stack: true, sort: 'payment_total', size: 150 },
            { name: 'No. of Refunds', stack: true, sort: 'refund_count', size: 150 },
            { name: 'Total Refunds', stack: true, sort: 'payment_refund', size: 150 },
            { name: 'Net Collection', stack: true, sort: 'payment_net', size: 150 },
        ]
    }

    const items = (item) => {
        if (reportSelector.report === "Daily Sales by Item") {
            return [
                { value: `${item.product} ${item.variant1} ${item.variant2} ${item.variant3}` },
                { value: item.category },
                { value: item.item_sold },
                { value: currency(item.net_sales) },
                { value: currency(item.goods_cost) },
                { value: currency(item.gross_profit) },
                { value: currency(item.sales_type_net) },
                { value: currency(item.credit_type_net) },
            ]
        }
        if (reportSelector.report === "Daily Sales by Category") {
            return [
                { value: item.category },
                { value: item.item_sold },
                { value: currency(item.net_sales) },
                { value: currency(item.goods_cost) },
                { value: currency(item.gross_profit) },
            ]
        }
        if (reportSelector.report === "Daily Sales by Collection") {
            return [
                { value: item.trans_type },
                { value: item.payment_method },
                { value: item.transaction_count },
                { value: currency(item.payment_total) },
                { value: item.refund_count },
                { value: currency(item.payment_refund) },
                { value: currency(item.payment_net) },
            ]
        }
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

    const reportColumn = () => {
        if (reportSelector.report === "Daily Sales by Item") return byItemColumn
        if (reportSelector.report === "Daily Sales by Category") return byCategoryColumn
        if (reportSelector.report === "Daily Sales by Collection") return byCollectionColumn
    }

    const printData = () => {
        if (records?.length) {
            localStorage.setItem("reports", JSON.stringify({
                title: reportSelector.report,
                subtext1: `Date: ${moment(filters.fr).format("MMMM DD, YYYY")} - ${moment(filters.to).format("MMMM DD, YYYY")}`,
                subtext2: `Branch: ${filters.store || "All"}`,
                columns: reportColumn(),
                data: records
            }))
            window.open(`/#/print/reports/${moment(filters.fr).format("MMDDYYYY")}-${moment(filters.to).format("MMDDYYYY")}-${filters.store || "All"}`, '_blank')
        }
    }

    const reLoad = () => {
        setRefetch(true)
    }

    return (
        (reportSelector.manager && inclusion.includes(reportSelector.report)) ? (
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
                {
                    (reportSelector.report === "Daily Sales by Item") ? (
                        <DataRecords
                            page={startpage}
                            columns={byItemColumn}
                            records={records}
                            setsorted={setsorted}
                            setPage={setstartpage}
                            itemsperpage={itemsperpage}
                            keeppagination={true}
                        />
                    ) : null
                }
                {
                    (reportSelector.report === "Daily Sales by Category") ? (
                        <DataRecords
                            page={startpage}
                            columns={byCategoryColumn}
                            records={records}
                            setsorted={setsorted}
                            setPage={setstartpage}
                            itemsperpage={itemsperpage}
                            keeppagination={true}
                        />
                    ) : null
                }
                {
                    (reportSelector.report === "Daily Sales by Collection") ? (
                        <DataRecords
                            page={startpage}
                            columns={byCollectionColumn}
                            records={records}
                            setsorted={setsorted}
                            setPage={setstartpage}
                            itemsperpage={itemsperpage}
                            keeppagination={true}
                        />
                    ) : null
                }
            </>
        ) : null
    )
}

export default ReportsFormSales
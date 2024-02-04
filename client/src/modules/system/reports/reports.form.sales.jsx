import { ArchiveBoxArrowDownIcon, ArrowPathIcon, PresentationChartLineIcon, PrinterIcon } from "@heroicons/react/24/outline"
import { saveAs } from 'file-saver'
import moment from "moment"
import { useEffect, useState } from 'react'
import { useSelector } from "react-redux"
import Datepicker from "react-tailwindcss-datepicker"
import * as XLSX from 'xlsx'
import { sortBy } from "../../../utilities/functions/array.functions"
import { sqlDate } from "../../../utilities/functions/datetime.functions"
import { currency } from "../../../utilities/functions/number.funtions"
import { isEmpty } from "../../../utilities/functions/string.functions"
import DataRecords from "../../../utilities/interface/datastack/data.records"
import { useFetchAllBranchMutation } from "../../library/branch/branch.services"
import { useSalesByCategoryReportMutation, useSalesByCollectionReportMutation, useSalesByItemReportMutation } from "./reports.services"

const ReportsFormSales = () => {
    const reportSelector = useSelector(state => state.reports)
    const searchSelector = useSelector(state => state.search)
    const [refetch, setRefetch] = useState(false)
    const [data, setdata] = useState()
    const [records, setrecords] = useState()
    const [sorted, setsorted] = useState()
    const [startpage, setstartpage] = useState(1)
    const itemsperpage = 150
    const [filters, setFilters] = useState({ fr: sqlDate(), to: sqlDate(), store: "" })
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
        }
        instantiate()
    }, [])


    useEffect(() => {
        const instantiate = async () => {
            setdata([])
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
            { name: 'Type of Transaction', stack: true, sort: 'trans_type', size: 150 },
            { name: 'Payment Method', stack: true, sort: 'payment_method', size: 150 },
            { name: 'Branch', stack: true, sort: 'store', size: 100 },
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
                { value: `${item.product} (${item.variant1 || ""}${item.variant2 ? `/${item.variant2}` : ""}${item.variant3 ? `/${item.variant3}` : ""})` },
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
                { value: item.store },
                { value: item.transaction_count },
                { value: currency(item.payment_total) },
                { value: item.refund_count },
                { value: currency(item.payment_refund) },
                { value: currency(item.payment_net) },
            ]
        }
    }

    const key = (item, index) => {
        if (reportSelector.report === "Daily Sales by Item") {
            return item.id
        }
        if (reportSelector.report === "Daily Sales by Category") {
            return `${index}${item.category}`
        }
        if (reportSelector.report === "Daily Sales by Collection") {
            return item.store
        }
    }

    const totalItem = (item) => {
        return [
            { value: "OVERALL TOTAL" },
            { value: null },
            { value: item?.reduce((prev, curr) => prev + (curr.item_sold || 0), 0) },
            { value: currency(item?.reduce((prev, curr) => prev + (curr.net_sales || 0), 0)) },
            { value: currency(item?.reduce((prev, curr) => prev + (curr.goods_cost || 0), 0)) },
            { value: currency(item?.reduce((prev, curr) => prev + (curr.gross_profit || 0), 0)) },
            { value: currency(item?.reduce((prev, curr) => prev + (curr.sales_type_net || 0), 0)) },
            { value: currency(item?.reduce((prev, curr) => prev + (curr.credit_type_net || 0), 0)) },
        ]
    }

    const totalCategory = (item) => {
        return [
            { value: "OVERALL TOTAL" },
            { value: item?.reduce((prev, curr) => prev + (curr.item_sold || 0), 0) },
            { value: currency(item?.reduce((prev, curr) => prev + (curr.net_sales || 0), 0)) },
            { value: currency(item?.reduce((prev, curr) => prev + (curr.goods_cost || 0), 0)) },
            { value: currency(item?.reduce((prev, curr) => prev + (curr.gross_profit || 0), 0)) },
        ]
    }

    const totalCollection = (item) => {
        return [
            { value: "OVERALL TOTAL" },
            { value: null },
            { value: null },
            { value: item?.reduce((prev, curr) => prev + (curr.transaction_count || 0), 0) },
            { value: currency(item?.reduce((prev, curr) => prev + (curr.payment_total || 0), 0)) },
            { value: item?.reduce((prev, curr) => prev + (curr.refund_count || 0), 0) },
            { value: currency(item?.reduce((prev, curr) => prev + (curr.payment_refund || 0), 0)) },
            { value: currency(item?.reduce((prev, curr) => prev + (curr.payment_net || 0), 0)) },
        ]
    }

    useEffect(() => {
        if (data) {
            setrecords([])
            let filtered = data
            if (searchSelector.searchKey && reportSelector.report === "Daily Sales by Item") {
                let sought = searchSelector.searchKey?.toLowerCase()
                filtered = filtered?.filter(f => (
                    `${f.product} (${f.variant1 || ""}${f.variant2 ? `/${f.variant2}` : ""}${f.variant3 ? `/${f.variant3}` : ""})`?.toLowerCase()?.includes(sought)
                ))
            }
            let tempdata = sorted ? sortBy(filtered, sorted) : filtered
            setrecords(tempdata?.map((item, i) => {
                return {
                    key: key(item, i),
                    items: items(item)
                }
            }))
        }
    }, [data, sorted, reportSelector.report, searchSelector.searchKey])

    const reportColumn = () => {
        if (reportSelector.report === "Daily Sales by Item") return byItemColumn
        if (reportSelector.report === "Daily Sales by Category") return byCategoryColumn
        if (reportSelector.report === "Daily Sales by Collection") return byCollectionColumn
    }

    const totalRow = () => {
        if (reportSelector.report === "Daily Sales by Item") return totalItem(data)
        if (reportSelector.report === "Daily Sales by Category") return totalCategory(data)
        if (reportSelector.report === "Daily Sales by Collection") return totalCollection(data)
    }

    const printData = () => {
        if (records?.length) {
            localStorage.setItem("reports", JSON.stringify({
                title: reportSelector.report,
                subtext1: `Date: ${moment(filters.fr).format("MMMM DD, YYYY")} - ${moment(filters.to).format("MMMM DD, YYYY")}`,
                subtext2: `Branch: ${filters.store || "All"}`,
                columns: reportColumn(),
                total: totalRow(),
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
        (reportSelector.manager && inclusion.includes(reportSelector.report)) ? (
            <>
                <div className="w-full uppercase font-bold flex flex-col lg:flex-row justify-start gap-3 lg:gap-0 lg:justify-between lg:items-center no-select text-base lg:text-lg px-3 lg:px-0">
                    <div className="flex gap-4 ml-14 items-center lg:ml-16 py-2 text-sm lg:text-base">
                        <PresentationChartLineIcon className="w-8 h-8" />
                        {reportSelector.report}
                    </div>
                    <div className="flex flex-wrap lg:flex-nowrap items-center gap-2">
                        <Datepicker
                            value={range}
                            onChange={onRangeChange}
                            showShortcuts={true}
                            readOnly
                        />
                        <select name="store" className="report-select-filter text-sm w-full lg:w-[200px]" value={filters.store} onChange={onChange}>
                            <option value="">All</option>
                            {
                                libBranchers?.map(branch => (
                                    <option key={branch.key} value={branch.value}>{branch.key}</option>
                                ))
                            }
                        </select>
                        <div className="flex gap-2">
                            <button className="report-button py-2" onClick={() => reLoad()}>
                                <ArrowPathIcon className="w-5 h-5" />
                            </button>
                            <button className="report-button py-2" onClick={() => printData()}>
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
                        reportSelector.report === "Daily Sales by Item" && Array.from({ length: 6 }, (_, i) => i + 2)?.map(n => (
                            <div key={n} className="flex flex-col w-[200px] lg:w-full py-3 px-5 border border-gray-400 hover:bg-gray-200 transition ease-in duration-300 flex-none lg:flex-1">
                                <span className="text-gray-500 no-select">
                                    {byItemColumn.items[n].name}
                                </span>
                                <span className="text-lg font-semibold">
                                    {totalItem(data)[n]?.value}
                                </span>
                            </div>
                        ))
                    }
                    {
                        reportSelector.report === "Daily Sales by Category" && Array.from({ length: 4 }, (_, i) => i + 1)?.map(n => (
                            <div key={n} className="flex flex-col w-[200px] lg:w-full py-3 px-5 border border-gray-400 hover:bg-gray-200 transition ease-in duration-300 flex-none lg:flex-1">
                                <span className="text-gray-500 no-select">
                                    {byCategoryColumn.items[n].name}
                                </span>
                                <span className="text-lg font-semibold">
                                    {totalCategory(data)[n]?.value}
                                </span>
                            </div>
                        ))
                    }
                    {
                        reportSelector.report === "Daily Sales by Collection" && Array.from({ length: 5 }, (_, i) => i + 3)?.map(n => (
                            <div key={n} className="flex flex-col w-[200px] lg:w-full py-3 px-5 border border-gray-400 hover:bg-gray-200 transition ease-in duration-300 flex-none lg:flex-1">
                                <span className="text-gray-500 no-select">
                                    {byCollectionColumn.items[n].name}
                                </span>
                                <span className="text-lg font-semibold">
                                    {totalCollection(data)[n]?.value}
                                </span>
                            </div>
                        ))
                    }
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
                            total={totalRow()}
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
                            total={totalRow()}
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
                            total={totalRow()}
                        />
                    ) : null
                }
            </>
        ) : null
    )
}

export default ReportsFormSales
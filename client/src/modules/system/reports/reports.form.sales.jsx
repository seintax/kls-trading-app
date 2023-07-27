import { PresentationChartLineIcon } from "@heroicons/react/24/outline"
import moment from "moment"
import { useEffect, useState } from 'react'
import { useSelector } from "react-redux"
import { currency } from "../../../utilities/functions/number.funtions"
import { isEmpty } from "../../../utilities/functions/string.functions"
import DataRecords from "../../../utilities/interface/datastack/data.records"
import { useSalesByItemReportMutation } from "./reports.services"

const ReportsFormSales = () => {
    const reportSelector = useSelector(state => state.reports)
    const [refetch, setRefetch] = useState(false)
    const [data, setdata] = useState()
    const [records, setrecords] = useState()
    const [sorted, setsorted] = useState()
    const [startpage, setstartpage] = useState(1)
    const itemsperpage = 150
    const [filters, setFilters] = useState({
        fr: "2023-07-19",
        to: "2023-07-27",
        store: "JT-MAIN"
    })

    const [salesByItem] = useSalesByItemReportMutation()

    useEffect(() => {
        const instantiate = async () => {
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
            setRefetch(false)
        }

        if (!isEmpty(reportSelector.report || refetch)) instantiate()
    }, [reportSelector.report, refetch])

    const columns = {
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

    const items = (item) => {
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

    const onChange = (e) => {
        const { value } = e.target
        setfilter(prev => ({
            ...prev,
            fr: value,
        }))
    }

    const printData = () => {
        localStorage.setItem(reportSelector.report, JSON.stringify({
            title: reportSelector.report,
            subtext: `Date: ${moment(filters.fr).format("MMMM DD, YYYY")}`,
            data: records
        }))
        window.open(`/#/print/${reportSelector.report}/${moment(filters.fr).format("MMDDYYYY")}`, '_blank')
    }

    return (
        (reportSelector.manager && reportSelector.report === "Daily Sales by Item") ? (
            <>
                <div className="w-full text-lg uppercase font-bold flex justify-between items-center no-select">
                    <div className="flex gap-4">
                        <PresentationChartLineIcon className="w-6 h-6" />
                        {reportSelector.report}
                    </div>
                    <div className="flex items-center">
                        <input type="date" className="" />
                        <input type="date" className="" />
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

export default ReportsFormSales
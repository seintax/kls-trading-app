import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { sortBy } from '../../../utilities/functions/array.functions'
import { momentOffset } from "../../../utilities/functions/datetime.functions"
import { cleanDisplay } from "../../../utilities/functions/string.functions"
import DataHeader from "../../../utilities/interface/datastack/data.header"
import DataIndex from "../../../utilities/interface/datastack/data.index"
import DataRecords from '../../../utilities/interface/datastack/data.records'
import { resetInventoryStocks } from "./inventory.reducer"
import { useByStockRecordInventoryMutation } from "./inventory.services"

const StocksIndex = () => {
    const dataSelector = useSelector(state => state.inventory)
    const dispatch = useDispatch()
    const [data, setdata] = useState()
    const [records, setrecords] = useState()
    const [startpage, setstartpage] = useState(1)
    const [sorted, setsorted] = useState()
    const columns = dataSelector.stockage

    const [stockRecord, { isLoading }] = useByStockRecordInventoryMutation()

    useEffect(() => {
        const instantiate = async () => {
            await stockRecord({
                product: dataSelector.item.product,
                variant: dataSelector.item.variant,
                branch: dataSelector.item.store
            })
                .unwrap()
                .then(res => {
                    console.log(res)
                    if (res.success) {
                        setdata(res?.arrayResult)
                    }
                })
                .catch(err => console.error(err))
            return
        }

        if (dataSelector.item.id) {
            instantiate()
        }
    }, [dataSelector.item.id])

    const actions = (item) => {
        return []
    }

    const identifyQuantity = (item) => {
        if (item.transaction === "DISPENSE") return item.dispense || 0
        if (item.transaction === "RETURNED") return item.quantity || 0
        if (item.transaction === "TRANSFER") return item.quantity || 0
    }

    const items = (item) => {
        return [
            { value: cleanDisplay(`${dataSelector.item.product_name} ${dataSelector.item.variant_serial} ${dataSelector.item.variant_model} ${dataSelector.item.variant_brand}`) },
            { value: momentOffset(item.time, 480, "MM-DD-YYYY") },
            { value: `${item.stocks}/${item.received}` },
            { value: item.acquisition },
            { value: <span className="bg-yellow-300 text-xs px-1 py-0.2 rounded-sm shadow-md">{item.store}</span> },
        ]
    }

    useEffect(() => {
        if (data?.length) {
            let temp = sorted ? sortBy(data, sorted) : data
            setrecords(temp?.map((item, i) => {
                return {
                    key: item.id,
                    items: items(item),
                    ondoubleclick: () => { },
                }
            }))
        }
    }, [data, sorted])

    const returnToList = useCallback(() => {
        dispatch(resetInventoryStocks())
    }, [])

    const productName = cleanDisplay(`${dataSelector.item.product_name} (${dataSelector.item.category}/${dataSelector.item.variant_serial}/${dataSelector.item.variant_model}/${dataSelector.item.variant_brand})`)

    return (
        <div className="w-full flex flex-col gap-5 -mt-5 lg:mt-0">
            <div className="w-full sticky -top-5 pt-5 lg:pt-0 z-10">
                <DataHeader
                    name={`Inventory Stock Logs for: ${productName}`}
                    returncallback={returnToList}
                />
            </div>
            <DataIndex
                display={{
                    name: "Receiving",
                    text: "A list of all in-transit stocks from stock transfer.",
                }}
                isLoading={isLoading}
                plain={true}
            >
                <DataRecords
                    page={startpage}
                    columns={columns}
                    records={records}
                    setsorted={setsorted}
                    setPage={setstartpage}
                    loading={isLoading}
                    itemsperpage={dataSelector?.perpage}
                />
            </DataIndex>
        </div>
    )
}

export default StocksIndex
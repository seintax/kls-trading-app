import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { sortBy } from '../../../utilities/functions/array.functions'
import { momentOffset } from "../../../utilities/functions/datetime.functions"
import { cleanDisplay } from "../../../utilities/functions/string.functions"
import DataHeader from "../../../utilities/interface/datastack/data.header"
import DataIndex from "../../../utilities/interface/datastack/data.index"
import DataRecords from '../../../utilities/interface/datastack/data.records'
import { useByInventoryDispensingMutation, useByInventoryReturnedMutation } from "../browser/browser.services"
import { useByInventoryTransmitMutation } from "../transfer-item/transfer.item.services"
import { resetInventoryLedger } from "./inventory.reducer"

const HistoryIndex = () => {
    const dataSelector = useSelector(state => state.inventory)
    const dispatch = useDispatch()
    const [consolidate, setconsolidate] = useState()
    const [records, setrecords] = useState()
    const [startpage, setstartpage] = useState(1)
    const [sorted, setsorted] = useState()
    const columns = dataSelector.history

    const [dispenseItem, { isLoading: dispenseLoading }] = useByInventoryDispensingMutation()
    const [returnedItem, { isLoading: returnedLoading }] = useByInventoryReturnedMutation()
    const [transferItem, { isLoading: transferLoading }] = useByInventoryTransmitMutation()

    useEffect(() => {
        const instantiate = async () => {
            let consolidated = []
            let completed = 0
            await dispenseItem({ item: dataSelector.item.id })
                .unwrap()
                .then(res => {
                    if (res.success) {
                        consolidated = [...consolidated, ...res?.arrayResult?.map(item => {
                            return { ...item, transaction: "DISPENSE" }
                        })]
                        completed++
                    }
                })
                .catch(err => console.error(err))
            await returnedItem({ item: dataSelector.item.id })
                .unwrap()
                .then(res => {
                    if (res.success) {
                        consolidated = [...consolidated, ...res?.arrayResult?.map(item => {
                            return { ...item, transaction: "RETURNED" }
                        })]
                        completed++
                    }
                })
                .catch(err => console.error(err))
            await transferItem({ item: dataSelector.item.id })
                .unwrap()
                .then(res => {
                    if (res.success) {
                        consolidated = [...consolidated, ...res?.arrayResult?.map(item => {
                            return { ...item, transaction: "TRANSFER" }
                        })]
                        completed++
                    }
                })
                .catch(err => console.error(err))
            if (completed === 3) setconsolidate(consolidated)
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
            { value: momentOffset(item.time, 480, "MM-DD-YYYY hh:mm A") },
            { value: identifyQuantity(item) },
            { value: item.transaction },
            { value: <span className="bg-yellow-300 text-xs px-1 py-0.2 rounded-sm shadow-md">{item.store}</span> },
        ]
    }

    useEffect(() => {
        if (consolidate) {
            let data = sorted
                ? sortBy(consolidate, sorted)
                : sortBy(consolidate, { prop: "time", desc: true })
            setrecords(data?.map((item, i) => {
                return {
                    key: item.id,
                    items: items(item),
                    ondoubleclick: () => { },
                }
            }))
        }
    }, [consolidate, sorted])

    const returnToList = useCallback(() => {
        dispatch(resetInventoryLedger())
    }, [])

    const productName = cleanDisplay(`${dataSelector.item.product_name} (${dataSelector.item.category}/${dataSelector.item.variant_serial}/${dataSelector.item.variant_model}/${dataSelector.item.variant_brand})`)

    return (
        <div className="w-full flex flex-col gap-5 -mt-5 lg:mt-0">
            <div className="w-full sticky -top-5 pt-5 lg:pt-0 z-10">
                <DataHeader
                    name={`Transaction Ledger for: ${productName}`}
                    returncallback={returnToList}
                />
            </div>
            <DataIndex
                display={{
                    name: "Receiving",
                    text: "A list of all in-transit stocks from stock transfer.",
                }}
                isLoading={dispenseLoading && returnedLoading && transferLoading}
                plain={true}
            >
                <DataRecords
                    page={startpage}
                    columns={columns}
                    records={records}
                    setsorted={setsorted}
                    setPage={setstartpage}
                    loading={dispenseLoading || returnedLoading || transferLoading}
                    itemsperpage={dataSelector?.perpage}
                />
            </DataIndex>
        </div>
    )
}

export default HistoryIndex
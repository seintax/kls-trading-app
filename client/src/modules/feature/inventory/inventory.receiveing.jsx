import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { sortBy } from '../../../utilities/functions/array.functions'
import { NumFn } from "../../../utilities/functions/number.funtions"
import { getBranch } from "../../../utilities/functions/string.functions"
import useAuth from "../../../utilities/hooks/useAuth"
import DataIndex from "../../../utilities/interface/datastack/data.index"
import DataOperation from '../../../utilities/interface/datastack/data.operation'
import DataRecords from '../../../utilities/interface/datastack/data.records'
import InventoryManage from "./inventory.manage"
import { setInventoryItem, setInventoryNotifier, setInventoryReceive, showInventoryManager } from "./inventory.reducer"
import { useByTransmitInventoryMutation } from "./inventory.services"

const ReceivingRecords = () => {
    const auth = useAuth()
    const dataSelector = useSelector(state => state.inventory)
    const searchSelector = useSelector(state => state.search)
    const dispatch = useDispatch()
    const [records, setrecords] = useState()
    const [startpage, setstartpage] = useState(1)
    const [sorted, setsorted] = useState()
    const columns = dataSelector.header

    const [transmitInventory, { isLoading, isError }] = useByTransmitInventoryMutation()

    useEffect(() => {
        const instantiate = async () => {
            await transmitInventory({ branch: getBranch(auth) })
                .unwrap()
                .then(res => {
                    if (res.success) {
                        dispatch(setInventoryReceive(res?.arrayResult))
                        dispatch(setInventoryNotifier(false))
                    }
                })
                .catch(err => console.error(err))
            return
        }

        if (dataSelector.receive.length === 0 || dataSelector.notifier || auth?.store) {
            instantiate()
        }
    }, [dataSelector.notifier, auth])

    const toggleAccept = async (item) => {
        dispatch(setInventoryItem(item))
        dispatch(showInventoryManager())
    }

    const actions = (item) => {
        return [
            { type: 'button', trigger: () => toggleAccept(item), label: 'Accept', hidden: item?.acquisition !== "TRANSMIT" },
        ]
    }

    const items = (item) => {
        return [
            { value: `${item.product_name} ${item.variant_serial} ${item.variant_model} ${item.variant_brand}` },
            { value: item.variant_serial },
            { value: item.supplier_name },
            { value: item.category },
            { value: item.stocks },
            { value: NumFn.currency(item.price) },
            { value: <span className="bg-yellow-300 text-xs px-1 py-0.2 rounded-sm shadow-md">{item.store}</span> },
            { value: <DataOperation actions={actions(item)} /> }
        ]
    }

    useEffect(() => {
        if (dataSelector?.receive) {
            let temp = dataSelector?.receive
            if (searchSelector.searchKey) {
                let sought = searchSelector.searchKey?.toLowerCase()
                temp = dataSelector?.receive?.filter(f => (
                    `${f.product_name} ${f.variant_serial} ${f.variant_model} ${f.variant_brand}`?.toLowerCase()?.includes(sought) ||
                    f.supplier_name?.toLowerCase()?.includes(sought) ||
                    f.variant_serial?.toLowerCase()?.includes(sought) ||
                    f.store?.toLowerCase()?.includes(sought)
                ))
            }
            let data = sorted ? sortBy(temp, sorted) : temp
            setrecords(data?.map((item, i) => {
                return {
                    key: item.id,
                    items: items(item),
                    ondoubleclick: () => { },
                }
            }))
        }
    }, [dataSelector?.receive, sorted])

    return (
        (dataSelector.manager) ? (
            <InventoryManage />
        ) : (
            <DataIndex
                display={{
                    name: "Receiving",
                    text: "A list of all in-transit stocks from stock transfer.",
                    show: true
                }}
                data={dataSelector.receive}
                isError={isError}
                isLoading={isLoading}
                plain={true}
            >
                <DataRecords
                    page={startpage}
                    columns={columns}
                    records={records}
                    setsorted={setsorted}
                    setPage={setstartpage}
                    itemsperpage={dataSelector?.perpage}
                />
            </DataIndex>
        )
    )
}
export default ReceivingRecords
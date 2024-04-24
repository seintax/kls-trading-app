import moment from "moment"
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useModalContext } from "../../../utilities/context/modal.context"
import { sortBy } from '../../../utilities/functions/array.functions'
import { NumFn } from "../../../utilities/functions/number.funtions"
import { StrFn, cleanDisplay, getBranch } from "../../../utilities/functions/string.functions"
import useAuth from "../../../utilities/hooks/useAuth"
import DataIndex from "../../../utilities/interface/datastack/data.index"
import DataOperation from '../../../utilities/interface/datastack/data.operation'
import DataRecords from '../../../utilities/interface/datastack/data.records'
import { showDelete } from "../../../utilities/redux/slices/deleteSlice"
import InventoryManage from "./inventory.manage"
import { setInventoryItem, setInventoryNotifier, setInventoryReceive, showInventoryManager } from "./inventory.reducer"
import { useByTransmitInventoryMutation, useSqlCancelInventoryMutation } from "./inventory.services"

const ReceivingRecords = () => {
    const auth = useAuth()
    const dataSelector = useSelector(state => state.inventory)
    const searchSelector = useSelector(state => state.search)
    const { assignDeleteCallback } = useModalContext()
    const dispatch = useDispatch()
    const [records, setrecords] = useState()
    const [startpage, setstartpage] = useState(1)
    const [sorted, setsorted] = useState()
    const columns = dataSelector.header

    const [transmitInventory, { isLoading, isError }] = useByTransmitInventoryMutation()
    const [sqlCancel] = useSqlCancelInventoryMutation()

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

    const toggleCancel = async (item) => {
        assignDeleteCallback({ item: item, callback: handleCancel })
        dispatch(showDelete({ description: "Cancel Transfer Item", reference: `${item.product_name} ${item.variant_serial} ${item.variant_model} ${item.variant_brand}` }))
    }

    const handleCancel = async (item) => {
        if (!item.id) {
            toast.showError("Reference id does not exist.")
            return
        }
        let formData = {
            destination: {
                received: 0,
                stocks: 0,
                acquisition: 'CANCELLED',
                id: item.id
            },
            transmit: {
                quantity: 0,
                id: item.transmit
            },
            transfer: {
                id: item.transfer
            },
            source: {
                id: item.transmit_item,
                operator: "+",
                quantity: item.transmit_quantity
            },
        }
        await sqlCancel(formData)
            .unwrap()
            .then(res => {
                if (res.success) {
                    toast.showUpdate("Item receipt has been successfully cancelled.")
                    dispatch(setInventoryNotifier(true))
                }
            })
            .catch(err => console.error(err))
        return true
    }

    const actions = (item) => {
        return [
            { type: 'button', trigger: () => toggleAccept(item), label: 'Accept', hidden: item?.acquisition !== "TRANSMIT" },
            { type: 'button', trigger: () => toggleCancel(item), label: 'Cancel', hidden: item?.acquisition !== "TRANSMIT" || item.received !== item.stocks },
        ]
    }

    const items = (item) => {
        return [
            { value: cleanDisplay(`${item.product_name} ${item.variant_serial} ${item.variant_model} ${item.variant_brand}`) },
            { value: item.variant_serial },
            { value: StrFn.formatWithZeros(item.id, 10) },
            { value: moment(item.time).format("MM-DD-YYYY") },
            { value: item.category },
            { value: `${item.stocks}/${item.received}` },
            { value: NumFn.currency(item.cost) },
            { value: NumFn.currency(item.price) },
            {
                value:
                    <div>
                        <span className="bg-green-300 text-xs px-1 py-0.2 rounded-sm shadow-md whitespace-nowrap">
                            {item.source}
                        </span>
                        <span className="bg-red-300 text-xs px-1 py-0.2 rounded-sm shadow-md whitespace-nowrap">
                            ➜
                        </span>
                        <span className="bg-yellow-300 text-xs px-1 py-0.2 rounded-sm shadow-md whitespace-nowrap">
                            {item.store}
                        </span>
                    </div>
            },
            { value: <DataOperation actions={actions(item)} /> }
        ]
    }

    useEffect(() => {
        if (dataSelector?.receive) {
            let temp = dataSelector?.receive
            if (searchSelector.searchKey) {
                let sought = searchSelector.searchKey?.toLowerCase()
                temp = dataSelector?.receive?.filter(f => (
                    cleanDisplay(`${f.product_name} ${f.variant_serial} ${f.variant_model} ${f.variant_brand}`)?.toLowerCase()?.includes(sought) ||
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
    }, [dataSelector?.receive, sorted, searchSelector.searchKey])

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
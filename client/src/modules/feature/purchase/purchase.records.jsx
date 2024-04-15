import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useModalContext } from "../../../utilities/context/modal.context"
import { sortBy } from '../../../utilities/functions/array.functions'
import { longDate } from "../../../utilities/functions/datetime.functions"
import { NumFn } from "../../../utilities/functions/number.funtions"
import { StrFn } from "../../../utilities/functions/string.functions"
import useDelay from "../../../utilities/hooks/useDelay"
import useToast from "../../../utilities/hooks/useToast"
import DataOperation from '../../../utilities/interface/datastack/data.operation'
import DataRecords from '../../../utilities/interface/datastack/data.records'
import { showDelete } from "../../../utilities/redux/slices/deleteSlice"
import { setLogged } from "../../../utilities/redux/slices/utilitySlice"
import { setPurchaseItem, setPurchaseNotifier, showPurchaseManager } from "./purchase.reducer"
import { useBySyncPurchaseMutation, useDeletePurchaseMutation } from "./purchase.services"

const PurchaseRecords = ({ isLoading, records, setrecords }) => {
    const dataSelector = useSelector(state => state.purchase)
    const searchSelector = useSelector(state => state.search)
    const { assignDeleteCallback } = useModalContext()
    const dispatch = useDispatch()
    const [startpage, setstartpage] = useState(1)
    const [sorted, setsorted] = useState()
    const [active, setactive] = useState()
    const columns = dataSelector.header
    const toast = useToast()
    const delay = useDelay()

    const [deletePurchase] = useDeletePurchaseMutation()
    const [syncPurchase] = useBySyncPurchaseMutation()

    const toggleView = async (item, index) => {
        dispatch(setLogged())
        await delay.asyncDelay()
        setactive(index)
        dispatch(setPurchaseItem(item))
        dispatch(showPurchaseManager())
    }

    const toggleDelete = (item) => {
        assignDeleteCallback({ item: item, callback: handleDelete })
        dispatch(showDelete({ description: "PO No.", reference: StrFn.formatWithZeros(item.id, 6) }))
    }

    const handleDelete = async (item) => {
        if (!item.id) {
            toast.showError("Reference id does not exist.")
            return
        }
        await deletePurchase({ id: item.id })
            .unwrap()
            .then(res => {
                if (res.success) {
                    dispatch(setPurchaseNotifier(true))
                }
            })
            .catch(err => console.error(err))
        return true
    }

    const toggleSync = async (item) => {
        await syncPurchase({ id: item.id })
            .unwrap()
            .then(res => {
                if (res.success) {
                    dispatch(setPurchaseNotifier(true))
                }
            })
            .catch(err => console.error(err))
    }

    const actions = (item, index) => {
        return [
            { type: 'button', trigger: () => toggleView(item, index), label: 'View' },
            { type: 'button', trigger: () => toggleDelete(item), label: 'Delete' },
            { type: 'button', trigger: () => toggleSync(item), label: 'Sync' }
        ]
    }

    const defineStatus = (item, valueOnly = false) => {
        if (item.status === "PENDING" && item.receivedtotal > 0) {
            return valueOnly ? 'PARTIALLY RECEIVED' : <span className="text-green-600">PARTIALLY RECEIVED</span>
        }
        if (item.status === "PENDING" && item.receivedtotal === 0) {
            return valueOnly ? 'PENDING' : <span className="text-blue-600">PENDING</span>
        }
        return valueOnly ? item.status : <span className="text-gray-300">{item.status}</span>
    }

    const items = (item, index) => {
        return [
            { value: item.supplier_name },
            { value: StrFn.formatWithZeros(item.id, 6) },
            { value: longDate(item.date) },
            { value: item.category },
            { value: defineStatus(item) },
            { value: NumFn.acctg.float(item.rawtotal) },
            {
                value:
                    <span className="bg-yellow-300 text-xs px-1 py-0.2 rounded-sm shadow-md">
                        {item.store}
                    </span>
            },
            { value: <DataOperation actions={actions(item, index)} /> }
        ]
    }

    const print = (item) => {
        return [
            { value: item.supplier_name },
            { value: StrFn.formatWithZeros(item.id, 6) },
            { value: longDate(item.date) },
            { value: item.category },
            { value: defineStatus(item, true) },
            { value: NumFn.acctg.float(item.rawtotal) },
            { value: item.store },
        ]
    }

    useEffect(() => {
        if (dataSelector?.data) {
            let temp = dataSelector?.data
            if (searchSelector.searchKey) {
                let sought = searchSelector.searchKey?.toLowerCase()
                temp = dataSelector?.data?.filter(f => (
                    f.supplier_name?.toLowerCase()?.includes(sought) ||
                    String(f.id)?.toLowerCase()?.includes(sought) ||
                    f.store?.toLowerCase()?.includes(sought) ||
                    longDate(f.date)?.toLowerCase()?.includes(sought)
                ))
            }
            let data = sorted ? sortBy(temp, sorted) : temp
            setrecords(data?.map((item, index) => {
                return {
                    key: item.id,
                    items: items(item, index),
                    print: print(item),
                    onclick: () => { setactive() },
                }
            }))
        }
    }, [dataSelector?.data, sorted, searchSelector.searchKey])

    return (
        <>
            <DataRecords
                page={startpage}
                columns={columns}
                records={records}
                setsorted={setsorted}
                setPage={setstartpage}
                itemsperpage={dataSelector?.perpage}
                loading={isLoading}
                active={active}
            />
        </>
    )
}
export default PurchaseRecords
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useModalContext } from "../../../utilities/context/modal.context"
import { sortBy } from '../../../utilities/functions/array.functions'
import { longDate } from "../../../utilities/functions/datetime.functions"
import { StrFn } from "../../../utilities/functions/string.functions"
import useToast from "../../../utilities/hooks/useToast"
import DataOperation from '../../../utilities/interface/datastack/data.operation'
import DataRecords from '../../../utilities/interface/datastack/data.records'
import { showDelete } from "../../../utilities/redux/slices/deleteSlice"
import { setPurchaseItem, setPurchaseNotifier, showPurchaseManager } from "./purchase.reducer"
import { useDeletePurchaseMutation } from "./purchase.services"

const PurchaseRecords = () => {
    const dataSelector = useSelector(state => state.purchase)
    const { assignDeleteCallback } = useModalContext()
    const dispatch = useDispatch()
    const [records, setrecords] = useState()
    const [startpage, setstartpage] = useState(1)
    const [sorted, setsorted] = useState()
    const columns = dataSelector.header
    const toast = useToast()

    const [deletePurchase] = useDeletePurchaseMutation()

    const toggleView = (item) => {
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

    const actions = (item) => {
        return [
            { type: 'button', trigger: () => toggleView(item), label: 'View' },
            { type: 'button', trigger: () => toggleDelete(item), label: 'Delete' }
        ]
    }

    const items = (item) => {
        return [
            { value: item.supplier_name },
            { value: StrFn.formatWithZeros(item.id, 6) },
            { value: longDate(item.date) },
            { value: item.category },
            { value: item.status },
            { value: <span className="bg-yellow-300 text-xs px-1 py-0.2 rounded-sm shadow-md">{item.store}</span> },
            { value: <DataOperation actions={actions(item)} /> }
        ]
    }

    useEffect(() => {
        if (dataSelector?.data) {
            let data = sorted ? sortBy(dataSelector?.data, sorted) : dataSelector?.data
            setrecords(data?.map((item, i) => {
                return {
                    key: item.id,
                    items: items(item),
                    ondoubleclick: () => { },
                }
            }))
        }
    }, [dataSelector?.data, sorted])

    return (
        <>
            <DataRecords
                page={startpage}
                columns={columns}
                records={records}
                setsorted={setsorted}
                setPage={setstartpage}
                itemsperpage={dataSelector?.perpage}
            />
        </>
    )
}
export default PurchaseRecords
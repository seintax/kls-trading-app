import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useModalContext } from "../../../utilities/context/modal.context"
import { sortBy } from '../../../utilities/functions/array.functions'
import useToast from "../../../utilities/hooks/useToast"
import DataOperation from '../../../utilities/interface/datastack/data.operation'
import DataRecords from '../../../utilities/interface/datastack/data.records'
import { showDelete } from "../../../utilities/redux/slices/deleteSlice"
import { setReceivableItem, setReceivableNotifier, showReceivableManager } from "./purchase.item.reducer"
import { useDeleteReceivableMutation } from "./purchase.item.services"

const ReceivableRecords = () => {
    const dataSelector = useSelector(state => state.receivable)
    const { assignDeleteCallback } = useModalContext()
    const dispatch = useDispatch()
    const [records, setrecords] = useState()
    const [startpage, setstartpage] = useState(1)
    const [sorted, setsorted] = useState()
    const columns = dataSelector.header
    const toast = useToast()

    const [deleteReceivable] = useDeleteReceivableMutation()

    const toggleEdit = (item) => {
        dispatch(setReceivableItem(item))
        dispatch(showReceivableManager())
    }

    const toggleDelete = (item) => {
        assignDeleteCallback({ item: item, callback: handleDelete })
        dispatch(showDelete({ description: "Product", reference: item.variant }))
    }

    const handleDelete = async (item) => {
        if (!item.id) {
            toast.showError("Reference id does not exist.")
            return
        }
        await deleteReceivable({ id: item.id })
            .unwrap()
            .then(res => {
                if (res.success) {
                    dispatch(setReceivableNotifier(true))
                }
            })
            .catch(err => console.error(err))
        return true
    }

    const actions = (item) => {
        return [
            { type: 'button', trigger: () => toggleEdit(item), label: 'Edit' },
            { type: 'button', trigger: () => toggleDelete(item), label: 'Delete' }
        ]
    }

    const items = (item) => {
        return [
            { value: item.product },
            { value: item.variant },
            { value: item.ordered },
            { value: item.received },
            { value: item.costing },
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
export default ReceivableRecords
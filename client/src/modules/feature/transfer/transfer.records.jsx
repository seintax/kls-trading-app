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
import { setTransferItem, setTransferNotifier, showTransferManager } from "./transfer.reducer"
import { useDeleteTransferMutation } from "./transfer.services"

const TransferRecords = () => {
    const dataSelector = useSelector(state => state.transfer)
    const { assignDeleteCallback } = useModalContext()
    const dispatch = useDispatch()
    const [records, setrecords] = useState()
    const [startpage, setstartpage] = useState(1)
    const [sorted, setsorted] = useState()
    const columns = dataSelector.header
    const toast = useToast()

    const [deleteTransfer] = useDeleteTransferMutation()

    const toggleEdit = (item) => {
        dispatch(setTransferItem(item))
        dispatch(showTransferManager())
    }

    const toggleDelete = (item) => {
        assignDeleteCallback({ item: item, callback: handleDelete })
        dispatch(showDelete({ description: "TR No.", reference: item.id }))
    }

    const handleDelete = async (item) => {
        if (!item.id) {
            toast.showError("Reference id does not exist.")
            return
        }
        await deleteTransfer({ id: item.id })
            .unwrap()
            .then(res => {
                if (res.success) {
                    dispatch(setTransferNotifier(true))
                }
            })
            .catch(err => console.error(err))
        return true
    }

    const actions = (item) => {
        return [
            // { type: 'button', trigger: () => toggleEdit(item), label: 'View' },
            { type: 'button', trigger: () => toggleEdit(item), label: 'Edit' },
            { type: 'button', trigger: () => toggleDelete(item), label: 'Delete' }
        ]
    }

    const items = (item) => {
        return [
            { value: StrFn.formatWithZeros(item.id, 6) },
            { value: item.source },
            { value: item.destination },
            { value: item.category },
            { value: longDate(item.date) },
            { value: item.status },
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
export default TransferRecords
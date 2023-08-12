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
    const searchSelector = useSelector(state => state.search)
    const { assignDeleteCallback } = useModalContext()
    const dispatch = useDispatch()
    const [records, setrecords] = useState()
    const [startpage, setstartpage] = useState(1)
    const [sorted, setsorted] = useState()
    const columns = dataSelector.header
    const toast = useToast()

    const [deleteTransfer] = useDeleteTransferMutation()

    const toggleView = (item) => {
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
            { type: 'button', trigger: () => toggleView(item), label: 'View' },
            { type: 'button', trigger: () => toggleDelete(item), label: 'Delete' }
        ]
    }

    const items = (item) => {
        return [
            { value: StrFn.formatWithZeros(item.id, 6) },
            { value: item.category },
            { value: longDate(item.date) },
            { value: item.status },
            { value: <span className="bg-blue-300 text-xs px-1 py-0.2 rounded-sm shadow-md">{item.source}</span> },
            { value: <span className="bg-yellow-300 text-xs px-1 py-0.2 rounded-sm shadow-md">{item.destination}</span> },
            { value: <DataOperation actions={actions(item)} /> }
        ]
    }

    useEffect(() => {
        if (dataSelector?.data) {
            let temp = dataSelector?.data
            if (searchSelector.searchKey) {
                let sought = searchSelector.searchKey
                temp = dataSelector?.data?.filter(f => (
                    f.id?.toLowerCase()?.includes(sought) ||
                    f.source?.toLowerCase()?.includes(sought) ||
                    f.destination?.toLowerCase()?.includes(sought) ||
                    longDate(f.date)?.toLowerCase()?.includes(sought)
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
            />
        </>
    )
}
export default TransferRecords
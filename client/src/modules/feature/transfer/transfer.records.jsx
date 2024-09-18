import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useModalContext } from "../../../utilities/context/modal.context"
import { sortBy } from '../../../utilities/functions/array.functions'
import { longDate } from "../../../utilities/functions/datetime.functions"
import { currency } from "../../../utilities/functions/number.funtions"
import { StrFn } from "../../../utilities/functions/string.functions"
import useDelay from "../../../utilities/hooks/useDelay"
import useToast from "../../../utilities/hooks/useToast"
import DataOperation from '../../../utilities/interface/datastack/data.operation'
import DataRecords from '../../../utilities/interface/datastack/data.records'
import { showDelete } from "../../../utilities/redux/slices/deleteSlice"
import { setLogged } from "../../../utilities/redux/slices/utilitySlice"
import { setTransferItem, setTransferNotifier, showTransferManager } from "./transfer.reducer"
import { useDeleteTransferMutation } from "./transfer.services"

const TransferRecords = ({ isLoading, records, setrecords }) => {
    const dataSelector = useSelector(state => state.transfer)
    const searchSelector = useSelector(state => state.search)
    const { assignDeleteCallback } = useModalContext()
    const dispatch = useDispatch()
    const [startpage, setstartpage] = useState(1)
    const [sorted, setsorted] = useState()
    const [active, setactive] = useState()
    const columns = dataSelector.header
    const toast = useToast()
    const delay = useDelay()

    const [deleteTransfer] = useDeleteTransferMutation()

    const toggleView = async (item, index) => {
        dispatch(setLogged())
        await delay.asyncDelay()
        setactive(index)
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

    const actions = (item, index) => {
        return [
            // { type: 'button', trigger: () => toggleEdit(item), label: 'View' },
            { type: 'button', trigger: () => toggleView(item, index), label: 'View' },
            { type: 'button', trigger: () => toggleDelete(item), label: 'Delete' }
        ]
    }

    const defineStatus = (item) => {
        if (item.count === item.arrive) {
            return <span className="text-gray-300">FULLY RECEIVED</span>
        }
        if (item.arrive > 0) {
            return <span className="text-green-600">PARTIALLY RECEIVED</span>
        }
        return <span className="text-blue-600">PENDING</span>
    }

    const statusValue = (item) => {
        if (item.count === item.arrive) return "FULLY RECEIVED"
        if (item.arrive > 0) return "PARTIALLY RECEIVED"
        return "PENDING"
    }

    const items = (item, index) => {
        return [
            { value: StrFn.formatWithZeros(item.id, 6) },
            { value: item.category },
            { value: longDate(item.date) },
            { value: defineStatus(item) },
            { value: currency(item.value) },
            { value: <span className="bg-blue-300 text-xs px-1 py-0.2 rounded-sm shadow-md">{item.source}</span> },
            { value: <span className="bg-yellow-300 text-xs px-1 py-0.2 rounded-sm shadow-md">{item.destination}</span> },
            { value: <DataOperation actions={actions(item, index)} /> }
        ]
    }

    const print = (item) => {
        return [
            { value: StrFn.formatWithZeros(item.id, 6) },
            { value: item.category },
            { value: longDate(item.date) },
            { value: statusValue(item) },
            { value: currency(item.value) },
            { value: item.source },
            { value: item.destination },
        ]
    }

    useEffect(() => {
        if (dataSelector?.data) {
            let temp = dataSelector?.data
            if (searchSelector.searchKey) {
                let sought = searchSelector.searchKey
                temp = dataSelector?.data?.filter(f => (
                    String(f.id)?.toLowerCase()?.includes(sought) ||
                    f.source?.toLowerCase()?.includes(sought) ||
                    f.destination?.toLowerCase()?.includes(sought) ||
                    longDate(f.date)?.toLowerCase()?.includes(sought)
                ))
            }
            let data = sorted ? sortBy(temp, sorted) : temp
            setrecords(data?.map((item, index) => {
                return {
                    key: item.id,
                    items: items(item, index),
                    print: print(item),
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
                loading={isLoading}
                active={active}
            />
        </>
    )
}
export default TransferRecords
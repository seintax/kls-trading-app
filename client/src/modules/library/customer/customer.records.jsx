import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useModalContext } from "../../../utilities/context/modal.context"
import { sortBy } from '../../../utilities/functions/array.functions'
import { NumFn } from "../../../utilities/functions/number.funtions"
import { isAdmin, isDev } from "../../../utilities/functions/string.functions"
import useAuth from "../../../utilities/hooks/useAuth"
import useToast from "../../../utilities/hooks/useToast"
import DataOperation from '../../../utilities/interface/datastack/data.operation'
import DataRecords from '../../../utilities/interface/datastack/data.records'
import { showDelete } from "../../../utilities/redux/slices/deleteSlice"
import { setCustomerItem, setCustomerNotifier, showCustomerManager } from "./customer.reducer"
import { useDeleteCustomerMutation } from "./customer.services"

const CustomerRecords = () => {
    const auth = useAuth()
    const dataSelector = useSelector(state => state.customer)
    const searchSelector = useSelector(state => state.search)
    const { assignDeleteCallback } = useModalContext()
    const dispatch = useDispatch()
    const [records, setrecords] = useState()
    const [startpage, setstartpage] = useState(1)
    const [sorted, setsorted] = useState()
    const columns = dataSelector.header
    const toast = useToast()

    const [deleteCustomer] = useDeleteCustomerMutation()

    const toggleEdit = (item) => {
        dispatch(setCustomerItem(item))
        dispatch(showCustomerManager())
    }

    const toggleDelete = (item) => {
        if (item.id === 0) {
            toast.showWarning("Cannot delete a system constant value.")
            return
        }
        assignDeleteCallback({ item: item, callback: handleDelete })
        dispatch(showDelete({ description: "Customer", reference: item.name }))
    }

    const handleDelete = async (item) => {
        if (!item.id) {
            toast.showError("Reference id does not exist.")
            return
        }
        await deleteCustomer({ id: item.id })
            .unwrap()
            .then(res => {
                if (res.success) {
                    dispatch(setCustomerNotifier(true))
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
            { value: item.name },
            { value: item.address },
            { value: item.cellphone },
            { value: item.email },
            { value: item.count },
            { value: NumFn.currency(item.value) },
            { value: (isDev(auth) || isAdmin(auth)) ? <DataOperation actions={actions(item)} /> : null },
        ]
    }

    useEffect(() => {
        if (dataSelector?.data) {
            let temp = dataSelector?.data
            if (searchSelector.searchKey) {
                let sought = searchSelector.searchKey
                temp = dataSelector?.data?.filter(f => (
                    f.name?.toLowerCase()?.includes(sought) ||
                    f.address?.toLowerCase()?.includes(sought)
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
export default CustomerRecords
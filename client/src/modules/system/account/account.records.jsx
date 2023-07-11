import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useModalContext } from "../../../utilities/context/modal.context"
import { sortBy } from '../../../utilities/functions/array.functions'
import { isAdmin, isDev } from "../../../utilities/functions/string.functions"
import useAuth from "../../../utilities/hooks/useAuth"
import useToast from "../../../utilities/hooks/useToast"
import DataOperation from '../../../utilities/interface/datastack/data.operation'
import DataRecords from '../../../utilities/interface/datastack/data.records'
import { showDelete } from "../../../utilities/redux/slices/deleteSlice"
import { setAccountItem, setAccountNotifier, showAccountManager } from "./account.reducer"
import { useDeleteAccountMutation } from "./account.services"

const AccountRecords = () => {
    const auth = useAuth()
    const dataSelector = useSelector(state => state.account)
    const { assignDeleteCallback } = useModalContext()
    const dispatch = useDispatch()
    const [records, setrecords] = useState()
    const [startpage, setstartpage] = useState(1)
    const [sorted, setsorted] = useState()
    const columns = dataSelector.header
    const toast = useToast()

    const [deleteAccount] = useDeleteAccountMutation()

    const toggleEdit = (item) => {
        dispatch(setAccountItem(item))
        dispatch(showAccountManager())
    }

    const toggleDelete = (item) => {
        assignDeleteCallback({ item: item, callback: handleDelete })
        dispatch(showDelete({ description: "Email address", reference: item.user }))
    }

    const handleDelete = async (item) => {
        if (!item.id) {
            toast.showError("Reference id does not exist.")
            return
        }
        await deleteAccount({ id: item.id })
            .unwrap()
            .then(res => {
                if (res.success) {
                    dispatch(setAccountNotifier(true))
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
            {
                value: isDev(item) && !isDev(auth)
                    ? <span className="text-[10px] px-2 py-1 bg-gray-300 italic text-gray-500 rounded-md no-select uppercase">Confidential</span>
                    : item.user
            },
            {
                value: isDev(item) && !isDev(auth)
                    ? <span className="text-[10px] px-2 py-1 bg-gray-300 italic text-gray-500 rounded-md no-select uppercase">Confidential</span>
                    : item.name || <span className="italic">Unnamed</span>
            },
            {
                value: isDev(item) && !isDev(auth)
                    ? <span className="text-[10px] px-2 py-1 bg-gray-300 italic text-gray-500 rounded-md no-select uppercase">Confidential</span>
                    : item.store
            },
            {
                value: isDev(item) && !isDev(auth)
                    ? <span className="text-[10px] px-2 py-1 bg-gray-300 italic text-gray-500 rounded-md no-select uppercase">Confidential</span>
                    : item.confirm ? "YES" : "NO"
            },
            {
                value: isDev(item) && !isDev(auth)
                    ? null
                    : (
                        isAdmin(auth) || isDev(auth)
                            ? <DataOperation actions={actions(item)} />
                            : null
                    )
            }
        ]
    }

    useEffect(() => {
        if (dataSelector?.data) {
            let valid = !isDev(auth) ? dataSelector?.data?.filter(f => f.store !== "DevOp") : dataSelector?.data
            let data = sorted ? sortBy(valid, sorted) : valid
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
export default AccountRecords
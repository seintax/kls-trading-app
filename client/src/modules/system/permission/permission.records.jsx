import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useModalContext } from "../../../utilities/context/modal.context"
import { sortBy } from '../../../utilities/functions/array.functions'
import { YesNoFromBoolean } from "../../../utilities/functions/string.functions"
import useToast from "../../../utilities/hooks/useToast"
import DataOperation from '../../../utilities/interface/datastack/data.operation'
import DataRecords from '../../../utilities/interface/datastack/data.records'
import { showDelete } from "../../../utilities/redux/slices/deleteSlice"
import { setPermissionItem, setPermissionNotifier, showPermissionManager } from "./permission.reducer"
import { useDeletePermissionMutation } from "./permission.services"

const PermissionRecords = () => {
    const dataSelector = useSelector(state => state.permission)
    const { assignDeleteCallback } = useModalContext()
    const dispatch = useDispatch()
    const [records, setrecords] = useState()
    const [startpage, setstartpage] = useState(1)
    const [sorted, setsorted] = useState()
    const columns = dataSelector.header
    const toast = useToast()

    const [deletePermission] = useDeletePermissionMutation()

    const toggleEdit = (item) => {
        dispatch(setPermissionItem(item))
        dispatch(showPermissionManager())
    }

    const toggleDelete = (item) => {
        assignDeleteCallback({ item: item, callback: handleDelete })
        dispatch(showDelete({ description: "Permission title", reference: item.name }))
    }

    const handleDelete = async (item) => {
        if (!item.id) {
            toast.showError("Reference id does not exist.")
            return
        }
        await deletePermission({ id: item.id })
            .unwrap()
            .then(res => {
                if (res.success) {
                    dispatch(setPermissionNotifier(true))
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

    const hasCustom = (json) => {
        let boolString = "No"
        let inclusion = ["show", "create", "read", "update", "delete"]
        for (const prop in json) {
            if (!inclusion.includes(prop)) {
                boolString = "Yes"
                break
            }
        }
        return boolString
    }

    const items = (item) => {
        let json = JSON.parse(item.json)
        return [
            { value: item.name },
            {
                value: <span className={json?.show ? "text-blue-400" : "text-red-400"}>
                    {YesNoFromBoolean(json?.show)}
                </span>
            },
            {
                value: <span className={json?.create ? "text-blue-400" : "text-red-400"}>
                    {YesNoFromBoolean(json?.create)}
                </span>
            },
            {
                value: <span className={json?.read ? "text-blue-400" : "text-red-400"}>
                    {YesNoFromBoolean(json?.read)}
                </span>
            },
            {
                value: <span className={json?.update ? "text-blue-400" : "text-red-400"}>
                    {YesNoFromBoolean(json?.update)}
                </span>
            },
            {
                value: <span className={json?.delete ? "text-blue-400" : "text-red-400"}>
                    {YesNoFromBoolean(json?.delete)}
                </span>
            },
            {
                value: <span className={hasCustom(json) === "Yes" ? "text-blue-400" : "text-red-400"}>
                    {hasCustom(json)}
                </span>
            },
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
export default PermissionRecords
import { ArrowLeftIcon } from "@heroicons/react/24/outline"
import React, { useEffect, useState } from 'react'
import { FiRepeat, FiSave, FiXSquare } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"
import { StrFn, isDev } from "../../../utilities/functions/string.functions"
import useAuth from "../../../utilities/hooks/useAuth"
import useToast from "../../../utilities/hooks/useToast"
import { useFetchAllPermissionMutation } from "../permission/permission.services"
import { resetRolesPermissions, setRolesNotifier } from "./roles.reducer"
import { useUpdateRolesMutation } from "./roles.services"

const RolesPermissions = () => {
    const auth = useAuth()
    const dataSelector = useSelector(state => state.roles)
    const dispatch = useDispatch()
    const [instantiated, setInstantiated] = useState(false)
    const [permissions, setPermissions] = useState({})
    const [cached, setCached] = useState({})
    const [isDirty, setIsDirty] = useState(false)
    const toast = useToast()

    const [libPermissions, setLibPermissions] = useState()
    const [allPermissions] = useFetchAllPermissionMutation()
    const [updateRoles] = useUpdateRolesMutation()
    const inclusion = isDev(auth)
        ? []
        : ["branches-menu", "permissions-menu", "roles-menu"]

    useEffect(() => {
        const onUnload = (e) => {
            if (isDirty) alert("this is dirty")
        }

        window.addEventListener("beforeunload", onUnload)

        return () => {
            window.removeEventListener('beforeunload', onUnload)
        }
    }, [isDirty])

    useEffect(() => {
        const instantiate = async () => {
            await allPermissions()
                .unwrap()
                .then(res => {
                    if (res.success) {
                        if (!dataSelector.item.permission) {
                            setPermissions(formatToJSONObject(res?.arrayResult))
                            setCached()
                            setIsDirty(true)
                        }
                        setLibPermissions(formatToJSONObject(res?.arrayResult))
                    }
                })
                .catch(err => console.error(err))
            setInstantiated(true)
        }
        instantiate()
        setPermissions(JSON.parse(dataSelector.item.permission))
        setCached(dataSelector.item.permission)
        setIsDirty(false)
        setInstantiated(true)
    }, [dataSelector.item.permission])

    const onClose = () => {
        if (isDirty) {
            if (!window.confirm("Do you wish to dischard changes?"))
                return
        }
        dispatch(resetRolesPermissions())
    }

    const arrayProps = (json) => {
        let usableJson = JSON.parse(json)
        let jsonArray = []
        for (const prop in usableJson) {
            jsonArray.push({ name: prop, value: usableJson[prop] })
        }
        return jsonArray
    }

    const formatToJSONObject = (array) => {
        let jsonObject = {}
        array?.map(permission => {
            let usableJson = JSON.parse(permission.json)
            let jsonArray = {}
            for (const prop in usableJson) {
                if (usableJson[prop])
                    jsonArray = {
                        ...jsonArray,
                        [prop]: inclusion.includes(permission.name)
                            ? false
                            : usableJson[prop]
                    }
            }
            jsonObject = {
                ...jsonObject,
                [permission.name]: {
                    ...jsonArray
                }
            }
        })
        return jsonObject
    }

    useEffect(() => {
        if (instantiated) {
            setIsDirty(cached !== JSON.stringify(permissions))
        }
    }, [instantiated, permissions, cached])

    const destructToJSONArray = (json) => {
        let jsonArray = []
        let index = 0
        for (const prop in json) {
            jsonArray.push({ id: index, name: prop, json: JSON.stringify(json[prop]) })
            index++
        }
        return jsonArray
    }

    const formatPropName = (name) => {
        return name
            .split("-")
            .map(prop => { return StrFn.properCase(prop) })
            .join(" ")

    }

    const updatePermission = (permission, action, value) => {
        if (inclusion.includes(permission)) return
        setPermissions(prev => ({
            ...prev,
            [permission]: {
                ...prev[permission],
                [action]: value
            }
        }))
    }

    const updateAllPermission = (permission, value) => {
        if (inclusion.includes(permission)) return
        let currentPermission = permissions[permission]
        let newPermission = {}
        for (const prop in currentPermission) {
            newPermission = {
                ...newPermission,
                [prop]: value
            }
        }
        setPermissions(prev => ({
            ...prev,
            [permission]: newPermission
        }))
    }

    const onCompleted = () => {
        dispatch(setRolesNotifier(true))
    }

    const applyChanges = async () => {
        if (dataSelector.item.id) {
            await updateRoles({ permission: JSON.stringify(permissions), id: dataSelector.item.id })
                .unwrap()
                .then(res => {
                    if (res.success) {
                        setCached(JSON.stringify(permissions))
                        toast.showUpdate("Role permissions has been successfully updated.")
                        onCompleted()
                    }
                })
                .catch(err => console.error(err))
            return
        }
    }

    const resetPermissions = () => {
        if (window.confirm("Do you wish to reset all permissions?")) {
            setPermissions(libPermissions)
        }
    }

    return (
        <div className="w-full min-h-full">
            <div className="flex gap-5 items-center">
                <ArrowLeftIcon
                    className="w-5 h-5 cursor-pointer"
                    onClick={() => onClose()}
                />
                <span className="flex items-center font-bold text-lg gap-5">
                    All Permissions for:
                    <span className="bg-secondary-500 text-white px-3 py-0.5 rounded-md">
                        {dataSelector.item.name}
                    </span>
                </span>
            </div>
            <div className={`fixed bottom-44 right-12 p-2 rounded-md cursor-pointer bg-red-600 hover:bg-red-700`} onClick={() => onClose()}>
                <FiXSquare className="text-[30px] text-white" />
            </div>
            <div className={`fixed bottom-28 right-12 p-2 rounded-md cursor-pointer bg-green-600 hover:bg-green-700`} onClick={() => resetPermissions()}>
                <FiRepeat className="text-[30px] text-white" />
            </div>
            <div className={`fixed bottom-12 right-12 p-2 rounded-md cursor-pointer ${isDirty ? "bg-blue-600 hover:bg-blue-700" : " bg-gray-400 hover:bg-gray-500"}`} onClick={() => applyChanges()}>
                <FiSave className="text-[30px] text-white" />
            </div>
            <div className="w-full flex flex-col items-center gap-5 my-10">
                {
                    (destructToJSONArray(permissions)?.map((permission, i) => (
                        <div key={permission.name} className="flex flex-col w-3/4 bg-white border border-secondary-500 text-white rounded-md px-5 py-5 gap-5">
                            <div className="text-[15px] w-full bg-gradient-to-r from-primary-300 from-primary-300 text-secondary-500 font-bold p-3">
                                {formatPropName(permission.name)}
                            </div>
                            <div className="flex flex-wrap gap-5 justify-start">
                                <div className="flex gap-5 pl-3 pr-1.5 py-1.5 bg-gradient-to-r from-primary-300 to-white text-secondary-500 items-center justify-between w-3/4">
                                    <span className="font-bold">
                                        Switch All
                                    </span>
                                    <span className="isolate inline-flex rounded-md shadow-sm">
                                        <button
                                            type="button"
                                            className={`relative inline-flex items-center bg-white px-3 py-1 font-semibold ring-1 ring-inset ring-secondary-500 focus:z-10 w-[50px] justify-center hover:bg-secondary-300 text-gray-400`}
                                            onClick={() => updateAllPermission(permission.name, true)}
                                        >
                                            ON
                                        </button>
                                        <button
                                            type="button"
                                            className={`relative -ml-px inline-flex items-center bg-white px-3 py-1 font-semibold ring-1 ring-inset ring-secondary-500 focus:z-10 w-[50px] justify-center hover:bg-secondary-300 text-gray-400`}
                                            onClick={() => updateAllPermission(permission.name, false)}
                                        >
                                            OFF
                                        </button>
                                    </span>
                                </div>
                                {
                                    arrayProps(permission.json)?.map((prop, index) => (
                                        <div key={prop.name} className="flex gap-5 pl-3 pr-1.5 py-1.5 bg-gradient-to-r from-secondary-500 to-primary-400 items-center justify-between w-3/4">
                                            <span className="font-bold">
                                                {formatPropName(prop.name)}
                                            </span>
                                            <span className="isolate inline-flex rounded-md shadow-sm">
                                                <button
                                                    type="button"
                                                    className={`relative inline-flex items-center bg-white px-3 py-1 font-semibold ring-1 ring-inset ring-gray-300 focus:z-10 w-[50px] justify-center hover:bg-gray-300 ${prop.value ? "bg-blue-600 text-white hover:bg-blue-400" : "text-gray-400"}`}
                                                    onClick={() => updatePermission(permission.name, prop.name, true)}
                                                >
                                                    ON
                                                </button>
                                                <button
                                                    type="button"
                                                    className={`relative -ml-px inline-flex items-center bg-white px-3 py-1 font-semibold ring-1 ring-inset ring-gray-300 focus:z-10 w-[50px] justify-center hover:bg-gray-300 ${!prop.value ? "bg-blue-600 text-white hover:bg-blue-400" : "text-gray-400"}`}
                                                    onClick={() => updatePermission(permission.name, prop.name, false)}
                                                >
                                                    OFF
                                                </button>
                                            </span>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    )))
                }
            </div>
        </div>
    )
}

export default RolesPermissions
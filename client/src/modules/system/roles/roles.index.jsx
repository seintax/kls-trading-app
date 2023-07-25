import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import DataIndex from "../../../utilities/interface/datastack/data.index"
import RolesManage from "./roles.manage"
import RolesPermissions from "./roles.permissions"
import RolesRecords from "./roles.records"
import { resetRolesItem, resetRolesManager, resetRolesPermissions, setRolesData, setRolesNotifier, showRolesManager } from "./roles.reducer"
import { useFetchAllRolesMutation } from "./roles.services"

const RolesIndex = () => {
    const [allRoles, { isLoading, isError, isSuccess }] = useFetchAllRolesMutation()
    const dataSelector = useSelector(state => state.roles)
    const dispatch = useDispatch()
    const [mounted, setMounted] = useState(false)

    useEffect(() => { setMounted(true) }, [])

    useEffect(() => {
        if (mounted) {
            return () => {
                dispatch(resetRolesManager())
                dispatch(resetRolesPermissions())
            }
        }
    }, [mounted])

    useEffect(() => {
        const instantiate = async () => {
            await allRoles()
                .unwrap()
                .then(res => {
                    if (res.success) {
                        dispatch(setRolesData(res?.arrayResult))
                        dispatch(setRolesNotifier(false))
                    }
                })
                .catch(err => console.error(err))
            return
        }
        if (dataSelector.data.length === 0 || dataSelector.notifier) {
            instantiate()
        }
    }, [dataSelector.notifier])

    const toggleNewEntry = () => {
        dispatch(resetRolesItem())
        dispatch(showRolesManager())
    }

    const actions = () => {
        return [
            { label: `Add ${dataSelector.display.name}`, callback: toggleNewEntry },
        ]
    }

    return (
        (dataSelector.manager) ? (
            <RolesManage name={dataSelector.display.name} />
        ) : (
            (dataSelector.permissions) ? (
                <RolesPermissions />
            ) : (
                <DataIndex
                    display={dataSelector.display}
                    actions={actions()}
                    data={dataSelector.data}
                    isError={isError}
                    isLoading={isLoading}
                >
                    <RolesRecords />
                </DataIndex >
            )
        )
    )
}

export default RolesIndex
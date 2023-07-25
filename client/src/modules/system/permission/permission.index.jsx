import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import DataIndex from "../../../utilities/interface/datastack/data.index"
import PermissionManage from "./permission.manage"
import PermissionRecords from "./permission.records"
import { resetPermissionItem, setPermissionData, setPermissionNotifier, showPermissionManager } from "./permission.reducer"
import { useFetchAllPermissionMutation } from "./permission.services"

const PermissionIndex = () => {
    const [allPermission, { isLoading, isError, isSuccess }] = useFetchAllPermissionMutation()
    const dataSelector = useSelector(state => state.permission)
    const dispatch = useDispatch()

    useEffect(() => {
        const instantiate = async () => {
            await allPermission()
                .unwrap()
                .then(res => {
                    if (res.success) {
                        dispatch(setPermissionData(res?.arrayResult))
                        dispatch(setPermissionNotifier(false))
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
        dispatch(resetPermissionItem())
        dispatch(showPermissionManager())
    }

    const actions = () => {
        return [
            { label: `Add ${dataSelector.display.name}`, callback: toggleNewEntry },
        ]
    }

    return (
        (dataSelector.manager) ? (
            <PermissionManage name={dataSelector.display.name} />
        ) : (
            <DataIndex
                display={dataSelector.display}
                actions={actions()}
                data={dataSelector.data}
                isError={isError}
                isLoading={isLoading}
            >
                <PermissionRecords />
            </DataIndex >
        )
    )
}

export default PermissionIndex
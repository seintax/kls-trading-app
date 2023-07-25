import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { getBranch } from "../../../utilities/functions/string.functions"
import useAuth from "../../../utilities/hooks/useAuth"
import DataIndex from "../../../utilities/interface/datastack/data.index"
import AdjustmentIndex from "../inventory-item/inventory.item.index"
import InventoryRecords from "./inventory.records"
import { resetInventoryItem, resetInventoryManager, setInventoryData, setInventoryNotifier, showInventoryManager } from "./inventory.reducer"
import { useFetchAllInventoryBranchMutation } from "./inventory.services"

const InventoryIndex = () => {
    const auth = useAuth()
    const [allInventory, { isLoading, isError, isSuccess }] = useFetchAllInventoryBranchMutation()
    const dataSelector = useSelector(state => state.inventory)
    const dispatch = useDispatch()
    const [mounted, setMounted] = useState(false)

    useEffect(() => { setMounted(true) }, [])

    useEffect(() => {
        if (mounted) {
            return () => {
                dispatch(resetInventoryManager())
            }
        }
    }, [mounted])

    useEffect(() => {
        const instantiate = async () => {
            await allInventory({ branch: getBranch(auth) })
                .unwrap()
                .then(res => {
                    if (res.success) {
                        dispatch(setInventoryData(res?.arrayResult))
                        dispatch(setInventoryNotifier(false))
                    }
                })
                .catch(err => console.error(err))
            return
        }
        if (dataSelector.data.length === 0 || dataSelector.notifier || auth?.store) {
            instantiate()
        }
    }, [dataSelector.notifier, auth])

    const toggleNewEntry = () => {
        dispatch(resetInventoryItem())
        dispatch(showInventoryManager())
    }

    const actions = () => {
        return [
            // { label: `Add ${dataSelector.display.name}`, callback: toggleNewEntry },
        ]
    }

    return (
        (dataSelector.manager) ? (
            <AdjustmentIndex />
        ) : (
            <DataIndex
                display={dataSelector.display}
                actions={actions()}
                data={dataSelector.data}
                isError={isError}
                isLoading={isLoading}
            >
                <InventoryRecords />
            </DataIndex >
        )
    )
}

export default InventoryIndex
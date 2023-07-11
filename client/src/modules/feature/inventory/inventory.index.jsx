import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import DataIndex from "../../../utilities/interface/datastack/data.index"
import InventoryRecords from "./inventory.records"
import { resetInventoryItem, setInventoryData, setInventoryNotifier, showInventoryManager } from "./inventory.reducer"
import { useFetchAllInventoryMutation } from "./inventory.services"

const InventoryIndex = () => {
    const [allInventory, { isLoading, isError, isSuccess }] = useFetchAllInventoryMutation()
    const dataSelector = useSelector(state => state.inventory)
    const dispatch = useDispatch()

    useEffect(() => {
        const instantiate = async () => {
            await allInventory()
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
        if (dataSelector.data.length === 0 || dataSelector.notifier) {
            instantiate()
        }
    }, [dataSelector.notifier])

    useEffect(() => {
        if (!isLoading && isSuccess) {
            console.log("done")
        }
    }, [isSuccess, isLoading])

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
            // <InventoryManage name={dataSelector.display.name} />
            <div></div>
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
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import useAuth from "../../../utilities/hooks/useAuth"
import DataIndex from "../../../utilities/interface/datastack/data.index"
import { useFetchAllBranchMutation } from "../../library/branch/branch.services"
import AdjustmentIndex from "../inventory-item/inventory.item.index"
import PriceIndex from "../price/price.index"
import InventoryRecords from "./inventory.records"
import { resetInventoryItem, resetInventoryManager, setInventoryData, setInventoryNotifier, showInventoryManager } from "./inventory.reducer"
import { useFetchAllInventoryBranchMutation } from "./inventory.services"

const InventoryIndex = () => {
    const auth = useAuth()
    const [allInventory, { isLoading, isError, isSuccess }] = useFetchAllInventoryBranchMutation()
    const dataSelector = useSelector(state => state.inventory)
    const priceSelector = useSelector(state => state.price)
    const dispatch = useDispatch()
    const [mounted, setMounted] = useState(false)
    const [currentBranch, setCurrentBranch] = useState("JT-MAIN")
    const [libBranches, setLibBranches] = useState()

    const [allBranches] = useFetchAllBranchMutation()

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
            await allInventory({ branch: currentBranch })
                .unwrap()
                .then(res => {
                    if (res.success) {
                        dispatch(setInventoryData(res?.arrayResult))
                        dispatch(setInventoryNotifier(false))
                    }
                })
                .catch(err => console.error(err))
            await allBranches()
                .unwrap()
                .then(res => {
                    if (res.success) {
                        setLibBranches(res?.arrayResult.map(item => {
                            return {
                                key: item.name,
                                value: item.code
                            }
                        }))
                    }
                })
                .catch(err => console.error(err))
            return
        }

        if (dataSelector.data.length === 0 || dataSelector.notifier) {
            instantiate()
        }
    }, [dataSelector.notifier, currentBranch])

    const toggleNewEntry = () => {
        dispatch(resetInventoryItem())
        dispatch(showInventoryManager())
    }

    const actions = () => {
        return [
            // { label: `Add ${dataSelector.display.name}`, callback: toggleNewEntry },
        ]
    }

    const sortcallback = (option) => {
        setCurrentBranch(option.value)
        dispatch(setInventoryNotifier(true))
    }

    return (
        (priceSelector.shown) ? (
            <PriceIndex />
        ) : (
            (dataSelector.manager) ? (
                <AdjustmentIndex />
            ) : (
                <DataIndex
                    display={dataSelector.display}
                    actions={actions()}
                    sorts={libBranches}
                    sortcallback={sortcallback}
                    data={dataSelector.data}
                    isError={isError}
                    isLoading={isLoading}
                >
                    <InventoryRecords />
                </DataIndex >
            )
        )

    )
}

export default InventoryIndex
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import DataIndex from "../../../utilities/interface/datastack/data.index"
import BranchManage from "./branch.manage"
import BranchRecords from "./branch.records"
import { resetBranchItem, setBranchData, setBranchNotifier, showBranchManager } from "./branch.reducer"
import { useFetchAllBranchMutation } from "./branch.services"

const BranchIndex = () => {
    const [allBranch, { isLoading, isError, isSuccess }] = useFetchAllBranchMutation()
    const dataSelector = useSelector(state => state.branch)
    const dispatch = useDispatch()

    useEffect(() => {
        const instantiate = async () => {
            await allBranch()
                .unwrap()
                .then(res => {
                    if (res.success) {
                        dispatch(setBranchData(res?.arrayResult))
                        dispatch(setBranchNotifier(false))
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
        dispatch(resetBranchItem())
        dispatch(showBranchManager())
    }

    const actions = () => {
        return [
            { label: `Add ${dataSelector.display.name}`, callback: toggleNewEntry },
        ]
    }

    return (
        (dataSelector.manager) ? (
            <BranchManage name={dataSelector.display.name} />
        ) : (
            <DataIndex
                display={dataSelector.display}
                actions={actions()}
                data={dataSelector.data}
                isError={isError}
                isLoading={isLoading}
            >
                <BranchRecords />
            </DataIndex >
        )
    )
}

export default BranchIndex
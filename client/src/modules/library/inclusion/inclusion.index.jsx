import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import DataIndex from "../../../utilities/interface/datastack/data.index"
import InclusionManage from "./inclusion.manage"
import InclusionRecords from "./inclusion.records"
import { resetInclusionItem, setInclusionData, setInclusionNotifier, showInclusionManager } from "./inclusion.reducer"
import { useFetchAllInclusionMutation } from "./inclusion.services"

const InclusionIndex = () => {
    const [allInclusion, { isLoading, isError, isSuccess }] = useFetchAllInclusionMutation()
    const dataSelector = useSelector(state => state.inclusion)
    const dispatch = useDispatch()

    useEffect(() => {
        const instantiate = async () => {
            await allInclusion()
                .unwrap()
                .then(res => {
                    if (res.success) {
                        dispatch(setInclusionData(res?.arrayResult))
                        dispatch(setInclusionNotifier(false))
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
        dispatch(resetInclusionItem())
        dispatch(showInclusionManager())
    }

    const actions = () => {
        return [
            { label: `Add ${dataSelector.display.name}`, callback: toggleNewEntry },
        ]
    }

    return (
        (dataSelector.manager) ? (
            <InclusionManage name={dataSelector.display.name} />
        ) : (
            <DataIndex
                display={dataSelector.display}
                actions={actions()}
                data={dataSelector.data}
                isError={isError}
                isLoading={isLoading}
            >
                <InclusionRecords />
            </DataIndex >
        )
    )
}

export default InclusionIndex
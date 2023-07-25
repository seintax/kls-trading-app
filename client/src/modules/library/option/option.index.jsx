import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import DataIndex from "../../../utilities/interface/datastack/data.index"
import OptionManage from "./option.manage"
import OptionRecords from "./option.records"
import { resetOptionItem, setOptionData, setOptionNotifier, showOptionManager } from "./option.reducer"
import { useFetchAllOptionMutation } from "./option.services"

const OptionIndex = () => {
    const [allOption, { isLoading, isError, isSuccess }] = useFetchAllOptionMutation()
    const dataSelector = useSelector(state => state.option)
    const dispatch = useDispatch()

    useEffect(() => {
        const instantiate = async () => {
            await allOption()
                .unwrap()
                .then(res => {
                    if (res.success) {
                        dispatch(setOptionData(res?.arrayResult))
                        dispatch(setOptionNotifier(false))
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
        dispatch(resetOptionItem())
        dispatch(showOptionManager())
    }

    const actions = () => {
        return [
            { label: `Add ${dataSelector.display.name}`, callback: toggleNewEntry },
        ]
    }

    return (
        (dataSelector.manager) ? (
            <OptionManage name={dataSelector.display.name} />
        ) : (
            <DataIndex
                display={dataSelector.display}
                actions={actions()}
                data={dataSelector.data}
                isError={isError}
                isLoading={isLoading}
            >
                <OptionRecords />
            </DataIndex >
        )
    )
}

export default OptionIndex
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import DataIndex from "../../../utilities/interface/datastack/data.index"
import ReceivableRecords from "./purchase.item.records"
import { resetReceivableItem, setReceivableData, setReceivableNotifier, showReceivableManager } from "./purchase.item.reducer"
import { useFetchAllReceivableMutation } from "./purchase.item.services"

const ReceivableIndex = () => {
    const [allReceivable, { isLoading, isError, isSuccess }] = useFetchAllReceivableMutation()
    const dataSelector = useSelector(state => state.receivable)
    const dispatch = useDispatch()

    useEffect(() => {
        const instantiate = async () => {
            await allReceivable()
                .unwrap()
                .then(res => {
                    if (res.success) {
                        dispatch(setReceivableData(res?.arrayResult))
                        dispatch(setReceivableNotifier(false))
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
        dispatch(resetReceivableItem())
        dispatch(showReceivableManager())
    }

    const actions = () => {
        return [
            { label: `Add ${dataSelector.display.name}`, callback: toggleNewEntry },
        ]
    }

    return (
        <DataIndex
            display={dataSelector.display}
            actions={actions()}
            data={dataSelector.data}
            isError={isError}
            isLoading={isLoading}
            plain={true}
        >
            <ReceivableRecords />
        </DataIndex >
    )
}

export default ReceivableIndex
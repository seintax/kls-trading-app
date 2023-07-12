import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import DataIndex from "../../../utilities/interface/datastack/data.index"
import TransmitManage from "./transfer.item.manage"
import TransmitRecords from "./transfer.item.records"
import { resetTransmitItem, setTransmitData, setTransmitNotifier, showTransmitManager } from "./transfer.item.reducer"
import { useFetchAllTransmitMutation } from "./transfer.item.services"

const TransmitIndex = () => {
    const [allTransmit, { isLoading, isError, isSuccess }] = useFetchAllTransmitMutation()
    const dataSelector = useSelector(state => state.transmit)
    const dispatch = useDispatch()

    useEffect(() => {
        const instantiate = async () => {
            await allTransmit()
                .unwrap()
                .then(res => {
                    if (res.success) {
                        dispatch(setTransmitData(res?.arrayResult))
                        dispatch(setTransmitNotifier(false))
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
        dispatch(resetTransmitItem())
        dispatch(showTransmitManager())
    }

    const actions = () => {
        return [
            { label: `Add ${dataSelector.display.name}`, callback: toggleNewEntry },
        ]
    }

    return (
        (dataSelector.manager) ? (
            <TransmitManage name={dataSelector.display.name} />
        ) : (
            <DataIndex
                display={dataSelector.display}
                actions={actions()}
                data={dataSelector.data}
                isError={isError}
                isLoading={isLoading}
            >
                <TransmitRecords />
            </DataIndex >
        )
    )
}

export default TransmitIndex
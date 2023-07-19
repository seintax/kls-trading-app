import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import DataIndex from "../../../utilities/interface/datastack/data.index"
import TransferManage from "./transfer.manage"
import TransferRecords from "./transfer.records"
import { resetTransferItem, resetTransferSelector, setTransferData, setTransferItem, setTransferNotifier, showTransferManager } from "./transfer.reducer"
import { useFetchAllTransferMutation } from "./transfer.services"

const TransferIndex = () => {
    const [allTransfer, { isLoading, isError, isSuccess }] = useFetchAllTransferMutation()
    const dataSelector = useSelector(state => state.transfer)
    const dispatch = useDispatch()

    useEffect(() => {
        const instantiate = async () => {
            await allTransfer()
                .unwrap()
                .then(res => {
                    if (res.success) {
                        dispatch(setTransferData(res?.arrayResult))
                        dispatch(setTransferNotifier(false))
                        if (dataSelector.selector > 0) {
                            let selection = res?.arrayResult.filter(f => f.id === dataSelector.selector)
                            if (selection.length === 1) {
                                let selected = selection[0]
                                dispatch(setTransferItem(selected))
                                dispatch(resetTransferSelector())
                            }
                        }
                    }
                })
                .catch(err => console.error(err))
            return
        }
        if (dataSelector.data.length === 0 || dataSelector.notifier || dataSelector.selector > 0) {
            instantiate()
        }
    }, [dataSelector.notifier, dataSelector.selector])

    useEffect(() => {
        if (!isLoading && isSuccess) {
            console.log("done")
        }
    }, [isSuccess, isLoading])

    const toggleNewEntry = () => {
        dispatch(resetTransferItem())
        dispatch(showTransferManager())
    }

    const actions = () => {
        return [
            { label: `Add ${dataSelector.display.name}`, callback: toggleNewEntry },
        ]
    }

    return (
        (dataSelector.manager) ? (
            <TransferManage name={dataSelector.display.name} />
        ) : (
            <DataIndex
                display={dataSelector.display}
                actions={actions()}
                data={dataSelector.data}
                isError={isError}
                isLoading={isLoading}
            >
                <TransferRecords />
            </DataIndex >
        )
    )
}

export default TransferIndex
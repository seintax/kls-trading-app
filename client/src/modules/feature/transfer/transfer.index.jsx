import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { getBranch } from "../../../utilities/functions/string.functions"
import useAuth from "../../../utilities/hooks/useAuth"
import DataIndex from "../../../utilities/interface/datastack/data.index"
import TransferManage from "./transfer.manage"
import TransferRecords from "./transfer.records"
import { resetTransferItem, resetTransferManager, resetTransferSelector, setTransferData, setTransferItem, setTransferNotifier, showTransferManager } from "./transfer.reducer"
import { useByBranchTransferMutation } from "./transfer.services"

const TransferIndex = () => {
    // const [allTransfer, { isLoading, isError, isSuccess }] = useFetchAllTransferMutation()
    const auth = useAuth()
    const [allTransfer, { isLoading, isError }] = useByBranchTransferMutation()
    const dataSelector = useSelector(state => state.transfer)
    const dispatch = useDispatch()
    const [mounted, setMounted] = useState(false)

    useEffect(() => { setMounted(true) }, [])

    useEffect(() => {
        if (mounted) {
            return () => {
                dispatch(resetTransferManager())
            }
        }
    }, [mounted])

    useEffect(() => {
        const instantiate = async () => {
            await allTransfer({ source: getBranch(auth) })
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
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import DataIndex from "../../../utilities/interface/datastack/data.index"
import ReceiptManage from "./delivery.item.manage"
import ReceiptRecords from "./delivery.item.records"
import { resetReceiptItem, setReceiptData, setReceiptNotifier, showReceiptManager } from "./delivery.item.reducer"
import { useFetchAllReceiptMutation } from "./delivery.item.services"

const ReceiptIndex = () => {
    const [allReceipt, { isLoading, isError, isSuccess }] = useFetchAllReceiptMutation()
    const dataSelector = useSelector(state => state.receipt)
    const dispatch = useDispatch()

    useEffect(() => {
        const instantiate = async () => {
            await allReceipt()
                .unwrap()
                .then(res => {
                    if (res.success) {
                        dispatch(setReceiptData(res?.arrayResult))
                        dispatch(setReceiptNotifier(false))
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
        dispatch(resetReceiptItem())
        dispatch(showReceiptManager())
    }

    const actions = () => {
        return [
            { label: `Add ${dataSelector.display.name}`, callback: toggleNewEntry },
        ]
    }

    return (
        (dataSelector.manager) ? (
            <ReceiptManage name={dataSelector.display.name} />
        ) : (
            <DataIndex
                display={dataSelector.display}
                actions={actions()}
                data={dataSelector.data}
                isError={isError}
                isLoading={isLoading}
            >
                <ReceiptRecords />
            </DataIndex >
        )
    )
}

export default ReceiptIndex
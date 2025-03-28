import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import DataIndex from "../../../utilities/interface/datastack/data.index"
import { resetReceiptCache } from "../delivery-item/delivery.item.reducer"
import DeliveryManage from "./delivery.manage"
import DeliveryRecords from "./delivery.records"
import { resetDeliveryItem, resetDeliveryManager, resetDeliverySelector, setDeliveryData, setDeliveryItem, setDeliveryNotifier, showDeliveryManager } from "./delivery.reducer"
import { useByDateDeliveryMutation } from "./delivery.services"

const DeliveryIndex = () => {
    const [allDelivery, { isLoading, isError }] = useByDateDeliveryMutation()
    const dataSelector = useSelector(state => state.delivery)
    const dispatch = useDispatch()
    const [mounted, setMounted] = useState(false)

    useEffect(() => { setMounted(true) }, [])

    useEffect(() => {
        if (mounted) {
            return () => {
                dispatch(resetDeliveryManager())
                dispatch(resetDeliveryItem())
                dispatch(resetReceiptCache())
            }
        }
    }, [mounted])

    useEffect(() => {
        const instantiate = async () => {
            await allDelivery()
                .unwrap()
                .then(res => {
                    if (res.success) {
                        dispatch(setDeliveryData(res?.arrayResult))
                        dispatch(setDeliveryNotifier(false))
                        if (dataSelector.selector > 0) {
                            let selection = res?.arrayResult.filter(f => f.id === dataSelector.selector)
                            if (selection.length === 1) {
                                let selected = selection[0]
                                dispatch(setDeliveryItem(selected))
                                dispatch(resetDeliverySelector())
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
        dispatch(resetDeliveryItem())
        dispatch(showDeliveryManager())
    }

    const actions = () => {
        return [
            { label: `Add ${dataSelector.display.name}`, callback: toggleNewEntry },
        ]
    }

    return (
        (dataSelector.manager) ? (
            <DeliveryManage name={dataSelector.display.name} />
        ) : (
            <DataIndex
                display={dataSelector.display}
                actions={actions()}
                data={dataSelector.data}
                isError={isError}
                isLoading={isLoading}
            >
                <DeliveryRecords />
            </DataIndex >
        )
    )
}

export default DeliveryIndex
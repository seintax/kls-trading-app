import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import DataIndex from "../../../utilities/interface/datastack/data.index"
import PurchaseManage from "./purchase.manage"
import PurchaseRecords from "./purchase.records"
import { resetPurchaseItem, resetPurchaseSelector, setPurchaseData, setPurchaseItem, setPurchaseNotifier, showPurchaseManager } from "./purchase.reducer"
import { useFetchAllPurchaseMutation } from "./purchase.services"

const PurchaseIndex = () => {
    const [allPurchase, { isLoading, isError, isSuccess }] = useFetchAllPurchaseMutation()
    const dataSelector = useSelector(state => state.purchase)
    const dispatch = useDispatch()

    useEffect(() => {
        const instantiate = async () => {
            await allPurchase()
                .unwrap()
                .then(res => {
                    if (res.success) {
                        dispatch(setPurchaseData(res?.arrayResult))
                        dispatch(setPurchaseNotifier(false))
                        if (dataSelector.selector > 0) {
                            let id = dataSelector.selector
                            let items = res?.arrayResult?.filter(item => item.id === id)
                            let item = items.length ? items[0] : {}
                            dispatch(setPurchaseItem(item))
                            dispatch(resetPurchaseSelector())
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
        dispatch(resetPurchaseItem())
        dispatch(showPurchaseManager())
    }

    const actions = () => {
        return [
            { label: `Add ${dataSelector.display.name} Order`, callback: toggleNewEntry },
        ]
    }

    return (
        (dataSelector.manager) ? (
            <PurchaseManage name={`${dataSelector.display.name} Order`} />
        ) : (
            <DataIndex
                display={{
                    ...dataSelector.display,
                    name: `${dataSelector.display.name} Order`
                }}
                actions={actions()}
                data={dataSelector.data}
                isError={isError}
                isLoading={isLoading}
            >
                <PurchaseRecords />
            </DataIndex >
        )
    )
}

export default PurchaseIndex
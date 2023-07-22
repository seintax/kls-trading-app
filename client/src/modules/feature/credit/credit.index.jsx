import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import DataIndex from "../../../utilities/interface/datastack/data.index"
import { resetBrowserPayments } from "../browser/browser.reducer"
import CreditManage from "./credit.manage"
import CreditRecords from "./credit.records"
import { resetCreditItem, resetCreditManager, setCreditData, setCreditNotifier, showCreditManager } from "./credit.reducer"
import { useFetchAllCreditMutation } from "./credit.services"

const CreditIndex = () => {
    const [allCredit, { isLoading, isError, isSuccess }] = useFetchAllCreditMutation()
    const dataSelector = useSelector(state => state.credit)
    const dispatch = useDispatch()
    const [mounted, setMounted] = useState(false)

    useEffect(() => { setMounted(true) }, [])

    useEffect(() => {
        if (mounted) {
            return () => {
                dispatch(resetCreditManager())
                dispatch(resetBrowserPayments())
            }
        }
    }, [mounted])

    useEffect(() => {
        const instantiate = async () => {
            await allCredit()
                .unwrap()
                .then(res => {
                    if (res.success) {
                        dispatch(setCreditData(res?.arrayResult))
                        dispatch(setCreditNotifier(false))
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
        dispatch(resetCreditItem())
        dispatch(showCreditManager())
    }

    const actions = () => {
        return [
            // { label: `Add ${dataSelector.display.name}`, callback: toggleNewEntry },
        ]
    }

    return (
        (dataSelector.manager) ? (
            <CreditManage name={dataSelector.display.name} />
        ) : (
            <DataIndex
                display={dataSelector.display}
                actions={actions()}
                data={dataSelector.data}
                isError={isError}
                isLoading={isLoading}
            >
                <CreditRecords />
            </DataIndex >
        )
    )
}

export default CreditIndex
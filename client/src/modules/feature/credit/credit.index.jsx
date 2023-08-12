import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { getBranch } from "../../../utilities/functions/string.functions"
import useAuth from "../../../utilities/hooks/useAuth"
import DataIndex from "../../../utilities/interface/datastack/data.index"
import { resetBrowserPayments } from "../browser/browser.reducer"
import CreditManage from "./credit.manage"
import CreditRecords from "./credit.records"
import { resetCreditItem, resetCreditManager, setCreditData, setCreditNotifier, showCreditManager } from "./credit.reducer"
import { useByAllOngoingCreditMutation } from "./credit.services"

const CreditIndex = () => {
    const auth = useAuth()
    const [allCredit, { isLoading, isError, isSuccess }] = useByAllOngoingCreditMutation()
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
            await allCredit({ store: getBranch(auth) })
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
    }, [dataSelector.notifier, auth.store])

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
                plain={true}
            >
                <CreditRecords />
            </DataIndex >
        )
    )
}

export default CreditIndex
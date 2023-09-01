import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { getBranch, isEmpty } from "../../../utilities/functions/string.functions"
import useAuth from "../../../utilities/hooks/useAuth"
import DataIndex from "../../../utilities/interface/datastack/data.index"
import { resetBrowserPayments } from "../browser/browser.reducer"
import CreditLedger from "./credit.ledger"
import CreditManage from "./credit.manage"
import CreditPayment from "./credit.payments"
import CreditRecords from "./credit.records"
import { resetCreditManager, setCreditData, setCreditNotifier } from "./credit.reducer"
import { useByUnsettledCreditMutation } from "./credit.services"

const CreditIndex = () => {
    const auth = useAuth()
    const [allCredit, { isLoading, isError, isSuccess }] = useByUnsettledCreditMutation()
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
    }, [dataSelector.notifier])

    const actions = () => {
        return []
    }

    return (
        (isEmpty(dataSelector.history)) ? (
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
        ) : (
            (dataSelector.history === "Credit") ? (
                <CreditLedger />
            ) : (
                <CreditPayment />
            )
        )
    )
}

export default CreditIndex
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { sortBy } from "../../../utilities/functions/array.functions"
import { isAdmin, isDev, isEmpty } from "../../../utilities/functions/string.functions"
import useAuth from "../../../utilities/hooks/useAuth"
import DataIndex from "../../../utilities/interface/datastack/data.index"
import { useFetchAllBranchMutation } from "../../library/branch/branch.services"
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
    const [currentBranch, setCurrentBranch] = useState(auth.store)
    const [libBranches, setLibBranches] = useState()

    const [allBranches] = useFetchAllBranchMutation()

    useEffect(() => { setMounted(true) }, [])

    useEffect(() => {
        if (mounted) {
            if (!isDev(auth) && !isAdmin(auth)) {
                setCurrentBranch(auth.store)
            }
            if (isDev(auth) || isAdmin(auth)) {
                setCurrentBranch("JT-MAIN")
            }
            return () => {
                dispatch(resetCreditManager())
                dispatch(resetBrowserPayments())
            }
        }
    }, [mounted])

    useEffect(() => {
        const instantiate = async () => {
            await allCredit({ store: currentBranch })
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
    }, [dataSelector.notifier, currentBranch])

    useEffect(() => {
        const instantiate = async () => {
            await allBranches()
                .unwrap()
                .then(res => {
                    if (res.success) {
                        if (!isDev(auth) && !isAdmin(auth)) {
                            setLibBranches(sortBy(res?.arrayResult?.filter(f => f.code === auth.store).map((item, index) => {
                                return {
                                    id: index,
                                    key: item.name,
                                    value: item.code
                                }
                            }), { prop: "id", desc: true }))
                        }
                        if (isDev(auth) || isAdmin(auth)) {
                            setLibBranches(res?.arrayResult.map(item => {
                                return {
                                    key: item.name,
                                    value: item.code
                                }
                            }))
                        }
                    }
                })
                .catch(err => console.error(err))
            return
        }

        instantiate()
    }, [auth])

    const actions = () => {
        return []
    }

    const sortcallback = (option) => {
        setCurrentBranch(option.value)
        dispatch(setCreditNotifier(true))
    }

    return (
        (isEmpty(dataSelector.history)) ? (
            (dataSelector.manager) ? (
                <CreditManage name={dataSelector.display.name} />
            ) : (
                <DataIndex
                    display={dataSelector.display}
                    actions={actions()}
                    sorts={libBranches}
                    sortcallback={sortcallback}
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
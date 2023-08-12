import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { getBranch } from "../../../utilities/functions/string.functions"
import useAuth from "../../../utilities/hooks/useAuth"
import DataIndex from "../../../utilities/interface/datastack/data.index"
import { useByChequePaymentMutation } from "../payment/payment.services"
import ChequeManage from "./cheque.manage"
import ChequeRecords from "./cheque.records"
import { resetChequeItem, setChequeData, setChequeNotifier, showChequeManager } from "./cheque.reducer"

const ChequeIndex = () => {
    const auth = useAuth()
    const [allCheque, { isLoading, isError, isSuccess }] = useByChequePaymentMutation()
    const dataSelector = useSelector(state => state.cheque)
    const dispatch = useDispatch()

    useEffect(() => {
        const instantiate = async () => {
            await allCheque({ store: getBranch(auth) })
                .unwrap()
                .then(res => {
                    if (res.success) {
                        dispatch(setChequeData(res?.arrayResult))
                        dispatch(setChequeNotifier(false))
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
        dispatch(resetChequeItem())
        dispatch(showChequeManager())
    }

    const actions = () => {
        return [
            // { label: `Add ${dataSelector.display.name}`, callback: toggleNewEntry },
        ]
    }

    return (
        (dataSelector.manager) ? (
            <ChequeManage name={dataSelector.display.name} />
        ) : (
            <DataIndex
                display={dataSelector.display}
                actions={actions()}
                data={dataSelector.data}
                isError={isError}
                isLoading={isLoading}
                plain={true}
            >
                <ChequeRecords />
            </DataIndex >
        )
    )
}

export default ChequeIndex
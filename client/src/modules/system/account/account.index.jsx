import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import DataIndex from "../../../utilities/interface/datastack/data.index"
import AccountManage from "./account.manage"
import AccountRecords from "./account.records"
import { resetAccountItem, setAccountData, setAccountNotifier, showAccountManager } from "./account.reducer"
import { useFetchAllAccountMutation } from "./account.services"

const AccountIndex = () => {
    const [allAccounts, { isLoading, isError, isSuccess }] = useFetchAllAccountMutation()
    const dataSelector = useSelector(state => state.account)
    const dispatch = useDispatch()

    useEffect(() => {
        const instantiate = async () => {
            await allAccounts()
                .unwrap()
                .then(res => {
                    if (res.success) {
                        dispatch(setAccountData(res?.arrayResult))
                        dispatch(setAccountNotifier(false))
                    }
                })
                .catch(err => console.error(err))
            return
        }
        if (dataSelector.data.length === 0 || dataSelector.notifier) {
            instantiate()
        }
    }, [dataSelector.data, dataSelector.notifier])

    useEffect(() => {
        if (!isLoading && isSuccess) {
            console.log("done")
        }
    }, [isSuccess, isLoading])

    const toggleNewEntry = () => {
        dispatch(resetAccountItem())
        dispatch(showAccountManager())
    }

    const actions = () => {
        return [
            { label: `Add ${dataSelector.display.name}`, callback: toggleNewEntry },
        ]
    }

    return (
        (dataSelector.manager) ? (
            <AccountManage name={dataSelector.display.name} />
        ) : (
            <DataIndex
                display={dataSelector.display}
                actions={actions()}
                data={dataSelector.data}
                isError={isError}
                isLoading={isLoading}
            >
                <AccountRecords />
            </DataIndex >
        )
    )
}

export default AccountIndex
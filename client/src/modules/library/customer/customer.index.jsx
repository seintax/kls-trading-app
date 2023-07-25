import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import DataIndex from "../../../utilities/interface/datastack/data.index"
import CustomerManage from "./customer.manage"
import CustomerRecords from "./customer.records"
import { resetCustomerItem, setCustomerData, setCustomerNotifier, showCustomerManager } from "./customer.reducer"
import { useFetchAllCustomerMutation } from "./customer.services"

const CustomerIndex = () => {
    const [allCustomer, { isLoading, isError, isSuccess }] = useFetchAllCustomerMutation()
    const dataSelector = useSelector(state => state.customer)
    const dispatch = useDispatch()

    useEffect(() => {
        const instantiate = async () => {
            await allCustomer()
                .unwrap()
                .then(res => {
                    if (res.success) {
                        dispatch(setCustomerData(res?.arrayResult))
                        dispatch(setCustomerNotifier(false))
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
        dispatch(resetCustomerItem())
        dispatch(showCustomerManager())
    }

    const actions = () => {
        return [
            { label: `Add ${dataSelector.display.name}`, callback: toggleNewEntry },
        ]
    }

    return (
        (dataSelector.manager) ? (
            <CustomerManage name={dataSelector.display.name} />
        ) : (
            <DataIndex
                display={dataSelector.display}
                actions={actions()}
                data={dataSelector.data}
                isError={isError}
                isLoading={isLoading}
            >
                <CustomerRecords />
            </DataIndex >
        )
    )
}

export default CustomerIndex
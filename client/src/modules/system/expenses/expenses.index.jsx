import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import DataIndex from "../../../utilities/interface/datastack/data.index"
import ExpensesManage from "./expenses.manage"
import ExpensesRecords from "./expenses.records"
import { resetExpensesItem, setExpensesData, setExpensesNotifier, showExpensesManager } from "./expenses.reducer"
import { useFetchAllExpensesMutation } from "./expenses.services"

const ExpensesIndex = () => {
    const [allExpenses, { isLoading, isError, isSuccess }] = useFetchAllExpensesMutation()
    const dataSelector = useSelector(state => state.expenses)
    const dispatch = useDispatch()

    useEffect(() => {
        const instantiate = async () => {
            await allExpenses()
                .unwrap()
                .then(res => {
                    if (res.success) {
                        dispatch(setExpensesData(res?.arrayResult))
                        dispatch(setExpensesNotifier(false))
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
        dispatch(resetExpensesItem())
        dispatch(showExpensesManager())
    }

    const actions = () => {
        return [
            { label: `Add ${dataSelector.display.name}`, callback: toggleNewEntry },
        ]
    }

    return (
        (dataSelector.manager) ? (
            <ExpensesManage name={dataSelector.display.name} />
        ) : (
            <DataIndex
                display={dataSelector.display}
                actions={actions()}
                data={dataSelector.data}
                isError={isError}
                isLoading={isLoading}
            >
                <ExpensesRecords />
            </DataIndex >
        )
    )
}

export default ExpensesIndex
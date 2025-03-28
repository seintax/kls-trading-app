import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useModalContext } from "../../../utilities/context/modal.context"
import { sortBy } from '../../../utilities/functions/array.functions'
import { longDate } from "../../../utilities/functions/datetime.functions"
import { NumFn } from "../../../utilities/functions/number.funtions"
import { exactSearch } from "../../../utilities/functions/string.functions"
import useToast from "../../../utilities/hooks/useToast"
import DataOperation from '../../../utilities/interface/datastack/data.operation'
import DataRecords from '../../../utilities/interface/datastack/data.records'
import { showDelete } from "../../../utilities/redux/slices/deleteSlice"
import { setExpensesItem, setExpensesNotifier, showExpensesManager } from "./expenses.reducer"
import { useDeleteExpensesMutation } from "./expenses.services"

const ExpensesRecords = () => {
    const dataSelector = useSelector(state => state.expenses)
    const searchSelector = useSelector(state => state.search)
    const { assignDeleteCallback } = useModalContext()
    const dispatch = useDispatch()
    const [records, setrecords] = useState()
    const [startpage, setstartpage] = useState(1)
    const [sorted, setsorted] = useState()
    const columns = dataSelector.header
    const toast = useToast()

    const [deleteExpenses] = useDeleteExpensesMutation()

    const toggleEdit = (item) => {
        dispatch(setExpensesItem(item))
        dispatch(showExpensesManager())
    }

    const toggleDelete = (item) => {
        assignDeleteCallback({ item: item, callback: handleDelete })
        dispatch(showDelete({ description: "Email address", reference: item.name }))
    }

    const handleDelete = async (item) => {
        if (!item.id) {
            toast.showError("Reference id does not exist.")
            return
        }
        await deleteExpenses({ id: item.id })
            .unwrap()
            .then(res => {
                if (res.success) {
                    dispatch(setExpensesNotifier(true))
                }
            })
            .catch(err => console.error(err))
        return true
    }

    const actions = (item) => {
        return [
            { type: 'button', trigger: () => toggleEdit(item), label: 'Edit' },
            { type: 'button', trigger: () => toggleDelete(item), label: 'Delete' }
        ]
    }

    const items = (item) => {
        return [
            { value: item.particulars },
            { value: item.inclusion },
            { value: NumFn.currency(item.purchase) },
            { value: longDate(item.date) },
            { value: item.store },
            { value: item.account_name },
            { value: <DataOperation actions={actions(item)} /> }
        ]
    }

    useEffect(() => {
        if (dataSelector?.data) {
            let temp = dataSelector?.data
            if (searchSelector.searchKey) {
                let sought = searchSelector.searchKey
                temp = dataSelector?.data?.filter(f => (
                    f.particulars?.toLowerCase()?.includes(sought) ||
                    f.inclusion?.toLowerCase()?.includes(sought) ||
                    f.store?.toLowerCase()?.includes(sought) ||
                    exactSearch(sought, f.purchase) ||
                    exactSearch(sought, f.cash)
                ))
            }
            let data = sorted ? sortBy(temp, sorted) : temp
            setrecords(data?.map((item, i) => {
                return {
                    key: item.id,
                    items: items(item),
                    ondoubleclick: () => { },
                }
            }))
        }
    }, [dataSelector?.data, sorted, searchSelector.searchKey])

    return (
        <>
            <DataRecords
                page={startpage}
                columns={columns}
                records={records}
                setsorted={setsorted}
                setPage={setstartpage}
                itemsperpage={dataSelector?.perpage}
            />
        </>
    )
}
export default ExpensesRecords
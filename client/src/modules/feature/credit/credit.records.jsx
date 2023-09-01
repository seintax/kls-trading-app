import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useModalContext } from "../../../utilities/context/modal.context"
import { sortBy } from '../../../utilities/functions/array.functions'
import { NumFn } from "../../../utilities/functions/number.funtions"
import useToast from "../../../utilities/hooks/useToast"
import DataOperation from '../../../utilities/interface/datastack/data.operation'
import DataRecords from '../../../utilities/interface/datastack/data.records'
import { setCreditCustomer, setCreditHistory, setCreditItem, showCreditManager } from "./credit.reducer"
import { useDeleteCreditMutation } from "./credit.services"

const CreditRecords = () => {
    const dataSelector = useSelector(state => state.credit)
    const { assignDeleteCallback } = useModalContext()
    const dispatch = useDispatch()
    const [records, setrecords] = useState()
    const [startpage, setstartpage] = useState(1)
    const [sorted, setsorted] = useState()
    const columns = dataSelector.columns
    const toast = useToast()

    const [deleteCredit] = useDeleteCreditMutation()

    const toggleSettle = (item) => {
        dispatch(setCreditItem(item))
        dispatch(showCreditManager())
    }

    const toggleView = (item) => {
        dispatch(setCreditCustomer(item))
        dispatch(setCreditHistory("Credit"))
    }

    const togglePayment = (item) => {
        dispatch(setCreditCustomer(item))
        dispatch(setCreditHistory("Payment"))
    }

    const actions = (item) => {
        return [
            { type: 'button', trigger: () => toggleView(item), label: 'Credit History' },
            { type: 'button', trigger: () => togglePayment(item), label: 'Payment History' },
            { type: 'button', trigger: () => toggleSettle(item), label: 'Settle Account' },
        ]
    }

    const items = (item) => {
        return [
            {
                value: <div className="flex flex-col">
                    <span>{item.customer_name}</span>
                </div>
            },
            { value: NumFn.currency(item.value) },
            { value: NumFn.currency(item.paid) },
            { value: NumFn.currency(item.value - item.paid) },
            { value: <span className="bg-yellow-300 text-xs px-1 py-0.2 rounded-sm shadow-md">{item.store}</span> },
            { value: <DataOperation actions={actions(item)} /> }
        ]
    }

    useEffect(() => {
        if (dataSelector?.data) {
            let data = sorted ? sortBy(dataSelector?.data, sorted) : dataSelector?.data
            setrecords(data?.map((item, i) => {
                return {
                    key: item.id,
                    items: items(item),
                    ondoubleclick: () => { },
                }
            }))
        }
    }, [dataSelector?.data, sorted])

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
export default CreditRecords
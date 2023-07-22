import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useModalContext } from "../../../utilities/context/modal.context"
import { sortBy } from '../../../utilities/functions/array.functions'
import { NumFn } from "../../../utilities/functions/number.funtions"
import useToast from "../../../utilities/hooks/useToast"
import DataOperation from '../../../utilities/interface/datastack/data.operation'
import DataRecords from '../../../utilities/interface/datastack/data.records'
import { showDelete } from "../../../utilities/redux/slices/deleteSlice"
import { setCreditItem, setCreditNotifier, showCreditManager } from "./credit.reducer"
import { useDeleteCreditMutation } from "./credit.services"

const CreditRecords = () => {
    const dataSelector = useSelector(state => state.credit)
    const { assignDeleteCallback } = useModalContext()
    const dispatch = useDispatch()
    const [records, setrecords] = useState()
    const [startpage, setstartpage] = useState(1)
    const [sorted, setsorted] = useState()
    const columns = dataSelector.header
    const toast = useToast()

    const [deleteCredit] = useDeleteCreditMutation()

    const toggleView = (item) => {
        dispatch(setCreditItem(item))
        dispatch(showCreditManager())
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
        await deleteCredit({ id: item.id })
            .unwrap()
            .then(res => {
                if (res.success) {
                    dispatch(setCreditNotifier(true))
                }
            })
            .catch(err => console.error(err))
        return true
    }

    const actions = (item) => {
        return [
            { type: 'button', trigger: () => toggleView(item), label: 'View' },
        ]
    }

    const items = (item) => {
        return [
            { value: item.customer_name },
            { value: item.code },
            { value: NumFn.currency(item.total) },
            { value: NumFn.currency(item.partial) },
            { value: NumFn.currency(item.payment) },
            { value: NumFn.currency(item.waived) },
            { value: NumFn.currency(item.returned) },
            { value: NumFn.currency(item.outstand) },
            { value: item.status },
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
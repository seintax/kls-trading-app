import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useModalContext } from "../../../utilities/context/modal.context"
import { sortBy } from '../../../utilities/functions/array.functions'
import { longDateTime } from "../../../utilities/functions/datetime.functions"
import { NumFn } from "../../../utilities/functions/number.funtions"
import useToast from "../../../utilities/hooks/useToast"
import DataRecords from '../../../utilities/interface/datastack/data.records'
import { showDelete } from "../../../utilities/redux/slices/deleteSlice"
import { setPriceItem, setPriceNotifier, showPriceManager } from "./price.reducer"
import { useDeletePriceMutation } from "./price.services"

const PriceRecords = () => {
    const dataSelector = useSelector(state => state.price)
    const { assignDeleteCallback } = useModalContext()
    const dispatch = useDispatch()
    const [records, setrecords] = useState()
    const [startpage, setstartpage] = useState(1)
    const [sorted, setsorted] = useState()
    const columns = dataSelector.header
    const toast = useToast()

    const [deletePrice] = useDeletePriceMutation()

    const toggleEdit = (item) => {
        dispatch(setPriceItem(item))
        dispatch(showPriceManager())
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
        await deletePrice({ id: item.id })
            .unwrap()
            .then(res => {
                if (res.success) {
                    dispatch(setPriceNotifier(true))
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
            { value: item.details },
            { value: longDateTime(item.time) },
            { value: NumFn.acctg.currency(item.old_price) },
            { value: NumFn.acctg.currency(item.new_price) },
            { value: item.account_name },
            { value: item.current ? "Applied Price" : "" },
            // { value: <DataOperation actions={actions(item)} /> }
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
export default PriceRecords
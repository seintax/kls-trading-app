import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useModalContext } from "../../../utilities/context/modal.context"
import { sortBy } from '../../../utilities/functions/array.functions'
import { NumFn } from "../../../utilities/functions/number.funtions"
import useToast from "../../../utilities/hooks/useToast"
import DataOperation from '../../../utilities/interface/datastack/data.operation'
import DataRecords from '../../../utilities/interface/datastack/data.records'
import { showDelete } from "../../../utilities/redux/slices/deleteSlice"
import { setInventoryItem, setInventoryNotifier, showInventoryManager } from "./inventory.reducer"
import { useDeleteInventoryMutation, useUpdateInventoryMutation } from "./inventory.services"

const InventoryRecords = () => {
    const dataSelector = useSelector(state => state.inventory)
    const { assignDeleteCallback } = useModalContext()
    const dispatch = useDispatch()
    const [records, setrecords] = useState()
    const [startpage, setstartpage] = useState(1)
    const [sorted, setsorted] = useState()
    const columns = dataSelector.header
    const toast = useToast()

    const [deleteInventory] = useDeleteInventoryMutation()
    const [updateAcquisition] = useUpdateInventoryMutation()

    const toggleAccept = async (item) => {
        await updateAcquisition({ acquisition: "TRANSFER", id: item.id })
            .unwrap()
            .then(res => {
                if (res.success) {
                    toast.showUpdate("Item has been successfully acquired.")
                    dispatch(setInventoryNotifier(true))
                }
            })
            .catch(err => console.error(err))
    }

    const toggleView = (item) => {
        dispatch(setInventoryItem(item))
        dispatch(showInventoryManager())
    }

    const toggleDelete = (item) => {
        assignDeleteCallback({ item: item, callback: handleDelete })
        dispatch(showDelete({ description: "Product Name", reference: item.product_name }))
    }

    const handleDelete = async (item) => {
        if (!item.id) {
            toast.showError("Reference id does not exist.")
            return
        }
        await deleteInventory({ id: item.id })
            .unwrap()
            .then(res => {
                if (res.success) {
                    dispatch(setInventoryNotifier(true))
                }
            })
            .catch(err => console.error(err))
        return true
    }

    const actions = (item) => {
        return [
            { type: 'button', trigger: () => toggleView(item), label: 'View' }
        ]
    }

    const items = (item) => {
        return [
            { value: `${item.product_name} ${item.variant_serial} ${item.variant_model} ${item.variant_brand}` },
            { value: item.supplier_name },
            { value: item.category },
            { value: item.stocks },
            { value: NumFn.currency(item.price) },
            { value: item.store },
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
export default InventoryRecords
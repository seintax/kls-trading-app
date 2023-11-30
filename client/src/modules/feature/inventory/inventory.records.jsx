import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useModalContext } from "../../../utilities/context/modal.context"
import { sortBy } from '../../../utilities/functions/array.functions'
import { NumFn } from "../../../utilities/functions/number.funtions"
import { exactSearch, isAdmin, isDev } from "../../../utilities/functions/string.functions"
import useAuth from "../../../utilities/hooks/useAuth"
import useToast from "../../../utilities/hooks/useToast"
import DataOperation from '../../../utilities/interface/datastack/data.operation'
import DataRecords from '../../../utilities/interface/datastack/data.records'
import { showDelete } from "../../../utilities/redux/slices/deleteSlice"
import { setPriceShown } from "../price/price.reducer"
import { setInventoryItem, setInventoryNotifier, setInventoryPrint, showInventoryManager } from "./inventory.reducer"
import { useDeleteInventoryMutation, useUpdateInventoryMutation } from "./inventory.services"

const InventoryRecords = () => {
    const auth = useAuth()
    const dataSelector = useSelector(state => state.inventory)
    const roleSelector = useSelector(state => state.roles)
    const searchSelector = useSelector(state => state.search)
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

    const togglePrices = (item) => {
        dispatch(setInventoryItem(item))
        dispatch(setPriceShown(true))
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
            { type: 'button', trigger: () => toggleView(item), label: 'View' },
            { type: 'button', trigger: () => togglePrices(item), label: 'Prices' },
            // { type: 'button', trigger: () => toggleView(item), label: 'View', hidden: roleSelector.access.permission["inventory"]?.show }
        ]
    }

    const items = (item) => {
        return [
            { value: `${item.product_name} ${item.variant_serial} ${item?.variant_model || ""} ${item?.variant_brand || ""}` },
            { value: item.supplier_name || "-" },
            { value: item.category },
            { value: item.stocks },
            { value: (isDev(auth) || isAdmin(auth) || auth.store === "JT-MAIN") ? NumFn.currency(item.price) : item.store === "JT-MAIN" ? "-" : NumFn.currency(item.price) },
            { value: <span className="bg-yellow-300 text-xs px-1 py-0.2 rounded-sm shadow-md">{item.store}</span> },
            { value: (isDev(auth) || isAdmin(auth) || auth.store === "JT-MAIN") ? <DataOperation actions={actions(item)} /> : item.store === "JT-MAIN" ? "" : <DataOperation actions={actions(item)} /> },
        ]
    }

    const print = (item) => {
        return [
            { value: `${item.product_name} ${item.variant_serial} ${item?.variant_model || ""} ${item?.variant_brand || ""}` },
            { value: item.supplier_name || "-" },
            { value: item.category },
            { value: item.stocks },
            { value: (isDev(auth) || isAdmin(auth) || auth.store === "JT-MAIN") ? NumFn.currency(item.price) : item.store === "JT-MAIN" ? "-" : NumFn.currency(item.price) },
            { value: item.store },
        ]
    }

    useEffect(() => {
        if (dataSelector?.data) {
            let temp = dataSelector?.data
            if (searchSelector.searchKey) {
                let sought = searchSelector.searchKey?.toLowerCase()
                temp = dataSelector?.data?.filter(f => (
                    f.product_name?.toLowerCase()?.includes(sought) ||
                    `${f.variant_serial}/${f.variant_model}/${f.variant_brand}`?.toLowerCase()?.includes(sought) ||
                    f.supplier_name?.toLowerCase()?.includes(sought) ||
                    f.store?.toLowerCase()?.includes(sought) ||
                    exactSearch(sought, f.price) ||
                    exactSearch(sought, f.stocks)
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
            dispatch(setInventoryPrint(data?.map((item, i) => {
                return {
                    key: item.id,
                    items: print(item),
                    ondoubleclick: () => { },
                }
            })))
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
export default InventoryRecords
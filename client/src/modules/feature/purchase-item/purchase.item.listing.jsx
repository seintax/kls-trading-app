import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useModalContext } from "../../../utilities/context/modal.context"
import { NumFn } from "../../../utilities/functions/number.funtions"
import { cleanDisplay } from "../../../utilities/functions/string.functions"
import useToast from "../../../utilities/hooks/useToast"
import DataListing from "../../../utilities/interface/datastack/data.listing"
import { showDelete } from "../../../utilities/redux/slices/deleteSlice"
import ReceivableInjoin from "./purchase.item.injoin"
import { setReceivableData, setReceivableItem, setReceivableNotifier, showReceivableInjoiner } from "./purchase.item.reducer"
import { useByPurchaseReceivableMutation, useSqlReceivableMutation } from "./purchase.item.services"

const ReceivableListing = () => {
    const dataSelector = useSelector(state => state.receivable)
    const purchaseSelector = useSelector(state => state.purchase)
    const { assignDeleteCallback } = useModalContext()
    const dispatch = useDispatch()
    const [records, setrecords] = useState()
    const toast = useToast()
    const layout = dataSelector.listing.layout
    const header = {
        title: dataSelector.listing.title,
        description: dataSelector.listing.description
    }

    const [purchaseReceivable] = useByPurchaseReceivableMutation()
    const [sqlReceivable] = useSqlReceivableMutation()

    useEffect(() => {
        const instantiate = async () => {
            if (purchaseSelector.item.id) {
                await purchaseReceivable({ purchase: purchaseSelector.item.id })
                    .unwrap()
                    .then(res => {
                        if (res.success) {
                            dispatch(setReceivableData(res?.arrayResult))
                            dispatch(setReceivableNotifier(false))
                        }
                    })
                    .catch(err => console.error(err))
            }
            return
        }

        instantiate()
    }, [dataSelector.notifier, purchaseSelector.item.id])

    const toggleEdit = (item) => {
        dispatch(setReceivableItem(item))
        dispatch(showReceivableInjoiner())
    }

    const toggleDelete = (item) => {
        assignDeleteCallback({ item: item, callback: handleDelete })
        dispatch(showDelete({ description: "Purchase Order Item", reference: `${item.product_name} | ${item.variant_serial}/${item.variant_model}/${item.variant_brand}` }))
    }

    const handleDelete = async (item) => {
        if (!item.id) {
            toast.showError("Reference id does not exist.")
            return
        }
        let formData = {
            receivable: {
                delete: true,
                id: item.id
            },
            purchase: {
                id: purchaseSelector.item.id
            }
        }
        await sqlReceivable(formData)
            .unwrap()
            .then(res => {
                if (res.success) {
                    dispatch(setReceivableNotifier(true))
                }
            })
            .catch(err => console.error(err))
        return true
    }

    const controls = (item) => {
        return [
            {
                label: 'Edit',
                trigger: () => toggleEdit(item),
                style: `${purchaseSelector.item.status === "CLOSED" ? "hidden" : ""}`
            },
            {
                label: 'Delete',
                trigger: () => toggleDelete(item),
                style: `${purchaseSelector.item.status === "CLOSED" ? "hidden" : ""}`
            },
        ]
    }

    const items = (item) => {
        return [
            { value: item.product_name, subtext: cleanDisplay(`${item.variant_serial}/${item.variant_model}/${item.variant_brand}`) },
            { value: item.ordered, subtext: "Quantity" },
            { value: item.received, subtext: "Received" },
            { value: NumFn.currency(item.costing), subtext: "Costing" },
        ]
    }

    useEffect(() => {
        if (dataSelector?.data) {
            let data = dataSelector?.data
            setrecords(data?.map(item => {
                return {
                    key: item.id,
                    items: items(item),
                    controls: controls(item)
                }
            }))
        }
    }, [dataSelector?.data])

    const appendList = useCallback(() => {
        dispatch(showReceivableInjoiner())
    }, [])

    const saveList = useCallback(() => {
        console.info("saving...")
    }, [])

    return (
        <>
            <DataListing
                reference={purchaseSelector.item.id}
                header={header}
                layout={layout}
                records={records}
                appendcallback={appendList}
                savecallback={saveList}
            />
            <ReceivableInjoin />
        </>
    )
}

export default ReceivableListing
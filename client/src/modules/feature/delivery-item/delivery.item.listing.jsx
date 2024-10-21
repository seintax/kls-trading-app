import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useModalContext } from "../../../utilities/context/modal.context"
import { NumFn, amount } from "../../../utilities/functions/number.funtions"
import { StrFn, cleanDisplay } from "../../../utilities/functions/string.functions"
import useToast from "../../../utilities/hooks/useToast"
import DataListing from "../../../utilities/interface/datastack/data.listing"
import { showDelete } from "../../../utilities/redux/slices/deleteSlice"
import ReceiptInjoin from "./delivery.item.injoin"
import { resetReceiptItem, setReceiptData, setReceiptItem, setReceiptNotifier, showReceiptInjoiner } from "./delivery.item.reducer"
import { useByDeliveryReceiptMutation, useSqlReceiptMutation } from "./delivery.item.services"

const ReceiptListing = () => {
    const [deliveryReceipt] = useByDeliveryReceiptMutation()
    const dataSelector = useSelector(state => state.receipt)
    const deliverySelector = useSelector(state => state.delivery)
    const { assignDeleteCallback } = useModalContext()
    const dispatch = useDispatch()
    const [records, setrecords] = useState()
    const [search, setsearch] = useState("")
    const toast = useToast()
    const layout = dataSelector.listing.layout
    const header = {
        title: dataSelector.listing.title,
        description: dataSelector.listing.description
    }

    const [sqlReceipt] = useSqlReceiptMutation()

    useEffect(() => {
        const instantiate = async () => {
            if (deliverySelector.item.id) {
                await deliveryReceipt({ delivery: deliverySelector.item.id })
                    .unwrap()
                    .then(res => {
                        if (res.success) {
                            dispatch(setReceiptData(res?.arrayResult))
                            dispatch(setReceiptNotifier(false))
                        }
                    })
                    .catch(err => console.error(err))
            }
            return
        }

        instantiate()
    }, [dataSelector.notifier, deliverySelector.item.id])

    const toggleEdit = (item) => {
        dispatch(setReceiptItem(item))
        dispatch(showReceiptInjoiner())
    }

    const toggleDelete = (item) => {
        assignDeleteCallback({ item: item, callback: handleDelete })
        dispatch(showDelete({ description: "Delivery Receipt Item", reference: `(PO#${StrFn.formatWithZeros(item.purchase, 6)}) ${item.product_name} | ${item.variant_serial}/${item.variant_model}/${item.variant_brand}` }))
    }

    const handleDelete = async (item) => {
        if (!item.id) {
            toast.showError("Reference id does not exist.")
            return
        }
        let formData = {
            receipt: {
                delete: true,
                id: item.id
            },
            delivery: {
                id: item.delivery
            },
            receivable: {
                remaining: amount(item.receivable_balance) + amount(item.quantity),
                id: item.receivable
            },
            purchase: {
                id: item.purchase
            },
            inventory: {
                delete: true,
                id: item.inventory_id
            }
        }
        await sqlReceipt(formData)
            .unwrap()
            .then(res => {
                if (res.success) {
                    dispatch(setReceiptNotifier(true))
                }
            })
            .catch(err => console.error(err))
        return true
    }

    const controls = (item) => {
        return [
            { label: 'Edit', trigger: () => toggleEdit(item) },
            { label: 'Delete', trigger: () => toggleDelete(item) },
        ]
    }

    const items = (item) => {
        return [
            { value: cleanDisplay(`${item.product_name} | ${item.variant_serial}/${item.variant_model}/${item.variant_brand}`) },
            { value: StrFn.formatWithZeros(item.purchase, 6), subtext: "PO No." },
            { value: item.quantity, subtext: "Received" },
            { value: NumFn.currency(item.receivable_costing), subtext: "Costing" },
            { value: NumFn.currency(item.pricing), subtext: "Pricing" },
        ]
    }

    useEffect(() => {
        if (dataSelector?.data) {
            let sought = search?.toLowerCase()
            let data = sought
                ? dataSelector?.data?.filter(f => (
                    f.product_name?.toLowerCase()?.includes(sought) ||
                    cleanDisplay(`${f.product_name} ${f.variant_serial} ${f?.variant_model || ""} ${f?.variant_brand || ""}`)?.toLowerCase()?.includes(sought) ||
                    `${f.variant_serial}/${f.variant_model}/${f.variant_brand}`?.toLowerCase()?.includes(sought)
                ))
                : dataSelector?.data
            setrecords(data?.map((item, i) => {
                return {
                    key: item.id,
                    items: items(item),
                    controls: controls(item)
                }
            }))
        }
    }, [dataSelector?.data, search])

    const appendList = useCallback(() => {
        dispatch(resetReceiptItem())
        dispatch(showReceiptInjoiner())
    }, [])

    const saveList = useCallback(() => {
        toast.showWarning("Oh my god!!! What have you done!! \nThis button has no function.🤪😋")
    }, [])

    return (
        <>
            <div className="w-full flex gap-3 items-center sticky top-[45px] bg-white">
                <div className="w-fit border border-gray-400 rounded-md px-1">
                    <input type="search" className="border-none outline-none ring-0 focus:border-none focus:ring-0 focus:outline-none w-[300px]" placeholder="Search item" onChange={(e) => setsearch(e.target.value)} value={search} />
                </div>
                {search && (<span>Found: {records?.length} result/s</span>)}
            </div>
            <DataListing
                reference={deliverySelector.item.id}
                header={header}
                layout={layout}
                records={records}
                appendcallback={appendList}
                savecallback={saveList}
            />
            <ReceiptInjoin />
        </>
    )
}

export default ReceiptListing
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useModalContext } from "../../../utilities/context/modal.context"
import { NumFn } from "../../../utilities/functions/number.funtions"
import { cleanDisplay, exactSearch } from "../../../utilities/functions/string.functions"
import useToast from "../../../utilities/hooks/useToast"
import DataListing from "../../../utilities/interface/datastack/data.listing"
import { showDelete } from "../../../utilities/redux/slices/deleteSlice"
import ReceivableInjoin from "./purchase.item.injoin"
import { setReceivableData, setReceivableEditCost, setReceivableItem, setReceivableNotifier, showReceivableInjoiner } from "./purchase.item.reducer"
import { useByPurchaseReceivableMutation, useSqlReceivableMutation } from "./purchase.item.services"

const ReceivableListing = () => {
    const dataSelector = useSelector(state => state.receivable)
    const purchaseSelector = useSelector(state => state.purchase)
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

    const toggleEditCost = (item) => {
        dispatch(setReceivableEditCost(true))
        dispatch(setReceivableItem(item))
        dispatch(showReceivableInjoiner())
    }

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
                label: 'Edit Cost',
                trigger: () => toggleEditCost(item),
                style: `${purchaseSelector.item.status === "CLOSED" ? "" : "hidden"}`
            },
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
            { value: NumFn.float(item.rawcost), subtext: "Costing" },
        ]
    }

    useEffect(() => {
        if (dataSelector?.data) {
            let sought = search?.toLowerCase()
            let data = sought
                ? dataSelector?.data?.filter(f => (
                    f.product_name?.toLowerCase()?.includes(sought) ||
                    cleanDisplay(`${f.product_name} ${f.variant_serial} ${f?.variant_model || ""} ${f?.variant_brand || ""}`)?.toLowerCase()?.includes(sought) ||
                    `${f.variant_serial}/${f.variant_model}/${f.variant_brand}`?.toLowerCase()?.includes(sought) ||
                    exactSearch(sought, f.ordered) ||
                    exactSearch(sought, f.received)
                ))
                : dataSelector?.data
            setrecords(data?.map(item => {
                return {
                    key: `${item.id}${item.receipt_id}`,
                    items: items(item),
                    controls: controls(item)
                }
            }))
        }
    }, [dataSelector?.data, search])

    const appendList = useCallback(() => {
        dispatch(showReceivableInjoiner())
    }, [])

    const saveList = useCallback(() => {
        console.info("saving...")
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
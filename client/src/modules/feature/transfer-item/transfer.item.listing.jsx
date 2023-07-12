import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useModalContext } from "../../../utilities/context/modal.context"
import { NumFn } from "../../../utilities/functions/number.funtions"
import { StrFn } from "../../../utilities/functions/string.functions"
import useToast from "../../../utilities/hooks/useToast"
import DataListing from "../../../utilities/interface/datastack/data.listing"
import { showDelete } from "../../../utilities/redux/slices/deleteSlice"
import TransmitInjoin from "./transfer.item.injoin"
import { setTransmitData, setTransmitNotifier, showTransmitInjoiner } from "./transfer.item.reducer"
import { useByTransferTransmitMutation, useDeleteTransmitMutation } from "./transfer.item.services"

const TransmitListing = () => {
    const [transferTransmit] = useByTransferTransmitMutation()
    const dataSelector = useSelector(state => state.transmit)
    const transferSelector = useSelector(state => state.transfer)
    const { assignDeleteCallback } = useModalContext()
    const dispatch = useDispatch()
    const [records, setrecords] = useState()
    const toast = useToast()
    const layout = dataSelector.listing.layout
    const header = {
        title: dataSelector.listing.title,
        description: dataSelector.listing.description
    }

    const [deleteTransmit] = useDeleteTransmitMutation()

    useEffect(() => {
        const instantiate = async () => {
            if (transferSelector.item.id) {
                await transferTransmit({ transfer: transferSelector.item.id })
                    .unwrap()
                    .then(res => {
                        if (res.success) {
                            dispatch(setTransmitData(res?.arrayResult))
                            dispatch(setTransmitNotifier(false))
                        }
                    })
                    .catch(err => console.error(err))
            }
            return
        }

        instantiate()
    }, [dataSelector.notifier, transferSelector.item.id])

    const toggleEdit = (item) => {
        dispatch(setTransmitItem(item))
        dispatch(showTransmitInjoiner())
    }

    const toggleDelete = (item) => {
        assignDeleteCallback({ item: item, callback: handleDelete })
        dispatch(showDelete({ description: "Purchase Order Item", reference: item.product }))
    }

    const handleDelete = async (item) => {
        if (!item.id) {
            toast.showError("Reference id does not exist.")
            return
        }
        await deleteTransmit({ id: item.id })
            .unwrap()
            .then(res => {
                if (res.success) {
                    dispatch(setTransmitNotifier(true))
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
            { value: `${item.product_name} | ${item.variant_serial}/${item.variant_model}/${item.variant_brand}`, subtext: `ITEM#${StrFn.formatWithZeros(item.item, 6)}` },
            { value: NumFn.currency(item.inventory_base), subtext: "Base Price" },
            { value: item.quantity, subtext: "Quantity" },
            { value: item.received },
        ]
    }

    useEffect(() => {
        if (dataSelector?.data) {
            let data = dataSelector?.data
            setrecords(data?.map((item, i) => {
                return {
                    key: item.id,
                    items: items(item),
                    controls: controls(item)
                }
            }))
        }
    }, [dataSelector?.data])

    const appendList = useCallback(() => {
        dispatch(showTransmitInjoiner())
    }, [])

    const saveList = useCallback(() => {
        console.log("saving...")
    }, [])

    return (
        <>
            <DataListing
                reference={transferSelector.item.id}
                header={header}
                layout={layout}
                records={records}
                appendcallback={appendList}
                savecallback={saveList}
            />
            <TransmitInjoin />
        </>
    )
}

export default TransmitListing
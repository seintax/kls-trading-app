import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useModalContext } from "../../../utilities/context/modal.context"
import { sortBy } from '../../../utilities/functions/array.functions'
import useToast from "../../../utilities/hooks/useToast"
import DataOperation from '../../../utilities/interface/datastack/data.operation'
import DataRecords from '../../../utilities/interface/datastack/data.records'
import { showDelete } from "../../../utilities/redux/slices/deleteSlice"
import { setInventoryNotifier } from "../inventory/inventory.reducer"
import { setAdjustmentNotifier } from "./inventory.item.reducer"
import { useSqlAdjustmentMutation } from "./inventory.item.services"

const AdjustmentRecords = () => {
    const dataSelector = useSelector(state => state.adjustment)
    const { assignDeleteCallback } = useModalContext()
    const dispatch = useDispatch()
    const [records, setrecords] = useState()
    const [startpage, setstartpage] = useState(1)
    const [sorted, setsorted] = useState()
    const columns = dataSelector.header
    const toast = useToast()

    const [sqlAdjustment] = useSqlAdjustmentMutation()

    const toggleDelete = (item) => {
        assignDeleteCallback({ item: item, callback: handleDelete })
        dispatch(showDelete({ description: "Email address", reference: item.name }))
    }

    const handleDelete = async (item) => {
        if (!item.id) {
            toast.showError("Reference id does not exist.")
            return
        }
        let formData = {
            adjustment: {
                delete: true,
                id: item.id
            },
            inventory: {
                id: item.item,
                operator: item.operator === "DEDUCTION" ? "+" : "-",
                quantity: item.quantity,
            }
        }
        await sqlAdjustment(formData)
            .unwrap()
            .then(res => {
                if (res.success) {
                    dispatch(setAdjustmentNotifier(true))
                    dispatch(setInventoryNotifier(true))
                }
            })
            .catch(err => console.error(err))
        return true
    }

    const actions = (item) => {
        return [
            { type: 'button', trigger: () => toggleDelete(item), label: 'Delete' }
        ]
    }

    const items = (item) => {
        return [
            { value: item.details },
            { value: item.operator },
            { value: item.quantity },
            { value: item.remarks },
            { value: item.by },
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
export default AdjustmentRecords
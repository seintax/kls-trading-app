import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useModalContext } from "../../../utilities/context/modal.context"
import { sortBy } from '../../../utilities/functions/array.functions'
import { ItemView } from "../../../utilities/functions/display.functions"
import useToast from "../../../utilities/hooks/useToast"
import DataOperation from '../../../utilities/interface/datastack/data.operation'
import DataRecords from '../../../utilities/interface/datastack/data.records'
import { showDelete } from "../../../utilities/redux/slices/deleteSlice"
import { setVariantItem, setVariantNotifier, showVariantManager } from "./variant.reducer"
import { useDeleteVariantMutation } from "./variant.services"

const VariantRecords = () => {
    const dataSelector = useSelector(state => state.variant)
    const masterlistSelector = useSelector(state => state.masterlist)
    const searchSelector = useSelector(state => state.search)
    const { assignDeleteCallback } = useModalContext()
    const dispatch = useDispatch()
    const [records, setrecords] = useState()
    const [startpage, setstartpage] = useState(1)
    const [sorted, setsorted] = useState()
    const columns = dataSelector.header
    const toast = useToast()

    const [deleteVariant] = useDeleteVariantMutation()

    const toggleEdit = (item) => {
        dispatch(setVariantItem(item))
        dispatch(showVariantManager())
    }

    const toggleDelete = (item) => {
        assignDeleteCallback({ item: item, callback: handleDelete })
        dispatch(showDelete({ description: "Serial No.", reference: item.serial }))
    }

    const handleDelete = async (item) => {
        if (!item.id) {
            toast.showError("Reference id does not exist.")
            return
        }
        await deleteVariant({ id: item.id })
            .unwrap()
            .then(res => {
                if (res.success) {
                    dispatch(setVariantNotifier(true))
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
            { value: <ItemView main={masterlistSelector.item.name} subtext={masterlistSelector.item.category} reverse={true} /> },
            { value: <ItemView main={item.serial} subtext={item?.option1} reverse={true} /> },
            { value: <ItemView main={item.model} subtext={item?.option2} reverse={true} /> },
            { value: <ItemView main={item.brand} subtext={item?.option3} reverse={true} /> },
            { value: <DataOperation actions={actions(item)} /> }
        ]
    }

    useEffect(() => {
        if (dataSelector?.data) {
            let temp = dataSelector?.data
            if (searchSelector.searchKey) {
                let sought = searchSelector.searchKey
                temp = dataSelector?.data?.filter(f => (
                    f.serial?.toLowerCase()?.includes(sought) ||
                    f.model?.toLowerCase()?.includes(sought) ||
                    f.brand?.toLowerCase()?.includes(sought) ||
                    f.option1?.toLowerCase()?.includes(sought) ||
                    f.option2?.toLowerCase()?.includes(sought) ||
                    f.option3?.toLowerCase()?.includes(sought)
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
export default VariantRecords
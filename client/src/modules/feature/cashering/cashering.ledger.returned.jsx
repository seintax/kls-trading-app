import { Transition } from "@headlessui/react"
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { sortBy } from "../../../utilities/functions/array.functions"
import { NumFn } from "../../../utilities/functions/number.funtions"
import useToast from "../../../utilities/hooks/useToast"
import DataRecords from "../../../utilities/interface/datastack/data.records"
import { setReturnedItem, showReturnedManager } from "./returned.reducer"

const CasheringLedgerReturned = () => {
    const qtyRef = useRef(null)
    const dataSelector = useSelector(state => state.transaction)
    const returnedSelector = useSelector(state => state.returned)
    const dispatch = useDispatch()
    const [records, setrecords] = useState()
    const [startpage, setstartpage] = useState(1)
    const [sorted, setsorted] = useState()
    const [tab, setTab] = useState("DISPENSE")
    const columns = returnedSelector.header
    const toast = useToast()

    const selectItem = (item) => {
        dispatch(setReturnedItem(item))
        dispatch(showReturnedManager())
        qtyRef.current && qtyRef.current?.focus()
    }

    const items = (item) => {
        return [
            {
                value:
                    <div className="flex gap-1 flex-wrap">
                        <span className="bg-white px-1 rounded-md border border-gray-500">
                            {item.product_name}
                        </span>
                        <span className={`${item.category ? "" : "hidden"} bg-gradient-to-b from-white to-red-200 px-1 rounded-md border border-gray-400`}>
                            {item.category}
                        </span>
                        <span className={`${item.variant_serial?.replaceAll("-", "") ? "" : "hidden"} bg-gradient-to-b from-white to-blue-200 px-1 rounded-md border border-gray-400`}>
                            {item.variant_serial}
                        </span>
                        <span className={`${item.variant_model?.replaceAll("-", "") ? "" : "hidden"} bg-gradient-to-b from-white to-blue-200 px-1 rounded-md border border-gray-400`}>
                            {item.variant_model}
                        </span>
                        <span className={`${item.variant_brand?.replaceAll("-", "") ? "" : "hidden"} bg-gradient-to-b from-white to-blue-200 px-1 rounded-md border border-gray-400`}>
                            {item.variant_brand}
                        </span>
                        <span className={`${item.inventory_supplier ? "" : "hidden"} bg-gradient-to-b from-white to-green-200 px-1 rounded-md border border-gray-400`}>
                            Supplier: {item.supplier_name}
                        </span>
                    </div>
            },
            { value: NumFn.currency(item.price) },
            { value: item.dispense },
            { value: NumFn.currency(item.total) },
            { value: NumFn.currency(item.less + item.markdown) },
            { value: NumFn.currency(item.net) },
            { value: item.returned || "" },
            { value: "" }
        ]
    }

    useEffect(() => {
        if (returnedSelector?.data) {
            let data = sorted
                ? sortBy(returnedSelector?.data, sorted)
                : returnedSelector?.data
            setrecords(data?.map((item, i) => {
                return {
                    key: item.id,
                    items: items(item),
                    ondoubleclick: () => { },
                }
            }))
        }
    }, [returnedSelector?.data, sorted])

    return (
        <>
            <Transition
                enter="transition-opacity ease-linear duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                className="overflow-auto"
            >
                <DataRecords
                    page={startpage}
                    columns={columns}
                    records={records}
                    setsorted={setsorted}
                    setPage={setstartpage}
                    itemsperpage={returnedSelector?.perpage}
                    fontsize="lg"
                />
            </Transition>
        </>
    )
}

export default CasheringLedgerReturned
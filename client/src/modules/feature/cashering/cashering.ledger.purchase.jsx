import { Transition } from "@headlessui/react"
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { sortBy } from "../../../utilities/functions/array.functions"
import { NumFn, amount } from "../../../utilities/functions/number.funtions"
import useToast from "../../../utilities/hooks/useToast"
import DataOperation from "../../../utilities/interface/datastack/data.operation"
import DataRecords from "../../../utilities/interface/datastack/data.records"
import { setDispensingItem, showDispensingManager } from "./dispensing.reducer"

const CasheringLedgerPurchase = () => {
    const qtyRef = useRef(null)
    const dataSelector = useSelector(state => state.transaction)
    const dispensingSelector = useSelector(state => state.dispensing)
    const dispatch = useDispatch()
    const [records, setrecords] = useState()
    const [startpage, setstartpage] = useState(1)
    const [sorted, setsorted] = useState()
    const [tab, setTab] = useState("DISPENSE")
    const columns = dispensingSelector.header
    const toast = useToast()

    const selectItem = (item) => {
        dispatch(setDispensingItem(item))
        dispatch(showDispensingManager())
        qtyRef.current && qtyRef.current?.focus()
    }

    const actions = (item) => {
        return [
            { type: 'button', trigger: () => selectItem(item), label: 'Return' },
        ]
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
                        <span className={`${item.variant_serial.replaceAll("-", "") ? "" : "hidden"} bg-gradient-to-b from-white to-blue-200 px-1 rounded-md border border-gray-400`}>
                            {item.variant_serial}
                        </span>
                        <span className={`${item.variant_model.replaceAll("-", "") ? "" : "hidden"} bg-gradient-to-b from-white to-blue-200 px-1 rounded-md border border-gray-400`}>
                            {item.variant_model}
                        </span>
                        <span className={`${item.variant_brand.replaceAll("-", "") ? "" : "hidden"} bg-gradient-to-b from-white to-blue-200 px-1 rounded-md border border-gray-400`}>
                            {item.variant_brand}
                        </span>
                        <span className={`${item.inventory_supplier ? "" : "hidden"} bg-gradient-to-b from-white to-green-200 px-1 rounded-md border border-gray-400`}>
                            Supplier: {item.supplier_name}
                        </span>
                    </div>
            },
            { value: NumFn.currency(item.price) },
            {
                value:
                    // <span className={item.toreturn ? "text-secondary-500" : ""}>
                    //     {item.dispense}
                    // </span>
                    <div className="flex flex-row lg:flex-col">
                        <span className={item.toreturn > 0 ? "hidden" : ""}>
                            {item.dispense}
                        </span>
                        <span className={item.toreturn > 0 ? "text-secondary-500" : "hidden"}>
                            {item.dispense - item.toreturn}
                        </span>
                    </div>
            },
            {
                value:
                    <div className="flex flex-row lg:flex-col">
                        <span className={item.toreturn > 0 ? "mr-3 lg:text-[10px] line-through" : ""}>
                            {NumFn.currency(item.total)}
                        </span>
                        <span className={item.toreturn > 0 ? "text-secondary-500" : "hidden"}>
                            {NumFn.currency(amount(item.total) - (amount(item.price) * amount(item.toreturn)))}
                        </span>
                    </div>
            },
            {
                value:
                    <div className="flex flex-row lg:flex-col">
                        <span className={item.toreturn > 0 ? "mr-3 lg:text-[10px] line-through" : ""}>
                            {NumFn.currency(item.less + item.markdown)}
                        </span>
                        <span className={item.toreturn > 0 ? "text-secondary-500" : "hidden"}>
                            {NumFn.currency(((amount(item.less) / amount(item.dispense)) * (amount(item.dispense) - amount(item.toreturn))) + ((amount(item.markdown) / amount(item.dispense)) * (amount(item.dispense) - amount(item.toreturn))))}
                        </span>
                    </div>
            },
            {
                value:
                    <div className="flex flex-col">
                        <span className={item.toreturn > 0 ? "text-[10px] line-through" : ""}>
                            {NumFn.currency(item.net)}
                        </span>
                        <span className={item.toreturn > 0 ? "text-secondary-500" : "hidden"}>
                            {NumFn.currency((amount(item.total) - (amount(item.price) * amount(item.toreturn))) - ((amount(item.less) / amount(item.dispense)) * (amount(item.dispense) - amount(item.toreturn))) - ((amount(item.markdown) / amount(item.dispense)) * (amount(item.dispense) - amount(item.toreturn))))}
                        </span>
                    </div>
            },
            { value: item.toreturn || "" },
            { value: <DataOperation actions={actions(item)} /> }
        ]
    }

    useEffect(() => {
        if (dispensingSelector?.data) {
            let data = sorted
                ? sortBy(dispensingSelector?.data, sorted)
                : dispensingSelector?.data
            setrecords(data?.map((item, i) => {
                return {
                    key: item.id,
                    items: items(item),
                    ondoubleclick: () => { },
                }
            }))
        }
    }, [dispensingSelector?.data, sorted])

    return (
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
                itemsperpage={dispensingSelector?.perpage}
            />
        </Transition>
    )
}

export default CasheringLedgerPurchase
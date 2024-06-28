import { Transition } from "@headlessui/react"
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { sortBy } from "../../../utilities/functions/array.functions"
import { sqlDate } from "../../../utilities/functions/datetime.functions"
import { NumFn } from "../../../utilities/functions/number.funtions"
import useToast from "../../../utilities/hooks/useToast"
import DataRecords from "../../../utilities/interface/datastack/data.records"
import { setReturnedItem, showReturnedManager } from "./returned.reducer"

const CasheringLedgerPayment = () => {
    const qtyRef = useRef(null)
    const dataSelector = useSelector(state => state.transaction)
    const paymentSelector = useSelector(state => state.payment)
    const dispatch = useDispatch()
    const [records, setrecords] = useState()
    const [startpage, setstartpage] = useState(1)
    const [sorted, setsorted] = useState()
    const [tab, setTab] = useState("DISPENSE")
    const columns = paymentSelector.header
    const toast = useToast()

    const selectItem = (item) => {
        dispatch(setReturnedItem(item))
        dispatch(showReturnedManager())
        qtyRef.current && qtyRef.current?.focus()
    }

    const items = (item) => {
        return [
            { value: item.type },
            { value: item.method },
            { value: item.refcode },
            { value: item.refdate ? sqlDate(item.refdate) : "" },
            { value: NumFn.currency(item.amount) }
        ]
    }

    useEffect(() => {
        if (paymentSelector?.data) {
            let data = sorted
                ? sortBy(paymentSelector?.data, sorted)
                : paymentSelector?.data
            setrecords(data?.map((item, i) => {
                return {
                    key: item.id,
                    items: items(item),
                    ondoubleclick: () => { },
                }
            }))
        }
    }, [paymentSelector?.data, sorted])

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
                    itemsperpage={paymentSelector?.perpage}
                    fontsize="lg"
                />
            </Transition>
        </>
    )
}

export default CasheringLedgerPayment
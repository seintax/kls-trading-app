import { ArrowLeftIcon } from "@heroicons/react/24/solid"
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { sortBy } from '../../../utilities/functions/array.functions'
import { longDate, sqlDate } from "../../../utilities/functions/datetime.functions"
import { NumFn } from "../../../utilities/functions/number.funtions"
import { getBranch } from "../../../utilities/functions/string.functions"
import useAuth from "../../../utilities/hooks/useAuth"
import DataRecords from '../../../utilities/interface/datastack/data.records'
import { useBySettledPaymentMutation } from "../payment/payment.services"
import { setCreditCustomer, setCreditHistory } from "./credit.reducer"

const CreditPayment = () => {
    const auth = useAuth()
    const dataSelector = useSelector(state => state.credit)
    const dispatch = useDispatch()
    const [data, setData] = useState()
    const [records, setrecords] = useState()
    const [startpage, setstartpage] = useState(1)
    const [sorted, setsorted] = useState()
    const columns = {
        items: [
            { name: 'Date', stack: false, sort: 'time' },
            { name: 'Amount', stack: true, sort: 'amount', size: 220 },
            { name: 'Method', stack: true, sort: 'method', size: 220 },
            { name: 'Reference', stack: true, sort: 'refcode', size: 220 },
            { name: 'Processed by', stack: true, sort: 'account_name', size: 220 },
            { name: '', stack: true, sort: 'store', size: 150 },
        ]
    }

    const [settledCredit] = useBySettledPaymentMutation()

    useEffect(() => {
        const instantiate = async () => {
            await settledCredit({ customer: dataSelector.customer?.creditor, store: getBranch(auth) })
                .unwrap()
                .then(res => {
                    if (res.success) setData(res?.arrayResult)
                })
                .catch(err => console.error(err))
        }
        if (dataSelector.history === "Payment") {
            instantiate()
        }
    }, [dataSelector.customer?.creditor, dataSelector.history])

    const actions = (item) => {
        return []
    }

    const items = (item) => {
        return [
            {
                value: <div className="flex flex-col">
                    <span>{sqlDate(item.time)}</span>
                </div>
            },
            { value: NumFn.currency(item.amount) },
            { value: item.method },
            { value: `${item.refdate ? longDate(item.refdate) : ""} ${item.refcode || ""}` },
            { value: item.account_name },
            { value: <span className="bg-yellow-300 text-xs px-1 py-0.2 rounded-sm shadow-md">{item.store}</span> },
        ]
    }

    useEffect(() => {
        if (data) {
            let temp = sorted ? sortBy(data, sorted) : data
            setrecords(temp?.map((item, i) => {
                return {
                    key: item.id,
                    items: items(item),
                    ondoubleclick: () => { },
                }
            }))
        }
    }, [data, sorted])

    const toggleOff = () => {
        dispatch(setCreditCustomer(undefined))
        dispatch(setCreditHistory(undefined))
    }

    return (

        <div className="w-full">
            <div className="pl-1 pt-3 text-secondary-500 font-bold text-lg flex items-center gap-4 mb-10">
                <ArrowLeftIcon
                    className="w-6 h-6 cursor-pointer"
                    onClick={() => toggleOff()}
                />
                <span>Payment History for: {dataSelector.customer.customer_name}</span>
            </div>
            <DataRecords
                page={startpage}
                columns={columns}
                records={records}
                setsorted={setsorted}
                setPage={setstartpage}
                itemsperpage={dataSelector?.perpage}
            />
        </div>
    )
}
export default CreditPayment
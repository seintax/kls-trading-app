import { ArrowLeftIcon } from "@heroicons/react/24/solid"
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { sortBy } from '../../../utilities/functions/array.functions'
import { NumFn } from "../../../utilities/functions/number.funtions"
import { getBranch } from "../../../utilities/functions/string.functions"
import useAuth from "../../../utilities/hooks/useAuth"
import useToast from "../../../utilities/hooks/useToast"
import DataOperation from '../../../utilities/interface/datastack/data.operation'
import DataRecords from '../../../utilities/interface/datastack/data.records'
import { setCreditCustomer, setCreditHistory } from "./credit.reducer"
import { useByCustomerCreditMutation } from "./credit.services"

const CreditLedger = () => {
    const auth = useAuth()
    const dataSelector = useSelector(state => state.credit)
    const dispatch = useDispatch()
    const [data, setData] = useState()
    const [records, setrecords] = useState()
    const [startpage, setstartpage] = useState(1)
    const [sorted, setsorted] = useState()
    const columns = dataSelector.header
    const toast = useToast()

    const [customerCredit] = useByCustomerCreditMutation()

    useEffect(() => {
        const instantiate = async () => {
            await customerCredit({ customer: dataSelector.customer?.creditor, store: getBranch(auth) })
                .unwrap()
                .then(res => {
                    if (res.success) setData(res?.arrayResult)
                })
                .catch(err => console.error(err))
        }
        if (dataSelector.history === "Credit") {
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
                    <span>{item.customer_name}</span>
                    <span className="text-xs text-gray-400">Value: {NumFn.currency(item.customer_value)}</span>
                </div>
            },
            {
                value: <div className="flex flex-col">
                    <span>{item.code}</span>
                    <span className="text-xs text-gray-400">Total Purchase: {NumFn.currency(item.total)}</span>
                </div>
            },
            { value: NumFn.currency(item.partial) },
            { value: NumFn.currency(item.payment) },
            { value: NumFn.currency(item.waived) },
            { value: NumFn.currency(item.returned) },
            { value: NumFn.currency(item.outstand) },
            { value: item.status },
            { value: <span className="bg-yellow-300 text-xs px-1 py-0.2 rounded-sm shadow-md">{item.account_store}</span> },
            { value: <DataOperation actions={actions(item)} /> }
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
                <span>Credit History for: {dataSelector.customer.customer_name}</span>
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
export default CreditLedger
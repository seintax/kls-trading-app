import { Transition } from "@headlessui/react"
import { CurrencyDollarIcon, ExclamationCircleIcon, XMarkIcon } from "@heroicons/react/20/solid"
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { NumFn, amount } from "../../../utilities/functions/number.funtions"
import useAuth from "../../../utilities/hooks/useAuth"
import useToast from "../../../utilities/hooks/useToast"
import { useByCodePaymentMutation, useCreateReturnBySqlTransactionMutation } from "../browser/browser.services"
import { setTransactionNotifier } from "./cashering.reducer"
import { setDispensingNotifier } from "./dispensing.reducer"
import { resetReimburseManager } from "./reimburse.reducer"
import { setReturnedNotifier } from "./returned.reducer"

const CasheringReimburse = () => {
    const auth = useAuth()
    const inputRef = useRef([])
    const dataSelector = useSelector(state => state.reimburse)
    const transactionSelector = useSelector(state => state.transaction)
    const dispensingSelector = useSelector(state => state.dispensing)
    const creditSelector = useSelector(state => state.credit)
    const dispatch = useDispatch()
    const [total, setTotal] = useState(0)
    const [credit, setCredit] = useState(0)
    const [payments, setPayments] = useState()
    const [reimburse, setReimburse] = useState({
        method: "",
        refcode: "",
    })
    const toast = useToast()

    const [byCodePayment] = useByCodePaymentMutation()
    const [createReturn] = useCreateReturnBySqlTransactionMutation()

    useEffect(() => {
        const instantiate = async () => {
            await byCodePayment({ code: dispensingSelector.item.code })
                .unwrap()
                .then(res => {
                    if (res.success) {
                        let values = reimburse
                        setPayments(res?.arrayResult?.map((pay, index) => {
                            let name = `amt${index}`
                            values = { ...values, [name]: "" }
                            return {
                                ...pay,
                                remaining: pay.amount,
                                applyamt: 0
                            }
                        }))
                        setReimburse(values)
                        setTotal(dataSelector.total)
                        setCredit("")
                        if (creditSelector?.item?.outstand) {
                            setReimburse(prev => ({
                                ...prev,
                                [`amt${res?.arrayResult?.length || 0}`]: ""
                            }))
                        }
                    }
                })
                .catch(err => console.error(err))
            return
        }

        if (dataSelector.manager && dispensingSelector.item) {
            instantiate()
        }
    }, [dataSelector.manager, dispensingSelector.item])

    const onChange = (e) => {
        const { name, value } = e.target
        setReimburse(prev => ({
            ...prev,
            [name]: value
        }))
        const position = parseInt(name.replace("amt", ""))
        let paymentlist = payments
        paymentlist[position] = {
            ...paymentlist[position],
            remaining: amount(paymentlist[position].amount) - amount(value),
            applyamt: value
        }
        setPayments(paymentlist)
    }

    const onCreditChange = (e) => {
        const { name, value } = e.target
        setReimburse(prev => ({
            ...prev,
            [name]: value
        }))
        setCredit(value)
    }

    const onClose = () => {
        dispatch(resetReimburseManager())
    }

    const onCompleted = () => {
        dispatch(setDispensingNotifier(true))
        dispatch(setReturnedNotifier(true))
        dispatch(setTransactionNotifier(true))
        dispatch(resetReimburseManager())
    }

    const onApply = (item, index) => {
        console.log(reimburse)
        let name = `amt${index}`
        let applied = payments?.reduce((prev, curr) => prev + amount(curr.applyamt || 0), 0) + amount(credit)
        let remain = total - applied
        if (remain > 0) {
            let value = remain > item.amount ? item.amount : remain
            setReimburse(prev => ({
                ...prev,
                [name]: value
            }))
            let paymentlist = payments
            paymentlist[index] = {
                ...paymentlist[index],
                remaining: amount(paymentlist[index].amount) - amount(value),
                applyamt: value
            }
            setPayments(paymentlist)
        }
        inputRef.current[index].focus()
    }

    const onApplyCredit = () => {
        let index = payments?.length || 0
        let name = `amt${index}`
        let applied = payments?.reduce((prev, curr) => prev + amount(curr.applyamt || 0), 0) + amount(credit)
        let remain = total - applied
        if (remain > 0) {
            let value = remain > amount(creditSelector?.item?.outstand) ? amount(creditSelector?.item?.outstand) : remain
            setReimburse(prev => ({
                ...prev,
                [name]: value
            }))
            setCredit(value)
        }
        inputRef.current[index].focus()
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        let balance = total - (payments?.reduce((prev, curr) => prev + amount(curr.applyamt || 0), 0) + amount(credit))
        if (balance > 0) {
            toast.showWarning("Please apply the full returned amount.")
            return
        }
        let hasReturn = dispensingSelector?.data?.filter(f => f.toreturn > 0).length > 0
        if (hasReturn) {
            console.log(dispensingSelector?.data)
            console.log(payments)
            let payment = payments?.filter(f => f.applyamt > 0)
            let returns = dispensingSelector?.data?.filter(f => f.toreturn > 0)
            let dispense = dispensingSelector?.data
            let returnVat = returns?.reduce((prev, curr) => prev + amount(curr.returnvat), 0)
            let returnTotal = returns?.reduce((prev, curr) => prev + amount(curr.returntotal), 0)
            let returnLess = returns?.reduce((prev, curr) => prev + amount(curr.returnless), 0)
            let returnNet = returns?.reduce((prev, curr) => prev + amount(curr.returnnet), 0)
            let remainVat = dispense?.reduce((prev, curr) => prev + amount(curr.remainvat), 0)
            let remainTotal = dispense?.reduce((prev, curr) => prev + amount(curr.remaintotal), 0)
            let remainLess = dispense?.reduce((prev, curr) => prev + amount(curr.remainless), 0)
            let remainNet = dispense?.reduce((prev, curr) => prev + amount(curr.remainnet), 0)
            let data = {
                transaction: {
                    vat: remainVat,
                    total: remainTotal,
                    less: remainLess,
                    net: remainNet,
                    return: amount(transactionSelector.item.return) + amount(returnNet),
                    id: transactionSelector.item.id
                },
                refund: {
                    code: transactionSelector.item.code,
                    purchase_vat: transactionSelector.item.vat,
                    purchase_total: transactionSelector.item.total,
                    purchase_less: transactionSelector.item.less,
                    purchase_net: transactionSelector.item.net,
                    return_vat: returnVat,
                    return_total: returnTotal,
                    return_less: returnLess,
                    return_net: returnNet,
                    discount: transactionSelector.item.discount,
                    account: auth.id,
                },
                dispensing: returns?.map(item => {
                    return {
                        dispense: item.forreturned,
                        vat: amount(item.remainvat),
                        total: amount(item.remainvotal),
                        less: amount(item.remainvess),
                        net: amount(item.remainvet),
                        returned: amount(item.returned) + amount(item.toreturn),
                        toreturn: 0,
                        item: item.item,
                        qty: amount(item.toreturn),
                        id: item.id,
                    }
                }),
                returned: returns?.map(item => {
                    return {
                        code: transactionSelector.item.code,
                        item: item.item,
                        product: item.product,
                        quantity: item.toreturn,
                        price: item.price,
                        vat: item.returnvat,
                        total: item.returntotal,
                        less: item.returnless,
                        net: item.returnnet,
                        discount: item.discount,
                        taxrated: 0.12,
                    }
                }),
            }
            if (transactionSelector.item.method === "SALES") {
                data = {
                    ...data,
                    reimburse: {
                        code: transactionSelector.item.code,
                        method: transactionSelector.item.method,
                        amount: amount(total),
                        refcode: reimburse.refcode,
                        account: auth.id
                    }
                }
            }
            if (transactionSelector.item.method === "CREDIT") {
                let returned = amount(creditSelector.item.returned) + amount(total)
                let outstand = amount(creditSelector.item.outstand) - amount(total)
                data = {
                    ...data,
                    credit: {
                        creditor: creditSelector.item.creditor,
                        returned: returned,
                        outstand: outstand,
                        status: outstand > 0 ? "ON-GOING" : "PAID",
                        id: creditSelector.item.id
                    }
                }
            }
            if (payment.length > 0) {
                data = {
                    ...data,
                    payment: payment?.map(item => {
                        return {
                            amount: amount(item.amount) - amount(item.applyamt),
                            returned: amount(item.returned) + amount(item.applyamt),
                            reimburse: 1,
                            id: item.id
                        }
                    })
                }
            }
            console.log(data)
            await createReturn(data)
                .unwrap()
                .then(res => {
                    if (res.success) {
                        console.log(res)
                        toast.showCreate("Return successfully applied.")
                        onCompleted()
                    }
                })
                .catch(err => console.error(err))
        }
    }

    return (
        <Transition
            show={dataSelector.manager}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            className={`fixed left-0 top-0 h-full w-full bg-gradient-to-r from-[#00000070] via-[#00000070] to-[#00000040] z-20 flex items-start justify-center`}
        >
            <Transition.Child
                enter="transition ease-in-out duration-500 transform"
                enterFrom="translate-y-full"
                enterTo="translate-y-0"
                leave="transition ease-in-out duration-500 transform"
                leaveFrom="translate-y-0"
                leaveTo="translate-y-full"
                className="flex items-center justify-center h-full w-full lg:w-[550px]"
            >
                <div className="flex flex-col gap-2 bg-white p-3 w-[60%] lg:w-[550px] h-fit text-sm mt-1">
                    <div className="flex items-center justify-between">
                        <div>DISCOUNT OPTIONS</div>
                        <div onClick={() => onClose()}>
                            <XMarkIcon className="w-5 h-5 cursor-pointer" />
                        </div>
                    </div>
                    <form onSubmit={onSubmit} className="flex flex-col gap-3 mt-2 p-5">
                        <div className="flex gap-1">
                            <div className="flex flex-col gap-1 w-1/3">
                                <label htmlFor="amount" className="text-xs text-gray-500">Returned Total:</label>
                                <div className="flex border border-white border-b-secondary-500 p-0.5 items-center">
                                    <input
                                        type="text"
                                        value={NumFn.currency(total)}
                                        autoComplete="off"
                                        readOnly
                                        className="w-full border-none focus:border-none outline-none ring-0 focus:ring-0 focus:outline-none grow-1"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1 w-1/3">
                                <label htmlFor="amount" className="text-xs text-gray-500">Applied Total:</label>
                                <div className="flex border border-white border-b-secondary-500 p-0.5 items-center">
                                    <input
                                        type="text"
                                        value={NumFn.currency(payments?.reduce((prev, curr) => prev + amount(curr.applyamt || 0), 0) + amount(credit))}
                                        autoComplete="off"
                                        readOnly
                                        className="w-full border-none focus:border-none outline-none ring-0 focus:ring-0 focus:outline-none grow-1"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1 w-1/3">
                                <label htmlFor="amount" className="text-xs text-gray-500">Remaining:</label>
                                <div className="flex border border-white border-b-secondary-500 p-0.5 items-center">
                                    <input
                                        type="text"
                                        value={NumFn.currency(total - (payments?.reduce((prev, curr) => prev + amount(curr.applyamt || 0), 0) + amount(credit)))}
                                        autoComplete="off"
                                        readOnly
                                        className="w-full border-none focus:border-none outline-none ring-0 focus:ring-0 focus:outline-none grow-1"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="amount" className="text-xs text-gray-500">Credit Balance:</label>
                            <div className="flex border border-white border-b-secondary-500 p-0.5 items-center">
                                <input
                                    type="text"
                                    value={NumFn.currency(amount(creditSelector?.item?.outstand) - amount(credit))}
                                    autoComplete="off"
                                    readOnly
                                    className="w-full border-none focus:border-none outline-none ring-0 focus:ring-0 focus:outline-none grow-1"
                                />
                            </div>
                        </div>
                        <div className="px-5 py-3 border border-2 border-secondary-300 text-sm">
                            {
                                (payments?.length) ? (
                                    payments?.map((pay, index) => (
                                        <div key={index} className="w-full flex flex-grow gap-3 items-center py-3 relative">
                                            <div className="w-[80px] flex-none">
                                                [{pay.method}]
                                            </div>
                                            <div className="w-[80px] flex-none text-left">
                                                {NumFn.currency(pay.remaining)}
                                            </div>
                                            <div className="flex w-[150px] ml-auto items-center justify-end">
                                                <input
                                                    ref={r => inputRef.current[index] = r}
                                                    type="text"
                                                    name={`amt${index}`}
                                                    className="w-full border ring-0 outline-none border-white border-b-secondary-500 focus:outline-none focus:border-white focus:border-b-secondary-500 focus:ring-0 text-right text-sm pr-8"
                                                    value={reimburse[`amt${index}`]}
                                                    onChange={onChange}
                                                    autoComplete="off"
                                                />
                                                <CurrencyDollarIcon className="w-5 h-5 absolute right-0" onClick={() => onApply(pay, index)} />
                                            </div>
                                        </div>
                                    ))
                                ) : null
                            }
                            <div className={`${creditSelector?.item?.outstand > 0 ? "flex" : "hidden"} w-full flex-grow gap-3 items-center py-3 relative`}>
                                <div className="w-[80px] flex-none">
                                    [CREDIT]
                                </div>
                                <div className="w-[80px] flex-none text-left">
                                    {NumFn.currency(amount(creditSelector?.item?.outstand) - amount(credit))}
                                </div>
                                <div className="flex w-[150px] ml-auto items-center justify-end">
                                    <input
                                        ref={r => inputRef.current[payments?.length || 0] = r}
                                        type="text"
                                        name={`amt${payments?.length || 0}`}
                                        className="w-full border ring-0 outline-none border-white border-b-secondary-500 focus:outline-none focus:border-white focus:border-b-secondary-500 focus:ring-0 text-right text-sm pr-8"
                                        value={reimburse[`amt${payments?.length || 0}`] || ""}
                                        onChange={onCreditChange}
                                        autoComplete="off"
                                    />
                                    <CurrencyDollarIcon className="w-5 h-5 absolute right-0" onClick={() => onApplyCredit()} />
                                </div>
                            </div>
                            <div className={`${!payments?.length && creditSelector?.item?.outstand === 0 ? "flex" : "hidden"} gap-[10px] items-center`}>
                                <ExclamationCircleIcon className="h-7 w-7 text-blue-400" />
                                No payment entry.
                            </div>
                        </div>
                        {/* <div className="flex border border-secondary-500 p-0.5 items-center">
                            <input
                                type="text"
                                name="refcode"
                                value={reimburse.refcode}
                                onChange={(e) => setReimburse(prev => ({ ...prev, refcode: e.target.value }))}
                                autoComplete="off"
                                placeholder="Reference (Optional)"
                                className="w-full border-none focus:border-none outline-none ring-0 focus:ring-0 focus:outline-none grow-1"
                            />
                        </div> */}
                        <div className="flex justify-end mt-5">
                            <button type="button" tabIndex={-1} className="button-cancel" onClick={() => onClose()}>Cancel</button>
                            <button type="submit" className="button-submit">Add Option</button>
                        </div>
                    </form>
                </div>
            </Transition.Child>
        </Transition>
    )
}

export default CasheringReimburse
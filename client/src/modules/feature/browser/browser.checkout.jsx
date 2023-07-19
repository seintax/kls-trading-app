import { Transition } from "@headlessui/react"
import { ArrowLeftIcon } from "@heroicons/react/20/solid"
import { ChevronRightIcon } from "@heroicons/react/24/solid"
import moment from "moment"
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { sqlDate } from "../../../utilities/functions/datetime.functions"
import { NumFn, amount, currency } from "../../../utilities/functions/number.funtions"
import { StrFn, isEmpty } from "../../../utilities/functions/string.functions"
import useAuth from "../../../utilities/hooks/useAuth"
import useToast from "../../../utilities/hooks/useToast"
import DataRecords from "../../../utilities/interface/datastack/data.records"
import { useByMaxAccountTransactionMutation } from "../cashering/cashering.services"
import { removeBrowserPaid, resetBrowserCheckout, resetBrowserTransaction, setBrowserBalance, setBrowserNotifier, showBrowserDiscount, showBrowserPayments } from "./browser.reducer"
import { useCreateBrowserBySqlTransactionMutation } from "./browser.services"

const BrowserCheckout = () => {
    const auth = useAuth()
    const dataSelector = useSelector(state => state.browser)
    const dispatch = useDispatch()
    const [records, setrecords] = useState()
    const [startpage, setstartpage] = useState(1)
    const columns = dataSelector.header
    const toast = useToast()
    const [balance, setBalance] = useState(0)
    const [tended, setTended] = useState(0)
    const [change, setChange] = useState(0)
    const [payment, setPayment] = useState(0)
    const [summary, setsummary] = useState({
        total: 0,
        vat: 0,
        discount: 0,
        rate: 0,
        net: 0,
    })

    const [maxAccountTransaction] = useByMaxAccountTransactionMutation()
    const [createTransaction] = useCreateBrowserBySqlTransactionMutation()

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
                        <span className={`${item.supplier_name ? "" : "hidden"} bg-gradient-to-b from-white to-green-200 px-1 rounded-md border border-gray-400`}>
                            Supplier: {item.supplier_name}
                        </span>
                    </div>
            },
            { value: item.stocks },
            { value: NumFn.currency(item.price) },
            { value: item.store },
            { value: item.remaining || 0 },
            { value: item.quantity || "" },
            { value: "" }
        ]
    }

    useEffect(() => {
        if (dataSelector?.cart) {
            let data = dataSelector?.cart
            setrecords(data?.map((item, i) => {
                return {
                    key: item.id,
                    items: items(item),
                    ondoubleclick: () => { },
                }
            }))
            let total = dataSelector?.cart?.reduce((prev, curr) => prev + (amount(curr.price) * amount(curr.quantity)), 0)
            setsummary(prev => ({
                ...prev,
                total: total,
                vat: amount(total) * 0.12,
                net: amount(total) - amount(prev.discount)
            }))
        }
    }, [dataSelector?.cart])

    useEffect(() => {
        if (summary.total > 0) {
            let totalpaid = dataSelector?.paid?.reduce((prev, curr) => prev + amount(curr.amount), 0)
            let totalnoncash = dataSelector?.paid?.reduce((prev, curr) => prev + (curr.method !== "CASH" ? amount(curr.amount) : 0), 0)
            let totalcash = dataSelector?.paid?.reduce((prev, curr) => prev + (curr.method === "CASH" ? amount(curr.amount) : 0), 0)
            let totalpartial = dataSelector?.paid?.reduce((prev, curr) => prev + (curr.method === "CREDIT" ? amount(curr.partial) : 0), 0)
            let total = amount(summary.total) - amount(summary.discount)
            let settled = amount(total) - amount(totalnoncash)
            let change = totalcash - settled
            let balance = amount(total) - amount(totalpaid) - amount(totalpartial)
            let totalpayment = totalpaid + amount(totalpartial)
            setTended(totalcash || 0)
            setChange(change < 0 ? 0 : change)
            setBalance(balance < 0 ? 0 : balance)
            setPayment(totalpayment)
        }
    }, [dataSelector?.paid, summary.total, summary.discount, dataSelector?.less])

    useEffect(() => {
        if (dataSelector?.less?.discount) {
            if (dataSelector?.less?.option === "CUSTOM") {
                setsummary(prev => ({
                    ...prev,
                    rate: (amount(dataSelector?.less?.discount) / amount(summary.total)),
                    discount: dataSelector?.less?.discount,
                    net: amount(summary.total) - amount(dataSelector?.less?.discount)
                }))
                return
            }
            let discount = amount(summary.total) * amount(dataSelector?.less?.rate)
            setsummary(prev => ({
                ...prev,
                discount: discount,
                rate: dataSelector?.less?.rate,
                net: amount(total) - discount
            }))
        }
    }, [dataSelector?.less, summary.total])

    useEffect(() => {
        console.log(dataSelector?.paid)
    }, [dataSelector?.paid])


    const toggleOffCheckout = () => {
        dispatch(resetBrowserCheckout())
    }

    const toggleDiscount = () => {
        if (summary.total > 0) {
            dispatch(showBrowserDiscount())
            return
        }
    }

    const togglePayments = () => {
        if (balance > 0) {
            dispatch(setBrowserBalance(balance))
            dispatch(showBrowserPayments())
            return
        }
        toast.showWarning("Cannot add payment option when balance is zero.")
    }

    const removePayment = (id) => {
        if (window.confirm("Do you wish to delete this payment option?")) {
            dispatch(removeBrowserPaid(id))
        }
    }

    const onCompleted = () => {
        dispatch(setBrowserNotifier(true))
        dispatch(resetBrowserTransaction())
    }

    const destructCode = (maxcode) => {
        let tags = maxcode.split("-")
        return String(Number(tags[2]) + 1)
    }

    const processTransaction = async () => {
        console.log(auth)
        if (balance !== 0) {
            toast.showWarning("Please settle the checkout balance.")
            return
        }
        await maxAccountTransaction({ account: auth.id, date: sqlDate() })
            .unwrap()
            .then(async (res) => {
                if (res.success) {
                    let datetag = moment(new Date()).format("YYYYMMDD")
                    let usertag = StrFn.formatWithZeros(auth.id, 5)
                    let codetag = isEmpty(res.distinctResult?.data?.max)
                        ? "000001"
                        : StrFn.formatWithZeros(destructCode(res.distinctResult?.data?.max), 6)
                    let code = `${datetag}-${usertag}-${codetag}`
                    console.log(dataSelector.cart)
                    let data = {
                        transaction: {
                            code: code,
                            vat: amount(summary.vat),
                            total: amount(summary.total),
                            less: amount(summary.discount),
                            net: amount(summary.net),
                            discount: amount(summary.rate),
                            tended: tended,
                            change: change,
                            method: dataSelector.method,
                            status: "COMPLETED",
                            account: auth.id,
                            date: sqlDate()
                        },
                        dispensing: dataSelector.cart?.map(item => {
                            let vat = amount(item.price) * 0.12
                            let total = amount(item.quantity) * amount(item.price)
                            let less = total * amount(summary.rate)
                            let net = total - less
                            return {
                                code: code,
                                index: moment(new Date).format("YY-MM-DD-HH-mm-ss"),
                                item: item.id,
                                product: item.product,
                                purchase: amount(item.quantity),
                                dispense: amount(item.quantity),
                                variant: item.variant,
                                supplier: item.supplier,
                                price: item.price,
                                vat: vat,
                                total: total,
                                less: less,
                                net: net,
                                discount: amount(summary.rate),
                                taxrated: 0.12
                            }
                        }),
                        payment: dataSelector.paid
                            ?.filter(f => f.type === "SALES")
                            ?.map(pay => {
                                return {
                                    code: code,
                                    type: "SALES",
                                    method: pay.method,
                                    total: amount(pay.amount),
                                    amount: amount(pay.amount),
                                    refcode: pay.refcode,
                                    refdate: pay.method === "CHEQUE" ? pay.refdate : undefined,
                                    refstat: pay.refstat,
                                    account: auth.id
                                }
                            }),
                        credit: dataSelector.paid
                            ?.filter(f => f.type === "CREDIT")
                            ?.map(cred => {
                                let payment = {
                                    code: code,
                                    type: "CREDIT",
                                    method: "CASH",
                                    total: amount(cred.partial),
                                    amount: amount(cred.partial),
                                    refcode: cred.refcode,
                                    refdate: cred.method === "CHEQUE" ? cred.refdate : undefined,
                                    refstat: cred.refstat,
                                    account: auth.id
                                }
                                return {
                                    code: code,
                                    creditor: cred.creditor,
                                    total: amount(summary.net),
                                    partial: amount(cred.partial),
                                    balance: amount(cred.amount),
                                    outstand: amount(cred.amount),
                                    status: "ON-GOING",
                                    credit_payment: amount(cred.partial) > 0
                                        ? payment
                                        : undefined
                                }
                            })
                    }
                    console.log(data)
                    await createTransaction(data)
                        .unwrap()
                        .then(res => {
                            if (res.success) {
                                console.log(res)
                                toast.showCreate("Transaction successfully completed.")
                                onCompleted()
                            }
                        })
                        .catch(err => console.error(err))
                }
            })
            .catch(err => console.error(err))
    }

    return (
        <>
            <Transition
                show={dataSelector.checkout}
                enter="transition-opacity ease-linear duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                className={`fixed left-16 lg:left-56 top-24 mt-1 h-full w-full bg-gradient-to-r from-[#00000070] via-[#00000070] to-[#00000040] z-10 flex items-start justify-end`}
            >
                <Transition.Child
                    enter="transition ease-in-out duration-500 transform"
                    enterFrom="translate-y-full"
                    enterTo="translate-y-0"
                    leave="transition ease-in-out duration-500 transform"
                    leaveFrom="translate-y-0"
                    leaveTo="translate-y-full"
                    className="flex flex-col gap-2 bg-white px-3 w-full h-full text-sm mt-1 pr-20 lg:pr-60 pb-48"
                >
                    <div className="pl-1 pt-3 text-secondary-500 font-bold text-lg flex items-center gap-4">
                        <ArrowLeftIcon className="w-6 h-6 cursor-pointer" onClick={() => toggleOffCheckout()} />
                        <span>Checkout</span>
                    </div>
                    <DataRecords
                        page={startpage}
                        columns={columns}
                        records={records}
                        setPage={setstartpage}
                        itemsperpage={dataSelector?.perpage}
                    />
                    <div className="flex flex-col">
                        <div className="flex justify-between items-center p-3 border-t border-t-gray-400">
                            <span>Order Total ({dataSelector?.cart?.length} Item/s):</span>
                            <span className="ml-auto text-gray-800">
                                {currency(summary?.total)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center px-3 pt-1 pb-3 text-xs text-gray-600">
                            <span>Value Added Tax:</span>
                            <span className="ml-auto text-gray-600">
                                {currency(summary.vat)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-3 border-t border-t-gray-400 cursor-pointer" onClick={() => toggleDiscount()}>
                            <span>Discount ({currency(summary.rate * 100).replace("0.00", "")}%):</span>
                            <span className="ml-auto text-gray-800">
                                {currency(summary.discount)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-3 border-t border-t-gray-400">
                            <span>Net Amount:</span>
                            <span className="ml-auto text-secondary-500 font-bold">
                                {currency(summary.net)}
                            </span>
                        </div>
                        <div className="flex flex-col py-1 pl-3 border-t border-t-gray-400">
                            <div className="flex justify-between items-center py-2 cursor-pointer" onClick={() => togglePayments()}>
                                <span>Payment Options:</span>
                                <span className="ml-auto text-secondary-500 font-bold">
                                    <ChevronRightIcon className="w-5 h-5" />
                                </span>
                            </div>
                            <div className={`${dataSelector.paid?.length ? "flex" : "hidden"} flex-col w-full gap-1 py-2`}>
                                {
                                    dataSelector.paid?.map(pay => (
                                        <>
                                            <div key={pay.id} className="flex justify-between items-center pl-5 pr-3 py-1 text-xs" onClick={() => removePayment(pay.id)}>
                                                <span className="w-1/4 flex-none">
                                                    {pay.method}
                                                </span>
                                                <span className={pay.type === "SALES" ? "" : "hidden"}>
                                                    {pay.refcode ? ` #${pay.refcode}` : ""}
                                                </span>
                                                <span className={pay.type === "CREDIT" ? "flex gap-5" : "hidden"}>
                                                    <span>{pay.creditor_name}</span>
                                                </span>
                                                <span className="ml-auto text-gray-800">
                                                    {currency(pay.amount)}
                                                </span>
                                            </div>
                                            <div key={pay.id + 0.1} className={`${pay.type === "CREDIT" ? "flex" : "hidden"} justify-between items-center pl-5 pr-3 py-1 text-xs`} onClick={() => removePayment(pay.id)}>
                                                <span className="w-1/4 flex-none flex items-center gap-2">
                                                    {pay.method}
                                                    <span className="bg-gray-300 px-2 py-0.5 rounded-md">
                                                        PARTIAL
                                                    </span>
                                                </span>
                                                <span className="flex gap-5 ">
                                                    <span>{pay.creditor_name}</span>
                                                </span>
                                                <span className="ml-auto text-gray-800">
                                                    {currency(pay.partial)}
                                                </span>
                                            </div>
                                        </>
                                    ))
                                }
                                <div className={`${payment > 0 ? "flex" : "hidden"} justify-between items-center pl-5 pr-3 py-1 text-xs font-bold`}>
                                    <span className="w-full pt-3">Total Payment</span>
                                    <span className="w-1/3 text-right text-secondary-500 border-t border-t-gray-400 pt-3">
                                        {currency(payment)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex border-t border-t-gray-400">
                            <div className="flex flex-col py-3 pl-3">
                                <div className="flex flex-col justify-end items-start">
                                    <div className="text-sm flex gap-2">
                                        Balance:
                                        <span className="text-secondary-500 font-bold">
                                            {currency(balance)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4 ml-auto py-3">
                                <div className="flex flex-col justify-end items-end">
                                    <div className="text-sm flex gap-2">
                                        Tended Cash:
                                        <span className="text-secondary-500 font-bold">
                                            {currency(tended)}
                                        </span>
                                    </div>
                                    <div className="flex gap-2 text-xs">
                                        Change:
                                        <span className="text-secondary-500 font-bold">
                                            {currency(change)}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    className="button-link bg-gradient-to-b from-primary-500 via-secondary-500 to-secondary-600 px-7"
                                    onClick={() => processTransaction()}
                                >
                                    Process Transaction
                                </button>
                            </div>
                        </div>
                    </div>
                </Transition.Child>
            </Transition>
        </>
    )
}

export default BrowserCheckout
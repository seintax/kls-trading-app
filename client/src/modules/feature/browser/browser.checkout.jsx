import { Transition } from "@headlessui/react"
import { ArrowLeftIcon } from "@heroicons/react/20/solid"
import { ArrowDownIcon } from "@heroicons/react/24/outline"
import { ChevronRightIcon } from "@heroicons/react/24/solid"
import moment from "moment"
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { sqlDate } from "../../../utilities/functions/datetime.functions"
import { NumFn, amount, currency } from "../../../utilities/functions/number.funtions"
import { StrFn, formatVariant, isAdmin, isDev, isEmpty, isYes } from "../../../utilities/functions/string.functions"
import useAuth from "../../../utilities/hooks/useAuth"
import useToast from "../../../utilities/hooks/useToast"
import DataRecords from "../../../utilities/interface/datastack/data.records"
import { useDistinctBranchMutation } from "../../library/branch/branch.services"
import { useByMaxAccountTransactionMutation } from "../cashering/cashering.services"
import { removePaymentPaid, resetPaymentTransaction, setPaymentBalance, setPaymentEnableCredit, setPaymentSettlement, setPaymentTotal, showPaymentDiscount, showPaymentManager, showPaymentPayor } from "../payment/payment.reducer"
import { resetBrowserCheckout, resetBrowserTransaction, setBrowserNotifier } from "./browser.reducer"
import { useCreateBrowserBySqlTransactionMutation } from "./browser.services"

const BrowserCheckout = () => {
    const auth = useAuth()
    const [mounted, setMounted] = useState(false)
    const [processing, setProcessing] = useState(false)
    const dataSelector = useSelector(state => state.browser)
    const paymentSelector = useSelector(state => state.payment)
    const printingSelector = useSelector(state => state.printing)
    const [isPaid, setIsPaid] = useState(false)
    const dispatch = useDispatch()
    const [records, setrecords] = useState()
    const [startpage, setstartpage] = useState(1)
    const columns = dataSelector.header
    const toast = useToast()
    const configSelector = useSelector(state => state.settings)
    const config = configSelector.config
    const [branch, setBranch] = useState()
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

    useEffect(() => { setMounted(true) }, [])

    useEffect(() => {
        if (mounted) {
            return () => {
                if (isPaid) {
                    onCompleted()
                }
            }
        }
    }, [mounted])

    const [distinctBranch] = useDistinctBranchMutation()
    const [maxAccountTransaction] = useByMaxAccountTransactionMutation()
    const [createTransaction] = useCreateBrowserBySqlTransactionMutation()

    useEffect(() => {
        const instantiate = async () => {
            await distinctBranch({ code: auth.store })
                .unwrap()
                .then(res => {
                    if (res.success) {
                        setBranch(res.distinctResult)
                    }
                })
                .catch(err => console.error(err))
        }

        instantiate()
    }, [])

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
            {
                value: <span className={item.markdown ? "text-xs text-red-500 flex items-center" : "hidden"}>
                    -{NumFn.currency(item.markdown)}<ArrowDownIcon className="w-3 h-4" />
                </span>
            },
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
            let markdown = dataSelector?.cart?.reduce((prev, curr) => prev + amount(curr.markdown), 0)
            setsummary(prev => ({
                ...prev,
                total: total,
                markdown: markdown,
                vat: amount(total) * 0.12,
                net: amount(total) - amount(prev.discount) - amount(markdown)
            }))
        }
    }, [dataSelector?.cart])

    useEffect(() => {
        if (summary.total > 0) {
            let totalpaid = paymentSelector?.paid?.reduce((prev, curr) => prev + amount(curr.amount), 0)
            let totalnoncash = paymentSelector?.paid?.reduce((prev, curr) => prev + (curr.method !== "CASH" ? amount(curr.amount) : 0), 0)
            let totalcash = paymentSelector?.paid?.reduce((prev, curr) => prev + (curr.method === "CASH" ? amount(curr.amount) : 0), 0)
            let totalpartial = paymentSelector?.paid?.reduce((prev, curr) => prev + (curr.type === "CREDIT" ? amount(curr.amount) : 0), 0)
            let total = amount(summary.total) - amount(summary.discount) - amount(summary.markdown)
            let settled = amount(total) - amount(totalnoncash)
            let change = totalcash - settled
            let balance = amount(total) - amount(totalpaid) - amount(totalpartial)
            let totalpayment = totalpaid + amount(totalpartial)
            setTended(totalcash || 0)
            setChange(change < 0 ? 0 : change)
            setBalance(balance < 0 ? 0 : balance)
            setPayment(totalpayment)
        }
    }, [paymentSelector?.paid, summary.total, summary.discount, paymentSelector?.less])

    useEffect(() => {
        if (paymentSelector?.less?.discount) {
            if (paymentSelector?.less?.option === "CUSTOM") {
                setsummary(prev => ({
                    ...prev,
                    rate: (amount(paymentSelector?.less?.discount) / amount(summary.total)),
                    discount: paymentSelector?.less?.discount,
                    net: amount(summary.total) - amount(paymentSelector?.less?.discount) - amount(summary.markdown)
                }))
                return
            }
            let discount = amount(summary.total) * amount(paymentSelector?.less?.rate)
            setsummary(prev => ({
                ...prev,
                discount: discount,
                rate: paymentSelector?.less?.rate,
                net: amount(summary.total) - discount - amount(summary.markdown)
            }))
        }
    }, [paymentSelector?.less, summary.total])

    const toggleOffCheckout = () => {
        dispatch(resetBrowserCheckout())
    }

    const toggleDiscount = () => {
        if (isPaid) return
        if (summary.total > 0) {
            let total = dataSelector?.cart?.reduce((prev, curr) => prev + (amount(curr.price) * amount(curr.quantity)), 0)
            let markdown = dataSelector?.cart?.reduce((prev, curr) => prev + amount(curr.markdown), 0)
            dispatch(setPaymentTotal(amount(total) - amount(markdown)))
            dispatch(showPaymentDiscount())
            return
        }
    }

    const toggleCustomer = () => {
        if (isPaid) return
        dispatch(showPaymentPayor())
    }

    const togglePayments = () => {
        if (isPaid) return
        if (balance > 0) {
            dispatch(setPaymentBalance(balance))
            dispatch(setPaymentSettlement(false))
            dispatch(setPaymentEnableCredit(true))
            dispatch(showPaymentManager())
            return
        }
        toast.showWarning("Cannot add payment option when balance is zero.")
    }

    const removePayment = (id) => {
        if (isPaid) return
        if (window.confirm("Do you wish to delete this payment option?")) {
            dispatch(removePaymentPaid(id))
        }
    }

    const onCompleted = () => {
        setIsPaid(false)
        dispatch(setBrowserNotifier(true))
        dispatch(resetBrowserTransaction())
        dispatch(resetPaymentTransaction())
        localStorage.removeItem("printcompleted")
    }

    const destructCode = (maxcode) => {
        let tags = maxcode.split("-")
        return String(Number(tags[2]) + 1)
    }

    useEffect(() => {
        if (dataSelector.checkout && isPaid) {
            const interval = setInterval(() => {
                let printcompleted = localStorage.getItem("printcompleted")
                if (!isEmpty(printcompleted)) {
                    onCompleted()
                }
            }, 1000)
            return () => clearInterval(interval)
        }
    }, [dataSelector.checkout, isPaid])

    const processTransaction = async () => {
        if (balance !== 0) {
            toast.showWarning("Please settle the checkout balance.")
            return
        }
        if (isEmpty(paymentSelector.customer?.id)) {
            toast.showWarning("Please provide a payor for checkout.")
            return
        }
        if (paymentSelector.customer?.name === "Walkin Customer" && paymentSelector.method === "CREDIT") {
            toast.showWarning("Cannot process credit for walk-in customers.")
            return
        }
        setProcessing(true)
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
                    let data = {
                        transaction: {
                            code: code,
                            vat: amount(summary.vat),
                            total: amount(summary.total),
                            less: amount(summary.discount),
                            markdown: amount(summary.markdown),
                            net: amount(summary.net),
                            discount: amount(summary.rate),
                            tended: tended,
                            change: change,
                            method: paymentSelector.method,
                            status: "COMPLETED",
                            account: auth.id,
                            customer: paymentSelector.customer.id,
                            date: sqlDate()
                        },
                        dispensing: dataSelector.cart?.map(item => {
                            let vat = amount(item.price) * 0.12
                            let total = amount(item.quantity) * amount(item.price)
                            let less = total * amount(summary.rate)
                            let net = total - less - amount(item.markdown)
                            return {
                                code: code,
                                index: moment(new Date).format("YY-MM-DD-HH-mm-ss"),
                                item: item.id,
                                product: item.product,
                                purchase: amount(item.quantity),
                                dispense: amount(item.quantity),
                                variant: item.variant,
                                supplier: String(item.supplier),
                                price: item.price,
                                vat: vat,
                                total: total,
                                less: less,
                                markdown: item.markdown,
                                net: net,
                                discount: amount(summary.rate),
                                taxrated: 0.12
                            }
                        }),
                        payment: paymentSelector.paid
                            ?.filter(f => f.type === "SALES")
                            ?.map(pay => {
                                return {
                                    code: code,
                                    type: pay.type,
                                    method: pay.method,
                                    total: amount(pay.amount),
                                    amount: amount(pay.amount),
                                    refcode: pay.refcode,
                                    refdate: pay.method === "CHEQUE" ? pay.refdate : undefined,
                                    refstat: pay.refstat,
                                    account: auth.id
                                }
                            }),
                        credit: paymentSelector.paid
                            ?.filter(f => f.type === "CREDIT")
                            ?.map(cred => {
                                let payment = {
                                    code: code,
                                    type: cred.type,
                                    method: cred.method,
                                    total: amount(cred.amount),
                                    amount: amount(cred.amount),
                                    refcode: cred.refcode,
                                    refdate: cred.method === "CHEQUE" ? cred.refdate : undefined,
                                    refstat: cred.refstat,
                                    account: auth.id
                                }
                                return {
                                    code: code,
                                    creditor: paymentSelector.customer.id,
                                    total: amount(summary.net),
                                    partial: amount(cred.amount),
                                    balance: amount(cred.credit),
                                    outstand: amount(cred.credit),
                                    status: "ON-GOING",
                                    account: auth.id,
                                    credit_payment: amount(cred.amount) > 0
                                        ? payment
                                        : undefined
                                }
                            })
                    }
                    await createTransaction(data)
                        .unwrap()
                        .then(res => {
                            setProcessing(false)
                            if (res.success) {
                                setIsPaid(true)
                                let partial = paymentSelector.paid
                                    ?.filter(f => f.type === "CREDIT")
                                    ?.reduce((prev, curr) => prev + amount(curr.amount), 0)
                                let credit = paymentSelector.paid
                                    ?.filter(f => f.type === "CREDIT")
                                    ?.reduce((prev, curr) => prev + amount(curr.credit), 0)
                                let printdata = {
                                    branch: branch?.data?.name || printingSelector.defaults.branch,
                                    address: branch?.data?.address || printingSelector.defaults.address,
                                    service: printingSelector.defaults.service,
                                    subtext: printingSelector.defaults.subtext,
                                    contact: branch?.data?.contact || printingSelector.defaults.contact,
                                    customer: {
                                        name: paymentSelector.customer.name,
                                        address: paymentSelector.customer.address
                                    },
                                    cashier: auth.name,
                                    transaction: code,
                                    items: dataSelector.cart?.map(item => {
                                        let total = amount(item.quantity) * amount(item.price)
                                        let less = total * amount(summary.rate)
                                        return {
                                            product: `${item.product_name} (${formatVariant(item.variant_serial, item.variant_model, item.variant_brand)})`,
                                            quantity: item.quantity,
                                            price: item.price,
                                            item: item.id,
                                            total: total,
                                            less: amount(less) + amount(item.markdown),
                                        }
                                    }),
                                    discount: {
                                        rate: summary.rate * 100,
                                        amount: amount(summary.discount) + amount(summary.markdown)
                                    },
                                    total: summary.net,
                                    cash: credit > 0 ? partial : tended,
                                    change: change,
                                    credit: credit
                                }
                                localStorage.setItem("rcpt", JSON.stringify(printdata))
                                window.open(`/#/print/receipt/${code}${moment(new Date()).format("MMDDYYYYHHmmss")}`, '_blank')
                                toast.showCreate("Transaction successfully completed.")
                                // onCompleted()
                            }
                        })
                        .catch(err => {
                            console.error(err)
                            setProcessing(false)
                        })
                }
            })
            .catch(err => {
                console.error(err)
                setProcessing(false)
            })
    }

    const mockPrint = () => {
        localStorage.setItem("rcpt", JSON.stringify(printingSelector.test))
        window.open(`/#/print/receipt/TEST-0000001-${moment(new Date()).format("MMDDYYYYHHmmss")}`, '_blank')
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
                className={`fixed left-16 lg:left-56 top-12 lg:top-24 mt-2 h-full w-full bg-gradient-to-r from-[#00000070] via-[#00000070] to-[#00000040] z-10 flex items-start justify-end`}
            >
                <Transition.Child
                    enter="transition ease-in-out duration-500 transform"
                    enterFrom="translate-y-full"
                    enterTo="translate-y-0"
                    leave="transition ease-in-out duration-500 transform"
                    leaveFrom="translate-y-0"
                    leaveTo="translate-y-full"
                    className="flex flex-col gap-2 bg-white px-3 w-full h-full text-lg mt-1 pr-20 lg:pr-60 pb-48"
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
                        fontsize="lg"
                    />
                    <div className="flex flex-col">
                        <div className="flex justify-between items-center p-3 border-t border-t-gray-400 cursor-pointer" onClick={() => toggleCustomer()}>
                            <span>Payor:</span>
                            <span className={`ml-auto font-bold ${paymentSelector.customer?.name ? "text-orange-500" : ""}`}>
                                {paymentSelector.customer?.name ? paymentSelector.customer?.name : "Not selected"}
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-3 border-t border-t-gray-400">
                            <span>Order Total ({dataSelector?.cart?.length} Item/s):</span>
                            <span className="ml-auto text-gray-800">
                                {currency(summary?.total)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center px-3 pt-1 pb-3 text-sm text-gray-600">
                            <span>Value Added Tax:</span>
                            <span className="ml-auto text-gray-600">
                                {currency(summary.vat)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-3 border-t border-t-gray-400">
                            <span>Quantity Discount:</span>
                            <span className="ml-auto text-gray-800">
                                {currency(summary.markdown)}
                            </span>
                        </div>
                        <div className={`${isYes(config?.shownetdiscount) ? "flex" : "hidden"} justify-between items-center p-3 border-t border-t-gray-400 cursor-pointer`} onClick={() => toggleDiscount()}>
                            <span>Net Discount ({currency(summary.rate * 100).replace("0.00", "")}%):</span>
                            <span className="ml-auto text-gray-800">
                                {currency(summary.discount)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-3 border-t border-t-gray-400">
                            <span>Net Amount:</span>
                            <span className="ml-auto text-orange-500 font-bold">
                                {currency(summary.net)}
                            </span>
                        </div>
                        <div className="flex flex-col py-1 pl-3 border-t border-t-gray-400">
                            <div className="flex justify-between items-center py-2 cursor-pointer" onClick={() => togglePayments()}>
                                <span>Payment Options:</span>
                                <span className="ml-auto text-orange-500 font-bold">
                                    <ChevronRightIcon className="w-5 h-5" />
                                </span>
                            </div>
                            <div className={`${paymentSelector.paid?.length ? "flex" : "hidden"} flex-col w-full gap-1 py-2`}>
                                {
                                    paymentSelector?.paid?.map((pay, index) => (
                                        <div key={index} className="flex justify-between items-center pl-5 pr-3 py-1 text-sm" onClick={() => removePayment(pay.id)}>
                                            <span className="w-1/4 flex-none">
                                                {
                                                    pay.type === "SALES"
                                                        ? pay.method
                                                        : pay.type
                                                }
                                            </span>
                                            <span className={pay.type === "SALES" ? "" : "hidden"}>
                                                {pay.refcode ? ` #${pay.refcode}` : ""}
                                            </span>
                                            <span className={pay.type === "CREDIT" ? "flex gap-5" : "hidden"}>
                                                <span>{paymentSelector.customer.name}</span>
                                            </span>
                                            <span className="ml-auto text-gray-800">
                                                {pay.type === "SALES" ? currency(pay.amount) : currency(pay.credit)}
                                            </span>
                                        </div>
                                    ))
                                }
                                {
                                    (paymentSelector.method === "CREDIT") ? (
                                        <div className="flex justify-between items-center pl-5 pr-3 py-1 text-sm" onClick={() => removePayment(paymentSelector?.paid[0]?.id)}>
                                            <span className="w-1/4 flex-none flex items-center gap-2">
                                                {paymentSelector?.paid[0]?.method}
                                                <span className="bg-gray-300 px-2 py-0.5 rounded-md">
                                                    PARTIAL
                                                </span>
                                            </span>
                                            <span className="flex gap-5 ">
                                                <span>{paymentSelector?.customer?.name}</span>
                                            </span>
                                            <span className="ml-auto text-gray-800">
                                                {currency(paymentSelector?.paid[0]?.amount)}
                                            </span>
                                        </div>
                                    ) : null
                                }
                                <div className={`${payment > 0 ? "flex" : "hidden"} justify-between items-center pl-5 pr-3 py-1 text-sm font-bold`}>
                                    <span className="w-full pt-3">Total Payment</span>
                                    <span className="w-1/3 text-right text-orange-500 border-t border-t-gray-400 pt-3">
                                        {currency(payment)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col lg:flex-row border-t border-t-gray-400">
                            <div className="flex flex-col py-3 pl-3">
                                <div className="flex flex-col justify-end items-start">
                                    <div className="text-lg flex gap-2">
                                        Balance:
                                        <span className="text-orange-500 font-bold">
                                            {currency(balance)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col lg:flex-row gap-4 lg:ml-auto py-3">
                                <div className="flex flex-col px-3 lg:px-0 lg:justify-end lg:items-end">
                                    <div className="text-lg flex gap-2">
                                        Tended Cash:
                                        <span className="text-orange-500 font-bold">
                                            {currency(tended)}
                                        </span>
                                    </div>
                                    <div className="flex gap-2 text-sm">
                                        Change:
                                        <span className="text-orange-500 font-bold">
                                            {currency(change)}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    className="button-link text-lg bg-gradient-to-b from-orange-400 via-orange-600 to-orange-600 px-7 disabled:from-gray-400 disabled:via-gray-600 disabled:to-gray-600"
                                    disabled={isPaid || processing}
                                    onClick={() => processTransaction()}
                                >
                                    {processing ? "Processing..." : "Process Transaction"}
                                </button>
                                {
                                    isDev(auth) || isAdmin(auth) ? (
                                        <button className="button-link" onClick={() => mockPrint()}>Test Print</button>
                                    ) : null
                                }
                            </div>
                        </div>
                    </div>
                </Transition.Child>
            </Transition>
        </>
    )
}

export default BrowserCheckout
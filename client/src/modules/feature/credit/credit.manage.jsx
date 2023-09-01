import { ArrowLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { longDate, sqlTimestamp } from "../../../utilities/functions/datetime.functions"
import { amount, currency } from "../../../utilities/functions/number.funtions"
import { eitherIs } from "../../../utilities/functions/string.functions"
import useAuth from "../../../utilities/hooks/useAuth"
import useToast from "../../../utilities/hooks/useToast"
import PaymentBrowser from "../payment/payment.browser"
import { removePaymentPaid, resetPaymentPaid, resetPaymentTransaction, setPaymentBalance, setPaymentEnableCredit, setPaymentSettlement, showPaymentManager } from "../payment/payment.reducer"
import { resetCreditManager, setCreditNotifier } from "./credit.reducer"
import { useSqlSettleCreditMutation } from "./credit.services"

const CreditManage = () => {
    const auth = useAuth()
    const toast = useToast()
    const dataSelector = useSelector(state => state.credit)
    const paymentSelector = useSelector(state => state.payment)
    const dispatch = useDispatch()

    const [balance, setBalance] = useState(0)
    const [tended, setTended] = useState(0)
    const [change, setChange] = useState(0)
    const [payment, setPayment] = useState(0)
    const [mounted, setMounted] = useState(false)

    // const [createCredit] = useCreateCreditMutation()
    const [sqlSettleCredit] = useSqlSettleCreditMutation()

    useEffect(() => {
        if (dataSelector.manager) {
            setMounted(true)
            setPayment(0)
            setTended(0)
            setChange(0)
        }
    }, [dataSelector.manager])

    useEffect(() => {
        if (mounted) {
            return () => {
                dispatch(resetPaymentPaid())
            }
        }
    }, [mounted])

    useEffect(() => {
        const instantiate = async () => {
            if (dataSelector.item.code) {
                await transactionCredit({ code: dataSelector.item.code })
                    .unwrap()
                    .then(res => {
                        if (res.success) {
                            setTransaction(res.arrayResult)
                        }
                    })
                    .catch(err => console.error(err))
            }
        }

        instantiate()
    }, [dataSelector.item.code])

    useEffect(() => {
        let outstand = amount(dataSelector.item.value) - amount(dataSelector.item.paid)
        if (outstand > 0) {
            let totalpaid = paymentSelector?.paid?.reduce((prev, curr) => prev + amount(curr.amount), 0)
            let totalnoncash = paymentSelector?.paid?.reduce((prev, curr) => prev + (curr.method !== "CASH" ? amount(curr.amount) : 0), 0)
            let totalcash = paymentSelector?.paid?.reduce((prev, curr) => prev + (curr.method === "CASH" ? amount(curr.amount) : 0), 0)
            let totalpartial = paymentSelector?.paid?.reduce((prev, curr) => prev + (curr.type === "CREDIT" ? amount(curr.partial) : 0), 0)
            let total = amount(outstand)
            let settled = amount(total) - amount(totalnoncash)
            let change = totalcash - settled
            let balance = amount(total) - amount(totalpaid) - amount(totalpartial)
            let totalpayment = totalpaid + amount(totalpartial)
            setTended(totalcash || 0)
            setChange(change < 0 ? 0 : change)
            setBalance(balance < 0 ? 0 : balance)
            setPayment(totalpayment)
        }
    }, [paymentSelector?.paid, dataSelector.item.value, dataSelector.item.paid, paymentSelector?.less])

    const onCompleted = () => {
        dispatch(setCreditNotifier(true))
        dispatch(resetPaymentTransaction())
        dispatch(resetCreditManager())
    }

    const processOldTransaction = async () => {
        if (balance !== 0) {
            toast.showWarning("Please settle the checkout balance.")
            return
        }
        let inclusion = ["CASH", "CHEQUE", "GCASH", "BANK TRANSFER"]
        let payment = paymentSelector.paid.reduce((prev, curr) => prev + amount(eitherIs(curr.method, inclusion) ? curr.amount : 0), 0)
        let waived = paymentSelector.paid.reduce((prev, curr) => prev + amount(curr.method === "WAIVE" ? curr.amount : 0), 0)
        let outstand = paymentSelector.paid.reduce((prev, curr) => prev + amount(curr.method === "BALANCE" ? curr.amount : 0), 0)
        let data = {
            credit: {
                outstand: amount(outstand),
                status: outstand > 0 ? "PARTIAL" : "PAID",
                payment: amount(payment),
                waived: amount(waived),
                settledon: sqlTimestamp(),
                id: dataSelector.item.id,
            },
            payment: paymentSelector.paid
                ?.filter(f => eitherIs(f.method, inclusion))
                ?.map(pay => {
                    return {
                        code: dataSelector.item.code,
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
            customer: {
                id: dataSelector.item.creditor
            }
        }
        if (outstand > 0) {
            data = {
                ...data,
                outstanding: {
                    code: dataSelector.item.code,
                    creditor: dataSelector.item.creditor,
                    total: amount(dataSelector.item.total),
                    partial: amount(payment),
                    balance: amount(outstand),
                    outstand: amount(outstand),
                    status: "ON-GOING",
                    account: auth.id
                }
            }
        }

        await sqlSettleCredit(data)
            .unwrap()
            .then(res => {
                if (res.success) {
                    toast.showCreate("Credit settlement successfully completed.")
                    onCompleted()
                }
            })
            .catch(err => console.error(err))
    }

    const processTransaction = async () => {
        let inclusion = ["CASH", "CHEQUE", "GCASH", "BANK TRANSFER"]
        let payment = paymentSelector.paid.reduce((prev, curr) => prev + amount(eitherIs(curr.method, inclusion) ? curr.amount : 0), 0)
        if (payment === 0) {
            toast.showWarning("Please enter a payment amount.")
            return
        }
        let data = {
            payment: paymentSelector.paid
                ?.filter(f => eitherIs(f.method, inclusion))
                ?.map(pay => {
                    return {
                        customer: dataSelector.item.creditor,
                        type: pay.type,
                        method: pay.method,
                        total: amount(pay.amount),
                        amount: amount(pay.amount),
                        refcode: pay.refcode,
                        refdate: pay.method === "CHEQUE" ? pay.refdate : undefined,
                        refstat: pay.refstat,
                        account: auth.id,
                        store: auth.store
                    }
                }),
            customer: {
                id: dataSelector.item.creditor
            }
        }

        await sqlSettleCredit(data)
            .unwrap()
            .then(res => {
                if (res.success) {
                    toast.showCreate("Credit settlement successfully completed.")
                    onCompleted()
                }
            })
            .catch(err => console.error(err))
    }

    const togglePayments = () => {
        if (balance > 0) {
            dispatch(setPaymentBalance(balance))
            dispatch(setPaymentSettlement(true))
            dispatch(setPaymentEnableCredit(false))
            dispatch(showPaymentManager())
            return
        }
        toast.showWarning("Cannot add payment option when balance is zero.")
    }

    const removePayment = (id) => {
        if (window.confirm("Do you wish to delete this payment option?")) {
            dispatch(removePaymentPaid(id))
        }
    }

    const toggleOffCreditManager = () => {
        dispatch(resetCreditManager())
    }

    return (
        <div className="w-full">
            <div className="pl-1 pt-3 text-secondary-500 font-bold text-lg flex items-center gap-4">
                <ArrowLeftIcon
                    className="w-6 h-6 cursor-pointer"
                    onClick={() => toggleOffCreditManager()}
                />
                <span>Credit Settlement</span>
            </div>
            <div className="flex flex-col mt-10">
                <div className="flex justify-between items-center p-3 border-t border-t-gray-400">
                    <span>Customer: </span>
                    <span className="ml-auto text-gray-800 font-bold">
                        {dataSelector.item.customer_name}
                    </span>
                </div>
                <div className="flex justify-between items-center p-3 border-t border-t-gray-400">
                    <span>Total Credit: </span>
                    <span className="ml-auto text-gray-800">
                        {currency(dataSelector.item.value)}
                    </span>
                </div>
                <div className="flex justify-between items-center p-3 border-t border-t-gray-400">
                    <span>Total Settled:</span>
                    <span className="ml-auto text-gray-800">
                        {currency(dataSelector.item.paid)}
                    </span>
                </div>
                <div className="flex justify-between items-center p-3 border-t border-t-gray-400">
                    <span>Outstanding Balance:</span>
                    <span className="ml-auto font-bold">
                        {currency(amount(dataSelector.item.value) - amount(dataSelector.item.paid))}
                    </span>
                </div>
                <div className="flex flex-col py-1 pl-3 border-t border-t-gray-400">
                    <div className="flex justify-between items-center py-2 cursor-pointer" onClick={() => togglePayments()}>
                        <span>Payment Options:</span>
                        <span className="ml-auto text-secondary-500 font-bold">
                            <ChevronRightIcon className="w-5 h-5" />
                        </span>
                    </div>
                    <div className={`${paymentSelector.paid?.length ? "flex" : "hidden"} flex-col w-full gap-1 py-2`}>
                        {
                            paymentSelector?.paid?.map((pay, index) => (
                                <div key={index} className="flex justify-between items-center pl-5 pr-3 py-1 text-xs" onClick={() => removePayment(pay.id)}>
                                    <span className="w-1/4 flex-none">
                                        {pay.method}
                                    </span>
                                    <span className="flex gap-3">
                                        <span>
                                            {pay.refcode
                                                ? ` REF#${pay.refcode}`
                                                : ""}
                                        </span>
                                        <span>
                                            {pay.method === "CHEQUE"
                                                ? ` Claim before ${longDate(pay.refdate)}`
                                                : ""}
                                        </span>
                                    </span>
                                    <span className="ml-auto text-gray-800">
                                        {currency(pay.amount)}
                                    </span>
                                </div>
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
                                <span className="text-orange-500 font-bold">
                                    {currency(balance)}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4 ml-auto py-3">
                        <div className="flex flex-col justify-end items-end">
                            <div className="text-sm flex gap-2">
                                Tended Cash:
                                <span className="text-orange-500 font-bold">
                                    {currency(tended)}
                                </span>
                            </div>
                            <div className="flex gap-2 text-xs">
                                Change:
                                <span className="text-orange-500 font-bold">
                                    {currency(change)}
                                </span>
                            </div>
                        </div>
                        <button
                            className="button-link text-base bg-gradient-to-b from-blue-400 via-blue-600 to-blue-600 px-7 disabled:from-gray-400 disabled:via-gray-600 disabled:to-gray-600"
                            onClick={() => processTransaction()}
                        >
                            Process Transaction
                        </button>
                    </div>
                </div>
            </div>
            <PaymentBrowser />
        </div>
    )
}

export default CreditManage
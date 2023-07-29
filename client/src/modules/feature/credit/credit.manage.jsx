import { ArrowLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { longDate, sqlDate, sqlTimestamp } from "../../../utilities/functions/datetime.functions"
import { NumFn, amount, currency } from "../../../utilities/functions/number.funtions"
import { eitherIs, isEmpty } from "../../../utilities/functions/string.functions"
import useAuth from "../../../utilities/hooks/useAuth"
import useToast from "../../../utilities/hooks/useToast"
import useYup from "../../../utilities/hooks/useYup"
import DataRecords from "../../../utilities/interface/datastack/data.records"
import PaymentBrowser from "../payment/payment.browser"
import { removePaymentPaid, resetPaymentTransaction, setPaymentBalance, setPaymentEnableCredit, setPaymentSettlement, showPaymentManager } from "../payment/payment.reducer"
import { resetCreditManager, setCreditNotifier } from "./credit.reducer"
import { useByTransactionCreditMutation, useCreateCreditMutation, useSqlSettleCreditMutation } from "./credit.services"

const CreditManage = () => {
    const auth = useAuth()
    const dataSelector = useSelector(state => state.credit)
    const paymentSelector = useSelector(state => state.payment)
    const dispatch = useDispatch()
    const [instantiated, setInstantiated] = useState(false)
    const [transaction, setTransaction] = useState()
    const [records, setrecords] = useState()
    const [values, setValues] = useState()
    const { yup } = useYup()
    const toast = useToast()

    const [balance, setBalance] = useState(0)
    const [tended, setTended] = useState(0)
    const [change, setChange] = useState(0)
    const [payment, setPayment] = useState(0)
    const columns = {
        items: [
            { name: 'Partial', stack: true, sort: 'partial', size: 130 },
            { name: 'Balance', stack: true, sort: 'balance', size: 130 },
            { name: 'Payment', stack: true, sort: 'payment', size: 130 },
            { name: 'Waived', stack: true, sort: 'waived', size: 120 },
            { name: 'Returned', stack: true, sort: 'returned', size: 120 },
            { name: 'Reimbursed', stack: true, sort: 'reimburse', size: 120 },
            { name: 'Status', stack: false, sort: 'status', size: 100 },
            { name: 'Settled On', stack: false, sort: 'status', size: 150 },
        ]
    }

    const [createCredit] = useCreateCreditMutation()
    const [transactionCredit] = useByTransactionCreditMutation()
    const [sqlSettleCredit] = useSqlSettleCreditMutation()

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
            setInstantiated(true)
        }

        instantiate()
    }, [dataSelector.item.code])

    const init = (value, initial = "") => {
        if (!isEmpty(value)) {
            return value
        }
        return initial
    }

    useEffect(() => {
        if (instantiated) {
            let item = dataSelector.item
            setValues({
                customer_name: init(item.customer_name),
                code: init(item.code),
                name: init(item.name),
                total: init(NumFn.currency(item.total)),
                partial: init(NumFn.currency(item.partial)),
                outstand: init(item.outstand),
            })
        }
    }, [instantiated])

    const items = (item) => {
        return [
            { value: currency(item.partial) },
            { value: currency(item.balance) },
            { value: currency(item.payment) },
            { value: currency(item.waived) },
            { value: currency(item.returned) },
            { value: currency(item.reimburse) },
            { value: item.status },
            { value: sqlDate(item.settledon, "") },
        ]
    }

    useEffect(() => {
        if (transaction?.length) {
            let data = transaction
            setrecords(data?.map((item, i) => {
                return {
                    key: item.id,
                    items: items(item),
                    ondoubleclick: () => { },
                }
            }))
        }
    }, [transaction])

    useEffect(() => {
        if (dataSelector.item.balance > 0) {
            let totalpaid = paymentSelector?.paid?.reduce((prev, curr) => prev + amount(curr.amount), 0)
            let totalnoncash = paymentSelector?.paid?.reduce((prev, curr) => prev + (curr.method !== "CASH" ? amount(curr.amount) : 0), 0)
            let totalcash = paymentSelector?.paid?.reduce((prev, curr) => prev + (curr.method === "CASH" ? amount(curr.amount) : 0), 0)
            let totalpartial = paymentSelector?.paid?.reduce((prev, curr) => prev + (curr.type === "CREDIT" ? amount(curr.partial) : 0), 0)
            let total = amount(dataSelector.item.outstand)
            let settled = amount(total) - amount(totalnoncash)
            let change = totalcash - settled
            let balance = amount(total) - amount(totalpaid) - amount(totalpartial)
            let totalpayment = totalpaid + amount(totalpartial)
            setTended(totalcash || 0)
            setChange(change < 0 ? 0 : change)
            setBalance(balance < 0 ? 0 : balance)
            setPayment(totalpayment)
        }
    }, [paymentSelector?.paid, dataSelector.item.balance, paymentSelector?.less])

    const onSchema = yup.object().shape({
        name: yup
            .string()
            .required('Field is required.'),
    })

    const onCompleted = () => {
        dispatch(setCreditNotifier(true))
        dispatch(resetPaymentTransaction())
        dispatch(resetCreditManager())
    }

    const processTransaction = async () => {
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
            <DataRecords
                columns={columns}
                records={records}
                itemsperpage={20}
                page={1}
            />
            <div className="flex flex-col">
                <div className="flex justify-between items-center p-3 border-t border-t-gray-400">
                    <span>Creditor: {dataSelector.item.customer_name}</span>
                    <span className="ml-auto text-gray-800">
                        {dataSelector.item.code}
                    </span>
                </div>
                <div className="flex justify-between items-center p-3 border-t border-t-gray-400">
                    <span>Total Purchase:</span>
                    <span className="ml-auto text-gray-800">
                        {currency(dataSelector.item.total)}
                    </span>
                </div>
                <div className="flex justify-between items-center p-3 border-t border-t-gray-400">
                    <span>Outstanding Balance:</span>
                    <span className="ml-auto text-secondary-500 font-bold">
                        {currency(dataSelector.item.outstand)}
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
            <PaymentBrowser />
        </div>
    )
}

export default CreditManage
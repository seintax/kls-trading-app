import { BanknotesIcon, CloudArrowUpIcon, DocumentChartBarIcon, DocumentCheckIcon, DocumentTextIcon, MagnifyingGlassIcon, PrinterIcon, ReceiptRefundIcon, ShoppingCartIcon, TrashIcon, UserCircleIcon, UserPlusIcon } from "@heroicons/react/24/outline"
import moment from "moment"
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useLocation } from "react-router-dom"
import { FormatOptionsNoLabel } from "../../../utilities/functions/array.functions"
import { sqlDate } from "../../../utilities/functions/datetime.functions"
import { amount, currency } from "../../../utilities/functions/number.funtions"
import { StrFn, formatVariant, isAdmin, isDev, isEmpty } from "../../../utilities/functions/string.functions"
import useAuth from "../../../utilities/hooks/useAuth"
import { useDebounce } from "../../../utilities/hooks/useDebounce"
import useToast from "../../../utilities/hooks/useToast"
import { setLocationPath } from "../../../utilities/redux/slices/locateSlice"
import { useDistinctBranchMutation } from "../../library/branch/branch.services"
import { setCategoryData } from "../../library/category/category.reducer"
import { useFetchAllCategoryMutation } from "../../library/category/category.services"
import { resetReportCashier, setReportName, showReportCashier } from "../../system/reports/reports.reducer"
import { reloadBrowserDraftCart, removeBrowserCart, resetBrowserCart, resetBrowserManager, resetBrowserTransaction, setBrowserCategory, setBrowserSearch } from "../browser/browser.reducer"
import { useCreateBrowserBySqlTransactionMutation } from "../browser/browser.services"
import CasheringLedger from "../cashering/cashering.ledger"
import CasheringReceipts from "../cashering/cashering.receipts"
import { resetTransactionReceipts, showTransactionReceipts } from "../cashering/cashering.reducer"
import CasheringReimburse from "../cashering/cashering.reimburse"
import CasheringReturn from "../cashering/cashering.return"
import { useByAllCountTransactionMutation, useByMaxAccountTransactionMutation } from "../cashering/cashering.services"
import { resetChequeShown, setChequeDisplay, setChequeNotifier, setChequeShown } from "../cheque/cheque.reducer"
import { resetCreditShown, setCreditDisplay, setCreditNotifier, setCreditShown } from "../credit/credit.reducer"
import { resetInventoryShown, setInventoryDisplay, setInventoryNotifier, setInventoryShown } from "../inventory/inventory.reducer"
import PaymentBrowser from "../payment/payment.browser"
import PaymentCustomer from "../payment/payment.customer"
import { removePaymentPaid, resetPaymentTransaction, setPaymentBalance, setPaymentEnableCredit, setPaymentSettlement, showPaymentManager, showPaymentPayor } from "../payment/payment.reducer"
import CasheringComplexBrowse from "./cashering.complex.browse"
import CasheringComplexCheque from "./cashering.complex.cheque"
import CasheringComplexCredits from "./cashering.complex.credits"
import CasheringComplexInventory from "./cashering.complex.inventory"
import CasheringComplexVariant from "./cashering.complex.variant"
import CasheringComplexReport from "./cashering.complext.report"

const CasheringComplexIndex = () => {
    const auth = useAuth()
    const toast = useToast()
    const [processing, setProcessing] = useState(false)
    const categorySelector = useSelector(state => state.category)
    const browserSelector = useSelector(state => state.browser)
    const paymentSelector = useSelector(state => state.payment)
    const printingSelector = useSelector(state => state.printing)
    const transactionSelector = useSelector(state => state.transaction)
    const [isPaid, setIsPaid] = useState(false)
    const location = useLocation()
    const dispatch = useDispatch()
    const [category, setCategory] = useState("")
    const [search, setSearch] = useState("")
    const debounceSearch = useDebounce(search, 500)
    const [count, setCount] = useState(1)
    const [branch, setBranch] = useState()
    const [balance, setBalance] = useState(0)
    const [cascade, setCascade] = useState(false)
    const [tended, setTended] = useState(0)
    const [change, setChange] = useState(0)
    const [payment, setPayment] = useState(0)
    const [summary, setSummary] = useState({
        total: 0,
        vat: 0,
        discount: 0,
        rate: 0,
        net: 0,
    })

    useEffect(() => {
        dispatch(setLocationPath(location?.pathname?.replace("complex-", "")))
    }, [location])

    const [libCategories, setLibCategories] = useState()

    const [distinctBranch] = useDistinctBranchMutation()
    const [countTransaction] = useByAllCountTransactionMutation()
    const [allCategory] = useFetchAllCategoryMutation()
    const [maxAccountTransaction] = useByMaxAccountTransactionMutation()
    const [createTransaction] = useCreateBrowserBySqlTransactionMutation()
    const [mounted, setMounted] = useState(false)

    useEffect(() => { setMounted(true) }, [])

    useEffect(() => {
        if (mounted) {
            let draft = localStorage.getItem("draft")
            if (!isEmpty(draft)) {
                if (confirm("A cart has been retrieved after an unexpected page crash or reload. Do you wish to load the cached data?")) {
                    let draftCart = JSON.parse(draft)
                    dispatch(reloadBrowserDraftCart(draftCart))
                }
            }
            return () => {
                dispatch(resetInventoryShown())
                dispatch(resetBrowserManager())
                dispatch(resetReportCashier())
                dispatch(resetChequeShown())
                dispatch(resetCreditShown())
                dispatch(resetTransactionReceipts())
            }
        }
    }, [mounted])

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

            if (categorySelector.data.length === 0) {
                await allCategory()
                    .unwrap()
                    .then(res => {
                        if (res.success) {
                            dispatch(setCategoryData(res?.arrayResult))
                            setCategory(res?.arrayResult[0].name)
                            dispatch(setBrowserCategory(res?.arrayResult[0].name))
                            setLibCategories(FormatOptionsNoLabel(res?.arrayResult, "name", "name"))
                        }
                    })
                    .catch(err => console.error(err))
            }
            if (categorySelector.data.length > 0) {
                setLibCategories(FormatOptionsNoLabel(categorySelector.data, "name", "name"))
                setCategory(categorySelector.data[0].name)
                dispatch(setBrowserCategory(categorySelector.data[0].name))
            }
            return
        }

        instantiate()
    }, [])

    useEffect(() => {
        const instantiate = async () => {
            await countTransaction({ account: auth.id })
                .unwrap()
                .then(res => {
                    if (res.success) {
                        setCount(amount(res.distinctResult.data.count) + 1 || 1)
                    }
                })
                .catch(err => console.error(err))
        }

        if (isEmpty(browserSelector.cart.length)) {
            instantiate()
            setCascade(false)
        }
    }, [browserSelector.cart])

    useEffect(() => {
        dispatch(setBrowserSearch(debounceSearch))
    }, [debounceSearch])

    const onChange = (e) => {
        setSearch(e.target.value)
    }

    const onCategory = (e) => {
        setCategory(e.target.value)
        dispatch(setBrowserCategory(e.target.value))
    }

    const toggleDiscard = () => {
        if (isPaid) return
        if (processing) return
        if (!browserSelector.cart.length) return
        if (window.confirm("Do you wish to discard this transaction?")) {
            dispatch(resetBrowserCart())
        }
    }

    const toggleCustomer = () => {
        if (isPaid) return
        dispatch(showPaymentPayor())
    }

    const togglePayments = () => {
        if (isPaid) return
        if (!browserSelector?.cart?.length) return
        if (balance > 0) {
            dispatch(setPaymentBalance(balance))
            dispatch(setPaymentSettlement(false))
            dispatch(setPaymentEnableCredit(true))
            dispatch(showPaymentManager())
            return
        }
        toast.showWarning("Cannot add payment option when balance is satisfied.")
    }

    const removePayment = (id) => {
        if (isPaid) return
        if (processing) return
        if (window.confirm("Do you wish to delete this payment option?")) {
            dispatch(removePaymentPaid(id))
        }
    }

    const removeItem = (item) => {
        if (isPaid) return
        if (processing) return
        if (window.confirm("Do you wish to remove this from the transaction?")) {
            dispatch(removeBrowserCart(item))
        }
    }

    const toggleViewInventory = () => {
        dispatch(setInventoryDisplay(false))
        dispatch(setInventoryShown())
    }

    const toggleViewReceipts = () => {
        if (transactionSelector.receipts) {
            dispatch(resetTransactionReceipts())
            return
        }
        dispatch(showTransactionReceipts())
    }

    const toggleViewCheque = () => {
        dispatch(setChequeDisplay(false))
        dispatch(setChequeShown())
    }

    const toggleViewCredits = () => {
        dispatch(setCreditDisplay(false))
        dispatch(setCreditShown())
    }

    const toggleViewReports = () => {
        dispatch(setReportName("Cashier Summary"))
        dispatch(showReportCashier())
    }

    useEffect(() => {
        if (browserSelector?.cart) {
            let total = browserSelector?.cart?.reduce((prev, curr) => prev + (amount(curr.price) * amount(curr.quantity)), 0)
            let markdown = browserSelector?.cart?.reduce((prev, curr) => prev + amount(curr.markdown), 0)
            setSummary(prev => ({
                ...prev,
                total: total,
                markdown: markdown,
                vat: amount(total) * 0.12,
                net: amount(total) - amount(prev.discount) - amount(markdown)
            }))
        }
    }, [browserSelector?.cart])

    useEffect(() => {
        if (summary.total > 0) {
            let totalpaid = paymentSelector?.paid?.reduce((prev, curr) => prev + amount(curr.amount), 0)
            let totalnoncash = paymentSelector?.paid?.reduce((prev, curr) => prev + (curr.method !== "CASH" ? amount(curr.amount) : 0), 0)
            let totalcredit = paymentSelector?.paid?.reduce((prev, curr) => prev + (curr.type === "CREDIT" ? amount(curr.credit) : 0), 0)
            let totalcash = paymentSelector?.paid?.reduce((prev, curr) => prev + (curr.method === "CASH" ? amount(curr.amount) : 0), 0)
            let totalpartial = paymentSelector?.paid?.reduce((prev, curr) => prev + (curr.type === "CREDIT" ? amount(curr.amount) : 0), 0)
            let total = amount(summary.total) - amount(summary.discount) - amount(summary.markdown)
            let settled = amount(total) - amount(totalnoncash)
            let change = totalcash - settled
            let balance = amount(total) - amount(totalpaid) - amount(totalpartial) - amount(totalcredit)
            let totalpayment = amount(totalpaid) + amount(totalcredit)
            setTended(totalcash || 0)
            setChange(change < 0 ? 0 : change)
            setBalance(balance < 0 ? 0 : balance)
            setPayment(totalpayment)
        }
    }, [paymentSelector?.paid, summary.total, summary.discount, paymentSelector?.less])

    useEffect(() => {
        if (paymentSelector?.less?.discount) {
            if (paymentSelector?.less?.option === "CUSTOM") {
                setSummary(prev => ({
                    ...prev,
                    rate: (amount(paymentSelector?.less?.discount) / amount(summary.total)),
                    discount: paymentSelector?.less?.discount,
                    net: amount(summary.total) - amount(paymentSelector?.less?.discount) - amount(summary.markdown)
                }))
                return
            }
            let discount = amount(summary.total) * amount(paymentSelector?.less?.rate)
            setSummary(prev => ({
                ...prev,
                discount: discount,
                rate: paymentSelector?.less?.rate,
                net: amount(summary.total) - discount - amount(summary.markdown)
            }))
        }
    }, [paymentSelector?.less, summary.total])

    const destructCode = (maxcode) => {
        let tags = maxcode.split("-")
        return String(Number(tags[2]) + 1)
    }

    const onCompleted = () => {
        setIsPaid(false)
        dispatch(resetBrowserTransaction())
        dispatch(resetPaymentTransaction())
        setCascade(false)
        localStorage.removeItem("printcompleted")
    }

    useEffect(() => {
        if (isPaid) {
            const interval = setInterval(() => {
                let printcompleted = localStorage.getItem("printcompleted")
                if (!isEmpty(printcompleted)) {
                    onCompleted()
                }
            }, 1000)
            return () => clearInterval(interval)
        }
    }, [isPaid])

    const processTransaction = async () => {
        if (!browserSelector?.cart?.length) return
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
        await maxAccountTransaction({ account: auth.id })
            .unwrap()
            .then(async (res) => {
                if (res.success) {
                    let datetag = moment(new Date()).format("YYYYMMDD")
                    let usertag = StrFn.formatWithZeros(auth.id, 5)
                    let codetag = isEmpty(res.distinctResult?.data?.max)
                        ? "000001"
                        : StrFn.formatWithZeros(destructCode(res.distinctResult?.data?.max), 6)
                    let code = `${datetag}-${usertag}-${codetag}`
                    let partial = 0
                    if (paymentSelector.paid?.filter(f => f.type === "CREDIT")?.length) {
                        partial = paymentSelector.paid
                            ?.filter(f => f.type === "CREDIT")?.reduce((prev, curr) => prev + (curr.amount || 0), 0)
                    }
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
                            partial: partial,
                            date: sqlDate()
                        },
                        dispensing: browserSelector.cart?.map(item => {
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
                                taxrated: 0.12,
                                store: auth.store,
                            }
                        }),
                        payment: paymentSelector.paid
                            ?.filter(f => f.type === "SALES")
                            ?.map(pay => {
                                return {
                                    code: code,
                                    customer: paymentSelector.customer.id,
                                    type: pay.type,
                                    method: pay.method,
                                    total: pay.method === "CASH" ? amount(pay.amount) - change : amount(pay.amount),
                                    amount: pay.method === "CASH" ? amount(pay.amount) - change : amount(pay.amount),
                                    refcode: pay.refcode,
                                    refdate: pay.method === "CHEQUE" ? pay.refdate : undefined,
                                    refstat: pay.refstat,
                                    account: auth.id,
                                    store: auth.store
                                }
                            }),
                        credit: paymentSelector.paid
                            ?.filter(f => f.type === "CREDIT")
                            ?.map(cred => {
                                let payment = {
                                    code: code,
                                    customer: paymentSelector.customer.id,
                                    type: cred.type,
                                    method: cred.method,
                                    total: cred.method === "CASH" ? amount(cred.amount) - change : amount(cred.amount),
                                    amount: cred.method === "CASH" ? amount(cred.amount) - change : amount(cred.amount),
                                    refcode: cred.refcode,
                                    refdate: cred.method === "CHEQUE" ? cred.refdate : undefined,
                                    refstat: cred.refstat,
                                    account: auth.id,
                                    store: auth.store
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
                                    store: auth.store,
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
                                let cheque = paymentSelector.paid
                                    ?.filter(f => f.method === "CHEQUE")
                                    ?.reduce((prev, curr) => prev + amount(curr.amount), 0)
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
                                    items: browserSelector.cart?.map(item => {
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
                                    mode: paymentSelector.method,
                                    payment: paymentSelector?.paid?.reduce((prev, curr) => prev + amount(curr.amount), 0),
                                    partial: partial,
                                    change: change,
                                    credit: credit
                                }
                                if (credit > 0) dispatch(setCreditNotifier(true))
                                if (cheque > 0) dispatch(setChequeNotifier(true))
                                dispatch(setInventoryNotifier(true))
                                localStorage.setItem("rcpt", JSON.stringify(printdata))
                                window.open(`/#/print/receipt/${code}${moment(new Date()).format("MMDDYYYYHHmmss")}`, '_blank')
                                toast.showCreate("Transaction successfully completed.")
                                localStorage.removeItem("draft")
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
        <div id="no-print" className="flex flex-col w-full mb-[4rem] lg:mb-0 pb-0 lg:pb-[4rem] min-h-full relative">
            <div className="flex flex-col sticky top-0 lg:top-[-21px] bg-white">
                <div className="flex flex-col md:flex-row border border-secondary-500 py-3 px-3 items-center bg-[#4baf4f]">
                    <select
                        value={category}
                        onChange={onCategory}
                        className="w-full md:w-fit text-xs md:text-sm border-[#4baf4f] outline-none ring-0 focus:ring-0 focus:outline-none grow-1 bg-[#4baf4f] focus:border-[#4baf4f] focus:border-b-gray-200 text-white border border-b-gray-200 border border-b-gray-200"
                    >
                        {
                            libCategories?.map(item => (
                                <option key={item.value} value={item.value}>{item.key}</option>
                            ))
                        }
                    </select>
                    <div className="w-full flex items-center relative md:px-3">
                        <MagnifyingGlassIcon className="w-5 h-5 text-white hidden md:block absolute" />
                        <input
                            type="search"
                            value={search}
                            onChange={onChange}
                            placeholder="Search inventory item here"
                            className="w-full text-sm border-[#4baf4f] outline-none ring-0 focus:ring-0 focus:outline-none focus:border-[#4baf4f] focus:border-b-gray-200 grow-1 bg-[#4baf4f] text-white placeholder:text-white border border-b-gray-200 pl-6 lg:pl-8"
                        />
                    </div>
                    <div className="flex w-full md:w-fit justify-center gap-2">
                        <button
                            className="flex items-center justify-center mt-2 md:mt-0 p-2 md:p-3 w-12 shadow-md border border-grap-200 rounded-md hover:bg-[#3d9e40] flex-none disabled:bg-gray-300 disabled:text-gray-400"
                            onClick={() => toggleDiscard()}
                            disabled={processing || !browserSelector?.cart?.length}
                        >
                            <TrashIcon className="w-4 md:w-5 h-4 md:h-5 cursor-pointer text-white" />
                        </button>
                        <button
                            className="flex items-center justify-center mt-2 md:mt-0 p-2 md:p-3 w-12 shadow-md border border-grap-200 rounded-md hover:bg-[#3d9e40] flex-none disabled:bg-gray-300 disabled:text-gray-400"
                            onClick={() => toggleCustomer()}
                            disabled={processing}
                        >
                            <UserPlusIcon className="w-4 md:w-5 h-4 md:h-5 cursor-pointer text-white" />
                        </button>
                        <button
                            className="flex md:hidden items-center justify-center mt-2 md:mt-0 p-2 md:p-3 w-12 shadow-md border border-grap-200 rounded-md hover:bg-[#3d9e40] flex-none disabled:bg-gray-300 disabled:text-gray-400"
                            onClick={() => togglePayments()}
                            disabled={processing || !browserSelector?.cart?.length}
                        >
                            <BanknotesIcon className="w-4 md:w-5 h-4 md:h-5 cursor-pointer text-white" />
                        </button>
                        <button
                            className="flex md:hidden items-center justify-center mt-2 md:mt-0 p-2 md:p-3 w-12 shadow-md border border-grap-200 rounded-md hover:bg-[#3d9e40] flex-none disabled:bg-gray-300 disabled:text-gray-400"
                            onClick={() => processTransaction()}
                            disabled={isPaid || processing || !browserSelector?.cart?.length}
                        >
                            <CloudArrowUpIcon className="w-4 md:w-5 h-4 md:h-5 cursor-pointer text-white" />
                        </button>
                    </div>
                </div>
                <div className="flex flex-col items-center w-full bg-full border border-b border-b-gray-400 no-select relative">
                    <div className="flex flex-col-reverse md:flex-row w-full gap-3 lg:gap-0 lg:justify-between lg:items-center py-5">
                        <div className="text-sm lg:text-lg flex flex-row md:flex-col gap-2 justify-between md:justify-center px-5 w-full">
                            <div className="flex gap-2">
                                <span className="text-sm md:text-base">Ticket</span>
                                <span className="font-bold text-sm md:text-base">
                                    #{count}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex gap-2">
                                    <span className="text-sm md:text-base">Total:</span>
                                    <span className="font-bold text-sm md:text-base">
                                        {currency(browserSelector.cart?.reduce((prev, curr) => prev + curr.price, 0))}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <span className="text-xs">No. of Items:</span>
                                    <span className="text-sm">{browserSelector?.cart?.length}</span>
                                </div>
                            </div>
                        </div>
                        <div className="hidden md:flex gap-2 h-full justify-center px-5">
                            <button
                                className="flex items-center gap-2 text-white h-[30px] md:h-[35px] bg-[#4baf4f] hover:bg-[#3d9e40] px-3 rounded-md text-sm md:text-base disabled:bg-gray-300 disabled:text-gray-400"
                                onClick={() => togglePayments()}
                                disabled={processing || !browserSelector?.cart?.length}
                            >
                                <BanknotesIcon className="w-5 h-5" />
                                Payment
                            </button>

                            <button
                                className="flex items-center gap-2 text-white h-[30px] md:h-[35px] bg-[#4baf4f] hover:bg-[#3d9e40] px-3 rounded-md text-sm md:text-base disabled:bg-gray-300 disabled:text-gray-400"
                                onClick={() => processTransaction()}
                                disabled={isPaid || processing || !browserSelector?.cart?.length}
                            >
                                <CloudArrowUpIcon className="w-5 h-5" />
                                {processing ? "Processing" : "Save"}
                            </button>{
                                isDev(auth) || isAdmin(auth) ? (
                                    <button
                                        className="flex items-center gap-2 text-white h-[30px] md:h-[35px] bg-[#4baf4f] hover:bg-[#3d9e40] px-3 rounded-md text-sm md:text-base disabled:bg-gray-300 disabled:text-gray-400"
                                        onClick={() => mockPrint()}
                                        disabled={processing}
                                    >
                                        <PrinterIcon className="w-5 h-5" />
                                        Print
                                    </button>
                                ) : null
                            }
                        </div>
                    </div>
                    <div className={`${cascade ? "flex" : "hidden"} flex-col w-full px-5 py-5 gap-5`}>
                        {
                            browserSelector.cart?.map(item => (
                                <div key={item.id} className="flex flex-col md:flex-row justify-between text-sm md:text-base">
                                    <div className="flex flex-col">
                                        <span className="font-semibold">{item.product_name} x {item.quantity}</span>
                                        <span className="text-xs md:text-sm text-gray-500">{`${item.variant_serial || "-"}/${item.variant_model || "-"}/${item.variant_brand || "-"}`}</span>
                                    </div>
                                    <div className="flex font-semibold items-center justify-between md:justify-start gap-5">
                                        <span className="">
                                            {currency(item.price * item.quantity)}
                                        </span>
                                        <TrashIcon className="w-4 h-4 cursor-pointer" onClick={() => removeItem(item)} />
                                    </div>
                                </div>
                            ))
                        }
                        <div className="flex justify-between text-sm md:text-base">
                            <div className="flex flex-col">
                                <span>Discounts</span>
                            </div>
                            <div className="font-semibold pr-10">
                                {currency(browserSelector?.cart?.reduce((prev, curr) => prev + curr?.markdown, 0))}
                            </div>
                        </div>
                        <div className="flex justify-between text-sm md:text-base">
                            <div className="flex flex-col">
                                <span className="font-bold">Net Total</span>
                            </div>
                            <div className="font-bold pr-10">
                                {currency(browserSelector?.cart?.reduce((prev, curr) => prev + ((curr?.price * curr?.quantity) - curr?.markdown), 0))}
                            </div>
                        </div>
                    </div>
                    <div className="border border-white border-b-gray-400 border-dashed w-full mt-5"></div>
                    <div className={`${paymentSelector.paid?.length ? "flex" : "hidden"} flex-col w-full px-5 py-5 gap-5`}>
                        <div className="flex justify-between text-base">
                            <div className="flex flex-col">
                                <span className="text-base">Payment Details</span>
                            </div>
                        </div>
                        <div className="flex justify-between text-base">
                            <div className="flex flex-col">
                                <span className="text-base">Customer</span>
                            </div>
                            <div className="flex font-semibold items-center gap-5 -mr-1">
                                <span className="">
                                    {paymentSelector.customer?.name ? paymentSelector.customer?.name : "Not selected"}
                                </span>
                                <UserCircleIcon className="w-[18px] h-[18px]" />
                            </div>
                        </div>
                        {
                            paymentSelector.paid?.map(item => (
                                <div key={item.id} className="flex justify-between text-base">
                                    <div className="flex flex-col">
                                        <span className="font-semibold">
                                            {item.type === "SALES" ? item.method : item.type} #{item.id}
                                        </span>
                                        <span className={`${item.type === "SALES" ? "" : "hidden"} text-sm text-gray-500`}>
                                            {item.refcode ? ` #${item.refcode}` : ""}
                                        </span>
                                    </div>
                                    <div className="flex font-semibold items-center gap-5 pr-1">
                                        <span className="">
                                            {item.type === "SALES" ? currency(item.amount) : currency(item.credit)}
                                        </span>
                                        <TrashIcon className="w-4 h-4 cursor-pointer" onClick={() => removePayment(item.id)} />
                                    </div>
                                </div>
                            ))
                        }
                        {
                            (paymentSelector.method === "CREDIT") ? (
                                <div className="flex justify-between text-base">
                                    <div className="flex flex-col">
                                        <span className="font-semibold">
                                            PARTIAL {paymentSelector?.paid[0]?.refcode ? ` #${paymentSelector?.paid[0]?.refcode}` : ""}
                                        </span>
                                    </div>
                                    <div className="flex font-semibold items-center gap-5 pr-10">
                                        <span className="">
                                            {currency(paymentSelector?.paid[0]?.amount)}
                                        </span>
                                    </div>
                                </div>
                            ) : null
                        }
                        <div className={`${tended > 0 && paymentSelector.method !== "CREDIT" ? "flex" : "hidden"} justify-between text-base`}>
                            <div className="flex flex-col">
                                <span className="text-sm">Tended Cash</span>
                            </div>
                            <div className="text-sm mr-10">
                                {currency(tended)}
                            </div>
                        </div>
                        <div className={`${tended > 0 ? "flex" : "hidden"} justify-between`}>
                            <div className="flex flex-col">
                                <span className="text-sm">Change</span>
                            </div>
                            <div className="text-sm mr-10">
                                {currency(change)}
                            </div>
                        </div>
                        <div className={`${tended > 0 ? "flex" : "hidden"} justify-between`}>
                            <div className="flex flex-col">
                                <span className="text-base font-bold">Total Value</span>
                            </div>
                            <div className="text-base font-bold mr-10">
                                {currency(payment)}
                            </div>
                        </div>
                    </div>
                    <span className={`${browserSelector?.cart?.length ? "" : "hidden"} absolute bottom-0 mb-[-15px] bg-gray-300 px-5 py-2 cursor-pointer`} onClick={() => setCascade(prev => !prev)}>
                        Show {cascade ? "Less" : "Transaction Details"}
                    </span>
                </div>
            </div>
            <div className={`${cascade ? "hidden" : ""}`}>
                <CasheringComplexBrowse />
            </div>
            <CasheringComplexVariant />
            <PaymentCustomer />
            <PaymentBrowser />
            <div className="flex flex-col fixed bottom-12 right-6 gap-2">
                <div className="w-fit p-2 md:p-3 cursor-pointer rounded-full shadow-md bg-[#4baf4f] border border-white text-gray-200 hover:bg-[#2c7f2e]" onClick={() => toggleViewInventory()}>
                    <ShoppingCartIcon className="w-5 md:w-7 w-5 md:h-7" />
                </div>
                <div className="w-fit p-2 md:p-3 cursor-pointer rounded-full shadow-md bg-[#4baf4f] border border-white text-gray-200 hover:bg-[#2c7f2e]" onClick={() => toggleViewReceipts()}>
                    <ReceiptRefundIcon className="w-5 md:w-7 w-5 md:h-7" />
                </div>
                <div className="w-fit p-2 md:p-3 cursor-pointer rounded-full shadow-md bg-[#4baf4f] border border-white text-gray-200 hover:bg-[#2c7f2e]" onClick={() => toggleViewCheque()}>
                    <DocumentCheckIcon className="w-5 md:w-7 w-5 md:h-7" />
                </div>
                <div className="w-fit p-2 md:p-3 cursor-pointer rounded-full shadow-md bg-[#4baf4f] border border-white text-gray-200 hover:bg-[#2c7f2e]" onClick={() => toggleViewCredits()}>
                    <DocumentTextIcon className="w-5 md:w-7 w-5 md:h-7" />
                </div>
                <div className="w-fit p-2 md:p-3 cursor-pointer rounded-full shadow-md bg-[#4baf4f] border border-white text-gray-200 hover:bg-[#2c7f2e]" onClick={() => toggleViewReports()}>
                    <DocumentChartBarIcon className="w-5 md:w-7 w-5 md:h-7" />
                </div>
            </div>
            <CasheringReceipts />
            <CasheringLedger />
            <CasheringReturn />
            <CasheringReimburse />
            <CasheringComplexInventory />
            <CasheringComplexCredits />
            <CasheringComplexCheque />
            <CasheringComplexReport />
        </div>
    )
}

export default CasheringComplexIndex
import { ArrowLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { NumFn, amount, currency } from "../../../utilities/functions/number.funtions"
import { isEmpty } from "../../../utilities/functions/string.functions"
import useToast from "../../../utilities/hooks/useToast"
import useYup from "../../../utilities/hooks/useYup"
import DataRecords from "../../../utilities/interface/datastack/data.records"
import { removeBrowserPaid, setBrowserBalance, showBrowserPayments } from "../browser/browser.reducer"
import { resetCreditManager, setCreditNotifier } from "./credit.reducer"
import { useCreateCreditMutation, useUpdateCreditMutation } from "./credit.services"

const CreditManage = () => {
    const dataSelector = useSelector(state => state.credit)
    const browserSelector = useSelector(state => state.browser)
    const dispatch = useDispatch()
    const [instantiated, setInstantiated] = useState(false)
    const [records, setrecords] = useState()
    const [listener, setListener] = useState()
    const [element, setElement] = useState()
    const [values, setValues] = useState()
    const { yup } = useYup()
    const toast = useToast()

    const [balance, setBalance] = useState(0)
    const [tended, setTended] = useState(0)
    const [change, setChange] = useState(0)
    const [payment, setPayment] = useState(0)
    const columns = {
        items: [
            { name: 'Total Purchase', stack: false, sort: 'total', size: 150 },
            { name: 'Partial', stack: true, sort: 'partial', size: 130 },
            { name: 'Balance', stack: true, sort: 'balance', size: 130 },
            { name: 'Payment', stack: true, sort: 'payment', size: 130 },
            { name: 'Waived', stack: true, sort: 'waived', size: 120 },
            { name: 'Returned', stack: true, sort: 'returned', size: 120 },
            { name: 'Status', stack: false, sort: 'status', size: 100 },
            { name: 'Settled On', stack: false, sort: 'status', size: 150 },
        ]
    }

    const [createCredit] = useCreateCreditMutation()
    const [updateCredit] = useUpdateCreditMutation()

    useEffect(() => {
        const instantiate = async () => {
            // fetch all library dependencies here. (e.g. dropdown values, etc.)
            setInstantiated(true)
        }

        instantiate()
        return () => {
            setInstantiated(false)
        }
    }, [])

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

    // const onFields = (errors, register, values, setValue) => {
    //     return (
    //         <>
    //             <FormEl.Display
    //                 label='Customer'
    //                 register={register}
    //                 name='customer_name'
    //             />
    //             <FormEl.Display
    //                 label='Transaction'
    //                 register={register}
    //                 name='code'
    //             />
    //             <FormEl.Display
    //                 label='Total Purchase'
    //                 register={register}
    //                 name='total'
    //             />
    //             <FormEl.Display
    //                 label='Partial Payment'
    //                 register={register}
    //                 name='partial'
    //             />
    //             <FormEl.Text
    //                 label='Name'
    //                 register={register}
    //                 name='name'
    //                 errors={errors}
    //                 autoComplete='off'
    //                 wrapper='lg:w-1/2'
    //             />
    //         </>
    //     )
    // }

    const onChange = (values, element) => {
        setListener(values)
        setElement(element)
    }

    const items = (item) => {
        return [
            { value: currency(item.total) },
            { value: currency(item.partial) },
            { value: currency(item.balance) },
            { value: currency(item.payment) },
            { value: currency(item.waived) },
            { value: currency(item.returned) },
            { value: item.status },
            { value: item.settledon },
        ]
    }

    useEffect(() => {
        if (dataSelector?.item?.id) {
            let data = [dataSelector?.item]
            setrecords(data?.map((item, i) => {
                return {
                    key: item.id,
                    items: items(item),
                    ondoubleclick: () => { },
                }
            }))
        }
    }, [dataSelector?.cart])

    useEffect(() => {
        if (dataSelector.item.balance > 0) {
            let totalpaid = browserSelector?.paid?.reduce((prev, curr) => prev + amount(curr.amount), 0)
            let totalnoncash = browserSelector?.paid?.reduce((prev, curr) => prev + (curr.method !== "CASH" ? amount(curr.amount) : 0), 0)
            let totalcash = browserSelector?.paid?.reduce((prev, curr) => prev + (curr.method === "CASH" ? amount(curr.amount) : 0), 0)
            let totalpartial = browserSelector?.paid?.reduce((prev, curr) => prev + (curr.method === "CREDIT" ? amount(curr.partial) : 0), 0)
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
    }, [browserSelector?.paid, dataSelector.item.balance, browserSelector?.less])

    const onSchema = yup.object().shape({
        name: yup
            .string()
            .required('Field is required.'),
    })

    const onClose = () => {
        dispatch(resetCreditManager())
    }

    const onCompleted = () => {
        dispatch(setCreditNotifier(true))
        dispatch(resetCreditManager())
    }

    const onSubmit = async (data) => {
        const formData = data
        if (dataSelector.item.id) {
            await updateCredit({ ...data, id: dataSelector.item.id })
                .unwrap()
                .then(res => {
                    if (res.success) {
                        toast.showUpdate("Credit successfully updated.")
                        onCompleted()
                    }
                })
                .catch(err => console.error(err))
            return
        }
        await createCredit(data)
            .unwrap()
            .then(res => {
                if (res.success) {
                    toast.showCreate("Credit successfully created.")
                    onCompleted()
                }
            })
            .catch(err => console.error(err))
    }

    const inputFormData = {
        id: dataSelector.item.id,
        name: "!Manage Credit",
        values: values,
        schema: onSchema
    }

    const togglePayments = () => {
        if (dataSelector.item.balance > 0) {
            dispatch(setBrowserBalance(dataSelector.item.balance))
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

    const toggleOffCreditManager = () => {
        dispatch(resetCreditManager())
    }

    return (
        // <DataInputs
        //     formData={inputFormData}
        //     fields={onFields}
        //     change={onChange}
        //     submit={onSubmit}
        //     closed={onClose}
        // />
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
                itemsperpage={1}
                page={1}
            />
            <div className="flex flex-col">
                <div className="flex justify-between items-center p-3 border-t border-t-gray-400">
                    <span>{dataSelector.item.customer_name}</span>
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
                    <div className={`${dataSelector.paid?.length ? "flex" : "hidden"} flex-col w-full gap-1 py-2`}>
                        {
                            browserSelector?.paid?.map((pay, index) => (
                                <div key={index} className="flex justify-between items-center pl-5 pr-3 py-1 text-xs" onClick={() => removePayment(pay.id)}>
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
                            ))
                        }
                        {
                            (browserSelector.method === "CREDIT") ? (
                                <div className="flex justify-between items-center pl-5 pr-3 py-1 text-xs" onClick={() => removePayment(browserSelector?.paid[0]?.id)}>
                                    <span className="w-1/4 flex-none flex items-center gap-2">
                                        {browserSelector?.paid[0]?.method}
                                        <span className="bg-gray-300 px-2 py-0.5 rounded-md">
                                            PARTIAL
                                        </span>
                                    </span>
                                    <span className="flex gap-5 ">
                                        <span>{browserSelector?.paid[0]?.creditor_name}</span>
                                    </span>
                                    <span className="ml-auto text-gray-800">
                                        {currency(browserSelector?.paid[0]?.partial)}
                                    </span>
                                </div>
                            ) : null
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
        </div>
    )
}

export default CreditManage
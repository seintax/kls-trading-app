import { Transition } from "@headlessui/react"
import { XMarkIcon } from "@heroicons/react/20/solid"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FormatOptionsWithEmptyLabel } from "../../../utilities/functions/array.functions"
import { createInstance, sqlDate } from "../../../utilities/functions/datetime.functions"
import { amount } from "../../../utilities/functions/number.funtions"
import useToast from "../../../utilities/hooks/useToast"
import { useFetchAllCustomerMutation } from "../../library/customer/customer.services"
import { resetBrowserPayments, setBrowserMethod, setBrowserPaid } from "./browser.reducer"

const BrowserPayment = () => {
    const dataSelector = useSelector(state => state.browser)
    const dispatch = useDispatch()
    const [instantiated, setInstantiated] = useState(false)
    const [settle, setSettle] = useState({
        type: "",
        method: "",
        amount: "",
        partial: "",
        refcode: "",
        refdate: sqlDate(),
        refstat: "",
        creditor: "",
        creditor_name: ""
    })
    const toast = useToast()

    const [libCustomers, setLibCustomers] = useState()

    const [allCustomer] = useFetchAllCustomerMutation()

    useEffect(() => {
        const instantiate = async () => {
            await allCustomer()
                .unwrap()
                .then(res => {
                    if (res.success) {
                        setLibCustomers(FormatOptionsWithEmptyLabel(res?.arrayResult, "id", "name", "Select customer"))
                    }
                })
                .catch(err => console.error(err))
            setInstantiated(true)
        }

        instantiate()
    }, [])

    const onChange = (e) => {
        const { name, value } = e.target
        if (name === "creditor") {
            let customers = libCustomers?.filter(f => String(f.value) === String(value))
            let customer = customers.length ? customers[0] : undefined
            setSettle(prev => ({
                ...prev,
                [name]: value,
                creditor_name: customer?.key
            }))
            return
        }
        setSettle(prev => ({
            ...prev,
            [name]: value,
        }))
    }

    const onClose = () => {
        dispatch(resetBrowserPayments())
    }

    const onReset = () => {
        setSettle({
            type: "",
            method: "",
            amount: "",
            partial: "",
            refcode: "",
            refdate: sqlDate(),
            refstat: "",
            creditor: "",
            creditor_name: ""
        })
    }

    const onSubmit = (e) => {
        e.preventDefault()
        if (settle.method === "CREDIT") {
            if (dataSelector.paid.length) {
                toast.showWarning("Cannot apply option 'CREDIT' along with other methods of payment.")
                return
            }
        }
        let hasCash = dataSelector.paid?.filter(f => f.method === "CASH").length > 0
        if (hasCash) {
            toast.showWarning("Cannot add another 'CASH' option.")
            return
        }
        let type = settle.method === "CREDIT" ? "CREDIT" : "SALES"
        let settlement = {
            ...settle,
            id: createInstance(),
            type: type
        }
        if (settle.method === "CREDIT") {
            settlement = {
                ...settlement,
                partial: settlement.amount,
                amount: amount(dataSelector.balance) - amount(settlement.amount)
            }
        }
        console.log(settlement)
        dispatch(setBrowserMethod(type))
        dispatch(setBrowserPaid(settlement))
        onReset()
        dispatch(resetBrowserPayments())
    }

    return (
        <Transition
            show={dataSelector.payments}
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
                        <div>PAYMENT OPTIONS</div>
                        <div onClick={() => onClose()}>
                            <XMarkIcon className="w-5 h-5 cursor-pointer" />
                        </div>
                    </div>
                    <form onSubmit={onSubmit} className="flex flex-col gap-3 mt-2 p-5">
                        <div className="flex border border-secondary-500 p-0.5 items-center">
                            <select
                                name="method"
                                value={settle.method}
                                onChange={onChange}
                                tabIndex={0}
                                autoFocus
                                required
                                className="w-full border-none focus:border-none outline-none ring-0 focus:ring-0 focus:outline-none grow-1">
                                <option value="" className="text-sm" disabled>Select payment method</option>
                                <option value="CASH" className="text-sm">Cash</option>
                                <option value="CHEQUE" className="text-sm">Cheque</option>
                                <option value="GCASH" className="text-sm">GCash</option>
                                <option value="CREDIT" className="text-sm">Credit</option>
                            </select>
                        </div>
                        <div className={`${settle.method === "CREDIT" ? "flex" : "hidden"} border border-secondary-500 p-0.5 items-center`}>
                            <select
                                name="creditor"
                                value={settle.creditor}
                                onChange={onChange}
                                autoFocus
                                required={settle.method === "CREDIT"}
                                className="w-full border-none focus:border-none outline-none ring-0 focus:ring-0 focus:outline-none grow-1">
                                {
                                    libCustomers?.map(lib => (
                                        <option
                                            key={lib.value}
                                            value={lib.value} className="text-sm"
                                        >
                                            {lib.key}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className="flex border border-secondary-500 p-0.5 items-center">
                            <input
                                type="number"
                                name="amount"
                                value={settle.amount}
                                onChange={onChange}
                                autoComplete="off"
                                required
                                placeholder={settle.method === "CREDIT" ? "Enter partial payment" : "Enter amount"}
                                className="w-full border-none focus:border-none outline-none ring-0 focus:ring-0 focus:outline-none grow-1"
                            />
                        </div>
                        <div className="flex border border-secondary-500 p-0.5 items-center">
                            <input
                                type="text"
                                name="refcode"
                                value={settle.refcode}
                                onChange={onChange}
                                autoComplete="off"
                                required
                                disabled={settle.method === "CASH" || settle.method === "CREDIT"}
                                placeholder="Enter reference/cheque no."
                                className="w-full border-none focus:border-none outline-none ring-0 focus:ring-0 focus:outline-none grow-1 disabled:bg-gray-300"
                            />
                        </div>
                        <div className="flex border border-secondary-500 p-0.5 items-center">
                            <input
                                type="date"
                                name="refdate"
                                value={settle.refdate}
                                onChange={onChange}
                                autoComplete="off"
                                required
                                disabled={settle.method !== "CHEQUE"}
                                placeholder="Enter cheque date"
                                className="w-full border-none focus:border-none outline-none ring-0 focus:ring-0 focus:outline-none grow-1 disabled:bg-gray-300"
                            />
                        </div>
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

export default BrowserPayment
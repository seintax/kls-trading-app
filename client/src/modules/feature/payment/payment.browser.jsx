import { Transition } from "@headlessui/react"
import { XMarkIcon } from "@heroicons/react/20/solid"
import { CurrencyDollarIcon } from "@heroicons/react/24/outline"
import { useCallback, useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { createInstance, sqlDate } from "../../../utilities/functions/datetime.functions"
import { NumFn, amount } from "../../../utilities/functions/number.funtions"
import { eitherNot } from "../../../utilities/functions/string.functions"
import useToast from "../../../utilities/hooks/useToast"
import { resetPaymentManager, setPaymentMethod, setPaymentPaid } from "./payment.reducer"

const PaymentBrowser = () => {
    const amtRef = useRef()
    const dataSelector = useSelector(state => state.payment)
    const dispatch = useDispatch()
    const [instantiated, setInstantiated] = useState(false)
    const [settle, setSettle] = useState({
        type: "SALES",
        method: "CASH",
        amount: "",
        partial: "",
        refcode: "",
        refdate: sqlDate(),
        refstat: "",
    })
    const toast = useToast()

    const keydown = useCallback(e => {
        if (dataSelector.manager)
            if (e.key === 'Escape') onClose()
    })

    useEffect(() => {
        document.addEventListener('keydown', keydown)
        return () => { document.removeEventListener('keydown', keydown) }
    }, [keydown])

    useEffect(() => {
        const instantiate = async () => {
            setInstantiated(true)
        }

        instantiate()
    }, [])

    useEffect(() => {
        if (dataSelector.manager) {
            setSettle(prev => ({
                ...prev,
                type: dataSelector.settlement
                    ? "CREDIT"
                    : "SALES",
            }))

            return () => {
                onReset()
            }
        }
    }, [dataSelector.settlement, dataSelector.manager])

    const onChange = (e) => {
        const { name, value } = e.target
        setSettle(prev => ({
            ...prev,
            [name]: value,
        }))
        if (name === "type") {
            let amount = settle.amount
            if (value === "CREDIT") {
                amount = ""
            }
            setSettle(prev => ({
                ...prev,
                amount: amount
            }))
        }
    }

    const onClose = () => {
        dispatch(resetPaymentManager())
    }

    const onReset = () => {
        setSettle({
            type: "SALES",
            method: "CASH",
            amount: "",
            partial: "",
            refcode: "",
            refdate: sqlDate(),
            refstat: "",
        })
    }

    const onSubmit = (e) => {
        e.preventDefault()
        if (settle.method !== "CASH") {
            if (amount(settle.amount) > dataSelector.balance) {
                toast.showWarning("Amount entered exceeds the allowed balance.")
                return
            }
        }
        if (settle.type === "CREDIT" && !dataSelector.settlement) {
            if (dataSelector.paid.length) {
                toast.showWarning("Cannot apply option 'CREDIT' along with other methods of payment.")
                return
            }
        }

        let hasCash = dataSelector.paid
            ?.filter(f => f.method === "CASH")
            .length > 0
        if (settle.method === "CASH" && hasCash) {
            toast.showWarning("Cannot add another 'CASH' option.")
            return
        }

        if (settle.method === "BALANCE" && settle.amount !== dataSelector.balance) {
            toast.showWarning("Full balance is required when using payment method 'Balance'.")
            return
        }

        let settlement = {
            ...settle,
            id: createInstance(),
            refstat: settle.method === "CHEQUE" ? "UNCLAIMED" : ""
        }
        if (settle.type === "CREDIT" && !dataSelector.settlement) {
            settlement = {
                ...settlement,
                credit: amount(dataSelector.balance) - amount(settlement.amount || 0)
            }
        }
        dispatch(setPaymentMethod(settle.type))
        dispatch(setPaymentPaid(settlement))
        dispatch(resetPaymentManager())
    }

    const applyBalance = () => {
        setSettle(prev => ({
            ...prev,
            amount: amount(dataSelector.balance)
        }))
        amtRef?.current?.focus()
    }

    useEffect(() => {
        if (dataSelector.manager) {
            applyBalance()
        }
    }, [dataSelector.manager])


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
                <div className="flex flex-col gap-2 bg-white p-3 w-[90%] lg:w-[600px] h-fit text-lg mt-1">
                    <div className="flex items-center justify-between">
                        <div>PAYMENT OPTIONS</div>
                        <div onClick={() => onClose()}>
                            <XMarkIcon className="w-5 h-5 cursor-pointer" />
                        </div>
                    </div>
                    <form onSubmit={onSubmit} className="flex flex-col gap-3 mt-2 p-5">
                        <div className="flex border border-secondary-500 bg-secondary-200 p-0.5 items-center">
                            <div className="py-2.5 px-3 text-[15px] flex justify-between w-full">
                                Transaction Balance:
                                <span>{NumFn.currency(amount(dataSelector.balance) - amount(settle.amount))}</span>
                            </div>
                        </div>
                        <div className="flex border border-secondary-500 p-0.5 items-center">
                            <select
                                name="type"
                                value={settle.type}
                                onChange={onChange}
                                tabIndex={0}
                                autoFocus
                                required
                                className="w-full border-none focus:border-none outline-none ring-0 focus:ring-0 focus:outline-none grow-1">
                                <option value="" className="text-sm" disabled>Select type of transaction</option>
                                {
                                    (!dataSelector.settlement) ? (
                                        <option value="SALES" className="text-sm">
                                            Sales
                                        </option>
                                    ) : null
                                }
                                <option value="CREDIT" className="text-sm">
                                    Credit
                                </option>
                            </select>
                        </div>
                        <div className="flex border border-secondary-500 p-0.5 items-center">
                            <select
                                name="method"
                                value={settle.method}
                                onChange={onChange}
                                autoFocus
                                required
                                className="w-full border-none focus:border-none outline-none ring-0 focus:ring-0 focus:outline-none grow-1">
                                <option value="" className="text-sm" disabled>Select payment method</option>
                                <option value="CASH" className="text-sm">Cash</option>
                                <option value="CHEQUE" className="text-sm">Cheque</option>
                                <option value="GCASH" className="text-sm">GCash</option>
                                <option value="BANK TRANSFER" className="text-sm">Bank Transfer</option>
                                {/* {
                                    (dataSelector.settlement) ? (
                                        <>
                                            <option value="WAIVE" className="text-sm">
                                                Waive
                                            </option>
                                            <option value="BALANCE" className="text-sm">
                                                Balance
                                            </option>
                                        </>
                                    ) : null
                                } */}
                            </select>
                        </div>
                        <div className="flex border border-secondary-500 p-0.5 items-center">
                            <input
                                ref={amtRef}
                                type="number"
                                name="amount"
                                value={settle.amount}
                                onChange={onChange}
                                autoComplete="off"
                                required
                                placeholder={settle.type === "CREDIT" && !dataSelector.settlement ? "Enter partial payment" : "Enter amount"}
                                className="w-full border-none focus:border-none outline-none ring-0 focus:ring-0 focus:outline-none grow-1"
                            />
                            <CurrencyDollarIcon
                                className="w-5 h-5 mr-2 cursor-pointer no-select text-secondary-500"
                                onClick={() => applyBalance()}
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
                                disabled={eitherNot(settle.method, ["GCASH", "CHEQUE", "BANK TRANSFER"])}
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
                        <div className="flex flex-col-reverse md:flex-row gap-2 justify-end mt-5">
                            <button type="button" tabIndex={-1} className="button-cancel w-full md:w-fit" onClick={() => onClose()}>Cancel</button>
                            <button type="submit" className="button-submit">Add Option</button>
                        </div>
                    </form>
                </div>
            </Transition.Child>
        </Transition>
    )
}

export default PaymentBrowser
import { Transition } from "@headlessui/react"
import { XMarkIcon } from "@heroicons/react/20/solid"
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { NumFn, amount } from "../../../utilities/functions/number.funtions"
import useToast from "../../../utilities/hooks/useToast"
import { resetPaymentDiscount, setPaymentLess } from "../payment/payment.reducer"

const BrowserDiscount = () => {
    const dataSelector = useSelector(state => state.payment)
    const browserSelector = useSelector(state => state.browser)
    const dispatch = useDispatch()
    const [total, setTotal] = useState(0)
    const [settle, setSettle] = useState({
        option: "CUSTOM",
        discount: "",
        rate: "",
    })
    const toast = useToast()

    useEffect(() => {
        if (dataSelector.discount && dataSelector.total > 0) {
            setTotal(dataSelector.total)
            if (dataSelector?.less?.option) {
                setSettle(dataSelector?.less)
            }
        }
    }, [dataSelector.discount, dataSelector.total])

    const onDiscountChange = (e) => {
        const value = e.target.value
        if (settle.option === "CUSTOM") {
            let rate = value ? amount(value) / amount(total) : ""
            setSettle(prev => ({
                ...prev,
                rate: amount(rate).toFixed(2),
                discount: value
            }))
        }
    }

    const onOptionChange = (e) => {
        let value = e.target.value
        if (value === "CUSTOM") {
            setSettle(prev => ({
                ...prev,
                option: value,
                rate: "",
                discount: ""
            }))
            return
        }
        let rate = amount(value.replace("%", "")) / 100
        let discount = amount(total) * amount(rate)
        setSettle(prev => ({
            ...prev,
            option: value,
            rate: amount(rate),
            discount: discount
        }))
    }

    const onClose = () => {
        dispatch(resetPaymentDiscount())
    }

    const onReset = () => {
        setSettle({
            option: "",
            discount: "",
            rate: "",
        })
    }

    const onSubmit = (e) => {
        e.preventDefault()
        if (settle.discount > total) {
            toast.showWarning("Cannot apply discount which exceeds the available total.")
            return
        }
        dispatch(setPaymentLess(settle))
        onReset()
        dispatch(resetPaymentDiscount())
    }

    return (
        <Transition
            show={dataSelector.discount}
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
                        <div className="flex border border-secondary-500 p-0.5 items-center">
                            <div className="py-2.5 px-3 text-xs lg:text-sm text-[15px] flex justify-between w-full">
                                Transaction Total:
                                <span>{NumFn.currency(dataSelector.total)}</span>
                            </div>
                        </div>
                        <div className="flex border border-secondary-500 p-0.5 items-center">
                            <select
                                name="option"
                                value={settle.option}
                                onChange={onOptionChange}
                                tabIndex={0}
                                autoFocus
                                className="w-full text-xs lg:text-sm border-none focus:border-none outline-none ring-0 focus:ring-0 focus:outline-none grow-1">
                                <option value="CUSTOM" className="text-sm">Custom</option>
                                <option value="30%" className="text-sm">30%</option>
                                <option value="25%" className="text-sm">25%</option>
                                <option value="20%" className="text-sm">20%</option>
                                <option value="15%" className="text-sm">15%</option>
                                <option value="10%" className="text-sm">10%</option>
                                <option value="5%" className="text-sm">5%</option>
                            </select>
                        </div>
                        <div className="flex border border-secondary-500 p-0.5 items-center">
                            <input
                                type="number"
                                name="discount"
                                value={settle.discount}
                                onChange={onDiscountChange}
                                autoComplete="off"
                                required
                                placeholder="Enter discount amount"
                                className="w-full text-xs lg:text-sm border-none focus:border-none outline-none ring-0 focus:ring-0 focus:outline-none grow-1"
                            />
                        </div>
                        <div className="flex border border-secondary-500 p-0.5 items-center">
                            <input
                                type="number"
                                name="rate"
                                value={settle.rate}
                                readOnly
                                required
                                placeholder="Discount Rate (%) (auto-computed)"
                                className="w-full text-xs lg:text-sm border-none focus:border-none outline-none ring-0 focus:ring-0 focus:outline-none grow-1"
                            />
                        </div>
                        <div className="flex flex-col-reverse lg:flex-row justify-end mt-5">
                            <button type="button" tabIndex={-1} className="button-cancel" onClick={() => onClose()}>Cancel</button>
                            <button type="submit" className="button-submit">Add Option</button>
                        </div>
                    </form>
                </div>
            </Transition.Child>
        </Transition>
    )
}

export default BrowserDiscount
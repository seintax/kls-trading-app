import { Transition } from "@headlessui/react"
import { CalculatorIcon, DocumentArrowDownIcon, XMarkIcon } from "@heroicons/react/24/outline"
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { NumFn, amount } from "../../../utilities/functions/number.funtions"
import useToast from "../../../utilities/hooks/useToast"
import { resetBrowserItem, resetBrowserManager, setBrowserCart, updateBrowserData } from "./browser.reducer"

const BrowserQuantity = ({ qtyRef }) => {
    const mrkRef = useRef()
    const dataSelector = useSelector(state => state.browser)
    const dispatch = useDispatch()
    const [quantity, setQuantity] = useState("")
    const [markdown, setMarkdown] = useState("")
    const [discount, setDiscount] = useState("")
    const [balance, setBalance] = useState(0)
    const [config, setConfig] = useState()
    const toast = useToast()

    const keydown = useCallback(e => {
        if (dataSelector.manager)
            if (e.key === 'Escape') onClose()
    })

    useLayoutEffect(() => {
        document.addEventListener('keydown', keydown)
        return () => { document.removeEventListener('keydown', keydown) }
    }, [keydown])

    const onChange = (e) => {
        setQuantity(e.target.value)
        setBalance(amount(dataSelector.item.stocks) - amount(e.target.value || 0))
    }

    const onMarkdownChange = (e) => {
        setMarkdown(e.target.value)
    }

    const onDiscountChange = (e) => {
        setDiscount(e.target.value)
    }

    const onClose = () => {
        dispatch(resetBrowserItem())
        dispatch(resetBrowserManager())
    }

    const onFocus = (e) => {
        e.target.select()
    }

    const onReset = () => {
        setQuantity("")
        setBalance(amount(dataSelector.item.stocks) - amount(0))
        qtyRef.current.focus()
    }

    const onMarkdownReset = () => {
        setMarkdown("")
        mrkRef.current.focus()
    }

    const onSubmit = (e) => {
        e.preventDefault()
        if (balance < 0) {
            toast.showError("Cannot process input that can result to negative stock values.")
            return
        }
        let newItem = {
            ...dataSelector.item,
            quantity: quantity,
            remaining: balance,
            markdown: discount === "Amount" ? markdown : calculateDiscountAmt(false)
        }
        setQuantity("")
        setMarkdown("")
        setBalance(0)
        dispatch(setBrowserCart(newItem))
        dispatch(updateBrowserData(newItem))
        dispatch(resetBrowserManager())
    }

    useEffect(() => {
        if (dataSelector.manager) {
            setQuantity("")
            setMarkdown("")
            let newConfig = JSON.parse(localStorage.getItem("config")) || {}
            setConfig(newConfig)
            setDiscount(newConfig?.discount === "Percent" ? "Percent" : "Amount")
            setBalance(amount(dataSelector.item.stocks) - amount(0))
        }
    }, [dataSelector.manager])

    const setDiscountConfig = () => {
        let newConfig = {
            ...config,
            discount: discount
        }
        setConfig(newConfig)
        localStorage.setItem("config", JSON.stringify(newConfig))
    }

    const calculateDiscountAmt = (isDisplay = true) => {
        if (quantity > 0) {
            let currentMarkdown = markdown || 0
            if (discount === "Percent") {
                let purchaseValue = dataSelector.item.price * quantity
                let discountRate = currentMarkdown / 100
                return purchaseValue * discountRate
            }
            return isDisplay
                ? currentMarkdown
                : markdown
        }
        return isDisplay ? 0 : markdown
    }

    const calculateDiscountRate = () => {
        if (quantity > 0) {
            let currentMarkdown = markdown || 0
            if (discount === "Amount") {
                let purchaseValue = dataSelector.item.price * quantity
                return (currentMarkdown / purchaseValue) * 100
            }
            return currentMarkdown
        }
        return 0
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
            className={`fixed left-0 top-0 h-screen w-screen bg-gradient-to-r from-[#00000070] via-[#00000070] to-[#00000040] z-20 flex items-center justify-center`}
        >
            <Transition.Child
                enter="transition ease-in-out duration-500 transform"
                // enterFrom="translate-y-0"
                // enterTo="translate-y-full"
                leave="transition ease-in-out duration-500 transform"
                // leaveFrom="translate-y-0"
                // leaveTo="-translate-y-full"
                className="flex flex-col gap-2 bg-white p-5 w-[90%] lg:w-[600px] h-fit text-lg mt-1"
            >
                <div className="flex items-center justify-between">
                    <div>PURCHASE QUANTITY</div>
                    <div onClick={() => onClose()}>
                        <XMarkIcon className="w-5 h-5 cursor-pointer" />
                    </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                    <div className="flex flex-col-reverse border border-secondary-500 bg-gray-300 rounded-md py-2 px-4">
                        <span className="text-sm lg:text-[20px]">{dataSelector.item.product_name}</span>
                        <span className="text-[10px] lg:text-sm text-gray-400">product name</span>
                    </div>
                    <div className="flex flex-col-reverse border border-secondary-500 bg-gray-300 rounded-md py-2 px-4">
                        <span className="text-sm lg:text-[20px]">{`${dataSelector.item.variant_serial}/${dataSelector.item.variant_model}/${dataSelector.item.variant_brand}`}</span>
                        <span className="text-[10px] lg:text-sm text-gray-400">variant</span>
                    </div>
                    <div className="flex flex-col-reverse border border-secondary-500 bg-gray-300 rounded-md py-2 px-4">
                        <span className="text-sm lg:text-[20px]">{dataSelector.item.category}</span>
                        <span className="text-[10px] lg:text-sm text-gray-400">category</span>
                    </div>
                    <div className="flex flex-col-reverse border border-secondary-500 bg-gray-300 rounded-md py-2 px-4">
                        <span className="text-sm lg:text-[20px]">{dataSelector.item.store}</span>
                        <span className="text-[10px] lg:text-sm text-gray-400">branch</span>
                    </div>
                    <div className="flex flex-col-reverse border border-secondary-500 bg-gray-300 rounded-md py-2 px-4">
                        <span className="text-sm lg:text-[20px]">{dataSelector.item.supplier_name}</span>
                        <span className="text-[10px] lg:text-sm text-gray-400">supplier</span>
                    </div>
                    <div className="flex flex-col-reverse border border-secondary-500 bg-gray-300 rounded-md py-2 px-4">
                        <span className="text-sm lg:text-[20px]">{dataSelector.item.stocks}</span>
                        <span className="text-[10px] lg:text-sm text-gray-400">stocks</span>
                    </div>
                    <div className="flex flex-col-reverse border border-secondary-500 bg-gray-300 rounded-md py-2 px-4">
                        <span className="text-sm lg:text-[20px]">{NumFn.currency(dataSelector.item.price)}</span>
                        <span className="text-[10px] lg:text-sm text-gray-400">price</span>
                    </div>
                </div>
                <form onSubmit={onSubmit} className="flex flex-col gap-2">
                    <div className="flex border border-secondary-500 p-0.5 items-center">
                        <CalculatorIcon className="w-8 h-8 ml-1 text-secondary-500 hidden lg:flex" />
                        <input
                            ref={qtyRef}
                            type="number"
                            value={quantity}
                            onChange={onChange}
                            onFocus={onFocus}
                            tabIndex={1}
                            autoFocus
                            required
                            placeholder="Enter quantity"
                            className="w-full text-sm lg:text-lg border-none focus:border-none outline-none ring-0 focus:ring-0 focus:outline-none grow-1"
                        />
                        <button type="button" className="button-link text-sm ml-auto px-3 lg:px-6 bg-gradient-to-b from-orange-400 via-orange-600 to-orange-600 focus:ring-0" onClick={() => onReset()}>Reset</button>
                    </div>
                    <div className="flex gap-2">
                        <div className={`flex flex-col-reverse w-full border border-secondary-500 rounded-md py-2 px-4 ${balance < 0 ? "bg-red-500 [&>*]:text-white" : "bg-gray-200 text-gray-600"}`}>
                            <div className={`text-sm lg:text-[20px]`}>
                                {balance}
                            </div>
                            <span className="text-[15px] lg:text-sm text-gray-400">balance after commit</span>
                        </div>
                        <div className={`flex flex-col-reverse w-full border border-secondary-500 rounded-md py-2 px-4 ${balance < 0 ? "bg-red-500 [&>*]:text-white" : "bg-gray-200 text-gray-600"}`}>
                            <div className={`text-sm lg:text-[20px]`}>
                                {NumFn.currency(dataSelector.item.price * amount(quantity))}
                            </div>
                            <span className="text-[15px] lg:text-sm text-gray-400">purchase value</span>
                        </div>
                    </div>
                    <div className="flex border border-secondary-500 p-3.5 items-center gap-5 text-sm no-select">
                        <div className="flex items-center gap-2">
                            <input
                                id="amount"
                                name="discount"
                                type="radio"
                                value="Amount"
                                checked={discount === "Amount"}
                                onChange={onDiscountChange}
                            />
                            <label htmlFor="amount" className="cursor-pointer">Amount</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                id="percent"
                                name="discount"
                                type="radio"
                                value="Percent"
                                checked={discount === "Percent"}
                                onChange={onDiscountChange}
                            />
                            <label htmlFor="percent" className="cursor-pointer">Percent</label>
                        </div>
                        <span className={`${config?.discount === discount ? "hidden" : ""}  ml-auto text-blue-500 cursor-pointer`} onClick={() => setDiscountConfig()}>
                            Set as Default Discount Option
                        </span>
                    </div>
                    <div className="flex border border-secondary-500 p-0.5 items-center">
                        <DocumentArrowDownIcon className="w-8 h-8 ml-1 text-secondary-500 hidden lg:flex" />
                        <input
                            ref={mrkRef}
                            type="number"
                            value={markdown}
                            tabIndex={2}
                            onChange={onMarkdownChange}
                            placeholder={`Enter discount in ${discount.toLowerCase()}`}
                            className="w-full text-sm lg:text-lg border-none focus:border-none outline-none ring-0 focus:ring-0 focus:outline-none grow-1"
                        />
                        <span className="pr-4">{discount === "Amount" ? "₱" : "%"}</span>
                        <button type="button" className="button-link text-sm ml-auto px-3 lg:px-6 bg-gradient-to-b from-orange-400 via-orange-600 to-orange-600 focus:ring-0" onClick={() => onMarkdownReset()}>Reset</button>
                    </div>
                    <div className="flex gap-2">
                        <div className={`flex flex-col-reverse w-full border border-secondary-500 rounded-md py-2 px-4 ${calculateDiscountRate() > (config?.ratelimit || 100) ? "bg-red-500 [&>*]:text-white" : "bg-gray-200 text-gray-600"}`}>
                            <div className={`text-sm lg:text-[20px]`}>
                                {NumFn.currency(calculateDiscountAmt() * -1)}
                            </div>
                            <span className="text-[15px] lg:text-sm text-gray-400">applied discount value</span>
                        </div>
                        <div className={`flex flex-col-reverse w-full border border-secondary-500 rounded-md py-2 px-4 ${calculateDiscountRate() > (config?.ratelimit || 100) ? "bg-red-500 [&>*]:text-white" : "bg-gray-200 text-gray-600"}`}>
                            <div className={`text-sm lg:text-[20px]`}>
                                {NumFn.currency(calculateDiscountRate() * -1)}%
                            </div>
                            <span className="text-[15px] lg:text-sm text-gray-400">applied discount rate</span>
                        </div>
                    </div>
                    <div className="flex flex-col-reverse lg:flex-row gap-2 lg:gap-0 justify-end mt-5">
                        <button type="button" tabIndex={-1} className="button-cancel text-white lg:text-black" onClick={() => onClose()}>Cancel</button>
                        <button type="submit" className="button-submit">Submit</button>
                    </div>
                </form>
            </Transition.Child>
        </Transition>
    )
}

export default BrowserQuantity
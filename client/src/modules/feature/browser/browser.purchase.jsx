import { Transition } from "@headlessui/react"
import { ArrowLeftIcon, ShoppingCartIcon, TrashIcon } from "@heroicons/react/20/solid"
import moment from "moment"
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { NumFn, amount, currency } from "../../../utilities/functions/number.funtions"
import useToast from "../../../utilities/hooks/useToast"
import DataRecords from "../../../utilities/interface/datastack/data.records"
import { removeBrowserCart, resetBrowserTransaction, resetBrowserViewCart, setBrowserDraft, setBrowserNotifier, showBrowserCheckout } from "./browser.reducer"

const BrowserPurchase = () => {
    const dataSelector = useSelector(state => state.browser)
    const dispatch = useDispatch()
    const [records, setrecords] = useState()
    const [startpage, setstartpage] = useState(1)
    const [discard, setDiscard] = useState("")
    const columns = dataSelector.header
    const toast = useToast()

    const onChange = (e) => {
        setDiscard(e.target.value)
    }

    const removeItem = (item) => {
        if (window.confirm("Do you wish to remove this from cart?")) {
            dispatch(removeBrowserCart(item))
        }
    }

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
            {
                value:
                    <div className="flex items-start justify-end">
                        <div className={`w-28 flex-none button-green bg-gradient-to-b from-green-400 to-green-600 py-3 lg:px-2 focus:ring-0 ${item.quantity > 0 ? "hidden" : "flex"} flex-col lg:flex-row lg:text-center lg:justify-between gap-1 lg:gap-2 text-xs cursor-pointer no-select`} onClick={() => selectItem(item)}>
                            <ShoppingCartIcon className="w-6 h-6 lg:hidden" />
                            <span className="w-full text-center">Add to Cart</span>
                        </div>
                        <div className={`w-28 flex-none button-red bg-gradient-to-b from-red-400 to-red-600 py-3 focus:ring-0 ${item.quantity > 0 ? "flex" : "hidden"} flex-col lg:flex-row lg:text-center lg:justify-between gap-1 lg:gap-2 text-xs cursor-pointer no-select`} onClick={() => removeItem(item)}>
                            <TrashIcon className="w-6 h-6 lg:hidden" />
                            <span className="w-full text-center">Remove Item</span>
                        </div>
                    </div>
            }
        ]
    }

    useEffect(() => {
        if (dataSelector?.data) {
            let data = dataSelector?.cart
            setrecords(data?.map((item, i) => {
                return {
                    key: item.id,
                    items: items(item),
                    ondoubleclick: () => { },
                }
            }))
        }
    }, [dataSelector?.cart])

    const toggleOffViewCart = () => {
        setDiscard("")
        dispatch(resetBrowserViewCart())
    }

    const saveAsDraft = () => {
        if (dataSelector?.cart?.length) {
            if (window.confirm("Do you wish to save this cart as draft and use it later?")) {
                let draft = {
                    id: moment(new Date).format("YYYY-MM-DD HH:mm:ss"),
                    cart: dataSelector?.cart
                }
                dispatch(setBrowserDraft(draft))
                dispatch(setBrowserNotifier(true))
                dispatch(resetBrowserTransaction())
                toast.showSuccess("Cart entry has been successfully saved as draft.")
            }
        }
    }

    const toggleCheckout = () => {
        let value = dataSelector?.cart?.reduce((prev, curr) => prev + (amount(curr.price) * amount(curr.quantity)), 0)
        if (value > 0) {
            dispatch(showBrowserCheckout())
            dispatch(resetBrowserViewCart())
        }
    }

    const onDiscard = () => {
        if (discard !== "discard") {
            toast.showWarning("Please type the word 'discard'.")
            return
        }
        if (window.confirm("Would you like to discard this cart and its contents?")) {
            setDiscard("")
            dispatch(setBrowserNotifier(true))
            dispatch(resetBrowserTransaction())
        }
    }

    return (
        <>
            <Transition
                show={dataSelector.viewcart}
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
                    className="flex flex-col gap-2 bg-white px-3 w-[90%] h-full text-sm mt-1 pr-20 lg:pr-60 pb-48"
                >
                    <div className="pl-1 pt-3 text-secondary-500 font-bold text-lg flex items-center gap-4">
                        <ArrowLeftIcon className="w-6 h-6 cursor-pointer" onClick={() => toggleOffViewCart()} />
                        <span>My Cart</span>
                    </div>
                    <DataRecords
                        page={startpage}
                        columns={columns}
                        records={records}
                        setPage={setstartpage}
                        itemsperpage={dataSelector?.perpage}
                    />
                    <div className="w-full flex flex-col lg:flex-row">
                        <div className={`p-3 hover:text-blue-700 text-blue-500 cursor-pointer ${dataSelector.cart?.length ? "" : "hidden"}`} onClick={() => saveAsDraft()}>
                            Save cart as draft
                        </div>
                        <div className="flex flex-col lg:flex-row gap-4 lg:ml-auto py-3">
                            <div className="flex flex-col px-3 lg:px-0 lg:justify-end lg:items-end">
                                <div className="text-sm lg:text-lg flex gap-2">
                                    Value:
                                    <span className="text-secondary-500 font-bold">
                                        {currency(dataSelector?.cart?.reduce((prev, curr) => prev + (amount(curr.price) * amount(curr.quantity)), 0))}
                                    </span>
                                </div>
                                <div className="text-xs lg:text-sm flex gap-2">
                                    No. of items:
                                    <span className="text-secondary-500 font-bold">
                                        {dataSelector.cart.length}
                                    </span>
                                </div>
                            </div>
                            <button className="button-link bg-gradient-to-b from-primary-500 via-secondary-500 to-secondary-600 px-7" onClick={() => toggleCheckout()}>Checkout</button>
                        </div>
                    </div>
                    <div className={`${dataSelector.cart?.length ? "flex" : "hidden"} border border-blue-500 p-0.5 items-center mt-4`}>
                        <input
                            type="text"
                            value={discard}
                            onChange={onChange}
                            placeholder="Type 'discard' here"
                            className="w-full text-xs lg:text-sm border-none focus:border-none outline-none ring-0 focus:ring-0 focus:outline-none grow-1"
                        />
                        <button className="button-link ml-auto text-xs lg:text-sm px-4 py-1.5 lg:px-8 lg:py-3 bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 focus:ring-0" onClick={() => onDiscard()}>Discard</button>
                    </div>
                </Transition.Child>
            </Transition>
        </>
    )
}

export default BrowserPurchase
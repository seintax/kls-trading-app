import { XMarkIcon } from "@heroicons/react/24/outline"
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { currency } from "../../../utilities/functions/number.funtions"
import { StrFn, getBranch } from "../../../utilities/functions/string.functions"
import useAuth from "../../../utilities/hooks/useAuth"
import useToast from "../../../utilities/hooks/useToast"
import { resetBrowserManager, setBrowserCart, updateBrowserData } from "../browser/browser.reducer"
import { useFetchAllProductByCategoryMutation } from "../browser/browser.services"

const CasheringComplexVariant = () => {
    const toast = useToast()
    const auth = useAuth()
    const dispatch = useDispatch()
    const browserSelector = useSelector(state => state.browser)
    const [records, setRecords] = useState()
    const [selected, setSelected] = useState()
    const [quantity, setQuantity] = useState(1)
    const [discount, setDiscount] = useState(0)
    const discountList = [0.35, 0.30, 0.25, 0.20, 0.18, 0.15, 0.12, 0.10, 0.09, 0.08, 0.07, 0.06, 0.05, 0.04, 0.03, 0.02, 0.01, 0]

    useEffect(() => {
        if (browserSelector.manager) {
            setQuantity(1)
            return () => {
                setRecords()
                setSelected()
                setDiscount(0)
            }
        }
    }, [browserSelector.manager])

    const [allProducts, { isLoading }] = useFetchAllProductByCategoryMutation()

    useEffect(() => {
        const instantiate = async () => {
            await allProducts({ branch: getBranch(auth), category: browserSelector?.category, product: browserSelector.product.id })
                .unwrap()
                .then(res => {
                    if (res.success) {
                        setRecords(res?.arrayResult)
                        if (res?.arrayResult?.length > 0) {
                            setSelected(res?.arrayResult[0])
                        }
                    }
                })
                .catch(err => console.error(err))

            return
        }
        if (browserSelector.manager) instantiate()
    }, [browserSelector.manager])

    const onClose = () => {
        dispatch(resetBrowserManager())
    }

    const selectProduct = (item) => {
        setSelected(item)
    }

    const selectDiscount = (item) => {
        setDiscount(item)
    }

    const onQuantityChange = (e) => {
        setQuantity(e.target.value)
    }

    const addQuantity = () => {
        setQuantity(prev => prev + 1)
    }

    const deductQuantity = () => {
        if (quantity > 0) {
            setQuantity(prev => prev - 1)
        }
    }

    const onSave = () => {
        let balance = selected.stocks - quantity
        if (balance < 0) {
            toast.showError("Cannot process input that can result to negative stock values.")
            return
        }
        let newItem = {
            ...selected,
            quantity: quantity,
            remaining: balance,
            markdown: selected?.price * discount
        }
        dispatch(setBrowserCart(newItem))
        dispatch(updateBrowserData(newItem))
        dispatch(resetBrowserManager())
    }

    return (
        <div className={`${browserSelector.manager ? "flex" : "hidden"} items-center fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-40 z-20`}>
            <div className="w-full h-[95vh] md:h-[75vh] bg-white overflow-y-auto relative pb-10">
                <div className="sticky top-0 bg-white flex flex-col md:flex-row px-3 py-5 gap-2 md:gap-8 border-b border-b-gray-500 border-dashed">
                    <div className="flex gap-8">
                        <span onClick={() => onClose()}>
                            <XMarkIcon className="w-5 md:w-7 w-5 md:h-7 cursor-pointer" />
                        </span>
                        <span className="text-sm md:text-lg font-bold">
                            {browserSelector.product.name}
                        </span>
                    </div>
                    <div className="flex gap-2 ml-14 md:ml-0">
                        <span className={`${selected?.price ? "" : "hidden"} text-sm md:text-lg font-bold`}>
                            {currency(selected?.price * quantity || 0)}
                        </span>
                        <span className={`${discount > 0 ? "" : "hidden"} text-sm md:text-lg font-bold`}>
                            ({currency(selected?.price * discount || 0)})
                        </span>
                    </div>
                    <span className={`${selected?.price ? "flex" : "hidden"} items-center text-sm md:text-lg font-bold ml-auto cursor-pointer px-3 no-select bg-gray-300 shadow-md rounded-md`} onClick={() => onSave()}>
                        SAVE
                    </span>
                </div>
                <div className="flex flex-wrap w-full px-5">
                    {
                        records?.map(item => (
                            <div key={item.id} className="w-full md:w-1/2 p-2 cursor-pointer" onClick={() => selectProduct(item)}>
                                <div className={`flex justify-between p-3 border border-gray-200 hover:bg-gray-200 ${selected.id === item.id ? "border-gray-500 bg-gray-200" : ""}`}>
                                    <div className="flex flex-col">
                                        <span className="text-base font-semibold">
                                            {`${item.variant_serial || "-"}/${item.variant_model || "-"}/${item.variant_brand || "-"}`}
                                        </span>
                                        <div className="text-base flex gap-5 text-gray-500">
                                            <span>#{StrFn.formatWithZeros(item.id, 6)}</span>
                                            <div className="flex gap-3">
                                                QTY:
                                                <span>{item.stocks}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-base font-semibold">{currency(item.price)}</span>
                                </div>
                            </div>
                        ))
                    }
                    <div className={`${records?.length ? "hidden" : "flex"} w-full items-center justify-center p-10`}>
                        <span className="bg-gray-300 px-5 py-2 uppercase">
                            {isLoading ? "Retrieving..." : "No records found."}
                        </span>
                    </div>
                </div>
                <div className={`${records?.length ? "flex" : "hidden"} flex-col w-full p-5 gap-1`}>
                    <span className="text-base text-gray-500">Quantity</span>
                    <div className="w-full flex gap-3">
                        <button type="button" className="px-5 py-3 text-lg bg-gray-200 hover:bg-gray-300" onClick={() => deductQuantity()}>
                            -
                        </button>
                        <input
                            type="number"
                            min={1}
                            value={quantity}
                            onChange={onQuantityChange}
                            className="w-full border border-white border-b-gray-500 outline-none ring-0 focus:outline-none focus:border-white focus:border-b-gray-500 focus:ring-0 text-center plain-input"
                        />
                        <button type="button" className="px-5 py-3 text-lg bg-gray-200 hover:bg-gray-300" onClick={() => addQuantity()}>
                            +
                        </button>
                    </div>
                </div>
                <div className={`${records?.length ? "flex" : "hidden"} flex-col w-full p-5 gap-1`}>
                    <span className="text-base text-gray-500">Discount</span>
                    <div className="w-full flex flex-wrap">
                        {
                            discountList?.map(item => (
                                <div key={item} className="w-1/3 p-2 cursor-pointer" onClick={() => selectDiscount(item)}>
                                    <div className={`flex justify-between p-3 border border-gray-200 hover:bg-gray-200 ${item === discount ? "border-gray-500 bg-gray-200" : ""}`}>
                                        <div className="flex flex-col">
                                            <span className="text-base font-semibold">
                                                {item === 0 ? "None" : `${(item * 100).toFixed(0)}%`}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CasheringComplexVariant
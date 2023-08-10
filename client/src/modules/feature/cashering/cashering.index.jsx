import { CubeIcon, DocumentPlusIcon, DocumentTextIcon, LockClosedIcon, MagnifyingGlassIcon, ReceiptPercentIcon, ShoppingCartIcon } from "@heroicons/react/24/outline"
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { useClientContext } from "../../../utilities/context/client.context"
import { sqlDate } from "../../../utilities/functions/datetime.functions"
import { NumFn, amount } from "../../../utilities/functions/number.funtions"
import { StrFn, isBranch, isEmpty } from "../../../utilities/functions/string.functions"
import useAuth from "../../../utilities/hooks/useAuth"
import { useDebounce } from "../../../utilities/hooks/useDebounce"
import BrowserRecords from "../browser/browser.records"
import { resetBrowserViewCart, setBrowserSearch, showBrowserCheckout, showBrowserViewCart } from "../browser/browser.reducer"
import { resetTransactionReceipts, showTransactionReceipts } from "./cashering.reducer"
import { useByCountTransactionMutation } from "./cashering.services"

const CasheringIndex = () => {
    const auth = useAuth()
    const location = useLocation()
    const { handleTrail } = useClientContext()
    const [instantiated, setInstantiated] = useState(false)
    const [value, setValue] = useState(0)
    const [less, setLess] = useState(0)
    const [search, setSearch] = useState("")
    const [count, setCount] = useState(1)
    const debounceSearch = useDebounce(search, 500)
    const dataSelector = useSelector(state => state.transaction)
    const browserSelector = useSelector(state => state.browser)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        handleTrail(location?.pathname)
    }, [location])

    const [countTransaction] = useByCountTransactionMutation()

    useEffect(() => {
        const instantiate = async () => {
            await countTransaction({ account: auth.id, date: sqlDate() })
                .unwrap()
                .then(res => {
                    if (res.success) {
                        setCount(amount(res.distinctResult.data.count) + 1 || 1)
                    }
                })
                .catch(err => console.error(err))
            setInstantiated(true)
        }
        if (isEmpty(browserSelector.cart.length)) {
            instantiate()
        }
    }, [browserSelector.cart])

    const onChange = (e) => {
        setSearch(e.target.value)
    }

    useEffect(() => {
        dispatch(setBrowserSearch(debounceSearch))
    }, [debounceSearch])

    useEffect(() => {
        if (browserSelector.cart) {
            setValue(browserSelector?.cart?.reduce((prev, curr) => prev + (amount(curr.price) * amount(curr.quantity)), 0))
            setLess(browserSelector?.cart?.reduce((prev, curr) => prev + amount(curr.markdown), 0))
        }
    }, [browserSelector.cart])

    const toggleViewCart = () => {
        if (!browserSelector.checkout) {
            if (browserSelector.viewcart) {
                dispatch(resetBrowserViewCart())
                return
            }
            dispatch(showBrowserViewCart())
        }
    }

    const toggleViewReceipts = () => {
        if (dataSelector.receipts) {
            dispatch(resetTransactionReceipts())
            return
        }
        dispatch(showTransactionReceipts())
    }

    const toggleCheckout = () => {
        if (value > 0) {
            dispatch(showBrowserCheckout())
        }
    }

    const navigateTo = (url) => {
        navigate(`/${url}`)
    }

    return (
        <>
            <div id="no-print" className="w-full mb-[4rem] lg:mb-0 pb-0 lg:pb-[4rem]">
                <div className="w-full bg-full border border-b border-b-gray-400 pb-5">
                    <div className="flex flex-col gap-3 lg:gap-0 lg:flex-row lg:justify-between lg:items-center">
                        <div className="text-sm lg:text-lg flex gap-2 items-center">
                            <CubeIcon className="w-5 h-5" />
                            <div>Cart No. <span className="font-bold text-orange-500">{StrFn.formatWithZeros(count, 4)}</span></div>
                        </div>
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="flex flex-col lg:justify-end lg:items-end">
                                <div className="text-lg flex gap-2">
                                    Value:
                                    <span className="text-orange-500 font-bold">
                                        {NumFn.currency(value || 0)} {less > 0 ? `(${NumFn.currency(less)})` : ""}
                                    </span>
                                </div>
                                <div className="flex gap-2 text-sm">
                                    No. of items:
                                    <span className="text-orange-500 font-bold">
                                        {browserSelector.cart.length}
                                    </span>
                                </div>
                            </div>
                            <button className="button-link bg-gradient-to-b from-orange-400 via-orange-600 to-orange-600 px-7 text-lg" onClick={() => toggleCheckout()}>Checkout</button>
                        </div>
                    </div>
                </div>
                <div className="text-xs lg:text-sm py-3">
                    <div className="flex border border-secondary-500 p-0.5 items-center">
                        <MagnifyingGlassIcon className="w-8 h-8 ml-1 text-secondary-500 hidden lg:block" />
                        <input
                            type="search"
                            value={search}
                            onChange={onChange}
                            placeholder="Search inventory item here"
                            className="w-full text-sm border-none focus:border-none outline-none ring-0 focus:ring-0 focus:outline-none grow-1"
                        />
                        <button className="button-link ml-auto px-3 lg:px-9 bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 focus:ring-0">
                            Search
                        </button>
                    </div>
                    <div className="flex mt-1 gap-2">
                        Searching Branch:
                        <span className="font-bold text-orange-500">{isBranch(auth) ? auth.store : "All Branches"}</span>
                    </div>
                    <div className="flex flex-col">
                        <BrowserRecords />
                    </div>
                </div>
                <div className="fixed bottom-0 left-16 pr-20 lg:pr-60 lg:left-56 h-[5rem] w-full border border-t border-t-secondary-500 bg-white flex items-center justify-center pl-4 z-10">
                    <div className="flex justify-around gap-1 lg:gap-2 w-full">
                        <button className="flex flex-col lg:flex-row items-center gap-1 bg-gradient-to-b from-transparent via-gray-200 to-gray-400 w-full lg:px-8 py-3 cursor-pointer rounded-md no-select" onClick={() => toggleViewCart()}>
                            <ShoppingCartIcon className="w-5 h-5" />
                            Cart
                        </button>
                        <button className="flex flex-col lg:flex-row items-center gap-1 bg-gradient-to-b from-transparent via-gray-200 to-gray-400 w-full lg:px-8 py-3 cursor-pointer rounded-md no-select">
                            <DocumentPlusIcon className="w-5 h-5" />
                            Draft
                        </button>
                        <button className="flex flex-col lg:flex-row items-center gap-1 bg-gradient-to-b from-transparent via-gray-200 to-gray-400 w-full lg:px-8 py-3 cursor-pointer rounded-md no-select">
                            <LockClosedIcon className="w-5 h-5" />
                            Lock
                        </button>
                        <button className="flex flex-col lg:flex-row items-center gap-1 bg-gradient-to-b from-transparent via-gray-200 to-gray-400 w-full lg:px-8 py-3 cursor-pointer rounded-md no-select" onClick={() => toggleViewReceipts()}>
                            <ReceiptPercentIcon className="w-5 h-5" />
                            Receipts
                        </button>
                        <button className="flex flex-col lg:flex-row items-center gap-1 bg-gradient-to-b from-transparent via-gray-200 to-gray-400 w-full lg:px-8 py-3 cursor-pointer rounded-md no-select">
                            <DocumentTextIcon className="w-5 h-5" />
                            Account
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CasheringIndex
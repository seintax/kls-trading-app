import { ArrowDownIcon, ShoppingCartIcon, TrashIcon } from "@heroicons/react/24/outline"
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { sortBy } from '../../../utilities/functions/array.functions'
import { timeDurationInHours } from "../../../utilities/functions/datetime.functions"
import { NumFn } from "../../../utilities/functions/number.funtions"
import { exactSearch, forBranch } from "../../../utilities/functions/string.functions"
import useAuth from "../../../utilities/hooks/useAuth"
import useToast from "../../../utilities/hooks/useToast"
import DataRecords from '../../../utilities/interface/datastack/data.records'
import CasheringLedger from "../cashering/cashering.ledger"
import CasheringReceipts from "../cashering/cashering.receipts"
import CasheringReimburse from "../cashering/cashering.reimburse"
import CasheringReturn from "../cashering/cashering.return"
import PaymentBrowser from "../payment/payment.browser"
import PaymentCustomer from "../payment/payment.customer"
import PaymentDiscount from "../payment/payment.discount"
import PaymentPrinting from "../payment/payment.printing"
import BrowserCheckout from "./browser.checkout"
import BrowserPurchase from "./browser.purchase"
import BrowserQuantity from "./browser.quantity"
import { removeBrowserCart, setBrowserData, setBrowserItem, setBrowserNotifier, setBrowserSearchCount, showBrowserManager } from "./browser.reducer"
import { useFetchAllBrowserByBranchMutation } from "./browser.services"

const BrowserRecords = () => {
    const qtyRef = useRef(null)
    const auth = useAuth()
    const [allInventory, { isLoading }] = useFetchAllBrowserByBranchMutation()
    const dataSelector = useSelector(state => state.browser)
    const dispatch = useDispatch()
    const [records, setrecords] = useState()
    const [startpage, setstartpage] = useState(1)
    const [sorted, setsorted] = useState()
    const columns = dataSelector.header
    const toast = useToast()

    useEffect(() => {
        const instantiate = async () => {
            await allInventory({ branch: forBranch(auth) })
                .unwrap()
                .then(res => {
                    if (res.success) {
                        dispatch(setBrowserData(res?.arrayResult))
                        dispatch(setBrowserNotifier(false))
                    }
                })
                .catch(err => console.error(err))
            return
        }
        if (dataSelector.data.length === 0 || dataSelector.notifier || auth?.store) {
            instantiate()
        }
    }, [dataSelector.notifier, auth])

    const selectItem = (item) => {
        dispatch(setBrowserItem(item))
        dispatch(showBrowserManager())
        qtyRef.current && qtyRef.current?.focus()
    }

    const removeItem = (item) => {
        if (window.confirm("Do you wish to remove this from cart?")) {
            dispatch(removeBrowserCart(item))
        }
    }

    const displayStatus = (item) => {
        let beg = new Date(item.time).getTime()
        let end = (new Date()).getTime()
        let diff = timeDurationInHours(beg, end)
        if (diff <= 72) {
            return (
                <div className="px-0">
                    <span className="bg-orange-500 text-white text-xs py-0.5 px-1 rounded-[5px] cursor-default hover:no-underline">New</span>
                </div>
            )
        }
        return null
    }

    const items = (item) => {
        return [
            {
                value:
                    <div className="flex gap-1 flex-wrap">
                        {displayStatus(item)}
                        <span className="bg-white px-1 rounded-md border border-gray-500">
                            {item.product_name}
                        </span>
                        <span className={`${item.category ? "" : "hidden"} bg-gradient-to-b from-white to-red-200 px-1 rounded-md border border-gray-400`}>
                            {item.category}
                        </span>
                        <span className={`${item.variant_serial?.replaceAll("-", "") ? "" : "hidden"} bg-gradient-to-b from-white to-blue-200 px-1 rounded-md border border-gray-400`}>
                            {item.variant_serial}
                        </span>
                        <span className={`${item.variant_model?.replaceAll("-", "") ? "" : "hidden"} bg-gradient-to-b from-white to-blue-200 px-1 rounded-md border border-gray-400`}>
                            {item.variant_model}
                        </span>
                        <span className={`${item.variant_brand?.replaceAll("-", "") ? "" : "hidden"} bg-gradient-to-b from-white to-blue-200 px-1 rounded-md border border-gray-400`}>
                            {item.variant_brand}
                        </span>
                        <span className={`${item.supplier_name ? "" : "hidden"} bg-gradient-to-b from-white to-green-200 px-1 rounded-md border border-gray-400`}>
                            Supplier: {item.supplier_name}
                        </span>
                    </div>
            },
            { value: item.stocks },
            { value: NumFn.currency(item.price) },
            { value: item.remaining || 0 },
            { value: <span className="bg-yellow-300 text-xs px-1 py-0.2 rounded-sm shadow-md">{item.store}</span> },
            {
                value: <div className="flex flex-col">
                    <span>{item.quantity || ""}</span>
                    <span className={item.markdown ? "text-xs text-red-500 flex items-center" : "hidden"}>
                        -{NumFn.currency(item.markdown)}<ArrowDownIcon className="w-3 h-4" />
                    </span>
                </div>
            },
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
            let sought = dataSelector?.search?.toLowerCase()
            let browsed = dataSelector?.data.filter(f =>
                (
                    f.product_name?.toLowerCase()?.includes(sought) ||
                    `${f.variant_serial}/${f.variant_model}/${f.variant_brand}`?.toLowerCase()?.includes(sought) ||
                    f.supplier_name?.toLowerCase()?.includes(sought) ||
                    f.price?.toString()?.includes(sought) ||
                    f.stocks?.toString()?.includes(sought) ||
                    exactSearch(sought, f.price) ||
                    exactSearch(sought, f.stocks)
                )
                && f.acquisition !== "TRANSMIT"
            )
            let data = sorted ? sortBy(browsed, sorted) : browsed
            dispatch(setBrowserSearchCount(data.length))
            setrecords(data?.map((item, i) => {
                return {
                    key: item.id,
                    items: items(item),
                    ondoubleclick: () => { },
                }
            }))
        }
    }, [dataSelector?.data, dataSelector?.search, sorted])

    return (
        <>
            <BrowserQuantity qtyRef={qtyRef} />
            <DataRecords
                page={startpage}
                columns={columns}
                records={records}
                setsorted={setsorted}
                setPage={setstartpage}
                itemsperpage={dataSelector?.perpage}
                loading={isLoading}
                fontsize="lg"
            />
            <BrowserPurchase />
            <BrowserCheckout />
            <PaymentBrowser />
            <PaymentDiscount />
            <PaymentCustomer />
            <PaymentPrinting />
            <CasheringReceipts />
            <CasheringLedger />
            <CasheringReturn />
            <CasheringReimburse />
        </>
    )
}
export default BrowserRecords
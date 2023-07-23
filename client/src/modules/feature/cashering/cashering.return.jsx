import { Transition } from "@headlessui/react"
import { CalculatorIcon, XMarkIcon } from "@heroicons/react/24/outline"
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { NumFn, amount } from "../../../utilities/functions/number.funtions"
import useToast from "../../../utilities/hooks/useToast"
import { resetDispensingItem, resetDispensingManager, updateDispensingData } from "./dispensing.reducer"

const CasheringReturn = () => {
    const qtyRef = useRef()
    const dataSelector = useSelector(state => state.dispensing)
    const dispatch = useDispatch()
    const [quantity, setQuantity] = useState("")
    const [balance, setBalance] = useState(0)
    const toast = useToast()

    useEffect(() => {
        setBalance(amount(dataSelector.item.dispense))
    }, [dataSelector.item.id])


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
        setBalance(amount(dataSelector.item.dispense) - amount(e.target.value || 0))
    }

    const onClose = () => {
        dispatch(resetDispensingItem())
        dispatch(resetDispensingManager())
    }

    const onFocus = (e) => {
        e.target.select()
    }

    const onReset = () => {
        setQuantity("")
        setBalance(amount(dataSelector.item.dispense) - amount(0))
        qtyRef.current.focus()
    }

    const onSubmit = (e) => {
        e.preventDefault()
        if (balance < 0) {
            toast.showError("Cannot process input that can result to negative stock values.")
            return
        }

        let newItem = {
            ...dataSelector.item,
            toreturn: quantity,
            forreturned: amount(dataSelector.item.dispense) - amount(quantity),
            returntotal: amount(dataSelector.item.price) * amount(quantity),
            returnvat: (amount(dataSelector.item.vat) / amount(dataSelector.item.dispense)) * amount(quantity),
            returnless: (amount(dataSelector.item.less) / amount(dataSelector.item.dispense)) * amount(quantity),
            returnnet: (amount(dataSelector.item.price) * amount(quantity)) - ((amount(dataSelector.item.less) / amount(dataSelector.item.dispense)) * amount(quantity)),
            remaintotal: amount(dataSelector.item.total) - (amount(dataSelector.item.price) * amount(quantity)),
            remainvat: (amount(dataSelector.item.vat) / amount(dataSelector.item.dispense)) * (amount(dataSelector.item.dispense) - amount(quantity)),
            remainless: (amount(dataSelector.item.less) / amount(dataSelector.item.dispense)) * (amount(dataSelector.item.dispense) - amount(quantity)),
            remainnet: (amount(dataSelector.item.total) - (amount(dataSelector.item.price) * amount(quantity))) - ((amount(dataSelector.item.less) / amount(dataSelector.item.dispense)) * (amount(dataSelector.item.dispense) - amount(quantity)))
        }
        setQuantity("")
        setBalance(0)
        dispatch(updateDispensingData(newItem))
        dispatch(resetDispensingManager())
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
            className="fixed left-0 top-0 h-screen w-screen bg-gradient-to-r from-[#00000070] via-[#00000070] to-[#00000040] z-20 flex items-center justify-center"
        >
            <Transition.Child
                enter="transition ease-in-out duration-500 transform"
                // enterFrom="-translate-y-0"
                // enterTo="translate-y-full lg:translate-y-48"
                leave="transition ease-in-out duration-500 transform"
                // leaveFrom="translate-y-0"
                // leaveTo="-translate-y-full"
                className="flex flex-col gap-2 bg-white p-3 w-[80%] lg:w-[550px] h-fit text-sm mt-1"
            >
                <div className="flex items-center justify-between">
                    <div>RETURN QUANTITY</div>
                    <div onClick={() => onClose()}>
                        <XMarkIcon className="w-5 h-5 cursor-pointer" />
                    </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                    <div className="flex flex-col-reverse border border-secondary-500 bg-gray-300 rounded-md py-2 px-4">
                        <span className="text-[15px]">{dataSelector.item.product_name}</span>
                        <span className="text-gray-400">product name</span>
                    </div>
                    <div className="flex flex-col-reverse border border-secondary-500 bg-gray-300 rounded-md py-2 px-4">
                        <span className="text-[15px]">{`${dataSelector.item.variant_serial}/${dataSelector.item.variant_model}/${dataSelector.item.variant_brand}`}</span>
                        <span className="text-gray-400">variant</span>
                    </div>
                    <div className="flex flex-col-reverse border border-secondary-500 bg-gray-300 rounded-md py-2 px-4">
                        <span className="text-[15px]">{dataSelector.item.product_category}</span>
                        <span className="text-gray-400">category</span>
                    </div>
                    <div className="flex flex-col-reverse border border-secondary-500 bg-gray-300 rounded-md py-2 px-4">
                        <span className="text-[15px]">{dataSelector.item.inventory_store}</span>
                        <span className="text-gray-400">branch</span>
                    </div>
                    <div className="flex flex-col-reverse border border-secondary-500 bg-gray-300 rounded-md py-2 px-4">
                        <span className="text-[15px]">{dataSelector.item.supplier_name}</span>
                        <span className="text-gray-400">supplier</span>
                    </div>
                    <div className="flex flex-col-reverse border border-secondary-500 bg-gray-300 rounded-md py-2 px-4">
                        <span className="text-[15px]">{dataSelector.item.dispense}</span>
                        <span className="text-gray-400">quantity</span>
                    </div>
                    <div className="flex flex-col-reverse border border-secondary-500 bg-gray-300 rounded-md py-2 px-4">
                        <span className="text-[15px]">{NumFn.currency(dataSelector.item.price)}</span>
                        <span className="text-gray-400">price</span>
                    </div>
                </div>
                <form onSubmit={onSubmit} className="flex flex-col gap-2">
                    <div className="flex border border-secondary-500 p-0.5 items-center">
                        <CalculatorIcon className="w-8 h-8 ml-1 text-secondary-500" />
                        <input
                            ref={qtyRef}
                            type="number"
                            value={quantity}
                            onChange={onChange}
                            onFocus={onFocus}
                            tabIndex={1}
                            autoFocus
                            required
                            placeholder="Enter return quantity"
                            className="w-full border-none focus:border-none outline-none ring-0 focus:ring-0 focus:outline-none grow-1"
                        />
                        <button type="button" className="button-link ml-auto px-6 bg-gradient-to-b from-primary-500 via-secondary-500 to-secondary-600 focus:ring-0" onClick={() => onReset()}>Reset</button>
                    </div>
                    <div>
                        <div className={`flex flex-col-reverse border border-secondary-500 rounded-md py-2 px-4 ${balance < 0 ? "bg-red-500 [&>*]:text-white" : "bg-white"}`}>
                            <div className={`text-[15px]`}>
                                {balance}
                            </div>
                            <span className="text-gray-400">balance after commit</span>
                        </div>
                    </div>
                    <div className="flex flex-col-reverse lg:flex-row gap-2 lg:gap-0 justify-end mt-5">
                        <button type="button" tabIndex={-1} className="button-cancel text-white p-2.5" onClick={() => onClose()}>Cancel</button>
                        <button type="submit" className="button-submit">Add Return</button>
                    </div>
                </form>
            </Transition.Child>
        </Transition>
    )
}

export default CasheringReturn
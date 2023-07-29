import { Transition } from "@headlessui/react"
import { PrinterIcon, XMarkIcon } from "@heroicons/react/20/solid"
import React from 'react'
import { useDispatch, useSelector } from "react-redux"
import PrintReceipt from "../../system/prints/print.receipt"
import { resetPaymentPrint } from "./payment.reducer"

const PaymentPrinting = () => {
    const dataSelector = useSelector(state => state.payment)
    const dispatch = useDispatch()

    const onClose = () => {
        dispatch(resetPaymentPrint())
    }

    const onPrint = () => {
        var printContents = document.getElementById("receipt").innerHTML
        var originalContents = document.body.innerHTML
        document.body.innerHTML = printContents
        window.print()
        document.body.innerHTML = originalContents
    }

    return (
        <Transition
            show={dataSelector.print}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            className={`fixed left-0 top-0 h-screen w-screen bg-gradient-to-r from-[#00000070] via-[#00000070] to-[#00000040] z-20 flex items-start justify-center overflow-y-auto`}
        >
            <Transition.Child
                enter="transition ease-in-out duration-500 transform"
                enterFrom="translate-y-full"
                enterTo="translate-y-0"
                leave="transition ease-in-out duration-500 transform"
                leaveFrom="translate-y-0"
                leaveTo="translate-y-full"
                className="flex items-center justify-center min-h-screen w-full relative"
            >
                <PrintReceipt />
            </Transition.Child>
            <div className="p-2 bg-red-500 rounded-md fixed top-2 right-5 border-2 border-white shadow-lg text-white z-20" onClick={() => onClose()}>
                <XMarkIcon className="w-7 h-7 cursor-pointer" />
            </div>
            <div className="p-2 bg-blue-500 rounded-md fixed bottom-2 right-5 border-2 border-white shadow-lg text-white z-20" onClick={() => onPrint()}>
                <PrinterIcon className="w-7 h-7 cursor-pointer" />
            </div>
        </Transition>
    )
}

export default PaymentPrinting
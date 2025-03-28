import { Transition } from "@headlessui/react"
import { ArrowLeftIcon } from "@heroicons/react/20/solid"
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import ReportsFormStockAlert from "../../system/reports/report.form.stock-alert"
import { resetReportAlert, setReportName, showReportManager } from "../../system/reports/reports.reducer"

const InventoryLevelReport = () => {
    const dataSelector = useSelector(state => state.reports)
    const dispatch = useDispatch()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        if (dataSelector.alert) setMounted(true)
    }, [dataSelector.alert])

    useEffect(() => {
        if (mounted) {
            dispatch(setReportName("Stock Alert"))
            dispatch(showReportManager())

            return () => { }
        }
    }, [mounted])

    const toggleOff = () => {
        dispatch(resetReportAlert())
    }

    return (
        <>
            <Transition
                show={dataSelector.alert || false}
                enter="transition-opacity ease-linear duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                className={`fixed left-16 lg:left-56 top-12 lg:top-24 mt-2 h-full w-full bg-gradient-to-r from-[#00000070] via-[#00000070] to-[#00000040] z-10 flex items-start justify-end`}
                key="Stock Alert"
            >
                <Transition.Child
                    enter="transition ease-in-out duration-500 transform"
                    enterFrom="translate-y-full"
                    enterTo="translate-y-0"
                    leave="transition ease-in-out duration-500 transform"
                    leaveFrom="translate-y-0"
                    leaveTo="translate-y-full"
                    className="flex flex-col gap-2 bg-white px-3 w-full h-full text-sm mt-1 pr-20 lg:pr-60 pb-48"
                >
                    <div className="pl-1 pt-3 text-secondary-500 font-bold text-lg flex items-center gap-4">
                        <ArrowLeftIcon className="w-6 h-6 cursor-pointer" onClick={() => toggleOff()} />
                        <span>Stock Alert</span>
                    </div>
                    <ReportsFormStockAlert />
                </Transition.Child>
            </Transition>
        </>
    )
}

export default InventoryLevelReport
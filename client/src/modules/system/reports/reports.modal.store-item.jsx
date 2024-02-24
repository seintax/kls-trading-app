import { Transition } from "@headlessui/react"
import { ArrowLeftIcon } from "@heroicons/react/24/solid"
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { currency } from "../../../utilities/functions/number.funtions"
import { cleanDisplay } from "../../../utilities/functions/string.functions"
import { setReportShowItem } from "./reports.reducer"
import { useInventoryByStoreItemReportMutation } from "./reports.services"

const ReportsModalStoreItem = () => {
    const reportSelector = useSelector(state => state.reports)
    const dispatch = useDispatch()
    const [storeItem, { isLoading }] = useInventoryByStoreItemReportMutation()
    const [record, setRecord] = useState()

    const instantiate = async () => {
        await storeItem({
            product: reportSelector.inventory.productid,
            variant: reportSelector.inventory.variantid,
            cost: reportSelector.inventory.cost,
            price: reportSelector.inventory.price,
        })
            .unwrap()
            .then(res => {
                if (res.success) setRecord(res.data)
            })
            .catch(err => console.error(err))
    }

    useEffect(() => {
        if (reportSelector.showitem) {
            instantiate()
        }
    }, [reportSelector.showitem, reportSelector.inventory])

    const toggleOff = () => {
        dispatch(setReportShowItem(false))
    }

    return (
        <>
            <Transition
                show={reportSelector.showitem}
                enter="transition-opacity ease-linear duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                className={`fixed left-16 lg:left-auto pr-16 lg:pr-0 lg:right-0 top-12 lg:top-24 mt-[13px] h-full w-full lg:w-1/2 bg-gradient-to-r from-[#00000070] via-[#00000070] to-[#00000040] z-10 flex items-start justify-end border-l border-l-gray-500 border-t border-t-gray-500`}
            >
                <Transition.Child
                    enter="transition ease-in-out duration-500 transform"
                    enterFrom="translate-y-full"
                    enterTo="translate-y-0"
                    leave="transition ease-in-out duration-500 transform"
                    leaveFrom="translate-y-0"
                    leaveTo="translate-y-full"
                    className="flex flex-col gap-2 bg-white w-full h-full text-sm mt-0 px-3 pb-48 overflow-y-auto"
                >
                    <div className="sticky top-0 bg-white text-gray-500 font-bold text-lg">
                        <div className="flex items-center gap-4 pl-1 py-3">
                            <ArrowLeftIcon className="w-6 h-6 cursor-pointer" onClick={() => toggleOff()} />
                            <span>{cleanDisplay(reportSelector.inventory?.inventory)}</span>
                        </div>
                        <hr className="w-full bg-gray-400 text-gray-400 h-0.5" />
                    </div>
                    <div className="flex flex-col w-full px-2 text-base gap-3">
                        <div className="flex flex-col">
                            <div className="flex justify-between">
                                <span className="font-semibold">Cost</span>
                                <span className="font-semibold">
                                    {currency(reportSelector.inventory.cost)}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="flex justify-between">
                                <span className="font-semibold">Price</span>
                                <span className="font-semibold">
                                    {currency(reportSelector.inventory.price)}
                                </span>
                            </div>
                        </div>
                        <hr className="w-full bg-gray-400 text-gray-400 h-0.5" />
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between mb-5">
                                <span className="font-semibold">Branches:</span>
                            </div>
                            {
                                record?.map(item => (
                                    <div className="flex justify-between hover:bg-gray-300 cursor-pointer" key={item.code}>
                                        <span className="font-semibold px-3 py-2 w-1/2">{item.name}</span>
                                        <span className="font-semibold px-3 py-2 w-1/2 text-right">
                                            {isLoading
                                                ? <div className="skeleton-loading"></div>
                                                : item.stocks || 0}
                                        </span>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </Transition.Child>
            </Transition>
        </>
    )
}

export default ReportsModalStoreItem
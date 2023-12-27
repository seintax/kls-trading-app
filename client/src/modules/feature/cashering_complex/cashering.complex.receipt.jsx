import { Transition } from "@headlessui/react"
import { ArrowLeftIcon } from "@heroicons/react/20/solid"
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { momentPST } from "../../../utilities/functions/datetime.functions"
import { currency } from "../../../utilities/functions/number.funtions"
import { StrFn, cleanDisplay } from "../../../utilities/functions/string.functions"
import { resetReportReceipt } from "../../system/reports/reports.reducer"
import { useByCodeDispensingMutation } from "../browser/browser.services"

const CasheringComplexReceipt = () => {
    const dataSelector = useSelector(state => state.reports)
    const dispatch = useDispatch()
    const [dispensed, setDispensed] = useState()

    const [byCodeDispensing] = useByCodeDispensingMutation()

    const toggleOff = () => {
        dispatch(resetReportReceipt())
    }

    const reformatCode = (code) => {
        if (code) {
            let codeArr = code?.split("-")
            let firstTag = codeArr?.shift()
            return codeArr.join("-").slice(3, 15)
        }
        return code
    }

    useEffect(() => {
        if (dataSelector.transaction.id) {
            const instantiate = async () => {
                await byCodeDispensing({ code: dataSelector.transaction.code })
                    .unwrap()
                    .then(res => {
                        if (res.success) setDispensed(res?.arrayResult)
                    })
                    .catch(err => console.error(err))
            }

            instantiate()
        }
    }, [dataSelector.transaction])

    return (
        <>
            <Transition
                show={dataSelector.receipt}
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
                    className="flex flex-col gap-2 bg-white w-full h-full text-sm mt-0 px-3 pb-48"
                >
                    <div className="pl-1 pt-3 text-gray-500 font-bold text-lg flex items-center gap-4">
                        <ArrowLeftIcon className="w-6 h-6 cursor-pointer" onClick={() => toggleOff()} />
                        <span>№. {reformatCode(dataSelector?.transaction?.code)}</span>
                    </div>
                    <div className="flex flex-col w-full px-2 text-base gap-3">
                        <hr className="w-full bg-gray-400 text-gray-400 h-0.5" />
                        <div className="flex flex-col gap-0 items-center justify-center w-full h-[100px]">
                            <span className="flex justify-end text-red-600 text-lg w-full">
                                &nbsp;<span className={dataSelector?.transaction?.return > 0 ? "flex" : "hidden"}>Refund: ₱{currency(dataSelector?.transaction?.return)}</span>
                            </span>
                            <span className="font-semibold text-3xl">
                                ₱{currency(dataSelector?.transaction?.net)}
                            </span>
                            <span className="text-lg">Total</span>
                        </div>
                        <hr className="w-full bg-gray-400 text-gray-400 h-0.5" />
                        <div className="flex flex-col">
                            <span>
                                Employee: {StrFn.properCase(dataSelector?.transaction?.account_name)}
                            </span>
                            <span>
                                Role: {dataSelector?.transaction?.acct_role}
                            </span>
                        </div>
                        <hr className="w-full bg-gray-400 text-gray-400 h-0.5" />
                        <div className="flex flex-col">
                            <span>
                                Customer: {dataSelector?.transaction?.customer_name}
                            </span>
                        </div>
                        <hr className="w-full bg-gray-400 text-gray-400 h-0.5" />
                        <div className="flex flex-col max-h-[260px] overflow-y-auto pr-2">
                            {
                                dispensed?.map(item => (
                                    <div key={item.id} className="flex justify-between items-start hover:bg-gray-300">
                                        <div className="flex flex-col">
                                            <span>{item.product_name}</span>
                                            <span className="text-sm">
                                                ({cleanDisplay(`${item.variant_serial}/${item.variant_model}/${item.variant_brand}`)})
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                <span>({item.dispense} x {currency(item.price)})</span>
                                                <span className={`${(item.less || 0) + (item.markdown || 0) > 0 ? "" : "hidden"}`}> - {currency((item.less || 0) + (item.markdown || 0))}</span>
                                            </span>
                                        </div>
                                        <span>₱{currency(item.net)}</span>
                                    </div>
                                ))
                            }
                        </div>
                        <hr className="w-full bg-gray-400 text-gray-400 h-0.5" />
                        <div className="flex flex-col">
                            <div className="flex justify-between">
                                <span>Discount</span>
                                <span>-₱{currency((dataSelector?.transaction?.less || 0) + (dataSelector?.transaction?.markdown || 0))}</span>
                            </div>
                        </div>
                        <hr className="w-full bg-gray-400 text-gray-400 h-0.5" />
                        <div className="flex flex-col">
                            <div className="flex justify-between">
                                <span className="font-semibold">Total</span>
                                <span className="font-semibold">₱{currency(dataSelector?.transaction?.net || 0)}</span>
                            </div>
                            <div className="flex justify-between mt-3">
                                <span>Cash</span>
                                <span>₱{currency(dataSelector?.transaction?.tended || 0)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Change</span>
                                <span>₱{currency(dataSelector?.transaction?.change || 0)}</span>
                            </div>
                        </div>
                        <hr className="w-full bg-gray-400 text-gray-400 h-0.5" />
                        <div className="flex flex-col text-gray-500">
                            <span>{momentPST(dataSelector?.transaction?.time, "MMM DD, YYYY hh:mm A")}</span>
                        </div>
                    </div>
                </Transition.Child>
            </Transition>
        </>
    )
}

export default CasheringComplexReceipt
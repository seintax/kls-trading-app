import { Transition } from "@headlessui/react"
import { ArrowLeftIcon } from "@heroicons/react/24/outline"
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { StrFn } from "../../../utilities/functions/string.functions"
import useToast from "../../../utilities/hooks/useToast"
import { setReportShowIncome } from "./reports.reducer"
import { useByNoneRangeStatementMutation } from "./reports.statement"

const ReportsModalIncomeData = ({ setdata, statement, filters }) => {
    const dispatch = useDispatch()
    const reportSelector = useSelector(state => state.reports)
    const [entry, setEntry] = useState({ beginning: "", freight: "" })
    const [noneRange, { isLoading }] = useByNoneRangeStatementMutation()
    const [archive, setArchive] = useState([])
    const toast = useToast()

    const toggleOff = () => {
        dispatch(setReportShowIncome(false))
    }

    const onChange = (e) => {
        const { name, value } = e.target
        setEntry(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const onSubmit = (e) => {
        e.preventDefault()
        if (Number(entry.beginning) === 0) {
            toast.showWarning("Cannot apply zero beginning balance.")
            return
        }
        setdata(prev => ({ ...prev, ...entry }))
        dispatch(setReportShowIncome(false))
    }

    useEffect(() => {
        const instantiate = async (prop) => {
            await noneRange(prop)
                .unwrap()
                .then(res => {
                    if (res.success) {
                        setArchive(res.arrayResult?.filter(f => f.id !== statement?.id))
                    }
                })
                .catch(err => console.error(err))
        }
        if (reportSelector.showincome && filters) {
            setEntry({ beginning: "", freight: "" })
            instantiate(filters)
        }
    }, [reportSelector.showincome, filters, statement])

    const onRecordClick = (value) => {
        setEntry(prev => ({ ...prev, beginning: value }))
    }

    return (
        <>
            <Transition
                show={reportSelector.showincome}
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
                            <span>Set Reference Data for Income Statement</span>
                        </div>
                        <hr className="w-full bg-gray-400 text-gray-400 h-0.5" />
                    </div>
                    <form onSubmit={onSubmit} className="flex flex-col w-full px-2 py-5 text-base gap-3">
                        <div className="flex flex-col px-10 gap-2">
                            <label htmlFor="">Beginning Inventory:</label>
                            <div className="w-full">
                                <input type="number" className="rounded-sm w-full" placeholder="0.00" name="beginning" value={entry?.beginning} onChange={onChange} required />
                            </div>
                        </div>
                        <div className="flex flex-col px-10 gap-2">
                            <label htmlFor="">
                                Previous Record: {filters.store ? filters.store : "All Branches"}, {filters.category ? filters.category : "All Categories"}
                            </label>
                            <div className="w-full h-[205px] border border-gray-700 overflow-y-auto">
                                {
                                    isLoading ? (
                                        <div className="flex flex-col w-full p-2 gap-2">
                                            <div className="skeleton-loading w-full"></div>
                                            <div className="skeleton-loading w-[75%]"></div>
                                            <div className="skeleton-loading w-full"></div>
                                            <div className="skeleton-loading w-[75%]"></div>
                                            <div className="skeleton-loading w-full"></div>
                                            <div className="skeleton-loading w-[75%]"></div>
                                        </div>
                                    ) : (
                                        archive?.length ? (
                                            archive?.map(item => (
                                                <div key={item.id} className="flex w-full gap-2 justify-between p-3 cursor-pointer hover:bg-gray-200 transition ease-in delay-200" onClick={() => onRecordClick(Number(item.inventory))}>
                                                    <div>[{StrFn.formatWithZeros(item.id, 5)}] {item.month}</div>
                                                    <div>{item.inventory}0.00</div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="flex w-full h-full items-center justify-center">
                                                <span className="text-gray-500 no-select">No records found.</span>
                                            </div>
                                        )
                                    )
                                }
                            </div>
                        </div>
                        <div className="flex flex-col px-10 gap-2">
                            <label htmlFor="">Freight In:</label>
                            <div className="w-full">
                                <input type="number" className="rounded-sm w-full" placeholder="0.00" name="freight" value={entry?.freight} onChange={onChange} required />
                            </div>
                        </div>
                        <div className="flex px-10 ml-auto mt-5">
                            <button type="submit" className="button-action" disabled={isLoading}>Apply Values</button>
                        </div>
                    </form>
                </Transition.Child>
            </Transition>
        </>
    )
}

export default ReportsModalIncomeData
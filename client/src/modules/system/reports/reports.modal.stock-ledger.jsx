import { Transition } from "@headlessui/react"
import { ArrowLeftIcon } from "@heroicons/react/24/solid"
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { sqlTimestamp } from "../../../utilities/functions/datetime.functions"
import { NumFn } from "../../../utilities/functions/number.funtions"
import { cleanDisplay, isDev, reformatCode, reformatIfCode } from "../../../utilities/functions/string.functions"
import useAuth from "../../../utilities/hooks/useAuth"
import { useByAuditDispensingMutation, useByAuditReturnedMutation } from "../../feature/browser/browser.services"
import { useByAuditAdjustmentMutation } from "../../feature/inventory-item/inventory.item.services"
import { useByAuditTransmitMutation } from "../../feature/transfer-item/transfer.item.services"
import { setReportShowLedger } from "./reports.reducer"

const ReportsModalStockLedger = () => {
    const auth = useAuth()
    const dispatch = useDispatch()
    const reportSelector = useSelector(state => state.reports)
    const [dispensingrecord, setDispensingRecord] = useState()
    const [transmitrecord, setTransmitRecord] = useState()
    const [adjustmentrecord, setAdjustmentRecord] = useState()
    const [returnedrecord, setReturnedRecord] = useState()
    const [view, setView] = useState('Categorize')
    const [timeLine, setTimeLine] = useState()

    const [stockDispensing, { isLoading: dispensingLoading, isSuccess: dispensingSuccess }] = useByAuditDispensingMutation()
    const [stockTransmit, { isLoading: transmitLoading, isSuccess: transmitSuccess }] = useByAuditTransmitMutation()
    const [stockAdjustment, { isLoading: adjustmentLoading, isSuccess: adjustmentSuccess }] = useByAuditAdjustmentMutation()
    const [stockReturned, { isLoading: returnedLoading, isSuccess: returnedSuccess }] = useByAuditReturnedMutation()

    const dispensingTotal = dispensingrecord?.reduce((prev, curr) => prev + curr.quantity, 0)
    const transmitedTotal = transmitrecord?.reduce((prev, curr) => prev + (!curr.reference.includes("Pending") ? curr.quantity : 0), 0)
    const adjustmentTotal = adjustmentrecord?.reduce((prev, curr) => prev + (curr.reference === "Add Inventory" ? curr.quantity : 0), 0)
    const deductionTotal = adjustmentrecord?.reduce((prev, curr) => prev + (curr.reference !== "Add Inventory" ? curr.quantity : 0), 0)
    const returnedTotal = returnedrecord?.reduce((prev, curr) => prev + curr.quantity, 0)
    const stockCost = reportSelector.inventory?.cost || 0
    const totalIn = reportSelector.inventory.beginning + reportSelector.inventory.goodsin + reportSelector.inventory.purchase + reportSelector.inventory.adjustment + reportSelector.inventory.unreceived
    const totalOut = reportSelector.inventory.sold + reportSelector.inventory.goodsout + reportSelector.inventory.deducted + reportSelector.inventory.pending
    const balance = reportSelector.inventory.endbalance
    const completedFetch = dispensingSuccess && transmitSuccess && adjustmentSuccess && returnedSuccess

    const instantiate = async () => {
        await stockDispensing({
            asof: reportSelector.filter.asof,
            product: reportSelector.inventory.productid,
            variant: reportSelector.inventory.variantid,
            cost: reportSelector.inventory?.cost || '',
            branch: reportSelector.filter.branch,
        })
            .unwrap()
            .then(res => {
                if (res.success) setDispensingRecord(res.data)
            })
            .catch(err => console.error(err))
        await stockTransmit({
            asof: reportSelector.filter.asof,
            product: reportSelector.inventory.productid,
            variant: reportSelector.inventory.variantid,
            cost: reportSelector.inventory?.cost || '',
            branch: reportSelector.filter.branch,
        })
            .unwrap()
            .then(res => {
                if (res.success) setTransmitRecord(res.data)
            })
            .catch(err => console.error(err))
        await stockAdjustment({
            asof: reportSelector.filter.asof,
            product: reportSelector.inventory.productid,
            variant: reportSelector.inventory.variantid,
            cost: reportSelector.inventory?.cost || '',
            branch: reportSelector.filter.branch,
        })
            .unwrap()
            .then(res => {
                if (res.success) setAdjustmentRecord(res.data)
            })
            .catch(err => console.error(err))
        await stockReturned({
            asof: reportSelector.filter.asof,
            product: reportSelector.inventory.productid,
            variant: reportSelector.inventory.variantid,
            cost: reportSelector.inventory?.cost || '',
            branch: reportSelector.filter.branch,
        })
            .unwrap()
            .then(res => {
                if (res.success) setReturnedRecord(res.data)
            })
            .catch(err => console.error(err))
    }

    useEffect(() => {
        if (reportSelector.showledger) {
            instantiate()
        }
    }, [reportSelector.showledger, reportSelector.inventory])

    const injectType = (arr, type) => {
        return arr?.map(item => {
            return {
                ...item,
                datatype: type
            }
        }) || []
    }

    useEffect(() => {
        console.log(dispensingrecord)
        const consolidatedData = [...injectType(returnedrecord, "Return"), ...injectType(adjustmentrecord, "Adjustment"), ...injectType(dispensingrecord, "Sold"), ...injectType(transmitrecord, "Goods out")]
            ?.sort((a, b) => new Date(a.time) - new Date(b.time))
        setTimeLine(consolidatedData)
    }, [completedFetch])


    const toggleOff = () => {
        dispatch(setReportShowLedger(false))
    }

    const computeDiscrepancy = (item) => {
        const totalIn = item.beginning + item.goodsin + item.purchase + item.adjustment + item.unreceived
        const totalOut = item.sold + item.goodsout + item.deducted + item.pending
        const computedEndBalance = totalIn - totalOut
        const validEndBalance = item.endbalance
        return validEndBalance - Math.abs(computedEndBalance)
    }

    const typeOfDiscrepancy = (item) => {
        const totalIn = item.beginning + item.goodsin + item.purchase + item.adjustment + item.unreceived
        const totalOut = item.sold + item.goodsout + item.deducted + item.pending
        const computedEndBalance = totalIn - totalOut
        const validEndBalance = item.endbalance
        const discrepancy = validEndBalance - Math.abs(computedEndBalance)
        return discrepancy === 0 ? "" : (discrepancy < 0 ? "(Missing)" : "(Excess)")
    }

    return (
        <>
            <Transition
                show={reportSelector.showledger}
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
                            {isDev(auth) ? <span className="ml-auto">(P: {reportSelector.inventory.productid})(V: {reportSelector.inventory.variantid})</span> : null}
                        </div>
                        <hr className="w-full bg-gray-400 text-gray-400 h-0.5" />
                    </div>
                    <div className="flex flex-col w-full px-2 text-base gap-3">
                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between">
                                <span className="font-semibold w-full">Cost</span>
                                <span className="font-semibold w-[500px] text-right">
                                    {NumFn.acctg.currency(stockCost)}
                                </span>
                            </div>
                            <hr className="w-full bg-gray-400 text-gray-400 h-0.5" />
                            <div className="flex justify-between">
                                <span className="font-semibold w-full">Beginning</span>
                                <span className="font-semibold w-[300px] text-right">
                                    {NumFn.acctg.number(reportSelector.inventory.beginning)}
                                </span>
                                <span className="font-semibold w-[600px] text-right">
                                    {NumFn.acctg.currency(stockCost * reportSelector.inventory.beginning)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold w-full">Purchase</span>
                                <span className="font-semibold w-[300px] text-right">
                                    {NumFn.acctg.number(reportSelector.inventory.purchase)}
                                </span>
                                <span className="font-semibold w-[600px] text-right">
                                    {NumFn.acctg.currency(stockCost * reportSelector.inventory.purchase)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold w-full">Goods In</span>
                                <span className="font-semibold w-[300px] text-right">
                                    {NumFn.acctg.number(reportSelector.inventory.goodsin)}
                                </span>
                                <span className="font-semibold w-[600px] text-right">
                                    {NumFn.acctg.currency(stockCost * reportSelector.inventory.goodsin)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold w-full">Unreceived</span>
                                <span className="font-semibold w-[300px] text-right">

                                    {NumFn.acctg.number(reportSelector.inventory.unreceived)}
                                </span>
                                <span className="font-semibold w-[600px] text-right">
                                    {NumFn.acctg.currency(stockCost * reportSelector.inventory.unreceived)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold w-full">Adjusted</span>
                                <span className="font-semibold w-[300px] text-right">

                                    {NumFn.acctg.number(reportSelector.inventory.adjustment)}
                                </span>
                                <span className="font-semibold w-[600px] text-right">
                                    {NumFn.acctg.currency(stockCost * reportSelector.inventory.adjustment)}
                                </span>
                            </div>
                            <hr className="w-full bg-gray-400 text-gray-400 h-0.5" />
                            <div className="flex justify-between">
                                <span className="font-semibold w-full">Total In</span>
                                <span className="font-semibold w-[300px] text-right">
                                    {totalIn}
                                </span>
                                <span className="font-semibold w-[600px] text-right">
                                </span>
                            </div>
                            <hr className="w-full bg-gray-400 text-gray-400 h-0.5" />
                            <div className="flex justify-between">
                                <span className="font-semibold w-full">Sold</span>
                                <span className="font-semibold w-[300px] text-right">
                                    {NumFn.acctg.number(reportSelector.inventory.sold)}
                                </span>
                                <span className="font-semibold w-[600px] text-right">
                                    {NumFn.acctg.currency(stockCost * reportSelector.inventory.sold)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold w-full">Goods Out</span>
                                <span className="font-semibold w-[300px] text-right">
                                    {NumFn.acctg.number(reportSelector.inventory.goodsout)}
                                </span>
                                <span className="font-semibold w-[600px] text-right">
                                    {NumFn.acctg.currency(stockCost * reportSelector.inventory.goodsout)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold w-full">Pending Transfer</span>
                                <span className="font-semibold w-[300px] text-right">
                                    {NumFn.acctg.number(reportSelector.inventory.pending)}
                                </span>
                                <span className="font-semibold w-[600px] text-right">
                                    {NumFn.acctg.currency(stockCost * reportSelector.inventory.pending)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold w-full">Deducted</span>
                                <span className="font-semibold w-[300px] text-right">

                                    {NumFn.acctg.number(reportSelector.inventory.deducted)}
                                </span>
                                <span className="ffont-semibold w-[600px] text-right">
                                    {NumFn.acctg.currency(stockCost * reportSelector.inventory.deducted)}
                                </span>
                            </div>
                            <hr className="w-full bg-gray-400 text-gray-400 h-0.5" />
                            <div className="flex justify-between">
                                <span className="font-semibold w-full">Total Out</span>
                                <span className="font-semibold w-[300px] text-right">
                                    {totalOut}
                                </span>
                                <span className="font-semibold w-[600px] text-right">
                                </span>
                            </div>
                            <hr className="w-full bg-gray-400 text-gray-400 h-0.5" />
                            <div className="flex justify-between">
                                <span className="font-semibold w-full">End Balance</span>
                                <span className="font-semibold w-[300px] text-right">

                                    {NumFn.acctg.number(reportSelector.inventory.endbalance)}
                                </span>
                                <span className="font-semibold w-[600px] text-right">
                                    {/* <span className="ml-8 text-gray-500">({balance})</span> */}
                                    {NumFn.acctg.currency(stockCost * (reportSelector.inventory.endbalance))}
                                </span>
                            </div>
                            <hr className="w-full bg-gray-400 text-gray-400 h-0.5" />
                            <div className={`flex justify-between ${computeDiscrepancy(reportSelector.inventory) !== 0 ? "text-red-600" : ""}`}>
                                <span className="font-semibold w-full">Discrepancy {typeOfDiscrepancy(reportSelector.inventory)}</span>
                                <span className="font-semibold w-[600px] text-right">
                                    {NumFn.acctg.number(computeDiscrepancy(reportSelector.inventory))}
                                </span>
                            </div>
                        </div>
                        <hr className="w-full bg-gray-400 text-gray-400 h-0.5" />
                        <div className="flex justify-between">
                            <span className="font-semibold w-full">Computed Total Take Away</span>
                            <span className="font-semibold w-[600px] text-right">
                                {NumFn.acctg.number(dispensingTotal + transmitedTotal + deductionTotal)}
                            </span>
                        </div>
                        <hr className="w-full bg-gray-400 text-gray-400 h-0.5" />
                        <span className="text-xs text-gray-400">
                            Note: Computed Total Take Away is the overall total of Total Goods Out, Total Dispensed and Total Deducted
                        </span>
                        <div className="flex gap-2 justify-end">
                            <button
                                className={view === "Categorize" ? "button-static" : "button-action"}
                                disabled={view === "Categorize"}
                                onClick={() => setView("Categorize")}
                            >
                                Categorize
                            </button>
                            <button
                                className={view === "Timeline" ? "button-static" : "button-action"}
                                disabled={view === "Timeline"}
                                onClick={() => setView("Timeline")}
                            >
                                Timeline
                            </button>
                        </div>
                        {
                            view === "Categorize" ? (
                                <>
                                    <hr className="w-full bg-gray-400 text-gray-400 h-0.5" />
                                    <span className="font-semibold w-full text-gray-500">
                                        Returned Data:
                                    </span>
                                    {
                                        returnedrecord?.map(item => (
                                            <div className="flex justify-between hover:bg-gray-300 cursor-pointer" key={item.time}>
                                                <span className="px-3 py-2 w-1/2 text-sm">
                                                    {returnedLoading
                                                        ? <div className="skeleton-loading"></div>
                                                        : item.branch}
                                                </span>
                                                <span className="px-3 py-2 w-1/2 text-sm">
                                                    {returnedLoading
                                                        ? <div className="skeleton-loading"></div>
                                                        : reformatCode(item.reference)}
                                                </span>
                                                <span className="px-3 py-2 w-1/2 text-sm">
                                                    {returnedLoading
                                                        ? <div className="skeleton-loading"></div>
                                                        : sqlTimestamp(item.time)}
                                                </span>
                                                <span className="px-3 py-2 w-1/2 text-sm text-right">
                                                    {returnedLoading
                                                        ? <div className="skeleton-loading"></div>
                                                        : item.quantity || 0}
                                                </span>
                                            </div>
                                        ))
                                    }
                                    {
                                        returnedrecord?.length ? (
                                            <div className="flex justify-between hover:bg-gray-300 cursor-pointer">
                                                <span className="font-semibold px-3 py-2 w-1/2 text-sm text-gray-500">
                                                    Total Returned:
                                                </span>
                                                <span className="font-semibold px-3 py-2 w-1/2 text-sm text-right">
                                                    {returnedLoading
                                                        ? <div className="skeleton-loading"></div>
                                                        : returnedTotal}
                                                </span>
                                            </div>
                                        ) : null
                                    }
                                    <hr className="w-full bg-gray-400 text-gray-400 h-0.5" />
                                    <span className="font-semibold w-full text-gray-500">
                                        Adjusted Data:
                                    </span>
                                    {
                                        adjustmentrecord?.map(item => (
                                            <div className="flex justify-between hover:bg-gray-300 cursor-pointer" key={item.time}>
                                                <span className="px-3 py-2 w-1/2 text-sm">
                                                    {adjustmentLoading
                                                        ? <div className="skeleton-loading"></div>
                                                        : item.branch}
                                                </span>
                                                <span className="px-3 py-2 w-1/2 text-sm">
                                                    {adjustmentLoading
                                                        ? <div className="skeleton-loading"></div>
                                                        : item.reference}
                                                </span>
                                                <span className="px-3 py-2 w-1/2 text-sm">
                                                    {adjustmentLoading
                                                        ? <div className="skeleton-loading"></div>
                                                        : sqlTimestamp(item.time)}
                                                </span>
                                                <span className="px-3 py-2 w-1/2 text-sm text-right">
                                                    {adjustmentLoading
                                                        ? <div className="skeleton-loading"></div>
                                                        : item.quantity || 0}
                                                </span>
                                            </div>
                                        ))
                                    }
                                    {
                                        adjustmentrecord?.length ? (
                                            <div className="flex justify-between hover:bg-gray-300 cursor-pointer">
                                                <span className="font-semibold px-3 py-2 w-1/2 text-sm text-gray-500">
                                                    Total Adjusted:
                                                </span>
                                                <span className="font-semibold px-3 py-2 w-1/2 text-sm text-right">
                                                    {adjustmentLoading
                                                        ? <div className="skeleton-loading"></div>
                                                        : adjustmentTotal}
                                                </span>
                                            </div>
                                        ) : null
                                    }
                                    {
                                        adjustmentrecord?.length ? (
                                            <div className="flex justify-between hover:bg-gray-300 cursor-pointer">
                                                <span className="font-semibold px-3 py-2 w-1/2 text-sm text-gray-500">
                                                    Total Deducted:
                                                </span>
                                                <span className="font-semibold px-3 py-2 w-1/2 text-sm text-right">
                                                    {adjustmentLoading
                                                        ? <div className="skeleton-loading"></div>
                                                        : deductionTotal}
                                                </span>
                                            </div>
                                        ) : null
                                    }

                                    <hr className="w-full bg-gray-400 text-gray-400 h-0.5" />
                                    <div className="flex flex-col gap-2">
                                        <span className="font-semibold py-2 w-full text-gray-500">
                                            Sold Data:
                                        </span>
                                        {
                                            dispensingrecord?.map(item => (
                                                <div className="flex justify-between hover:bg-gray-300 cursor-pointer" key={item.time}>
                                                    <span className="px-3 py-2 w-1/2 text-sm">
                                                        {dispensingLoading
                                                            ? <div className="skeleton-loading"></div>
                                                            : item.branch}
                                                    </span>
                                                    <span className="px-3 py-2 w-1/2 text-sm">
                                                        {adjustmentLoading
                                                            ? <div className="skeleton-loading"></div>
                                                            : reformatIfCode(item.reference)}
                                                    </span>
                                                    <span className="px-3 py-2 w-1/2 text-sm">
                                                        {dispensingLoading
                                                            ? <div className="skeleton-loading"></div>
                                                            : sqlTimestamp(item.time)}
                                                    </span>
                                                    <span className="px-3 py-2 w-1/2 text-sm text-right">
                                                        {dispensingLoading
                                                            ? <div className="skeleton-loading"></div>
                                                            : item.quantity || 0}
                                                    </span>
                                                </div>
                                            ))
                                        }
                                        {
                                            dispensingrecord?.length ? (
                                                <div className="flex justify-between hover:bg-gray-300 cursor-pointer">
                                                    <span className="font-semibold px-3 py-2 w-1/2 text-sm text-gray-500">
                                                        Total Sold:
                                                    </span>
                                                    <span className="font-semibold px-3 py-2 w-1/2 text-sm text-right">
                                                        {dispensingLoading
                                                            ? <div className="skeleton-loading"></div>
                                                            : dispensingTotal}
                                                    </span>
                                                </div>
                                            ) : null
                                        }
                                        <hr className="w-full bg-gray-400 text-gray-400 h-0.5" />
                                        <div className="flex justify-between mb-3">
                                            <span className="font-semibold py-2 w-full text-gray-500">
                                                Goods Out Data:
                                            </span>
                                        </div>
                                        {
                                            transmitrecord?.map(item => (
                                                <div className="flex justify-between hover:bg-gray-300 cursor-pointer" key={item.time}>
                                                    <span className="px-3 py-2 w-1/2 text-sm">
                                                        {transmitLoading
                                                            ? <div className="skeleton-loading"></div>
                                                            : item.branch}
                                                    </span>
                                                    <span className="px-3 py-2 w-1/2 text-sm">
                                                        {adjustmentLoading
                                                            ? <div className="skeleton-loading"></div>
                                                            : item.reference}
                                                    </span>
                                                    <span className="px-3 py-2 w-1/2 text-sm">
                                                        {transmitLoading
                                                            ? <div className="skeleton-loading"></div>
                                                            : sqlTimestamp(item.time)}
                                                    </span>
                                                    <span className="px-3 py-2 w-1/2 text-sm text-right">
                                                        {transmitLoading
                                                            ? <div className="skeleton-loading"></div>
                                                            : item.quantity || 0}
                                                    </span>
                                                </div>
                                            ))
                                        }
                                        {
                                            transmitrecord?.length ? (
                                                <div className="flex justify-between hover:bg-gray-300 cursor-pointer">
                                                    <span className="font-semibold px-3 py-2 w-1/2 text-sm text-gray-500">
                                                        Total Goods Out:
                                                    </span>
                                                    <span className="font-semibold px-3 py-2 w-1/2 text-sm text-right">
                                                        {transmitLoading
                                                            ? <div className="skeleton-loading"></div>
                                                            : transmitedTotal}
                                                    </span>
                                                </div>
                                            ) : null
                                        }
                                        <hr className="w-full bg-gray-400 text-gray-400 h-0.5" />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <hr className="w-full bg-gray-400 text-gray-400 h-0.5" />
                                    <span className="font-semibold w-full text-gray-500">
                                        Timeline View:
                                    </span>
                                    {
                                        timeLine?.map(item => (
                                            <div className="flex justify-between hover:bg-gray-300 cursor-pointer" key={item.time}>
                                                <span className="px-3 py-2 w-2/3 text-sm">
                                                    {sqlTimestamp(item.time)}
                                                </span>
                                                <span className="px-3 py-2 w-1/3 text-sm">
                                                    {item.datatype}
                                                </span>
                                                <span className="px-3 py-2 w-1/2 text-sm">
                                                    {item.branch}
                                                </span>
                                                <span className="px-3 py-2 w-1/2 text-sm">
                                                    {reformatIfCode(item.reference)}
                                                </span>
                                                <span className="px-3 py-2 w-1/2 text-sm text-right">
                                                    {item.quantity || 0}
                                                </span>
                                            </div>
                                        ))
                                    }
                                </>
                            )
                        }
                    </div>
                </Transition.Child>
            </Transition>
        </>
    )
}

export default ReportsModalStockLedger
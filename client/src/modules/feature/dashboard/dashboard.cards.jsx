import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid"
import moment from "moment"
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { firstDayOfWeekByDate, lastDayOfWeekByDate } from "../../../utilities/functions/datetime.functions"
import { NumFn } from "../../../utilities/functions/number.funtions"
import { useCollectiblesReportMutation, useWeeklyDiscountsReportMutation, useWeeklyGrossProfitReportMutation, useWeeklyGrossSalesReportMutation, useWeeklyNetSalesReportMutation, useWeeklyRefundsReportMutation } from "../../system/reports/reports.services"
import { setDashboardSummary, setDashboardWeek } from "./dashboard.reducer"

const DashboardCards = () => {
    const dashboardSelector = useSelector(state => state.dashboard)
    const dispatch = useDispatch()
    const [totalGrossSales, setTotalGrossSales] = useState(0)
    const [totalRefunds, setTotalRefunds] = useState(0)
    const [totalDiscounts, setTotalDiscounts] = useState(0)
    const [totalNetSales, setTotalNetSales] = useState(0)
    const [totalGrossProfit, setTotalGrossProfit] = useState(0)
    const [totalCollectibles, setTotalCollectibles] = useState(0)

    const [grossSales, { isLoading: grosssalesLoading }] = useWeeklyGrossSalesReportMutation()
    const [refunds, { isLoading: refundsLoading }] = useWeeklyRefundsReportMutation()
    const [discounts, { isLoading: discountsLoading }] = useWeeklyDiscountsReportMutation()
    const [netSales, { isLoading: netsalesLoading }] = useWeeklyNetSalesReportMutation()
    const [grossProfit, { isLoading: grossprofitLoading }] = useWeeklyGrossProfitReportMutation()
    const [collectibles, { isLoading: collectibleLoading }] = useCollectiblesReportMutation()

    useEffect(() => {
        dispatch(setDashboardWeek(firstDayOfWeekByDate(new Date())))
    }, [])


    useEffect(() => {
        const weeklyCards = async () => {
            await grossSales({ day: dashboardSelector.week, total: true })
                .unwrap()
                .then(res => { setTotalGrossSales(res.data.total) })
                .catch(err => console.error(err))

            await refunds({ day: dashboardSelector.week, total: true })
                .unwrap()
                .then(res => { setTotalRefunds(res.data.total) })
                .catch(err => console.error(err))

            await discounts({ day: dashboardSelector.week, total: true })
                .unwrap()
                .then(res => { setTotalDiscounts(res.data.total) })
                .catch(err => console.error(err))

            await netSales({ day: dashboardSelector.week, total: true })
                .unwrap()
                .then(res => { setTotalNetSales(res.data.total) })
                .catch(err => console.error(err))

            await grossProfit({ day: dashboardSelector.week, total: true })
                .unwrap()
                .then(res => { setTotalGrossProfit(res.data.total) })
                .catch(err => console.error(err))
            await collectibles()
                .unwrap()
                .then(res => { setTotalCollectibles(res.data.total) })
                .catch(err => console.error(err))
        }
        if (dashboardSelector.week) weeklyCards()
    }, [dashboardSelector.week])

    const onClick = (summary) => {
        dispatch(setDashboardSummary(summary))
    }

    const prevWeek = () => {
        let prevweek = moment(dashboardSelector.week).subtract(7, 'days').format("YYYY-MM-DD")
        dispatch(setDashboardWeek(firstDayOfWeekByDate(prevweek)))
    }

    const nextWeek = () => {
        let nextweek = moment(dashboardSelector.week).add(7, 'days').format("YYYY-MM-DD")
        dispatch(setDashboardWeek(firstDayOfWeekByDate(nextweek)))
    }

    return (
        <div className="w-full flex flex-col gap-5">
            <div className="flex justify-center text-black font-bold p-2 border border-1 border-gray-300 rounded-[20px] text-[12px] card-font relative items-center no-select">
                <div className="w-full text-center py-3 bg-gradient-to-bl from-primary-300 to-white rounded-[20px] font-mono text-[14px] flex flex-col gap-0.5">
                    <span className="text-xs">Sales Summary for the Current Week:</span>
                    <span>
                        {firstDayOfWeekByDate(dashboardSelector.week, "MMM DD, YYYY")} - {lastDayOfWeekByDate(dashboardSelector.week, "MMM DD, YYYY")}
                    </span>
                </div>
                <ChevronLeftIcon
                    className="w-5 h-5 absolute left-5 cursor-pointer hover:text-secondary-500"
                    onClick={() => prevWeek()}
                />
                <ChevronRightIcon
                    className="w-5 h-5 absolute right-5 cursor-pointer hover:text-secondary-500"
                    onClick={() => nextWeek()}
                />
            </div>
            <div className="w-full flex items-start justify-between gap-[20px]">
                <div className="w-full flex flex-col gap-[5px] cursor-pointer p-2 border border-1 border-gray-300 rounded-[20px] hover:border-secondary-500 transition ease-in-out duration-300" onClick={() => onClick("Gross Sales")}>
                    <div className="text-xs bg-gradient-to-bl from-primary-300 to-white rounded-tl-[10px] rounded-tr-[10px] text-left py-2 px-5 font-mono no-select">
                        Gross Sales
                    </div>
                    <div className="w-full py-3 px-5 bg-gradient-to-bl from-primary-300 to-white rounded-bl-[10px] rounded-br-[10px] flex flex-col gap-[10px]">
                        <div className="flex flex-col gap-[5px]">
                            <span className="text-lg font-bold font-mono">
                                PhP {grosssalesLoading ? "loading..." : NumFn.currency(totalGrossSales)}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="w-full flex flex-col gap-[5px] cursor-pointer p-2 border border-1 border-gray-300 rounded-[20px] hover:border-secondary-500 transition ease-in-out duration-300" onClick={() => onClick("Refunds")}>
                    <div className="text-xs bg-gradient-to-bl from-primary-300 to-white rounded-tl-[10px] rounded-tr-[10px] text-left py-2 px-5 font-mono no-select">
                        Refunds
                    </div>
                    <div className="w-full py-3 px-5 bg-gradient-to-bl from-primary-300 to-white rounded-bl-[10px] rounded-br-[10px] flex flex-col gap-[10px]">
                        <div className="flex flex-col gap-[5px]">
                            <span className="text-lg font-bold font-mono">
                                PhP {refundsLoading ? "loading..." : NumFn.currency(totalRefunds)}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="w-full flex flex-col gap-[5px] cursor-pointer p-2 border border-1 border-gray-300 rounded-[20px] hover:border-secondary-500 transition ease-in-out duration-300" onClick={() => onClick("Discounts")}>
                    <div className="text-xs bg-gradient-to-bl from-primary-300 to-white rounded-tl-[10px] rounded-tr-[10px] text-left py-2 px-5 font-mono no-select">
                        Discounts
                    </div>
                    <div className="w-full py-3 px-5 bg-gradient-to-bl from-primary-300 to-white rounded-bl-[10px] rounded-br-[10px] flex flex-col gap-[10px]">
                        <div className="flex flex-col gap-[5px]">
                            <span className="text-lg font-bold font-mono">
                                PhP {discountsLoading ? "loading..." : NumFn.currency(totalDiscounts)}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="w-full flex flex-col gap-[5px] cursor-pointer p-2 border border-1 border-gray-300 rounded-[20px] hover:border-secondary-500 transition ease-in-out duration-300" onClick={() => onClick("Net Sales")}>
                    <div className="text-xs bg-gradient-to-bl from-primary-300 to-white rounded-tl-[10px] rounded-tr-[10px] text-left py-2 px-5 font-mono no-select">
                        Net Sales
                    </div>
                    <div className="w-full py-3 px-5 bg-gradient-to-bl from-primary-300 to-white rounded-bl-[10px] rounded-br-[10px] flex flex-col gap-[10px]">
                        <div className="flex flex-col gap-[5px]">
                            <span className="text-lg font-bold font-mono">
                                PhP {netsalesLoading ? "loading..." : NumFn.currency(totalNetSales)}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="w-full flex flex-col gap-[5px] cursor-pointer p-2 border border-1 border-gray-300 rounded-[20px] hover:border-secondary-500 transition ease-in-out duration-300" onClick={() => onClick("Gross Profit")}>
                    <div className="text-xs bg-gradient-to-bl from-primary-300 to-white rounded-tl-[10px] rounded-tr-[10px] text-left py-2 px-5 font-mono no-select">
                        Gross Profit
                    </div>
                    <div className="w-full py-3 px-5 bg-gradient-to-bl from-primary-300 to-white rounded-bl-[10px] rounded-br-[10px] flex flex-col gap-[10px]">
                        <div className="flex flex-col gap-[5px]">
                            <span className="text-lg font-bold font-mono">
                                PhP {grossprofitLoading ? "loading..." : NumFn.currency(totalGrossProfit)}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="w-full flex flex-col gap-[5px] cursor-pointer p-2 border border-1 border-gray-300 rounded-[20px] hover:border-secondary-500 transition ease-in-out duration-300" onClick={() => onClick("Collectibles")}>
                    <div className="text-xs bg-gradient-to-bl from-primary-300 to-white rounded-tl-[10px] rounded-tr-[10px] text-left py-2 px-5 font-mono no-select">
                        Collectibles
                    </div>
                    <div className="w-full py-3 px-5 bg-gradient-to-bl from-primary-300 to-white rounded-bl-[10px] rounded-br-[10px] flex flex-col gap-[10px]">
                        <div className="flex flex-col gap-[5px]">
                            <span className="text-lg font-bold font-mono">
                                PhP {collectibleLoading ? "loading..." : NumFn.currency(totalCollectibles)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardCards
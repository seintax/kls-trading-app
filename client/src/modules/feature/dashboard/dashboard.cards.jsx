import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid"
import moment from "moment"
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { getFirstElementFromArray } from "../../../utilities/functions/array.functions"
import { dateFormat, dateRangedFormat, firstDayOfWeekByDate, sqlDate } from "../../../utilities/functions/datetime.functions"
import { NumFn } from "../../../utilities/functions/number.funtions"
import { getBranch, isEmpty } from "../../../utilities/functions/string.functions"
import useAuth from "../../../utilities/hooks/useAuth"
import { useFetchAllBranchMutation } from "../../library/branch/branch.services"
import { setDashboardBranch, setDashboardStart, setDashboardStore, setDashboardSummary, showDashboardFilters } from "./dashboard.reducer"
import { useCollectiblesDashboardMutation, useWeeklyCreditCollectionDashboardMutation, useWeeklyCreditSalesDashboardMutation, useWeeklyDiscountsDashboardMutation, useWeeklyGrossProfitDashboardMutation, useWeeklyGrossSalesDashboardMutation, useWeeklyNetSalesDashboardMutation, useWeeklyRefundsDashboardMutation } from "./dashboard.services"

const DashboardCards = () => {
    const auth = useAuth()
    const dashboardSelector = useSelector(state => state.dashboard)
    const dispatch = useDispatch()
    const [totalGrossSales, setTotalGrossSales] = useState(0)
    const [totalCreditSales, setTotalCreditSales] = useState(0)
    const [totalRefunds, setTotalRefunds] = useState(0)
    const [totalDiscounts, setTotalDiscounts] = useState(0)
    const [totalNetSales, setTotalNetSales] = useState(0)
    const [totalGrossProfit, setTotalGrossProfit] = useState(0)
    const [totalCollectibles, setTotalCollectibles] = useState(0)
    const [totalCreditCollection, setTotalCreditCollection] = useState(0)
    const currentWeek = firstDayOfWeekByDate(sqlDate())

    const [allBranches] = useFetchAllBranchMutation()
    const [grossSales, { isLoading: grosssalesLoading }] = useWeeklyGrossSalesDashboardMutation()
    const [creditSales, { isLoading: creditsalesLoading }] = useWeeklyCreditSalesDashboardMutation()
    const [refunds, { isLoading: refundsLoading }] = useWeeklyRefundsDashboardMutation()
    const [discounts, { isLoading: discountsLoading }] = useWeeklyDiscountsDashboardMutation()
    const [netSales, { isLoading: netsalesLoading }] = useWeeklyNetSalesDashboardMutation()
    const [grossProfit, { isLoading: grossprofitLoading }] = useWeeklyGrossProfitDashboardMutation()
    const [collectibles, { isLoading: collectibleLoading }] = useCollectiblesDashboardMutation()
    const [creditCollection, { isLoading: creditcollectionLoading }] = useWeeklyCreditCollectionDashboardMutation()

    useEffect(() => {
        dispatch(setDashboardStart(firstDayOfWeekByDate(new Date())))
        dispatch(setDashboardStore(isEmpty(getBranch(auth)) ? "" : auth.store))

        const instantiate = async () => {
            if (isEmpty(dashboardSelector.branch)) {
                await allBranches()
                    .unwrap()
                    .then(res => {
                        if (res.success) {
                            dispatch(setDashboardBranch(isEmpty(getBranch(auth)) ? "All Branches" : getFirstElementFromArray(res?.arrayResult?.filter(f => f.code === auth.store))?.name || ""))
                        }
                    })
                    .catch(err => console.error(err))
            }
        }

        instantiate()
    }, [])

    useEffect(() => {
        const weeklyCards = async () => {
            let end = dateRangedFormat(dashboardSelector.start, 'add', dashboardSelector.range - 1)
            let collection = 0

            await creditCollection({
                fr: dashboardSelector.start,
                to: end,
                total: true,
                store: dashboardSelector.store
            })
                .unwrap()
                .then(res => {
                    setTotalCreditCollection(res.data.total)
                    collection = res.data.total
                })
                .catch(err => console.error(err))

            await grossSales({
                fr: dashboardSelector.start,
                to: end,
                total: true,
                store: dashboardSelector.store
            })
                .unwrap()
                .then(res => { setTotalGrossSales(res.data.total + collection) })
                .catch(err => console.error(err))

            await refunds({
                fr: dashboardSelector.start,
                to: end,
                total: true,
                store: dashboardSelector.store
            })
                .unwrap()
                .then(res => { setTotalRefunds(res.data.total) })
                .catch(err => console.error(err))

            await discounts({
                fr: dashboardSelector.start,
                to: end,
                total: true,
                store: dashboardSelector.store
            })
                .unwrap()
                .then(res => { setTotalDiscounts(res.data.total) })
                .catch(err => console.error(err))

            await netSales({
                fr: dashboardSelector.start,
                to: end,
                total: true,
                store: dashboardSelector.store
            })
                .unwrap()
                .then(res => { setTotalNetSales(res.data.total + collection) })
                .catch(err => console.error(err))

            await grossProfit({
                fr: dashboardSelector.start,
                to: end,
                total: true,
                store: dashboardSelector.store
            })
                .unwrap()
                .then(res => { setTotalGrossProfit(res.data.total + collection) })
                .catch(err => console.error(err))

            await collectibles({
                store: dashboardSelector.store
            })
                .unwrap()
                .then(res => { setTotalCollectibles(res.data.total) })
                .catch(err => console.error(err))

            await creditSales({
                fr: dashboardSelector.start,
                to: end,
                total: true,
                store: dashboardSelector.store
            })
                .unwrap()
                .then(res => { setTotalCreditSales(res.data.total) })
                .catch(err => console.error(err))
        }
        if (dashboardSelector.start) weeklyCards()
    }, [dashboardSelector.start, dashboardSelector.store])

    const onClick = (summary) => {
        dispatch(setDashboardSummary(summary))
    }

    const prevWeek = () => {
        let prevrange = moment(dashboardSelector.start).subtract(dashboardSelector.range, 'days').format("YYYY-MM-DD")
        dispatch(setDashboardStart(prevrange))
    }

    const nextWeek = () => {
        let nextrange = moment(dashboardSelector.start).add(dashboardSelector.range, 'days').format("YYYY-MM-DD")
        dispatch(setDashboardStart(nextrange))
    }

    const showFilters = () => {
        dispatch(showDashboardFilters())
    }

    return (
        <div className="w-full flex flex-col gap-5">
            <div className="flex justify-center text-black font-bold border border-1 border-gray-300 text-[12px] card-font relative items-center no-select">
                <div className="w-full text-center items-center py-3 bg-gradient-to-b from-primary-300 via-primary-200 to-white font-mono text-[14px] flex flex-col gap-0.5">
                    <span className="text-xs">
                        Sales Summary <u>{dashboardSelector.branch}</u> for the {currentWeek === dashboardSelector.start ? "Current" : "Previous"} Range:
                    </span>
                    <span
                        className="cursor-pointer w-fit hover:text-secondary-500 mt-2"
                        onClick={() => showFilters()}
                    >
                        {dateFormat(dashboardSelector.start, "MMM DD, YYYY")} - {dateRangedFormat(dashboardSelector.start, 'add', dashboardSelector.range - 1, "MMM DD, YYYY")}
                    </span>

                    <div className="w-full flex lg:hidden justify-center gap-5 mt-2">
                        <ChevronLeftIcon
                            className="w-5 h-5 cursor-pointer hover:text-secondary-500"
                            onClick={() => prevWeek()}
                        />
                        <ChevronRightIcon
                            className="w-5 h-5 cursor-pointer hover:text-secondary-500"
                            onClick={() => nextWeek()}
                        />
                    </div>
                </div>
                <ChevronLeftIcon
                    className="w-5 h-5 absolute left-5 cursor-pointer hover:text-secondary-500 hidden lg:flex"
                    onClick={() => prevWeek()}
                />
                <ChevronRightIcon
                    className="w-5 h-5 absolute right-5 cursor-pointer hover:text-secondary-500 hidden lg:flex"
                    onClick={() => nextWeek()}
                />
            </div>
            <div className="w-full flex flex-col lg:flex-row flex-wrap items-center justify-center gap-2">
                <div className="w-full lg:w-1/6 h-32 flex flex-col gap-[5px] cursor-pointer p-2 border border-1 border-gray-300 rounded-[20px] hover:border-secondary-500 transition ease-in-out duration-300 h-full" onClick={() => onClick("Gross Sales")}>
                    <div className="text-xs bg-gradient-to-bl from-primary-300 to-white rounded-tl-[10px] rounded-tr-[10px] text-left py-2 px-5 font-mono no-select">
                        Gross Sales
                    </div>
                    <div className="w-full py-3 px-5 bg-gradient-to-bl from-primary-300 to-white rounded-bl-[10px] rounded-br-[10px] flex flex-col gap-[10px] h-full">
                        <div className="flex flex-col gap-[5px]">
                            <span className="text-lg font-bold font-mono">
                                PhP {grosssalesLoading ? "loading..." : NumFn.currency(totalGrossSales)}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="w-full lg:w-1/6 h-32 flex flex-col gap-[5px] cursor-pointer p-2 border border-1 border-gray-300 rounded-[20px] hover:border-secondary-500 transition ease-in-out duration-300 h-full" onClick={() => onClick("Refunds")}>
                    <div className="text-xs bg-gradient-to-bl from-primary-300 to-white rounded-tl-[10px] rounded-tr-[10px] text-left py-2 px-5 font-mono no-select">
                        Refunds
                    </div>
                    <div className="w-full py-3 px-5 bg-gradient-to-bl from-primary-300 to-white rounded-bl-[10px] rounded-br-[10px] flex flex-col gap-[10px] h-full">
                        <div className="flex flex-col gap-[5px]">
                            <span className="text-lg font-bold font-mono">
                                PhP {refundsLoading ? "loading..." : NumFn.currency(totalRefunds)}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="w-full lg:w-1/6 h-32 flex flex-col gap-[5px] cursor-pointer p-2 border border-1 border-gray-300 rounded-[20px] hover:border-secondary-500 transition ease-in-out duration-300 h-full" onClick={() => onClick("Discounts")}>
                    <div className="text-xs bg-gradient-to-bl from-primary-300 to-white rounded-tl-[10px] rounded-tr-[10px] text-left py-2 px-5 font-mono no-select">
                        Discounts
                    </div>
                    <div className="w-full py-3 px-5 bg-gradient-to-bl from-primary-300 to-white rounded-bl-[10px] rounded-br-[10px] flex flex-col gap-[10px] h-full">
                        <div className="flex flex-col gap-[5px]">
                            <span className="text-lg font-bold font-mono">
                                PhP {discountsLoading ? "loading..." : NumFn.currency(totalDiscounts)}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="w-full lg:w-1/6 h-32 flex flex-col gap-[5px] cursor-pointer p-2 border border-1 border-gray-300 rounded-[20px] hover:border-secondary-500 transition ease-in-out duration-300 h-full" onClick={() => onClick("Net Sales")}>
                    <div className="text-xs bg-gradient-to-bl from-primary-300 to-white rounded-tl-[10px] rounded-tr-[10px] text-left py-2 px-5 font-mono no-select">
                        Net Sales
                    </div>
                    <div className="w-full py-3 px-5 bg-gradient-to-bl from-primary-300 to-white rounded-bl-[10px] rounded-br-[10px] flex flex-col gap-[10px] h-full">
                        <div className="flex flex-col gap-[5px]">
                            <span className="text-lg font-bold font-mono">
                                PhP {netsalesLoading ? "loading..." : NumFn.currency(totalNetSales)}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="w-full lg:w-1/6 h-32 flex flex-col gap-[5px] cursor-pointer p-2 border border-1 border-gray-300 rounded-[20px] hover:border-secondary-500 transition ease-in-out duration-300 h-full" onClick={() => onClick("Gross Profit")}>
                    <div className="text-xs bg-gradient-to-bl from-primary-300 to-white rounded-tl-[10px] rounded-tr-[10px] text-left py-2 px-5 font-mono no-select">
                        Gross Profit
                    </div>
                    <div className="w-full py-3 px-5 bg-gradient-to-bl from-primary-300 to-white rounded-bl-[10px] rounded-br-[10px] flex flex-col gap-[10px] h-full">
                        <div className="flex flex-col gap-[5px]">
                            <span className="text-lg font-bold font-mono">
                                PhP {grossprofitLoading ? "loading..." : NumFn.currency(totalGrossProfit)}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="w-full lg:w-1/6 h-32 flex flex-col gap-[5px] cursor-pointer p-2 border border-1 border-gray-300 rounded-[20px] hover:border-secondary-500 transition ease-in-out duration-300 h-full" onClick={() => onClick("Collectibles")}>
                    <div className="text-xs bg-gradient-to-bl from-primary-300 to-white rounded-tl-[10px] rounded-tr-[10px] text-left py-2 px-5 font-mono no-select">
                        Collectibles
                    </div>
                    <div className="w-full py-3 px-5 bg-gradient-to-bl from-primary-300 to-white rounded-bl-[10px] rounded-br-[10px] flex flex-col gap-[10px] h-full">
                        <div className="flex flex-col gap-[5px]">
                            <span className="text-lg font-bold font-mono">
                                PhP {collectibleLoading ? "loading..." : NumFn.currency(totalCollectibles)}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="w-full lg:w-1/6 h-32 flex flex-col gap-[5px] cursor-pointer p-2 border border-1 border-gray-300 rounded-[20px] hover:border-secondary-500 transition ease-in-out duration-300 h-full" onClick={() => onClick("Credit Sales")}>
                    <div className="text-xs bg-gradient-to-bl from-primary-300 to-white rounded-tl-[10px] rounded-tr-[10px] text-left py-2 px-5 font-mono no-select">
                        Credit Sales
                    </div>
                    <div className="w-full py-3 px-5 bg-gradient-to-bl from-primary-300 to-white rounded-bl-[10px] rounded-br-[10px] flex flex-col gap-[10px] h-full">
                        <div className="flex flex-col gap-[5px]">
                            <span className="text-lg font-bold font-mono">
                                PhP {creditsalesLoading ? "loading..." : NumFn.currency(totalCreditSales)}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="w-full lg:w-1/6 h-32 flex flex-col gap-[5px] cursor-pointer p-2 border border-1 border-gray-300 rounded-[20px] hover:border-secondary-500 transition ease-in-out duration-300 h-full" onClick={() => onClick("Credit Collection")}>
                    <div className="text-xs bg-gradient-to-bl from-primary-300 to-white rounded-tl-[10px] rounded-tr-[10px] text-left py-2 px-5 font-mono no-select">
                        Credit Collection
                    </div>
                    <div className="w-full py-3 px-5 bg-gradient-to-bl from-primary-300 to-white rounded-bl-[10px] rounded-br-[10px] flex flex-col gap-[10px] h-full">
                        <div className="flex flex-col gap-[5px]">
                            <span className="text-lg font-bold font-mono">
                                PhP {creditcollectionLoading ? "loading..." : NumFn.currency(totalCreditCollection)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardCards
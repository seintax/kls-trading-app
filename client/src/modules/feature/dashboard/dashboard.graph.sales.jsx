import moment from "moment"
import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux"
import { dateRangedFormat } from "../../../utilities/functions/datetime.functions"
import AppLineChart from "../../../utilities/interface/application/aesthetics/app.chart.line"
import AppSuspense from "../../../utilities/interface/application/errormgmt/app.suspense"
import { useWeeklyCollectiblesDashboardMutation, useWeeklyDiscountsDashboardMutation, useWeeklyGrossProfitDashboardMutation, useWeeklyGrossSalesDashboardMutation, useWeeklyNetSalesDashboardMutation, useWeeklyRefundsDashboardMutation } from "./dashboard.services"

const DashboardGraphSales = () => {
    const [line, setline] = useState()
    const dashboardSelector = useSelector(state => state.dashboard)

    const [grossSales, { isLoading: grosssalesLoading }] = useWeeklyGrossSalesDashboardMutation()
    const [refunds, { isLoading: refundsLoading }] = useWeeklyRefundsDashboardMutation()
    const [discounts, { isLoading: discountsLoading }] = useWeeklyDiscountsDashboardMutation()
    const [netSales, { isLoading: netsalesLoading }] = useWeeklyNetSalesDashboardMutation()
    const [grossProfit, { isLoading: grossprofitLoading }] = useWeeklyGrossProfitDashboardMutation()
    const [collectibles, { isLoading: collectibleLoading }] = useWeeklyCollectiblesDashboardMutation()

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                ticks: {
                    color: '#000000',
                    padding: 30,
                    font: {
                        size: 10,
                        family: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                    }
                }
            },
            x: {
                ticks: {
                    color: '#000000',
                    padding: 30,
                    font: {
                        size: 10,
                        family: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                    }
                }
            }
        },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: "#000000",
                    font: {
                        family: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                    },
                }
            },
            title: {
                display: true,
                text: `${dashboardSelector.summary} Summary Data for the Current Week`,
                font: {
                    size: 14,
                    family: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                },
                color: '#000000'
            }
        }
    }

    const populateDataSet = (response) => {
        if (response.success) {
            setline({
                labels: response?.data
                    ?.map((data) => moment(data.day).format("MM-DD-YYYY")),
                datasets: [
                    {
                        label: `  ${dashboardSelector.summary}`,
                        data: response
                            ?.data.map((data) => data.total),
                        borderColor: '#88df8f',
                        color: '#ffffff',
                        backgroundColor: ["#02680b80"],
                        fill: true,
                        pointStyle: 'circle',
                        pointRadius: 8,
                        pointHoverRadius: 15
                    },
                ]
            })
        }
    }

    const isLoading = () => {
        return grosssalesLoading || refundsLoading || discountsLoading || netsalesLoading || grossprofitLoading || collectibleLoading
    }

    useEffect(() => {
        if (grosssalesLoading || refundsLoading || discountsLoading || netsalesLoading || grossprofitLoading || collectibleLoading) {
            setline({ label: [], datasets: [] })
        }
    }, [grosssalesLoading, refundsLoading, discountsLoading, netsalesLoading, grossprofitLoading, collectibleLoading])

    useEffect(() => {
        const weeklySales = async () => {
            let end = dateRangedFormat(dashboardSelector.start, 'add', dashboardSelector.range - 1)
            if (dashboardSelector.summary === "Gross Sales") {
                await grossSales({
                    fr: dashboardSelector.start,
                    to: end,
                    store: dashboardSelector.store
                })
                    .unwrap()
                    .then(response => populateDataSet(response))
                    .catch(err => console.error(err))
            }
            if (dashboardSelector.summary === "Refunds") {
                await refunds({
                    fr: dashboardSelector.start,
                    to: end,
                    store: dashboardSelector.store
                })
                    .unwrap()
                    .then(response => populateDataSet(response))
                    .catch(err => console.error(err))
            }
            if (dashboardSelector.summary === "Discounts") {
                await discounts({
                    fr: dashboardSelector.start,
                    to: end,
                    store: dashboardSelector.store
                })
                    .unwrap()
                    .then(response => populateDataSet(response))
                    .catch(err => console.error(err))
            }
            if (dashboardSelector.summary === "Net Sales") {
                await netSales({
                    fr: dashboardSelector.start,
                    to: end,
                    store: dashboardSelector.store
                })
                    .unwrap()
                    .then(response => populateDataSet(response))
                    .catch(err => console.error(err))
            }
            if (dashboardSelector.summary === "Gross Profit") {
                await grossProfit({
                    fr: dashboardSelector.start,
                    to: end,
                    store: dashboardSelector.store
                })
                    .unwrap()
                    .then(response => populateDataSet(response))
                    .catch(err => console.error(err))
            }
            if (dashboardSelector.summary === "Collectibles") {
                await collectibles({
                    fr: dashboardSelector.start,
                    to: end,
                    store: dashboardSelector.store
                })
                    .unwrap()
                    .then(response => populateDataSet(response))
                    .catch(err => console.error(err))
            }
        }

        weeklySales()
    }, [dashboardSelector.summary, dashboardSelector.start])


    return (
        <div className="flex flex-col w-full h-full p-3 font-mono">
            {line ? <AppLineChart data={line} options={options} /> : null}
            <div className={`${(isLoading()) ? "" : "hidden"} absolute z-10 top-0 left-0 w-full h-full transition ease-in duration-300`}>
                <AppSuspense />
            </div>
        </div>
    )
}

export default DashboardGraphSales
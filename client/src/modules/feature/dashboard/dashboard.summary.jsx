import moment from "moment"
import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux"
import AppLineChart from "../../../utilities/interface/application/aesthetics/app.chart.line"
import AppSuspense from "../../../utilities/interface/application/errormgmt/app.suspense"
import { useWeeklyCollectiblesReportMutation, useWeeklyDiscountsReportMutation, useWeeklyGrossProfitReportMutation, useWeeklyGrossSalesReportMutation, useWeeklyNetSalesReportMutation, useWeeklyRefundsReportMutation } from "../../system/reports/reports.services"

const DashboardSummary = () => {
    const [line, setline] = useState()
    const dashboardSelector = useSelector(state => state.dashboard)

    const [grossSales, { isLoading: grosssalesLoading }] = useWeeklyGrossSalesReportMutation()
    const [refunds, { isLoading: refundsLoading }] = useWeeklyRefundsReportMutation()
    const [discounts, { isLoading: discountsLoading }] = useWeeklyDiscountsReportMutation()
    const [netSales, { isLoading: netsalesLoading }] = useWeeklyNetSalesReportMutation()
    const [grossProfit, { isLoading: grossprofitLoading }] = useWeeklyGrossProfitReportMutation()
    const [collectibles, { isLoading: collectibleLoading }] = useWeeklyCollectiblesReportMutation()

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

    useEffect(() => {
        const weeklySales = async () => {
            if (dashboardSelector.summary === "Gross Sales") {
                await grossSales({ day: dashboardSelector.week })
                    .unwrap()
                    .then(response => populateDataSet(response))
                    .catch(err => console.error(err))
            }
            if (dashboardSelector.summary === "Refunds") {
                await refunds({ day: dashboardSelector.week })
                    .unwrap()
                    .then(response => populateDataSet(response))
                    .catch(err => console.error(err))
            }
            if (dashboardSelector.summary === "Discounts") {
                await discounts({ day: dashboardSelector.week })
                    .unwrap()
                    .then(response => populateDataSet(response))
                    .catch(err => console.error(err))
            }
            if (dashboardSelector.summary === "Net Sales") {
                await netSales({ day: dashboardSelector.week })
                    .unwrap()
                    .then(response => populateDataSet(response))
                    .catch(err => console.error(err))
            }
            if (dashboardSelector.summary === "Gross Profit") {
                await grossProfit({ day: dashboardSelector.week })
                    .unwrap()
                    .then(response => populateDataSet(response))
                    .catch(err => console.error(err))
            }
            if (dashboardSelector.summary === "Collectibles") {
                await collectibles({ day: dashboardSelector.week })
                    .unwrap()
                    .then(response => populateDataSet(response))
                    .catch(err => console.error(err))
            }
        }

        weeklySales()
    }, [dashboardSelector.summary, dashboardSelector.week])


    return (
        <div className="flex flex-col w-full h-full p-3 font-mono relative">
            <div className={`${(grosssalesLoading || refundsLoading || discountsLoading || netsalesLoading || grossprofitLoading || collectibleLoading) ? "" : "hidden"} absolute z-10 top-0 l-0 w-full h-full transition ease-in duration-300`}>
                <AppSuspense />
            </div>
            {line ? <AppLineChart data={line} options={options} /> : null}
        </div>
    )
}

export default DashboardSummary
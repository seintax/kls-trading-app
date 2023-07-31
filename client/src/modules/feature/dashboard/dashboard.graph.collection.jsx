import moment from "moment"
import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux"
import AppLineChart from "../../../utilities/interface/application/aesthetics/app.chart.line"
import { useWeeklyDashboardMutation } from "./dashboard.services"

const DashboardGraphCollection = () => {
    const dashboardSelector = useSelector(state => state.dashboard)
    const [line, setline] = useState()

    const [weeklyReports] = useWeeklyDashboardMutation()

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
                text: `Collection Summary Data ${dashboardSelector.branch} for the Past 15 Days`,
                font: {
                    size: 14,
                    family: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                },
                color: '#000000'
                // color: '#ef4444'
            }
        }
    }

    useEffect(() => {
        const collectionData = async () => {
            await weeklyReports({
                fr: moment(new Date()).subtract(15, 'days').format("YYYY-MM-DD"),
                to: moment(new Date()).format("YYYY-MM-DD"),
                store: dashboardSelector.store
            })
                .unwrap()
                .then(res => {
                    if (res.success) {
                        setline({
                            labels: res?.data.map((data) => moment(data.day).format("MM-DD-YYYY")),
                            datasets: [
                                {
                                    label: `  ${"Cash Sales"}`,
                                    data: res?.data.map((data) => data.cash),
                                    borderColor: '#88df8f',
                                    color: '#ffffff',
                                    backgroundColor: ["#02680b90"],
                                    pointStyle: 'circle',
                                    pointRadius: 8,
                                    pointHoverRadius: 15
                                },
                                {
                                    label: `  ${"Cheque Sales"}`,
                                    data: res?.data.map((data) => data.cheque),
                                    borderColor: '#df9588',
                                    color: '#ffffff',
                                    backgroundColor: ["#680e0290"],
                                    pointStyle: 'circle',
                                    pointRadius: 8,
                                    pointHoverRadius: 15
                                },
                                {
                                    label: `  ${"GCash Sales"}`,
                                    data: res?.data.map((data) => data.gcash),
                                    borderColor: '#889cdf',
                                    color: '#ffffff',
                                    backgroundColor: ["#02266890"],
                                    pointStyle: 'circle',
                                    pointRadius: 8,
                                    pointHoverRadius: 15
                                }
                            ]
                        })
                    }
                })
                .catch(err => console.error(err))
        }
        collectionData()
    }, [dashboardSelector.store])


    return (
        <div className="flex w-full h-full p-3 font-mono">
            {line ? <AppLineChart data={line} options={options} /> : null}
        </div>
    )
}

export default DashboardGraphCollection
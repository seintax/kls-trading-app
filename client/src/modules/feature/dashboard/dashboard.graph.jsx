import moment from "moment"
import React, { useEffect, useState } from 'react'
import AppLineChart from "../../../utilities/interface/application/aesthetics/app.chart.line"
import { useWeeklyReportMutation } from "../../system/reports/reports.services"

const DashboardGraph = () => {
    const [line, setline] = useState()

    const [weeklyReports] = useWeeklyReportMutation()

    useEffect(() => {
        const weeklySales = async () => {
            await weeklyReports({
                fr: moment(new Date()).subtract(15, 'days').format("YYYY-MM-DD"),
                to: moment(new Date()).format("YYYY-MM-DD")
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
                                    backgroundColor: ["#02680b"],
                                    pointStyle: 'circle',
                                    pointRadius: 8,
                                    pointHoverRadius: 15
                                },
                                {
                                    label: `  ${"Cheque Sales"}`,
                                    data: res?.data.map((data) => data.cheque),
                                    borderColor: '#df9588',
                                    color: '#ffffff',
                                    backgroundColor: ["#680e02"],
                                    pointStyle: 'circle',
                                    pointRadius: 8,
                                    pointHoverRadius: 15
                                },
                                {
                                    label: `  ${"GCash Sales"}`,
                                    data: res?.data.map((data) => data.gcash),
                                    borderColor: '#889cdf',
                                    color: '#ffffff',
                                    backgroundColor: ["#022668"],
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

        weeklySales()
    }, [])


    return (
        <div className="flex w-full h-full p-3">
            {line ? <AppLineChart data={line} /> : null}
        </div>
    )
}

export default DashboardGraph
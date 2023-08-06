import { Chart as ChartJS, registerables } from 'chart.js'
import React from 'react'
import { Doughnut } from "react-chartjs-2"
ChartJS.register(...registerables)

function AppDoughnutChart({ data, options }) {
    return (
        <Doughnut data={data} options={options} className="h-full font-mono" />
    )
}

export default AppDoughnutChart
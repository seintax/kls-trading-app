import { Chart as ChartJS, registerables } from 'chart.js'
import React from 'react'
import { Line } from "react-chartjs-2"
ChartJS.register(...registerables)

function AppLineChart({ data, options }) {
    return (
        <Line data={data} options={options} className="h-full font-mono" />
    )
}

export default AppLineChart
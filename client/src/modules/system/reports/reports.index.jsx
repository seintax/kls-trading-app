import React, { useEffect } from 'react'
import { useSelector } from "react-redux"
import ReportsFormSales from "./reports.form.sales"
import ReportsMenu from "./reports.menu"

const ReportsIndex = () => {
    const reportSelector = useSelector(state => state.reports)

    useEffect(() => {
        console.log(reportSelector.report)
    }, [reportSelector.report])

    return (
        <div className="w-full min-h-full flex lg:pl-56 relative">
            <ReportsMenu />
            <div className="pl-5 w-full">
                <ReportsFormSales />
            </div>
        </div>
    )
}

export default ReportsIndex
import React from 'react'
import { useSelector } from "react-redux"
import ReportsFormExpenses from "./reports.form.expenses"
import ReportsFormSales from "./reports.form.sales"
import ReportsFormSummary from "./reports.form.summary"
import ReportsMenu from "./reports.menu"

const ReportsIndex = () => {
    const reportSelector = useSelector(state => state.reports)

    return (
        <div className="w-full min-h-full flex lg:pl-56 relative">
            <ReportsMenu />
            <div className="pl-5 w-full">
                <ReportsFormSales />
                <ReportsFormSummary />
                <ReportsFormExpenses />
            </div>
        </div>
    )
}

export default ReportsIndex
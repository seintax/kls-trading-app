import React from 'react'
import { useSelector } from "react-redux"
import ReportsFormInventoryValuation from "./reporst.form.inventory-valuation"
import ReportsFormCashierSummary from "./reports.form.cashier-summary"
import ReportsFormExpenses from "./reports.form.expenses"
import ReportsFormExpensesSummary from "./reports.form.expenses-summary"
import ReportsFormReceipts from "./reports.form.receipts"
import ReportsFormSales from "./reports.form.sales"
import ReportsFormSummary from "./reports.form.summary"
import ReportsMenu from "./reports.menu"

const ReportsIndex = () => {
    const reportSelector = useSelector(state => state.reports)

    return (
        <div className="w-full flex flex-col lg:flex-row relative">
            <div className="w-full h-fit lg:w-fit lg:h-full pr-4 border border-white border-r-secondary-500 flex-none">
                <ReportsMenu />
            </div>
            <div className="lg:pl-5 lg:mt-0 w-full h-full flex flex-col">
                <ReportsFormSales />
                <ReportsFormSummary />
                <ReportsFormExpenses />
                <ReportsFormExpensesSummary />
                <ReportsFormReceipts />
                <ReportsFormCashierSummary />
                <ReportsFormInventoryValuation />
            </div>
        </div>
    )
}

export default ReportsIndex
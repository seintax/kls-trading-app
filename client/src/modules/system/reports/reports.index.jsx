import { Bars3Icon } from "@heroicons/react/24/outline"
import React from 'react'
import { useDispatch, useSelector } from "react-redux"
import ReportsFormInventoryValuation from "./reporst.form.inventory-valuation"
import ReportsFormCashierSummary from "./reports.form.cashier-summary"
import ReportsFormExpenses from "./reports.form.expenses"
import ReportsFormExpensesSummary from "./reports.form.expenses-summary"
import ReportsFormReceipts from "./reports.form.receipts"
import ReportsFormSales from "./reports.form.sales"
import ReportsFormSummary from "./reports.form.summary"
import ReportsMenu from "./reports.menu"
import { showReportMenu } from "./reports.reducer"

const ReportsIndex = () => {
    const reportSelector = useSelector(state => state.reports)
    const dispatch = useDispatch()

    const toggleMenu = () => {
        dispatch(showReportMenu(!reportSelector.showmenu))
    }

    return (
        <div className="w-full flex flex-col lg:flex-row relative">
            <div className="absolute border border-gray-300 p-2 cursor-pointer hover:bg-gray-400 transition ease-in-out duration-300 no-select" onClick={() => toggleMenu()}>
                <Bars3Icon className="w-8 h-8" />
            </div>
            {
                reportSelector.showmenu ? <ReportsMenu /> : null
            }
            <div className="lg:mt-0 w-full h-full flex flex-col">
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
import React from 'react'
import { useDispatch, useSelector } from "react-redux"
import { setReportName, showReportManager } from "./reports.reducer"

const ReportsMenu = () => {
    const reportSelector = useSelector(state => state.reports)
    const dispatch = useDispatch()

    const menuStyle = "text-black border border-transparent hover:bg-gradient-to-b hover:from-primary-300 hover:via-primary-300 hover:to-primary-400 hover:text-black hover:border-secondary-400 flex items-center px-1.5 px-2 py-2 text-xs font-medium rounded-md cursor-pointer flex-none"

    const onSelectReport = (reportName) => {
        dispatch(setReportName(reportName))
        dispatch(showReportManager())
    }

    return (
        <div className="flex flex-row flex-wrap lg:flex-col absolute no-select gap-2">
            <span
                className={menuStyle}
                onClick={() => onSelectReport("Daily Sales by Item")}
            >
                Daily Sales by Item
            </span>
            <span
                className={menuStyle}
                onClick={() => onSelectReport("Daily Sales by Category")}
            >
                Daily Sales by Category
            </span>
            <span
                className={menuStyle}
                onClick={() => onSelectReport("Daily Sales by Collection")}
            >
                Daily Sales by Collection
            </span>
            <span
                className={menuStyle}
                onClick={() => onSelectReport("Daily Summary")}
            >
                Daily Summary
            </span>
            <span
                className={menuStyle}
                onClick={() => onSelectReport("Receipts Summary")}
            >
                Receipts Summary
            </span>
            <span
                className={menuStyle}
                onClick={() => onSelectReport("Cashier Summary")}
            >
                Cashier Summary
            </span>
            <span
                className={menuStyle}
                onClick={() => onSelectReport("Expenses")}
            >
                Expenses
            </span>
            <span
                className={menuStyle}
                onClick={() => onSelectReport("Expenses Summary")}
            >
                Expenses Summary
            </span>
            {/* <span
                className={menuStyle}
                onClick={() => onSelectReport("Income Statement")}
            >
                Income Statement
            </span> */}
        </div>
    )
}

export default ReportsMenu
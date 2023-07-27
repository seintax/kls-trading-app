import React from 'react'
import { useDispatch, useSelector } from "react-redux"
import { setReportName, showReportManager } from "./reports.reducer"

const ReportsMenu = () => {
    const reportSelector = useSelector(state => state.reports)
    const dispatch = useDispatch()

    const menuStyle = "text-secondary-500 border border-transparent hover:bg-gradient-to-b hover:from-white hover:via-white hover:to-white hover:text-transparent lg:hover:bg-gradient-to-b lg:hover:from-primary-300 lg:hover:via-primary-300 lg:hover:to-primary-400 lg:hover:text-secondary-500 lg:hover:border-secondary-400 flex items-center px-1.5 lg:px-2 py-2 text-xs font-medium rounded-md cursor-pointer"

    const onSelectReport = (reportName) => {
        dispatch(setReportName(reportName))
        dispatch(showReportManager())
    }

    return (
        <div className="flex flex-col absolute w-56 top-0 left-0 h-full pr-4 border border-white border-r-secondary-500 no-select gap-2">
            <div
                className={menuStyle}
                onClick={() => onSelectReport("Daily Sales by Item")}
            >
                Daily Sales by Item
            </div>
            <div
                className={menuStyle}
                onClick={() => onSelectReport("Daily Sales by Category")}
            >
                Daily Sales by Category
            </div>
            <div
                className={menuStyle}
                onClick={() => onSelectReport("Daily Sales by Collection")}
            >
                Daily Sales by Collection
            </div>
            <div
                className={menuStyle}
                onClick={() => onSelectReport("Daily Summary")}
            >
                Daily Summary
            </div>
            <div
                className={menuStyle}
                onClick={() => onSelectReport("Expenses")}
            >
                Expenses
            </div>
            <div
                className={menuStyle}
                onClick={() => onSelectReport("Income Statement")}
            >
                Income Statement
            </div>
        </div>
    )
}

export default ReportsMenu
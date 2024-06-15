import React from 'react'
import { useDispatch, useSelector } from "react-redux"
import { getOneObject } from "../../../utilities/functions/array.functions"
import useAuth from "../../../utilities/hooks/useAuth"
import { setReportName, showReportManager, showReportMenu } from "./reports.reducer"

const ReportsMenu = () => {
    const reportSelector = useSelector(state => state.reports)
    const roleSelector = useSelector(state => state.roles)
    const dispatch = useDispatch()
    const auth = useAuth()

    const menuStyle = "text-black border border-transparent hover:bg-gradient-to-b hover:from-primary-300 hover:via-primary-300 hover:to-primary-400 hover:text-black hover:border-secondary-400 flex items-center px-0.5 lg:px-2 py-2 text-[11px] lg:text-xs font-medium rounded-md cursor-pointer flex-none bg-white"

    const onSelectReport = (reportName) => {
        dispatch(setReportName(reportName))
        dispatch(showReportManager())
        dispatch(showReportMenu(false))
    }

    const currentRole = getOneObject(roleSelector.cache.filter(f => f.name === auth.role))
    const reportPermissions = currentRole ? JSON.parse(currentRole.permission) : undefined
    const parsedPermissions = reportPermissions ? reportPermissions["reports-menu"] : undefined

    return (
        <div className="absolute mt-14 flex flex-col w-[300px] p-3 no-select gap-x-2 bg-white z-10 border border-gray-300">
            <span
                className={`${menuStyle} ${parsedPermissions && parsedPermissions["view-daily-sales-by-item"] ? "" : "hidden"}`}
                onClick={() => onSelectReport("Daily Sales by Item")}
            >
                Daily Sales by Item
            </span>
            <span
                className={`${menuStyle} ${parsedPermissions && parsedPermissions["view-daily-sales-by-category"] ? "" : "hidden"}`}
                onClick={() => onSelectReport("Daily Sales by Category")}
            >
                Daily Sales by Category
            </span>
            <span
                className={`${menuStyle} ${parsedPermissions && parsedPermissions["view-daily-sales-by-collection"] ? "" : "hidden"}`}
                onClick={() => onSelectReport("Daily Sales by Collection")}
            >
                Daily Sales by Collection
            </span>
            <span
                className={`${menuStyle} ${parsedPermissions && parsedPermissions["view-daily-summary"] ? "" : "hidden"}`}
                onClick={() => onSelectReport("Daily Summary")}
            >
                Daily Summary
            </span>
            <span
                className={`${menuStyle} ${parsedPermissions && parsedPermissions["view-receipts-summary"] ? "" : "hidden"}`}
                onClick={() => onSelectReport("Receipts Summary")}
            >
                Receipts Summary
            </span>
            <span
                className={`${menuStyle} ${parsedPermissions && parsedPermissions["view-cashier-summary"] ? "" : "hidden"}`}
                onClick={() => onSelectReport("Cashier Summary")}
            >
                Cashier Summary
            </span>
            <span
                className={`${menuStyle} ${parsedPermissions && parsedPermissions["view-inventory-valuation"] ? "" : "hidden"}`}
                onClick={() => onSelectReport("Inventory Valuation")}
            >
                Inventory Valuation
            </span>
            <span
                className={`${menuStyle} ${parsedPermissions && parsedPermissions["view-inventory-report"] ? "" : "hidden"}`}
                onClick={() => onSelectReport("Inventory Report")}
            >
                Inventory Report
            </span>
            <span
                className={`${menuStyle} ${parsedPermissions && parsedPermissions["view-stock-alert"] ? "" : "hidden"}`}
                onClick={() => onSelectReport("Stock Alert")}
            >
                Stock Alert
            </span>
            <span
                className={`${menuStyle} ${parsedPermissions && parsedPermissions["view-expenses"] ? "" : "hidden"}`}
                onClick={() => onSelectReport("Expenses")}
            >
                Expenses
            </span>
            <span
                className={`${menuStyle} ${parsedPermissions && parsedPermissions["view-expenses-summary"] ? "" : "hidden"}`}
                onClick={() => onSelectReport("Expenses Summary")}
            >
                Expenses Summary
            </span>
            <span
                className={`${menuStyle} ${parsedPermissions && parsedPermissions["view-income-statement"] ? "" : "hidden"}`}
                onClick={() => onSelectReport("Income Statement")}
            >
                Income Statement
            </span>
            {/* <span
                className={`${menuStyle} ${parsedPermissions && parsedPermissions["view-daily"] ? "" : "hidden"}`}
                onClick={() => onSelectReport("Income Statement")}
            >
                Income Statement
            </span> */}
        </div>
    )
}

export default ReportsMenu
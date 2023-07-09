import {
    CalculatorIcon,
    ClipboardDocumentCheckIcon,
    HomeIcon,
    NewspaperIcon,
    PresentationChartLineIcon,
    ShoppingCartIcon,
    UsersIcon
} from "@heroicons/react/24/outline"
import React, { useEffect } from 'react'
import { Outlet } from "react-router-dom"
import { useClientContext } from "../../../utilities/context/client.context"
import useAuth from "../../../utilities/hooks/useAuth"
import AppBreadcrumbs from "../../../utilities/interface/application/aesthetics/app.breadcrumb"
import AppSidebar from "../../../utilities/interface/application/navigation/app.sidebar"
import NotificationContainer from "../../../utilities/interface/notification/notification.container"

export const userNavigation = [
    { name: "My Profile", href: "/profile" },
    { name: "Activity", href: "/activity" },
]

const menulist = [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon, current: true },
    { name: "Cashering", href: "/cashering", icon: CalculatorIcon, current: false },
    {
        name: "Stocks",
        icon: ShoppingCartIcon,
        cascade: false,
        children: [
            { name: "Inventory", href: "/inventory" },
            { name: "Purchase Order", href: "/pruchase-order" },
            { name: "Deliveries", href: "/deliveries" },
            { name: "Stock Transfer", href: "/stock-transfer" },
            { name: "Adjustments", href: "/adjustments" },
        ]
    },
    {
        name: "Transactions",
        icon: ClipboardDocumentCheckIcon,
        cascade: false,
        children: [
            { name: "Credits", href: "/credits" },
            { name: "Returns", href: "/returns" },
            { name: "Cheque Monitor", href: "/monitor" },
        ]
    },
    {
        name: "Libraries",
        icon: NewspaperIcon,
        cascade: false,
        children: [
            { name: "Suppliers", href: "/suppliers" },
            { name: "Customers", href: "/customer" },
            { name: "Categories", href: "/category" },
            { name: "Masterlist", href: "/masterlist" },
            { name: "Options", href: "/option" },
        ]
    },
    { name: "Reports", href: "/reports", icon: PresentationChartLineIcon, current: false },
    { name: "Accounts", href: "/users", icon: UsersIcon, current: false },
]

const DashboardIndex = () => {
    const { trail } = useClientContext()
    const auth = useAuth()

    useEffect(() => {
        const instantiate = async () => {
        }

        instantiate()
    }, [])

    return (
        <div className="flex h-screen flex-col">
            <AppSidebar menulist={menulist} />
            <main className="flex flex-col md:pl-56 w-full flex-grow overflow-hidden bg-[#e4e4e4]">
                <AppBreadcrumbs pages={trail} />
                <div className="p-5 flex flex-col flex-grow bg-[#e4e4e4] overflow-auto relative scroll-md">
                    <div className="w-full flex flex-col bg-white border drop-shadow-md items-start p-5 text-xs min-h-full flex-none">
                        <Outlet />
                    </div>
                </div>
                <div className="flex flex-none w-full h-[40px] bg-white border border-t-secondary-500"></div>
            </main>
            <NotificationContainer />
        </div>
    )
}

export default DashboardIndex
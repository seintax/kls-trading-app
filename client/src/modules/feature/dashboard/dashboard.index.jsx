import {
    CalculatorIcon,
    ClipboardDocumentCheckIcon,
    HomeIcon,
    NewspaperIcon,
    PresentationChartLineIcon,
    ShoppingCartIcon,
    UserGroupIcon,
    UsersIcon
} from "@heroicons/react/24/outline"
import React, { useEffect, useState } from 'react'
import { Outlet } from "react-router-dom"
import { useClientContext } from "../../../utilities/context/client.context"
import useAuth from "../../../utilities/hooks/useAuth"
import useAuthenticate from "../../../utilities/hooks/useAuthenticate"
import useLogout from "../../../utilities/hooks/useLogout"
import AppBreadcrumbs from "../../../utilities/interface/application/aesthetics/app.breadcrumb"
import AppSideBar from "../../../utilities/interface/application/navigation/app.sidebar"
import AppSideMenu from "../../../utilities/interface/application/navigation/app.sidemenu"
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
            { name: "Purchase Order", href: "/purchase-order" },
            { name: "Delivery", href: "/delivery" },
            { name: "Inventory", href: "/inventory" },
            // { name: "Adjustment", href: "/stock-adjustment" },
            { name: "Stock Transfer", href: "/stock-transfer" },
            { name: "Receiving", href: "/receiving" },
        ]
    },
    {
        name: "Transactions",
        icon: ClipboardDocumentCheckIcon,
        cascade: false,
        children: [
            { name: "Credits", href: "/credit" },
            { name: "Cheque Monitor", href: "/cheque-monitor" },
            { name: "Expenses", href: "/expense" },
        ]
    },
    {
        name: "Libraries",
        icon: NewspaperIcon,
        cascade: false,
        children: [
            { name: "Branches", href: "/branch", exclusive: ["DevOp"] },
            { name: "Suppliers", href: "/supplier" },
            { name: "Customers", href: "/customer" },
            { name: "Categories", href: "/category" },
            { name: "Masterlist", href: "/masterlist" },
            { name: "Options", href: "/option" },
            { name: "Inclusions", href: "/inclusion" },
        ]
    },
    { name: "Reports", href: "/reports", icon: PresentationChartLineIcon, current: false },
    { name: "Accounts", href: "/users", icon: UsersIcon, current: false },
    { name: "Roles", href: "/roles", icon: UserGroupIcon, current: false, exclusive: ["DevOp"] },
]

const DashboardIndex = () => {
    const [sidebarSideMenu, setSidebarSideMenu] = useState(false)
    const [sideMenuItems, setSideMenuItems] = useState()
    const [instance, setInstance] = useState(true)
    const { trail } = useClientContext()
    const authenticate = useAuthenticate()
    const { logout } = useLogout()
    const auth = useAuth()

    useEffect(() => {
        const instantiate = async () => {
            console.log("instance")
            if (!authenticate) {
                logout()
            }
            setInstance(false)
        }

        if (instance) instantiate()
    }, [instance])

    return (
        <div className="flex h-screen flex-col">
            <AppSideBar
                menulist={menulist}
                sidebarSideMenu={sidebarSideMenu}
                setSidebarSideMenu={setSidebarSideMenu}
                setSideMenuItems={setSideMenuItems}
            />
            <main className="flex flex-col pl-16 lg:pl-56 w-full flex-grow overflow-hidden bg-[#e4e4e4] z-5 bg-red-200">
                <AppBreadcrumbs pages={trail} />
                <div className="p-0 lg:p-5 flex flex-col flex-grow bg-[#e4e4e4] overflow-auto scroll-md relative">
                    <div className="w-full flex flex-col bg-white border border-1 border-gray-300 items-start p-4 lg:p-6 text-xs min-h-full flex-none shadow-md bg-red-200">
                        <Outlet />
                    </div>
                    <AppSideMenu sidebarSideMenu={sidebarSideMenu} setSidebarSideMenu={setSidebarSideMenu} sideMenuItems={sideMenuItems} />
                </div>
                <div className="flex flex-none w-full h-[40px] bg-white border border-t-secondary-500"></div>
            </main>
            <NotificationContainer />
        </div>
    )
}

export default DashboardIndex
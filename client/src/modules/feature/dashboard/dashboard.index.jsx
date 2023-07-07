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
import { useNotifyContext } from "../../../utilities/context/notify.context"
import { useUserContext } from "../../../utilities/context/user.context"
import AppBreadcrumbs from "../../../utilities/interface/application/aesthetics/app.breadcrumb"
import AppSidebar from "../../../utilities/interface/application/navigation/app.sidebar"
import NotificationContainer from "../../../utilities/interface/notification/notification.container"
import { updateAccount } from "../../system/account/account.services"

export const userNavigation = [
    { name: "My Profile", href: "/profile" },
    { name: "Activity", href: "/activity" },
    { name: "Sign out", href: "/" },
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
            { name: "Categories", href: "/category" },
            { name: "Masterlist", href: "/masterlist" },
            { name: "Suppliers", href: "/suppliers" },
            { name: "Customers", href: "/customer" },
        ]
    },
    { name: "Reports", href: "/reports", icon: PresentationChartLineIcon, current: false },
    { name: "Accounts", href: "/users", icon: UsersIcon, current: false },
]

const DashboardIndex = () => {
    const { notify } = useNotifyContext()
    const { trail } = useClientContext()
    const { user, setuser } = useUserContext()

    useEffect(() => {
        const auth = JSON.parse(localStorage.getItem("auth"))
        if (auth) setuser(auth)
    }, [])

    useEffect(() => {
        if (user) {
            const instantiateUser = async () => {
                // let spec = await specifyhAccount(specifyfilter)
                let spec = await updateAccount({ name: "SEINTAXZZZZ", id: "1" })
                console.log(spec)
                // if (user?.id) {
                //     let res = await fetchShiftByStart(user.id)
                //     if (!res.success) {
                //         notify({ type: 'error', message: "An error occured during retrieval for shift schedule." })
                //         return
                //     }
                //     if (res?.result?.id) {
                //         localStorage.setItem("shift", JSON.stringify({
                //             shift: res?.result?.id,
                //             status: res?.result?.status,
                //             begcash: res?.result?.begcash,
                //             begshift: res?.result?.begshift
                //         }))
                //     }
                //     else localStorage.removeItem("shift")
                // }
                // else {
                //     notify({ type: 'error', message: "Invalid user data." })
                //     localStorage.removeItem("shift")
                // }
            }

            instantiateUser()
        }
    }, [user])

    return (
        <div className="flex h-screen flex-col">
            <AppSidebar menulist={menulist} />
            <main className="flex flex-col md:pl-56 w-full flex-grow overflow-hidden bg-[#e4e4e4]">
                <AppBreadcrumbs pages={trail} />
                <div className="p-5 flex flex-col flex-grow bg-[#e4e4e4] overflow-auto relative scroll-md">
                    <div className="w-full flex flex-col bg-white border drop-shadow-md items-start p-5 text-xs">
                        <Outlet />
                    </div>
                </div>
                <div className="w-full h-[75px] bg-white border border-t-secondary-500"></div>
            </main>
            <NotificationContainer />
        </div>
    )
}

export default DashboardIndex
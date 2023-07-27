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
import { useDispatch, useSelector } from "react-redux"
import { Outlet } from "react-router-dom"
import { useClientContext } from "../../utilities/context/client.context"
import { isDev, isEmpty } from "../../utilities/functions/string.functions"
import useAuth from "../../utilities/hooks/useAuth"
import useAuthenticate from "../../utilities/hooks/useAuthenticate"
import useLogout from "../../utilities/hooks/useLogout"
import AppBreadcrumbs from "../../utilities/interface/application/aesthetics/app.breadcrumb"
import AppSideBar from "../../utilities/interface/application/navigation/app.sidebar"
import AppSideMenu from "../../utilities/interface/application/navigation/app.sidemenu"
import NotificationContainer from "../../utilities/interface/notification/notification.container"
import { defaultRole } from "../../utilities/variables/string.variables"
import { useUpdateAccountMutation } from "../system/account/account.services"
import { setPermissionCache } from "../system/permission/permission.reducer"
import { useFetchAllPermissionMutation } from "../system/permission/permission.services"
import { setRolesAccess, setRolesCache } from "../system/roles/roles.reducer"
import { useCreateRolesMutation, useFetchAllRolesMutation } from "../system/roles/roles.services"

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
            { name: "Credits", href: "/credits" },
            { name: "Cheque Monitor", href: "/cheque-monitor" },
            { name: "Expenses", href: "/expenses" },
        ]
    },
    {
        name: "Libraries",
        icon: NewspaperIcon,
        cascade: false,
        children: [
            { name: "Branches", href: "/branches" },
            { name: "Suppliers", href: "/suppliers" },
            { name: "Customers", href: "/customers" },
            { name: "Categories", href: "/categories" },
            { name: "Masterlist", href: "/masterlist" },
            { name: "Options", href: "/options" },
            { name: "Inclusions", href: "/inclusions" },
            { name: "Permissions", href: "/permissions" },
        ]
    },
    { name: "Reports", href: "/reports", icon: PresentationChartLineIcon, current: false },
    { name: "Roles", href: "/roles", icon: UserGroupIcon, current: false },
    { name: "Accounts", href: "/accounts", icon: UsersIcon, current: false },
]

const AppIndex = () => {
    const permissionSelector = useSelector(state => state.permission)
    const roleSelector = useSelector(state => state.roles)
    const authSelector = useSelector(state => state.roles)
    const [sidebarSideMenu, setSidebarSideMenu] = useState(false)
    const [sideMenuItems, setSideMenuItems] = useState()
    const [instance, setInstance] = useState(true)
    const [noDev, setNoDev] = useState(false)
    const { trail } = useClientContext()
    const authenticate = useAuthenticate()
    const dispatch = useDispatch()
    const { logout } = useLogout()
    const auth = useAuth()

    const [allRoles] = useFetchAllRolesMutation()
    const [allPermissions] = useFetchAllPermissionMutation()
    const [createRole] = useCreateRolesMutation()
    const [updateAccount] = useUpdateAccountMutation()

    const formatToJSONObject = (array) => {
        let jsonObject = {}
        array?.map(permission => {
            let usableJson = JSON.parse(permission.json)
            let jsonArray = {}
            for (const prop in usableJson) {
                if (usableJson[prop])
                    jsonArray = {
                        ...jsonArray,
                        [prop]: usableJson[prop]
                    }
            }
            jsonObject = {
                ...jsonObject,
                [permission.name]: {
                    ...jsonArray
                }
            }
        })
        return jsonObject
    }

    useEffect(() => {
        const roleauth = async () => {
            await allRoles()
                .unwrap()
                .then(async (res) => {
                    if (res.success) {
                        let dev = res?.arrayResult?.filter(f => f.name === defaultRole)
                        if (isEmpty(dev.length)) setNoDev(true)
                        dispatch(setRolesCache(res?.arrayResult))
                    }
                })
                .catch(err => console.error(err))
        }

        const permissions = async () => {
            await allPermissions()
                .unwrap()
                .then(async (res) => {
                    if (res.success) {
                        dispatch(setPermissionCache(res?.arrayResult))
                    }
                })
                .catch(err => console.error(err))
        }

        const instantiate = async () => {
            await roleauth()
            await permissions()

            if (!authenticate) {
                logout()
            }
            setInstance(false)
        }

        if (instance) instantiate()
    }, [instance])

    useEffect(() => {
        if (isDev(auth) && noDev && permissionSelector.cache.length) {
            const registerDev = async () => {
                let json = JSON.stringify(formatToJSONObject(permissionSelector.cache))
                await createRole({ name: defaultRole, permission: json })
                    .unwrap()
                    .then(async (res) => {
                        if (res.success) {
                            await updateAccount({ role: defaultRole, id: auth.id })
                                .unwrap()
                                .then(res => {
                                    if (res.success) {
                                        setNoDev(false)
                                    }
                                })
                                .catch(err => console.error(err))
                        }
                    })
                    .catch(err => console.error(err))
            }
            if (window.confirm("Do you wish to create a dev role?")) {
                registerDev()
            }
        }
    }, [noDev, auth, permissionSelector.cache])

    useEffect(() => {
        if (auth.role && roleSelector.cache.length) {
            let matchRoles = roleSelector.cache.filter(f => f.name === auth.role)
            let matched = matchRoles.length ? matchRoles[0] : undefined
            dispatch(setRolesAccess({
                ...matched,
                permission: JSON.parse(matched?.permission)
            }))
        }
    }, [auth, roleSelector.cache])

    const currentService = () => {
        return import.meta.env.MODE === "development" ? import.meta.env.VITE_API_BASE_URL : import.meta.env.VITE_API_BASE_URL_PROD
    }

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
                <div className="flex flex-none w-full h-[40px] bg-white border border-t-secondary-500 items-center px-3">
                    <span className="ml-auto flex items-center gap-3 text-sm">
                        <div className="bg-lime-400 w-3 h-3 rounded-full"></div>
                        {currentService().includes("vercel") ? "Cloud" : "Local"} Endpoint
                    </span>
                </div>
            </main>
            <NotificationContainer />
        </div>
    )
}

export default AppIndex
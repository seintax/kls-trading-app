import {
    ArchiveBoxIcon,
    BanknotesIcon,
    CalculatorIcon,
    Cog8ToothIcon,
    DocumentTextIcon,
    HomeIcon,
    NewspaperIcon,
    PresentationChartLineIcon,
    ReceiptRefundIcon,
    ShoppingCartIcon,
    UserGroupIcon,
    UsersIcon
} from "@heroicons/react/24/outline"
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { Outlet } from "react-router-dom"
import { version } from "../../../package.json"
import { isDev, isEmpty, isYes } from "../../utilities/functions/string.functions"
import useAuth from "../../utilities/hooks/useAuth"
import useAuthenticate from "../../utilities/hooks/useAuthenticate"
import useLogout from "../../utilities/hooks/useLogout"
import AppBreadcrumbs from "../../utilities/interface/application/aesthetics/app.breadcrumb"
import AppSideBar from "../../utilities/interface/application/navigation/app.sidebar"
import AppSideMenu from "../../utilities/interface/application/navigation/app.sidemenu"
import NotificationContainer from "../../utilities/interface/notification/notification.container"
import { setOnScrollY, setScrollY } from "../../utilities/redux/slices/utilitySlice"
import { defaultRole } from "../../utilities/variables/string.variables"
import { useUpdateAccountMutation } from "../system/account/account.services"
import { setSettingsConfig, setSettingsMenus, setSettingsNotifier } from "../system/config/config.reducer"
import { useByAccountConfigMutation } from "../system/config/config.services"
import { setPermissionCache } from "../system/permission/permission.reducer"
import { useFetchAllPermissionMutation } from "../system/permission/permission.services"
import { setRolesAccess, setRolesCache } from "../system/roles/roles.reducer"
import { useCreateRolesMutation, useFetchAllRolesMutation } from "../system/roles/roles.services"

export const userNavigation = [
    { name: "My Profile", href: "/my-profile" },
    { name: "Activity", href: "/my-activity" },
]

const menulist = (config) => {
    return [
        { name: "Dashboard", href: "/dashboard", icon: HomeIcon, current: true },
        { name: "Reports", href: "/reports", icon: PresentationChartLineIcon, current: false },
        { name: "Inventory", href: "/inventory", icon: ArchiveBoxIcon, current: false },
        { name: "Cashering", href: isYes(config.simplifiedcashering) ? "/cashering" : "/complex-cashering", icon: CalculatorIcon, current: false },
        { name: "Credits", href: "/credits", icon: ReceiptRefundIcon, current: false },
        { name: "Cheque Monitor", href: "/cheque-monitor", icon: DocumentTextIcon, current: false },
        {
            name: "Stocks",
            icon: ShoppingCartIcon,
            cascade: false,
            children: [
                { name: "Price Checker", href: "/price-checker" },
                { name: "Purchase Order", href: "/purchase-order" },
                { name: "Delivery", href: "/delivery" },
                { name: "Stock Transfer", href: "/stock-transfer" },
                { name: "Receiving", href: "/receiving" },
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
        { name: "Expenses", href: "/expenses", icon: BanknotesIcon, current: false },
        { name: "Roles", href: "/roles", icon: UserGroupIcon, current: false },
        { name: "Accounts", href: "/accounts", icon: UsersIcon, current: false },
        { name: "Settings", href: "/settings", icon: Cog8ToothIcon, current: false },
    ]
}

const AppIndex = () => {
    const configSelector = useSelector(state => state.settings)
    const permissionSelector = useSelector(state => state.permission)
    const roleSelector = useSelector(state => state.roles)
    const locationSelector = useSelector(state => state.locate)
    const utilitySelector = useSelector(state => state.utility)
    const [sidebarSideMenu, setSidebarSideMenu] = useState(false)
    const [sideMenuItems, setSideMenuItems] = useState()
    const [instance, setInstance] = useState(true)
    const [noDev, setNoDev] = useState(false)
    const authenticate = useAuthenticate()
    const dispatch = useDispatch()
    const { logout } = useLogout()
    const refList = useRef()
    const auth = useAuth()

    const [allRoles, { isLoading: rolesLoading }] = useFetchAllRolesMutation()
    const [allPermissions, { isLoading: permissionsLoading }] = useFetchAllPermissionMutation()
    const [accountConfig, { isLoading: configLoading }] = useByAccountConfigMutation()
    const [createRole] = useCreateRolesMutation()
    const [updateAccount] = useUpdateAccountMutation()
    const defaultConfig = {
        discount: "Amount",
        ratelimit: 100,
        shownetdiscount: "Yes",
        simplifiedcashering: "No"
    }

    useEffect(() => {
        if (configSelector.updater) {
            dispatch(setSettingsMenus(menulist(configSelector.config)))
        }
    }, [configSelector.updater])

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

        const config = async () => {
            await accountConfig({ account: auth.id })
                .unwrap()
                .then(res => {
                    if (res.success) {
                        if (res.distinctResult.data?.length) {
                            let config = res.distinctResult.data[0]
                            dispatch(setSettingsConfig(JSON.parse(config.json)))
                            dispatch(setSettingsMenus((menulist(JSON.parse(config.json)))))
                            dispatch(setSettingsNotifier(true))
                        }
                        if (!res.distinctResult.data?.length) {
                            dispatch(setSettingsConfig(defaultConfig))
                            dispatch(setSettingsMenus((menulist(defaultConfig))))
                            dispatch(setSettingsNotifier(true))
                        }
                    }
                })
                .catch(err => console.error(err))
        }

        const instantiate = async () => {
            if (!authenticate) {
                logout()
            }

            await config()
            await roleauth()
            await permissions()
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

    useEffect(() => {
        if (refList.current && utilitySelector.isLogged) {
            dispatch(setScrollY(refList.current.scrollTop))
        }
    }, [utilitySelector.isLogged, refList])

    useEffect(() => {
        if (utilitySelector.onScrollY) {
            refList.current.scroll({
                top: utilitySelector.scrollY || 0,
                behavior: 'smooth'
            })
            dispatch(setOnScrollY(false))
        }
    }, [utilitySelector.onScrollY])

    return (
        <div className="flex h-screen flex-col">
            <AppSideBar
                sidebarSideMenu={sidebarSideMenu}
                setSidebarSideMenu={setSidebarSideMenu}
                setSideMenuItems={setSideMenuItems}
                isLoading={configLoading || permissionsLoading || rolesLoading}
            />
            <main className="flex flex-col pl-16 lg:pl-56 w-full flex-grow overflow-hidden bg-[#e4e4e4] z-5 bg-red-200">
                <AppBreadcrumbs location={locationSelector.location} />
                <div ref={refList} className="p-0 lg:p-5 flex flex-col flex-grow bg-[#e4e4e4] overflow-auto scroll-md relative">
                    <div className="w-full flex flex-col bg-white border border-1 border-gray-300 items-start p-0 md:p-4 lg:p-6 text-xs min-h-full flex-none shadow-md bg-red-200">
                        <Outlet />
                    </div>
                    <AppSideMenu
                        sidebarSideMenu={sidebarSideMenu}
                        setSidebarSideMenu={setSidebarSideMenu}
                        sideMenuItems={sideMenuItems}
                    />
                </div>
                <div className="flex flex-none w-full h-[40px] bg-white border border-t-secondary-500 items-center px-3">
                    <span className="flex items-center gap-3 text-sm">
                        v{version}
                    </span>
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
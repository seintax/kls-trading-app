import { ChevronRightIcon } from "@heroicons/react/24/outline"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { userNavigation } from "../../../../modules/app/app.index.jsx"
import { setSettingsUpdater } from "../../../../modules/system/config/config.reducer.jsx"
import { isDev, isEmpty } from "../../../functions/string.functions.jsx"
import useAuth from "../../../hooks/useAuth.jsx"
import AppNavigation from "./app.navigation.jsx"

export default function AppSideBar({ sidebarSideMenu, setSidebarSideMenu, setSideMenuItems, isLoading }) {
    const auth = useAuth()
    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const configSelector = useSelector(state => state.settings)
    const roleSelector = useSelector(state => state.roles)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [sidebarMenu, setSidebarMenu] = useState([])
    const [currentMenu, setCurrentMenu] = useState("Dashboard")
    const [currentCascade, setCurrentCascade] = useState("")
    const [isCascaded, setIsCascaded] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => { setMounted(true) }, [])

    useEffect(() => {
        if (mounted) {
            return () => {
                setSidebarMenu([])
            }
        }
    }, [mounted])

    useEffect(() => {
        setSidebarMenu(configSelector.menus)
        dispatch(setSettingsUpdater(false))
    }, [configSelector.menus])

    function handleSidebarOpen() {
        setSidebarOpen(prev => !prev)
    }

    useEffect(() => {
        if (sidebarSideMenu) {
            setSidebarMenu(sidebarMenu.map(nav => {
                if (nav?.children?.length) {
                    return {
                        ...nav,
                        cascade: false,
                    }
                }
                return nav
            }))
        }
    }, [sidebarSideMenu])

    useEffect(() => {
        let current = configSelector.menus?.filter(menu => location.pathname.startsWith(menu.href) || menu?.children?.filter(f => location.pathname.startsWith(f.href)).length)
        if (current?.length) setCurrentMenu(current[0].name)
    }, [location.pathname])

    function handleMenuSelect(item) {
        setSidebarOpen(false)
        setSidebarMenu(sidebarMenu.map(nav => {
            if (nav.name === item.name) {
                if (item.cascade !== undefined) {
                    return { ...nav, cascade: !item.cascade }
                }
                return { ...nav, current: true }
            }
            if (nav.cascade !== undefined) {
                return {
                    ...nav,
                    cascade: false,
                    children: nav?.children?.map(ch => {
                        return { ...ch, current: false }
                    })
                }
            }
            return { ...nav, current: false }
        }))
        if (item.cascade === undefined) {
            setSidebarSideMenu(item?.cascade || false)
            setCurrentCascade("")
            navigate(item.href)
            return
        }
        setCurrentCascade(item.name)
        setSideMenuItems(item.children)
        if (item.name === currentCascade) {
            setSidebarSideMenu(prev => !prev)
            setIsCascaded(prev => !prev)
            return
        }
        setSidebarSideMenu(true)
        if (!isEmpty(currentCascade) && currentCascade !== item.name) {
            setIsCascaded(true)
            return
        }
        if (currentCascade === item.name && isCascaded) {
            setIsCascaded(false)
            return
        }
        if (item.children) setIsCascaded(true)
    }

    function handleSubMenuSelect(item, subitem) {
        setSidebarMenu(sidebarMenu.map(nav => {
            if (nav.name === item.name) {
                return {
                    ...nav,
                    children: nav?.children?.map(ch => {
                        if (ch.name === subitem.name) {
                            return { ...ch, current: true }
                        }
                        return { ...ch, current: false }
                    })
                }
            }
            return { ...nav, current: false }
        }))
        navigate(subitem.href)
        setSidebarOpen(false)
        setSidebarSideMenu(false)
    }

    // const isVisible = (exclusive) => {
    //     if (isEmpty(exclusive) || exclusive.includes(auth.store)) return true
    //     return false
    // }

    const isVisible = (href) => {
        if (href === "/dashboard") return true
        if (href === "/settings") return true
        let propName = `${href?.replace("/", "")}-menu`
        if (roleSelector.access.permission?.hasOwnProperty(propName)) {
            return roleSelector.access.permission[propName]?.show
        }
        return false
    }

    const isRoledCascade = (item) => {
        let hasRole = item.children?.map(child => {
            let propName = `${child.href?.replace("/", "")}-menu`
            if (roleSelector.access.permission?.hasOwnProperty(propName)) {
                return { show: roleSelector.access.permission[propName]?.show }
            }
            return { show: false }
        })?.filter(f => f.show)
        return hasRole.length ? true : false
    }

    const activeLink = "bg-gradient-to-b text-black border border-secondary-600 from-white via-white to-primary-200"
    const normalLink = "text-black hover:bg-gradient-to-b hover:from-white hover:via-white hover:to-primary-200 hover:text-black lg:hover:bg-gradient-to-b lg:hover:from-primary-300 lg:hover:via-primary-300 lg:hover:to-primary-400 lg:hover:text-black border border-transparent hover:border-secondary-400"
    const activemdLink = "bg-gradient-to-b text-black border border-secondary-600 from-white via-white to-white lg:to-white lg:hover:bg-gradient-to-b lg:hover:from-primary-300 lg:hover:via-primary-300 lg:hover:to-primary-400 lg:hover:text-black lg:border-transparent hover:border-secondary-400"
    const normalmdLink = "text-black border border-transparent hover:bg-gradient-to-b hover:from-white hover:via-white hover:to-white hover:text-transparent lg:hover:bg-gradient-to-b lg:hover:from-primary-300 lg:hover:via-primary-300 lg:hover:to-primary-400 lg:hover:text-black lg:hover:border-secondary-400"
    const activelgLink = "bg-gradient-to-b text-black border border-secondary-600 from-white via-white to-white"

    const renderNavigation = () => {
        return (
            <nav className="flex-1 space-y-1 px-2 pb-4 z-20">
                {sidebarMenu?.map((item) => (
                    (!item.children) ? (
                        <div
                            key={item.name}
                            className={`${location.pathname.startsWith(item.href) ? activeLink : normalLink} group flex items-center px-1.5 lg:px-2 py-2 text-xs font-medium rounded-md cursor-pointer ${isVisible(item?.href) ? "" : "hidden"}`}
                            onClick={() => handleMenuSelect(item)}
                        >
                            <item.icon
                                className="text-secondary-600 mr-3 flex-shrink-0 h-6 w-6 group-hover:text-secondary-600"
                                aria-hidden="true"
                            />
                            <span className="hidden lg:block">{item.name}</span>
                        </div>
                    ) : (
                        <div
                            key={item.name}
                            className={isRoledCascade(item) ? "" : "hidden"}
                        >
                            {/* large viewport */}
                            <NavLink
                                className={`${(currentMenu === item.name && ((currentCascade === item.name && !isCascaded) || currentCascade !== item.name)) ? activelgLink : normalLink} w-full group hidden lg:flex items-center px-1.5 lg:px-2 py-2 text-xs font-medium rounded-md cursor-pointer focus:outline-none`}
                                onClick={() => handleMenuSelect(item)}
                            >
                                <item.icon
                                    className="text-secondary-600 mr-3 flex-shrink-0 h-6 w-6 group-hover:text-secondary-600"
                                    aria-hidden="true"
                                />
                                <span className="hidden lg:block">{item.name}</span>
                                <ChevronRightIcon className={`${currentCascade === item.name && sidebarSideMenu ? "rotate-90" : ""} ml-auto h-3 w-3 text-sm text-secondary-600`} />
                            </NavLink>

                            {/* mobile viewport */}
                            <NavLink
                                className={`${currentMenu === item.name ? activeLink : (currentCascade === item.name && sidebarSideMenu ? activemdLink : normalmdLink)} w-full group flex lg:hidden items-center px-1.5 lg:px-2 py-2 text-xs font-medium rounded-md cursor-pointer`}
                                onClick={() => handleMenuSelect(item)}
                            >
                                <item.icon
                                    className="text-secondary-600 mr-3 flex-shrink-0 h-6 w-6 group-hover:text-secondary-600"
                                    aria-hidden="true"
                                />
                                <span className="hidden lg:block">{item.name}</span>
                                <ChevronRightIcon className={`${currentCascade === item.name && sidebarSideMenu ? "rotate-90" : ""} ml-auto h-3 w-3 text-sm text-secondary-600`} />
                            </NavLink>

                            <div className="hidden lg:flex lg:flex-col">
                                {currentCascade === item.name && isCascaded && item.children.map((subItem) => (
                                    <div
                                        key={subItem.name}
                                        className={`${location.pathname.startsWith(subItem.href) ? activeLink : normalLink} group mt-1 flex items-center pl-[43px] pr-2 py-2 text-xs font-medium rounded-md cursor-pointer ${isVisible(subItem?.href) ? "" : "hidden"}`}
                                        onClick={() => handleSubMenuSelect(item, subItem)}
                                    >
                                        {subItem.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                ))}
                {
                    isDev(auth) && (
                        <div
                            className={`${location.pathname.startsWith("/database") ? activeLink : normalLink} group flex items-center px-1.5 lg:px-2 py-2 text-xs font-medium rounded-md cursor-pointer`}
                            onClick={() => navigate("/database")}
                        >
                            <ChevronRightIcon
                                className="text-secondary-600 mr-3 flex-shrink-0 h-6 w-6 group-hover:text-secondary-600"
                                aria-hidden="true"
                            />
                            <span className="hidden lg:block">Database</span>
                        </div>
                    )
                }
            </nav>
        )
    }

    const renderNavigationSkeleton = () => {
        return (
            Array.from({ length: 12 }, (_, i) => i)?.map(num => (
                <div
                    key={`navSkel${num}`}
                    className="text-black hover:bg-gradient-to-b border border-transparent group flex items-center px-1.5 lg:px-2 py-2.5 text-xs font-medium rounded-md gap-3"
                >
                    <span className="skeleton-loading lg:w-8"></span>
                    <div className="lg:skeleton-loading"></div>
                </div>
            ))
        )
    }

    const renderLabels = () => {
        return (
            <nav className="flex flex-col space-y-1 px-2 pb-4">
                {sidebarMenu?.map((item) => (
                    <div
                        key={item.name}
                        className={`flex items-center py-2 text-[10px] h-[42px] font-medium rounded-md cursor-pointer no-select blur-xs drop-shadow-lg`}
                    >
                        <span className="block bg-white border border-black px-1 py-1 rounded-[5px]">{item.name}</span>
                    </div>
                ))}
            </nav>
        )
    }

    return (
        <>
            <div className="w-16 fixed inset-y-0 flex lg:w-56 no-select">
                <div className="flex flex-grow flex-col overflow-y-auto border-r border-r-black text-white bg-white scroll-sm">
                    <div className="mt-20 px-1 flex flex-grow flex-col">
                        {isLoading ? renderNavigationSkeleton() : renderNavigation()}
                    </div>
                </div>
            </div>
            <div className={`w-fit absolute inset-y-0 flex z-50 ml-11 bg-transparent no-select ${sidebarOpen ? "" : "hidden"} lg:hidden`}>
                <div className="flex flex-grow flex-col overflow-y-auto text-black bg-transparent scroll-sm">
                    <div className="mt-20 px-1 flex flex-grow flex-col">
                        {renderLabels()}
                    </div>
                </div>
            </div>
            <div className="flex flex-0 flex-col no-select" >
                <AppNavigation
                    userNavigation={userNavigation}
                    handleSidebarOpen={handleSidebarOpen}
                    sidebarOpen={sidebarOpen}
                />
            </div>
        </>
    )
}

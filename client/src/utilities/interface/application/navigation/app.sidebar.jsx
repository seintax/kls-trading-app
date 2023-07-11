import { Dialog, Transition } from "@headlessui/react"
import {
    ChevronRightIcon,
    XMarkIcon
} from "@heroicons/react/24/outline"
import { Fragment, useEffect, useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { userNavigation } from "../../../../modules/feature/dashboard/dashboard.index.jsx"
import { isEmpty } from "../../../functions/string.functions.jsx"
import useAuth from "../../../hooks/useAuth.jsx"
import AppLogo from "../aesthetics/app.logo.jsx"
import AppNavigation from "./app.navigation.jsx"

export default function AppSideBar({ menulist }) {
    const auth = useAuth()
    const navigate = useNavigate()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [sidebarMenu, setSidebarMenu] = useState([])

    useEffect(() => {
        setSidebarMenu(menulist)
    }, [menulist])

    function handleSidebarOpen(isOpen) {
        setSidebarOpen(isOpen)
    }

    function handleMenuSelect(item) {
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
                    children: nav?.children?.map(ch => {
                        return { ...ch, current: false }
                    })
                }
            }
            return { ...nav, current: false }
        }))
        navigate(item.href)
        if (item.cascade === undefined) handleSidebarOpen(false)
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
        handleSidebarOpen(false)
    }

    const isVisible = (exclusive) => {
        if (isEmpty(exclusive) || exclusive === auth.store) return true
        return false
    }

    const activeLink = "bg-gradient-to-b text-secondary-500 border border-secondary-600 from-white via-white to-primary-200"
    const normalLink = "text-secondary-500 hover:bg-gradient-to-b hover:from-primary-300 hover:via-primary-300 hover:to-primary-400 hover:text-secondary-500 border border-transparent hover:border-secondary-400"

    const renderNavigation = () => {
        return (
            <nav className="flex-1 space-y-1 px-2 pb-4">
                {sidebarMenu.map((item) => (
                    (!item.children) ? (
                        <div
                            key={item.name}
                            className={`${item.current ? activeLink : normalLink} group flex items-center px-2 py-2 text-xs font-medium rounded-md cursor-pointer`}
                            onClick={() => handleMenuSelect(item)}
                        >
                            <item.icon
                                className="text-secondary-600 mr-3 flex-shrink-0 h-6 w-6 group-hover:text-secondary-600"
                                aria-hidden="true"
                            />
                            {item.name}
                        </div>
                    ) : (
                        <div
                            key={item.name}
                        >
                            <NavLink
                                className={`${item.current ? activeLink : normalLink} group flex items-center px-2 py-2 text-xs font-medium rounded-md cursor-pointer`}
                                onClick={() => handleMenuSelect(item)}
                            >
                                <item.icon
                                    className="text-secondary-600 mr-3 flex-shrink-0 h-6 w-6 group-hover:text-secondary-600"
                                    aria-hidden="true"
                                />
                                {item.name}
                                <ChevronRightIcon className={`${item.cascade ? "rotate-90" : ""} ml-auto h-4 w-4 text-secondary-600`} />
                            </NavLink>
                            {item.cascade && item.children.map((subItem) => (
                                <div
                                    key={subItem.name}
                                    className={`${subItem.current ? activeLink : normalLink} group mt-1 flex items-center pl-[43px] pr-2 py-2 text-xs font-medium rounded-md cursor-pointer ${isVisible(subItem?.exclusive) ? "" : "hidden"}`}
                                    onClick={() => handleSubMenuSelect(item, subItem)}
                                >
                                    {subItem.name}
                                </div>
                            ))}
                        </div>
                    )
                ))}
            </nav>
        )
    }

    // mobile sidebar
    return (
        <>
            <Transition.Root show={sidebarOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-40 md:hidden"
                    onClose={handleSidebarOpen}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="transition-opacity ease-linear duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-linear duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-40 flex">
                        <Transition.Child
                            as={Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-[#010a3a] text-white pt-5 pb-4">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-in-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in-out duration-300"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                                        <button
                                            type="button"
                                            className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                            onClick={() => handleSidebarOpen(false)}
                                        >
                                            <span className="sr-only">Close sidebar</span>
                                            <XMarkIcon
                                                className="h-6 w-6 text-white"
                                                aria-hidden="true"
                                            />
                                        </button>
                                    </div>
                                </Transition.Child>
                                {<AppLogo inverted={true} />}
                                <div className="mt-5 h-0 flex-1 overflow-y-auto">
                                    {renderNavigation()}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                        <div className="w-14 flex-shrink-0" aria-hidden="true">
                            {/* Dummy element to force sidebar to shrink to fit close icon */}
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
            <div className="hidden md:fixed md:inset-y-0 md:flex md:w-56 md:flex-col no-select">
                <div className="flex flex-grow flex-col overflow-y-auto border-r border-r-secondary-500 text-white bg-white shadow-md border-shadow scroll-sm">
                    <div className="mt-20 px-1 flex flex-grow flex-col">
                        {renderNavigation()}
                    </div>
                </div >
            </div >
            <div className="flex flex-0 flex-col no-select" >
                <AppNavigation
                    userNavigation={userNavigation}
                    handleSidebarOpen={handleSidebarOpen}
                />
            </div >
        </>
    )
}

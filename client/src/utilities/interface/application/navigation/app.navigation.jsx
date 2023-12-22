import { Menu, Transition } from "@headlessui/react"
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid"
import { Bars3Icon, BellIcon, TicketIcon } from "@heroicons/react/24/outline"
import { Fragment, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { Link, useLocation } from "react-router-dom"
import { StrFn, isDev } from "../../../functions/string.functions"
import useAuth from "../../../hooks/useAuth"
import { useDebounce } from "../../../hooks/useDebounce"
import useLogout from "../../../hooks/useLogout"
import { resetSearchKey, setSearchKey } from "../../../redux/slices/searchSlice"

function classNames(...classes) {
    return classes.filter(Boolean).join(" ")
}

export default function AppNavigation({ userNavigation, handleSidebarOpen, sidebarOpen }) {
    const auth = useAuth()
    const { logout } = useLogout()
    const [text, setText] = useState("")
    const [cache, setCache] = useState({
        service: ""
    })
    const debounceSearch = useDebounce(text, 700)
    const dispatch = useDispatch()
    const location = useLocation()

    useEffect(() => {
        dispatch(resetSearchKey())
        if (cache.hasOwnProperty(location.pathname)) {
            setText(cache[location.pathname])
            return
        }
        setText("")
    }, [location.pathname])

    useEffect(() => {
        dispatch(setSearchKey(debounceSearch))
        setCache(prev => ({
            ...prev,
            [location.pathname]: debounceSearch
        }))
    }, [debounceSearch])

    const onChange = (e) => {
        setText(e.target.value)
    }

    const onSubmit = (e) => {
        e.preventDefault()
    }

    const branchDisplay = () => {
        if (auth.role === "DevOp" && auth.store === "DevOp") return "All Access"
        if (auth.role === "SysAd" && auth.store === "SysAd") return "System Administrator"
        if (auth.store === "SysAd") return "Back Office"
        if (auth.store.includes("JT-")) return `Jally Trading - ${StrFn.properCase(auth.store?.replace("JT-", ""))} Branch`
    }

    return (
        <div className={`sticky top-0 z-20 flex h-16 flex-shrink-0 ${isDev(auth) ? "bg-gradient-to-b from-primary-300 via-primary-300 to-primary-500" : "bg-[#4baf4f]"} border-b border-secondary-500 shadow-md`}>
            <button
                type="button"
                className={`border-r border-secondary-500 ${sidebarOpen ? "focus:bg-primary-500" : ""} px-4 -ml-0.5 text-black-700 focus:outline-none focus:ring-inset lg:hidden`}
                onClick={() => handleSidebarOpen(true)}
            >
                <span className="sr-only">Open sidebar</span>
                <Bars3Icon className="h-8 w-8" aria-hidden="true" />
            </button>
            <div className="w-full flex flex-row-reverse lg:flex-row items-center flex-1 pl-1 pr-3 ml-2.5">
                {auth ? (
                    <>
                        <div className="flex items-center relative isolate w-fit group cursor-pointer h-fit">
                            <div className="flex absolute z-[-1] left-5 w-full">
                                <div className="hidden lg:flex items-center bg-primary-400 py-4 w-full pl-0 pr-5 rounded-[10px] rounded-br-[30px] border border-white group-hover:bg-primary-500">
                                </div>
                            </div>
                            <Menu as="div" className="relative">
                                <div>
                                    <Menu.Button className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                                        <span className="sr-only">Open user menu</span>
                                        <span className="h-9 w-9 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-[50%] flex items-center justify-center text-lg font-bold border border-1 border-white text-white hover:from-primary-400 hover:to-secondary-400 uppercase">
                                            {auth?.name?.slice(0, 1) || "U"}
                                        </span>
                                    </Menu.Button>
                                </div>
                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Menu.Items className="absolute right-0 lg:left-0 mt-2 w-48 origin-top-right lg:origin-top-left rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-secondary-500">
                                        {userNavigation.map((item) => (
                                            <Menu.Item key={item.name}>
                                                {({ active }) => (
                                                    <Link
                                                        to={item.href ? item.href : undefined}
                                                        className={classNames(
                                                            active ? "bg-gray-100" : "",
                                                            "block px-4 py-2 text-xs text-gray-700 hover:bg-gradient-to-b hover:from-white hover:via-white hover:to-primary-200"
                                                        )}
                                                    >
                                                        {item.name}
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                        ))}
                                        <Menu.Item key={"Sign Out"}>
                                            <Link
                                                onClick={() => logout()}
                                                className={"block px-4 py-2 text-xs text-gray-700 hover:bg-gradient-to-b hover:from-white hover:via-white hover:to-primary-200"}
                                            >
                                                Sign Out
                                            </Link>
                                        </Menu.Item>
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                            <span className="hidden lg:flex text-black text-sm ml-2 pr-2 font-semibold">
                                {StrFn.properCase(auth?.name)}
                            </span>
                        </div>
                        <div className="flex items-center relative isolate w-fit group cursor-pointer h-fit mr-2 lg:mr-0">
                            <div className="flex absolute z-[-1] right- lg:left-5 w-full">
                                <div className="flex items-center bg-primary-400 py-4 w-full pl-0 pr-5 rounded-[10px] rounded-tl-[30px] rounded-br-[30px] border border-white group-hover:bg-primary-500">
                                </div>
                            </div>
                            <span className="hidden lg:flex text-black text-sm mr-3 lg:ml-12 pr-2 font-semibold px-5 lg:px-0">
                                {branchDisplay()}
                            </span>
                            <span className="flex lg:hidden text-black text-sm mr-3 lg:ml-12 pr-2 font-semibold px-5 lg:px-0">
                                {auth.store}
                            </span>
                        </div>
                    </>
                ) : null}
                <div className="ml-auto flex items-center mr-2 lg:mr-0">
                    <div className="flex flex-1">
                        <form className="flex items-center w-full md:ml-0" onSubmit={onSubmit} method="GET">
                            <label htmlFor="search-field" className="sr-only">
                                Search
                            </label>
                            <div className="relative w-full text-gray-400 focus-within:text-black">
                                <div className="pointer-events-none absolute inset-y-0 left-1 flex items-center">
                                    <MagnifyingGlassIcon className="h-4 w-4 ml-2 text-black" aria-hidden="true" />
                                </div>
                                <input
                                    id="search-field"
                                    className="block w-full md:w-[350px] rounded-[10px] text-black bg-primary-400 my-2 focus:bg-primary-500 border-white py-2 pl-10 pr-3 placeholder-gray-500 focus:border-primary-300 focus:placeholder-[#32395e] focus:outline-none focus:ring-0 text-xs rounded-tl-[30px] rounded-br-[30px]"
                                    placeholder="Search product, supplier or transaction"
                                    autoComplete="off"
                                    type="search"
                                    name="search"
                                    value={text}
                                    onChange={onChange}
                                />
                            </div>
                        </form>
                    </div>
                    <button
                        type="button"
                        className="hidden lg:block rounded-full bg-primary-400 border border-white p-[7px] text-primary-700 hover:bg-primary-500 focus:outline-none focus:bg-primary-500 ml-2.5"
                    >
                        <span className="sr-only">View notifications</span>
                        <TicketIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <button
                        type="button"
                        className="hidden lg:block rounded-full bg-primary-400 border border-white p-[5px] text-primary-700 hover:bg-primary-500 focus:outline-none focus:bg-primary-500 ml-2.5"
                    >
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                </div>
            </div>
        </div>
    )
}

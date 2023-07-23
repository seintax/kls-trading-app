import { Menu, Transition } from "@headlessui/react"
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid"
import { Bars3BottomLeftIcon, BellIcon, TicketIcon } from "@heroicons/react/24/outline"
import { Fragment, useState } from "react"
import { Link } from "react-router-dom"
import { useClientContext } from "../../../context/client.context"
import { useUserContext } from "../../../context/user.context"
import useAuth from "../../../hooks/useAuth"
import useLogout from "../../../hooks/useLogout"

function classNames(...classes) {
    return classes.filter(Boolean).join(" ")
}

export default function AppNavigation({ userNavigation, handleSidebarOpen }) {
    const auth = useAuth()
    const { user } = useUserContext()
    const { setSearch } = useClientContext()
    const [text, settext] = useState("")
    const { logout } = useLogout()

    const onChange = (e) => {
        const { value } = e.target
        settext(value)
    }

    const onSubmit = (e) => {
        e.preventDefault()
        setSearch(prev => ({
            ...prev,
            time: new Date(),
            key: text
        }))
    }

    return (
        <div className="sticky top-0 z-20 flex h-16 flex-shrink-0 bg-gradient-to-b from-primary-300 via-primary-300 to-primary-500 border-b border-secondary-500 shadow-md border-shadow">
            <button
                type="button"
                className="border-r border-secondary-500 focus:bg-primary-500 px-5 -ml-0.5 text-secondary-500 focus:outline-none focus:ring-inset lg:hidden"
                onClick={() => handleSidebarOpen(true)}
            >
                <span className="sr-only">Open sidebar</span>
                <Bars3BottomLeftIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="w-full flex flex-row-reverse lg:flex-row items-center flex-1 pl-1 pr-3 ml-2.5">
                {auth ? (
                    <div className="flex items-center relative isolate w-fit group cursor-pointer h-fit">
                        <div className="hidden lg:flex items-center bg-primary-400 py-4 w-full pl-0 pr-5 rounded-br-[30px] absolute z-[-1] left-5 border border-secondary-500 group-hover:bg-primary-500">
                        </div>
                        <Menu as="div" className="relative">
                            <div>
                                <Menu.Button className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                                    <span className="sr-only">Open user menu</span>
                                    <span className="h-9 w-9 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-[50%] flex items-center justify-center text-lg font-bold border border-1 border-[#ec45de] text-white hover:from-primary-400 hover:to-secondary-400">
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
                        <span className="hidden lg:flex text-black text-xs ml-2 font-bold uppercase">
                            {auth?.name}
                        </span>
                    </div>
                ) : null}
                <div className="ml-auto flex items-center mr-3 lg:mr-0">
                    <div className="hidden lg:flex flex-1">
                        <form className="flex items-center w-full md:ml-0" onSubmit={onSubmit} method="GET">
                            <label htmlFor="search-field" className="sr-only">
                                Search
                            </label>
                            <div className="relative w-full text-gray-400 focus-within:text-black">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
                                    <MagnifyingGlassIcon className="h-4 w-4 ml-2" aria-hidden="true" />
                                </div>
                                <input
                                    id="search-field"
                                    className="block w-[350px] rounded-[10px] text-black bg-primary-400 my-2 focus:bg-primary-500 border-secondary-500 py-2 pl-8 pr-3 placeholder-gray-500 focus:border-transparent focus:placeholder-[#32395e] focus:outline-none focus:ring-0 text-xs"
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
                        className="rounded-full bg-primary-400 border border-secondary-500 p-[7px] text-primary-700 hover:bg-primary-500 focus:outline-none focus:bg-primary-500 ml-2.5"
                    >
                        <span className="sr-only">View notifications</span>
                        <TicketIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <button
                        type="button"
                        className="rounded-full bg-primary-400 border border-secondary-500 p-[5px] text-primary-700 hover:bg-primary-500 focus:outline-none focus:bg-primary-500 ml-2.5"
                    >
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                </div>
            </div>
        </div>
    )
}

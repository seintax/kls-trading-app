import { Transition } from "@headlessui/react"
import { useLocation, useNavigate } from "react-router-dom"
import { isEmpty } from "../../../functions/string.functions"
import useAuth from "../../../hooks/useAuth"

const AppSideMenu = ({ sidebarSideMenu, setSidebarSideMenu, sideMenuItems }) => {
    const auth = useAuth()
    const location = useLocation()
    const navigate = useNavigate()

    function handleSubMenuSelect(item) {
        setSidebarSideMenu(false)
        navigate(item.href)
    }

    const isVisible = (exclusive) => {
        if (isEmpty(exclusive) || exclusive === auth.store) return true
        return false
    }

    const activeLink = "bg-gradient-to-b text-secondary-500 border border-secondary-600 from-white via-white to-primary-200"
    const normalLink = "text-secondary-500 lg:hover:bg-gradient-to-b lg:hover:from-primary-300 lg:hover:via-primary-300 lg:hover:to-primary-400 lg:hover:text-secondary-500 border border-transparent lg:hover:border-secondary-400"

    return (
        <Transition
            show={sidebarSideMenu}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            className={`flex lg:hidden fixed h-full w-full bg-gradient-to-r from-[#00000070] via-[#00000070] to-[#00000040] z-10`}
        >
            <Transition.Child
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-4"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-4"
                className="bg-white p-3 w-[250px] h-[75%] text-sm mt-1"
            >
                {
                    sideMenuItems?.map(item => (
                        <div
                            key={item.name}
                            className={`${location.pathname.startsWith(item.href) ? activeLink : normalLink} group mt-1 flex items-center px-2 py-2 text-xs font-medium rounded-md cursor-pointer left-0 ${isVisible(item?.exclusive) ? "" : "hidden"}`}
                            onClick={() => handleSubMenuSelect(item)}
                        >
                            {item.name}
                        </div>
                    ))
                }
            </Transition.Child>
        </Transition>
    )
}

export default AppSideMenu
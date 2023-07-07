import { EyeIcon } from "@heroicons/react/20/solid"
import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import DevLogo from "../../../assets/logo.ico"
import { useNotificationContext } from "../../../utilities/context/notification.context"
import AppLogo from "../../../utilities/interface/application/aesthetics/app.logo"
import { loginAccount } from "./account.services"

const AccountLogin = () => {
    const { handleNotification } = useNotificationContext()
    const navigate = useNavigate()
    const [error, seterror] = useState("")
    const [view, setview] = useState("password")
    const [login, setlogin] = useState({
        user: "",
        pass: ""
    })

    useEffect(() => {
        localStorage.removeItem("cred")
        localStorage.removeItem("shift")
    }, [])


    const onChange = (e) => {
        const { name, value } = e.target
        setlogin(prev => ({ ...prev, [name]: value }))
        seterror("")
    }

    // const checkForShift = async (id) => {
    //     if (id) {
    //         let res = await fetchShiftByStart(id)
    //         if (res?.result?.id) {
    //             localStorage.setItem("shift", JSON.stringify({
    //                 shift: res?.result?.id,
    //                 status: res?.result?.status,
    //                 begcash: res?.result?.begcash,
    //                 begshift: res?.result?.begshift
    //             }))
    //         }
    //         else localStorage.removeItem("shift")
    //     }
    //     else localStorage.removeItem("shift")
    // }

    const onLogin = async (e) => {
        e.preventDefault()
        let param = {
            user: login.user,
            pass: login.pass
        }
        let res = await loginAccount(param.user, param.pass, param.token)
        if (res?.result?.name) {
            let id = res?.result?.id
            let token = JSON.stringify(res?.result)
            localStorage.setItem("cred", token)
            // await checkForShift(id)
            navigate("/dashboard")
            return
        }
        seterror("Invalid credentials. Please try again.")
    }

    return (
        <div className="flex min-h-full flex-col justify-center py-12 bg-gradient-to-b from-[#f1b83b] to-[#c28606] sm:px-6 lg:px-8 no-select">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <AppLogo style="h-[15rem]" inverted={true} />
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-primary-300">
                    Sign in to your account
                </h2>
            </div>
            <div className="text-center text-red-500 max-w-md w-full rounded-[20px] mx-auto mt-5">
                {error ? error : ""}
            </div>
            <div className="mt-1 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="py-10 px-4 shadow sm:rounded-lg sm:px-10">
                    <form onSubmit={onLogin} className="space-y-6">
                        <div>
                            <div className="mt-1">
                                <input
                                    id="user"
                                    name="user"
                                    type="email"
                                    autoComplete="off"
                                    placeholder="Email Address"
                                    value={login.user}
                                    required
                                    onChange={onChange}
                                    className="block w-full appearance-none rounded-md border border-primary-500 bg-primary-500 px-3 py-2 placeholder-primary-800 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="mt-1 flex relative items-center">
                                <input
                                    id="pass"
                                    name="pass"
                                    type={view}
                                    autoComplete="off"
                                    placeholder="Password"
                                    value={login.pass}
                                    required
                                    onChange={onChange}
                                    className="block w-full appearance-none rounded-md border border-primary-500 bg-primary-500 px-3 py-2 placeholder-primary-800 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                                />
                                <div className="absolute right-0 mr-1 cursor-pointer p-2" onMouseDown={() => setview("text")} onMouseUp={() => setview("password")} onMouseLeave={() => setview("password")}>
                                    <EyeIcon className="w-4 h-4" />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                />
                                <label
                                    htmlFor="remember-me"
                                    className="ml-2 block text-sm text-gray-200 hover:underline"
                                >
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <a
                                    href="#"
                                    className="font-medium text-primary-200 hover:text-primary-300 hover:underline"
                                >
                                    Forgot your password?
                                </a>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md border border-transparent bg-secondary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>
                </div>
                <div className="flex justify-center p-5 text-center text-blue-300 items-center">
                    In partnership with: <img src={DevLogo} className="h-10 w-10 ml-3" /> <span className="text-blue-200 rounded-[10px] hover:underline cursor-pointer flex items-center">KL Info. Tech Services</span>
                </div>
            </div>
        </div>
    )
}

export default AccountLogin
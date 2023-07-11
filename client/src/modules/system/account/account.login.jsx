import { EyeIcon } from "@heroicons/react/20/solid"
import React, { useEffect, useState } from 'react'
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import DevLogo from "../../../assets/logo.ico"
import useAuth from "../../../utilities/hooks/useAuth"
import useToast from "../../../utilities/hooks/useToast"
import AppLogo from "../../../utilities/interface/application/aesthetics/app.logo"
import { setCredentials } from "../../../utilities/redux/slices/authSlice"
import { useLoginMutation } from "./account.services"

const AccountLogin = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [error, seterror] = useState("")
    const [view, setview] = useState("password")
    const [login, setlogin] = useState({ user: "", pass: "" })
    const toast = useToast()
    const [authLogin, { isLoading }] = useLoginMutation()
    const auth = useAuth()

    useEffect(() => {
        if (auth) navigate("/dashboard")
    }, [navigate, auth])

    const onChange = (e) => {
        const { name, value } = e.target
        setlogin(prev => ({ ...prev, [name]: value }))
        seterror("")
    }

    const onLogin = async (e) => {
        e.preventDefault()
        const { user, pass } = login
        await authLogin({ user, pass }).unwrap()
            .then(res => {
                localStorage.setItem("token", res.token)
                toast.userNotify(user)
                dispatch(setCredentials(res.data))
            })
            .catch(err => console.error(err))

        seterror("Invalid credentials. Please try again.")
    }

    return (
        <div className="flex min-h-full flex-col justify-center py-12 bg-gradient-to-b from-[#f1b83b] to-[#c28606] sm:px-6 lg:px-8 no-select">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
            </div>
            <div className="text-center text-red-500 max-w-md w-full rounded-[20px] mx-auto mt-5">
                {error ? error : ""}
            </div>
            <div className="mt-1 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="py-10 px-4 shadow sm:rounded-lg sm:px-10 bg-gradient-to-b from-[#ffffff30] via-[#c7c6c610] to-[#ffffff90] border-shadow">
                    <AppLogo style="h-[15rem]" inverted={false} />
                    <h2 className="mb-8 text-center text-3xl font-bold tracking-tight text-primary-200">
                        Sign in to your account
                    </h2>
                    <form onSubmit={onLogin} className="space-y-6">
                        <div>
                            <div className="mt-1">
                                <input
                                    id="user"
                                    name="user"
                                    type="text"
                                    placeholder="Email Address"
                                    value={login.user}
                                    required
                                    onChange={onChange}
                                    className="block w-full appearance-none rounded-md border border-primary-500 bg-white px-3 py-2 placeholder-primary-800 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
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
                                    className="block w-full appearance-none rounded-md border border-primary-500 bg-white px-3 py-2 placeholder-primary-800 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
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
                <div className="flex flex-col gap-4 justify-start px-4 py-5 mt-5 text-blue-600 items-start bg-gradient-to-b from-[#ffffff50] via-[#c7c6c650] to-[#ffffff] rounded-xl shadow border-shadow">
                    <span>In partnership with:</span>
                    <div className="w-full flex justify-center gap-3">
                        <img src={DevLogo} className="h-7 w-7 ml-3" />
                        <span className="text-blue-800 font-bold rounded-[10px] hover:underline cursor-pointer flex items-center text-lg">KL Info. Tech Services</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AccountLogin
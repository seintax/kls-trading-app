import { XMarkIcon } from "@heroicons/react/20/solid"
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useLocation } from "react-router-dom"
import Banner from "../../../assets/jally_banner.png"
import useAuth from "../../../utilities/hooks/useAuth"
import { setLocationPath } from "../../../utilities/redux/slices/locateSlice"
import DashboardCards from "./dashboard.cards"
import DashboardFilters from "./dashboard.filters"
import DashboardGraphSales from "./dashboard.graph.sales"
import { resetDashboardSummary, setDashboardShown } from "./dashboard.reducer"

const DashboardIndex = ({ id }) => {
    const auth = useAuth()
    const dashboardSelector = useSelector(state => state.dashboard)
    const dispatch = useDispatch()
    const location = useLocation()
    const [showStats, setShowStats] = useState(false)
    const [mounted, setMounted] = useState(false)
    const statisticsRoleInclusion = ["DevOp", "SysAd", "Admin"]

    useEffect(() => { setMounted(true) }, [])

    useEffect(() => {
        if (mounted) {
            return () => {
                setShowStats(false)
            }
        }
    }, [mounted])

    useEffect(() => {
        // handleTrail(location.pathname.split("/").filter(path => path !== id).join("/"))
        dispatch(setLocationPath(location?.pathname))
    }, [location])

    const onClose = () => {
        dispatch(resetDashboardSummary())
    }

    const toggleStatistics = () => {
        setShowStats(prev => !prev)
        dispatch(setDashboardShown(!showStats))
    }

    return (
        <div className="h-full flex-none w-full">
            <div className="flex flex-col w-full h-full">
                <div className="flex flex-col lg:flex-row w-full h-full gap-4">
                    <div className={`${dashboardSelector.summary ? "" : "hidden"} flex items-center justify-center fixed top-0 left-0 w-screen h-screen transition ease-in-out duration-300 z-20 bg-black bg-opacity-20`}>
                        <div className="w-[90%] lg:w-2/3 h-2/3 p-5 border border-gray-300 rounded-[20px] relative bg-white">
                            <span className="absolute right-5 p-0.5 bg-secondary-500" onClick={() => onClose()}>
                                <XMarkIcon className="w-4 h-4 text-white cursor-pointer" />
                            </span>
                            <DashboardGraphSales />
                        </div>
                    </div>
                    <div className="w-full transition ease-in-out duration-300 p-5 rounded-[20px] flex flex-col items-center justify-center">
                        {/* <DashboardGraphCollection /> */}
                        <img src={Banner} alt="" />
                        {/* <AppLogo style="h-full" /> */}
                        <div className={`${statisticsRoleInclusion.includes(auth.role) ? "" : "hidden"} mt-5 text-base text-blue-600 cursor-pointer hover:underline no-select`} onClick={() => toggleStatistics()}>
                            {showStats ? "Hide" : "Show"} Statistics
                        </div>
                    </div>
                </div>
                <div className={showStats ? `flex w-full py-10` : "hidden"}>
                    <DashboardCards />
                </div>
            </div>
            <DashboardFilters />
        </div>
    )
}

export default DashboardIndex
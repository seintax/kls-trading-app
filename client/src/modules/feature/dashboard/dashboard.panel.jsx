import { XMarkIcon } from "@heroicons/react/20/solid"
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useLocation } from "react-router-dom"
import { useClientContext } from "../../../utilities/context/client.context"
import useToast from "../../../utilities/hooks/useToast"
import DashboardCards from "./dashboard.cards"
import DashboardGraph from "./dashboard.graph"
import { resetDashboardSummary } from "./dashboard.reducer"
import DashboardSummary from "./dashboard.summary"

const DashboardPanel = ({ id }) => {
    const dashboardSelector = useSelector(state => state.dashboard)
    const dispatch = useDispatch()
    const location = useLocation()
    const { handleTrail, user } = useClientContext()
    const toast = useToast()
    const [loadId, setLoadId] = useState()
    // const { data, isLoading, isError, refetch } = useQuery(`${name.toLowerCase()}-index`, () => fetchDailySummary(moment(new Date()).subtract(3, 'days').format("YYYY-MM-DD"), moment(new Date()).format("YYYY-MM-DD")))

    useEffect(() => {
        handleTrail(location.pathname.split("/").filter(path => path !== id).join("/"))
    }, [location])

    const fetch = async () => {
        await toast.showPending(
            new Promise(resolve => setTimeout(resolve, 3000)),
            "Please wait...",
            "Fetch successful",
            "Fetch has failed"
        )
    }

    const onClose = () => {
        dispatch(resetDashboardSummary())
    }

    return (
        <div className="h-full flex-none w-full">
            <div className="flex flex-col gap-3 w-full h-full">
                <DashboardCards />
                <div className="flex w-full h-full gap-4">
                    <div className={`${dashboardSelector.summary ? "w-2/3" : "hidden"} transition ease-in-out duration-300 h-full p-5 border border-gray-300 rounded-[20px] relative`}>
                        <span className="absolute right-5 p-0.5 bg-secondary-500" onClick={() => onClose()}>
                            <XMarkIcon className="w-4 h-4 text-white cursor-pointer" />
                        </span>
                        <DashboardSummary />
                    </div>
                    <div className={`${dashboardSelector.summary ? "w-1/3" : "w-full"} transition ease-in-out duration-300 h-full p-5 border border-gray-300 rounded-[20px]`}>
                        <DashboardGraph />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardPanel
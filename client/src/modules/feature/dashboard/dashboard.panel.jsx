import React, { useEffect, useState } from 'react'
import { useLocation } from "react-router-dom"
import { useClientContext } from "../../../utilities/context/client.context"
import useToast from "../../../utilities/hooks/useToast"
import DashboardGraph from "./dashboard.graph"

const DashboardPanel = ({ id }) => {
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

    return (
        <div className="h-full flex-none w-full">
            <div className="flex flex-col gap-3 w-full h-full">
                <div className="flex gap-5 text-sm">
                    <div className="w-full flex flex-col p-5 border border-gray-300 hover:bg-gradient-to-b hover:from-white hover:via-white hover:to-primary-200 cursor-pointer transition ease-in-out duration-500">
                        Gross Sales
                        <div className="text-xl">1,000.00</div>
                    </div>
                    <div className="w-full flex flex-col p-5 border border-gray-300 hover:bg-gradient-to-b hover:from-white hover:via-white hover:to-primary-200 cursor-pointer transition ease-in-out duration-500">
                        Refunds
                        <div className="text-xl">1,000.00</div>
                    </div>
                    <div className="w-full flex flex-col p-5 border border-gray-300 hover:bg-gradient-to-b hover:from-white hover:via-white hover:to-primary-200 cursor-pointer transition ease-in-out duration-500">
                        Discounts
                        <div className="text-xl">1,000.00</div>
                    </div>
                    <div className="w-full flex flex-col p-5 border border-gray-300 hover:bg-gradient-to-b hover:from-white hover:via-white hover:to-primary-200 cursor-pointer transition ease-in-out duration-500">
                        Net Sales
                        <div className="text-xl">1,000.00</div>
                    </div>
                    <div className="w-full flex flex-col p-5 border border-gray-300 hover:bg-gradient-to-b hover:from-white hover:via-white hover:to-primary-200 cursor-pointer transition ease-in-out duration-500">
                        Gross Profit
                        <div className="text-xl">1,000.00</div>
                    </div>
                    <div className="w-full flex flex-col p-5 border border-gray-300 hover:bg-gradient-to-b hover:from-white hover:via-white hover:to-primary-200 cursor-pointer transition ease-in-out duration-500">
                        Collectibles
                        <div className="text-xl">1,000.00</div>
                    </div>
                </div>
                <div className="w-full h-full p-5 border border-gray-300">
                    <DashboardGraph />
                </div>
            </div>
        </div>
    )
}

export default DashboardPanel
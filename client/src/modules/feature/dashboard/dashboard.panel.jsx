import React, { useEffect } from 'react'
import { useLocation } from "react-router-dom"
import { useClientContext } from "../../../utilities/context/client.context"

const DashboardPanel = ({ id }) => {
    const location = useLocation()
    const { handleTrail, user } = useClientContext()
    // const { data, isLoading, isError, refetch } = useQuery(`${name.toLowerCase()}-index`, () => fetchDailySummary(moment(new Date()).subtract(3, 'days').format("YYYY-MM-DD"), moment(new Date()).format("YYYY-MM-DD")))

    useEffect(() => {
        handleTrail(location.pathname.split("/").filter(path => path !== id).join("/"))
    }, [location])

    return (
        <div className="min-h-[1500px]">
            test
        </div>
    )
}

export default DashboardPanel
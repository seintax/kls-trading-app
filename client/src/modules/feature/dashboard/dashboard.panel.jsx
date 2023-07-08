import React, { useEffect, useState } from 'react'
import { useLocation } from "react-router-dom"
import { useClientContext } from "../../../utilities/context/client.context"
import useToast from "../../../utilities/hooks/useToast"

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
        <div className="min-h-[1500px]">
            <div className="flex flex-col gap-3">
                <button className="button-link" onClick={() => toast.showError("Error has occured")}>Error</button>
                <button className="button-link" onClick={() => toast.showSuccess("Successful action")}>Success</button>
                <button className="button-link" onClick={() => toast.showWarning("Lorem eawer awrawea weaw rawr aawdaw awe aw rawr awraw raweawe awe raw rawraweawe awe")}>Warning</button>
                <button className="button-link" onClick={() => toast.showDelete("Lorem eawer  rawraweawe awe")}>Delete</button>
                <button className="button-link" onClick={() => toast.showUpdate("Lorem rawraweawe awe")}>Update</button>
                <button className="button-link" onClick={() => fetch()}>Pending</button>
                <button className="button-link" onClick={() => setLoadId(toast.showLoading("Loading..."))}>Loading</button>
                <button className="button-link" onClick={() => toast.updateLoading(loadId, "Updating id", true)}>Upadte Loading</button>
                <button className="button-link" onClick={() => toast.updateLoading(loadId, "Finished id", false, "success")}>Finish Loading</button>
            </div>
        </div>
    )
}

export default DashboardPanel
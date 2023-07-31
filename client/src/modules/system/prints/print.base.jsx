import React, { useEffect } from 'react'
import { Outlet } from "react-router-dom"

const PrintBase = () => {
    useEffect(() => {
        document.title = "JBS | Report"
    }, [])


    return (
        <div id="no-print" className="w-screen min-h-screen bg-gradient-to-b from-primary-200 via-secondary-200 to-violet-200 flex items-start overflow-x-hidden">
            <Outlet />
        </div>
    )
}

export default PrintBase
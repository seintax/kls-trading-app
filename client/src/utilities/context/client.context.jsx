import React, { createContext, useContext, useState } from 'react'
import { useNavigate } from "react-router-dom"
import { StrFn } from "../functions/string.functions"
import AppLoading from "../interface/application/errormgmt/app.loading"

const ClientContext = createContext()

export function useClientContext() {
    return useContext(ClientContext)
}

export default function ClientProvider({ children }) {
    const navigate = useNavigate()
    const [loading, setloading] = useState(false)
    const [trail, setTrail] = useState([])
    const [config, setConfig] = useState({})
    const [selected, setSelected] = useState({})
    const [print, setPrint] = useState([])
    const [cache, setcache] = useState({
        schedule: []
    })
    const [search, setSearch] = useState({
        time: new Date(),
        key: "",
        all: {
            inventory: "N",
            conversion: "N"
        }
    })

    function handleTrail(pathname) {
        let patharray = pathname.split("/").filter(path => path !== "")
        setTrail(patharray.map((path, i) => {
            if (path) return {
                current: (patharray.length - 1) === i,
                name: StrFn.properCase(path),
                href: `/${path}`,
            }
        }) || [])
    }

    const handleLoading = async (callback) => {
        setloading(true)
        await callback()
        setloading(false)
    }

    const renderSelected = (fallback, key) => {
        if (!key) {
            navigate(fallback)
            return
        }
        return key
    }

    return (
        <ClientContext.Provider value={{
            trail,
            handleTrail,
            config,
            setConfig,
            search,
            setSearch,
            selected,
            setSelected,
            cache,
            setcache,
            print,
            setPrint,
            loading,
            setloading,
            handleLoading,
            renderSelected
        }}>
            {children}
            <AppLoading loading={loading} />
        </ClientContext.Provider>
    )
}

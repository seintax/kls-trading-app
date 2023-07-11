import React, { createContext, useContext, useState } from 'react'
import { StrFn } from "../functions/string.functions"

const ClientContext = createContext()

export function useClientContext() {
    return useContext(ClientContext)
}

export default function ClientProvider({ children }) {
    const [trail, setTrail] = useState([])

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

    return (
        <ClientContext.Provider value={{
            trail,
            handleTrail,
        }}>
            {children}
            {/* <AppLoading loading={loading} /> */}
        </ClientContext.Provider>
    )
}

import React, { createContext, useContext, useState } from 'react'

const DataContext = createContext()

export function useDataContext() {
    return useContext(DataContext)
}

export default function DataProvider({ children }) {
    const [actions, setActions] = useState({
        client: {}
    })

    const addAction = (payload) => {
        setActions(prev => ({
            ...prev,
            [payload.location]: payload.actions
        }))
    }

    const deconstructAction = (location) => {
        return actions[location]
    }

    return (
        <DataContext.Provider value={{
            actions,
            addAction,
            deconstructAction
        }}>
            {children}
        </DataContext.Provider>
    )
}

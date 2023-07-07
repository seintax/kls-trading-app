import React, { createContext, useContext, useState } from 'react'

const UserContext = createContext()

export function useUserContext() {
    return useContext(UserContext)
}

export default function UserProvider({ children }) {
    const [user, setuser] = useState()

    const auth = () => { return user }

    return (
        <UserContext.Provider value={{
            auth,
            user,
            setuser
        }}>
            {children}
        </UserContext.Provider>
    )
}

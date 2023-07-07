import { createContext, useContext, useState } from "react"

export const NotifyContext = createContext()

export function useNotifyContext() {
    return useContext(NotifyContext)
}

export default function NotifyProvider({ children }) {
    const [notifications, setNotifications] = useState([])

    function ShowNotification(type, message) {
        let notificationProperties = null
        notificationProperties = {
            id: crypto.randomUUID(),
            type: type,
            message: message,
        }
        setNotifications([...notifications, notificationProperties])
    }

    function notify(params) {
        ShowNotification(params.type, params.message)
    }

    return (
        <NotifyContext.Provider
            value={{
                notify,
                notifications,
                setNotifications,
            }}
        >
            {children}
        </NotifyContext.Provider>
    )
}

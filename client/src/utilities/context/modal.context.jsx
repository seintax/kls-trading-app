import { createContext, useContext, useEffect, useState } from "react"

const ModalContext = createContext()

export function useModalContext() {
    return useContext(ModalContext)
}

export default function ModalProvider({ children }) {
    const [activeModals, setActiveModals] = useState([])
    const [currentModal, setCurrentModal] = useState("")
    const [deleteProps, setDeleteProps] = useState("")
    const [modalProps, setModalProps] = useState({
        project: {}
    })

    function closeModal() {
        let active = activeModals.filter(f => f !== currentModal)
        setActiveModals(active)
        setCurrentModal(active.at(-1) || "")
    }

    function openAsModal(modalKey) {
        if (activeModals.includes(modalKey)) {
            throw Error(`Duplicate modal key '${modalKey}'.`)
        }
        setActiveModals(prev => ([...prev, modalKey]))
        setCurrentModal(modalKey)
    }

    function isActiveModal(modalKey) {
        return currentModal === modalKey
    }

    function toggleDelete(display, data, callback) {
        if (activeModals.includes("delete")) {
            throw Error(`Duplicate modal key 'delete'.`)
        }
        setDeleteProps({
            display,
            data,
            callback
        })
        setActiveModals(prev => ([...prev, "delete"]))
        setCurrentModal("delete")
    }

    function closeDelete() {
        let active = activeModals.filter(f => f !== "delete")
        setActiveModals(active)
        setCurrentModal(active.at(-1) || "")
    }

    useEffect(() => {
        console.log("current modal is: ", currentModal)
    }, [currentModal])


    return (
        <ModalContext.Provider value={{
            isActiveModal,
            activeModals,
            currentModal,
            openAsModal,
            closeModal,
            toggleDelete,
            closeDelete,
            deleteProps,
            modalProps,
            setModalProps
        }}>
            {children}
        </ModalContext.Provider>
    )
}

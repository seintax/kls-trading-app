import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useLocation } from "react-router-dom"
import useAuth from "../../../utilities/hooks/useAuth"
import { setLocationPath } from "../../../utilities/redux/slices/locateSlice"
import ConfigManage from "./config.manage"
import { resetSettingsItem, setSettingsItem, setSettingsNotifier, showSettingsManager } from "./config.reducer"
import { useByAccountConfigMutation } from "./config.services"

const ConfigIndex = () => {
    const auth = useAuth()
    const [accountConfig] = useByAccountConfigMutation()
    const dataSelector = useSelector(state => state.settings)
    const dispatch = useDispatch()
    const location = useLocation()
    const [mounted, setMounted] = useState(false)
    useEffect(() => { setMounted(true) }, [])

    useEffect(() => {
        if (mounted) {
            return () => { }
        }
    }, [mounted])

    useEffect(() => {
        dispatch(setLocationPath(location?.pathname))
    }, [location])

    useEffect(() => {
        const instantiate = async () => {
            await accountConfig({ account: auth.id })
                .unwrap()
                .then(res => {
                    if (res.success) {
                        if (res.distinctResult.data?.length) {
                            toggleUpdate(res.distinctResult.data[0])
                        }
                        if (!res.distinctResult.data?.length) {
                            toggleNewEntry()
                        }
                    }
                })
                .catch(err => console.error(err))
            return
        }

        instantiate()
    }, [mounted, dataSelector.notifier])

    const toggleNewEntry = () => {
        dispatch(resetSettingsItem())
        dispatch(setSettingsNotifier(false))
    }

    const toggleUpdate = (item) => {
        dispatch(setSettingsItem({
            ...item,
            json: JSON.parse(item.json)
        }))
        dispatch(setSettingsNotifier(false))
    }

    const toggleSettingsManager = () => {
        dispatch(showSettingsManager())
    }

    return (
        (dataSelector.manager) ? (
            <ConfigManage name={dataSelector?.display?.name} />
        ) : (
            <div className="w-full h-full flex items-center justify-center">
                <div className="px-5 py-2 bg-gray-300 rounded-md cursor-pointer hover:text-primary-500 transition ease-in duration-300" onClick={() => toggleSettingsManager()}>
                    Continue to User Configuration
                </div>
            </div>
        )
    )
}

export default ConfigIndex
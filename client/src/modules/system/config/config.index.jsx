import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import useAuth from "../../../utilities/hooks/useAuth"
import ConfigManage from "./config.manage"
import { resetSettingsItem, setSettingsItem, showSettingsManager } from "./config.reducer"
import { useByAccountConfigMutation } from "./config.services"

const ConfigIndex = () => {
    const auth = useAuth()
    const [accountConfig] = useByAccountConfigMutation()
    const dataSelector = useSelector(state => state.settings)
    const dispatch = useDispatch()

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
    }, [])

    const toggleNewEntry = () => {
        dispatch(resetSettingsItem())
        dispatch(showSettingsManager())
    }

    const toggleUpdate = (item) => {
        dispatch(setSettingsItem({
            ...item,
            json: JSON.parse(item.json)
        }))
        dispatch(showSettingsManager())
    }

    return (
        <ConfigManage name={dataSelector?.display?.name} />
    )
}

export default ConfigIndex
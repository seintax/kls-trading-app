import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import DataIndex from "../../../utilities/interface/datastack/data.index"
import MasterlistManage from "./masterlist.manage"
import MasterlistRecords from "./masterlist.records"
import { resetMasterlistItem, setMasterlistData, setMasterlistNotifier, showMasterlistManager } from "./masterlist.reducer"
import { useFetchAllMasterlistMutation } from "./masterlist.services"

const MasterlistIndex = () => {
    const [allMasterlist, { isLoading, isError, isSuccess }] = useFetchAllMasterlistMutation()
    const dataSelector = useSelector(state => state.masterlist)
    const dispatch = useDispatch()

    useEffect(() => {
        const instantiate = async () => {
            await allMasterlist()
                .unwrap()
                .then(res => {
                    if (res.success) {
                        dispatch(setMasterlistData(res?.arrayResult))
                        dispatch(setMasterlistNotifier(false))
                    }
                })
                .catch(err => console.error(err))
            return
        }
        if (dataSelector.data.length === 0 || dataSelector.notifier) {
            instantiate()
        }
    }, [dataSelector.notifier])

    useEffect(() => {
        if (!isLoading && isSuccess) {
            console.log("done")
        }
    }, [isSuccess, isLoading])

    const toggleNewEntry = () => {
        dispatch(resetMasterlistItem())
        dispatch(showMasterlistManager())
    }

    const actions = () => {
        return [
            { label: `Add ${dataSelector.display.name}`, callback: toggleNewEntry },
        ]
    }

    return (
        (dataSelector.manager) ? (
            <MasterlistManage name={dataSelector.display.name} />
        ) : (
            <DataIndex
                display={dataSelector.display}
                actions={actions()}
                data={dataSelector.data}
                isError={isError}
                isLoading={isLoading}
            >
                <MasterlistRecords />
            </DataIndex >
        )
    )
}

export default MasterlistIndex
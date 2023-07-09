import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import DataIndex from "../../../utilities/interface/datastack/data.index"
import VariantManage from "./variant.manage"
import VariantRecords from "./variant.records"
import { resetVariantItem, setVariantData, setVariantNotifier, showVariantManager } from "./variant.reducer"
import { useFetchAllVariantMutation } from "./variant.services"

const VariantIndex = () => {
    const [allVariant, { isLoading, isError, isSuccess }] = useFetchAllVariantMutation()
    const dataSelector = useSelector(state => state.variant)
    const masterlistSelector = useSelector(state => state.masterlist)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if (!masterlistSelector?.item?.id) {
            navigate('/masterlist')
        }
    }, [masterlistSelector])


    useEffect(() => {
        const instantiate = async () => {
            await allVariant()
                .unwrap()
                .then(res => {
                    if (res.success) {
                        dispatch(setVariantData(res?.arrayResult))
                        dispatch(setVariantNotifier(false))
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
        dispatch(resetVariantItem())
        dispatch(showVariantManager())
    }

    const actions = () => {
        return [
            { label: `Add ${dataSelector.display.name}`, callback: toggleNewEntry },
        ]
    }

    return (
        (dataSelector.manager) ? (
            <VariantManage name={dataSelector.display.name} />
        ) : (
            <DataIndex
                display={dataSelector.display}
                actions={actions()}
                data={dataSelector.data}
                isError={isError}
                isLoading={isLoading}
            >
                <VariantRecords />
            </DataIndex >
        )
    )
}

export default VariantIndex
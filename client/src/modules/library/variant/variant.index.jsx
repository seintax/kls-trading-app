import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import DataHeader from "../../../utilities/interface/datastack/data.header"
import DataIndex from "../../../utilities/interface/datastack/data.index"
import { resetMasterlistItem } from "../masterlist/masterlist.reducer"
import VariantManage from "./variant.manage"
import VariantRecords from "./variant.records"
import { resetVariantItem, resetVariantManager, setVariantData, setVariantNotifier, showVariantManager } from "./variant.reducer"
import { useByProductVariantMutation } from "./variant.services"

const VariantIndex = () => {
    const masterlistSelector = useSelector(state => state.masterlist)
    const dataSelector = useSelector(state => state.variant)
    const [productVariant, { isLoading, isError, isSuccess }] = useByProductVariantMutation(masterlistSelector.item.id)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if (!masterlistSelector?.item?.id) {
            navigate('/masterlist')
        }
    }, [masterlistSelector])

    useEffect(() => {
        const instantiate = async () => {
            if (masterlistSelector.item.id) {
                await productVariant({ product: masterlistSelector.item.id })
                    .unwrap()
                    .then(res => {
                        if (res.success) {
                            dispatch(setVariantData(res?.arrayResult))
                            dispatch(setVariantNotifier(false))
                        }
                    })
                    .catch(err => console.error(err))
            }
            return
        }
        if (dataSelector.data.length === 0 || dataSelector.notifier) {
            instantiate()
        }
    }, [dataSelector.notifier, masterlistSelector.item.id])

    useEffect(() => {
        if (!isLoading && isSuccess) {
            console.log("done")
            return () => {
                dispatch(setVariantData([]))
                dispatch(setVariantNotifier(false))
            }
        }
    }, [isSuccess, isLoading])

    const toggleNewEntry = () => {
        dispatch(resetVariantItem())
        dispatch(showVariantManager())
    }

    const actions = () => {
        return [
            { label: `Add ${dataSelector.display.name}`, callback: toggleNewEntry }
        ]
    }

    const moveBack = useCallback(() => {
        dispatch(resetMasterlistItem())
        navigate('/masterlist')
    }, [])

    const returnToList = useCallback(() => {
        dispatch(resetVariantItem())
        dispatch(resetVariantManager())
    }, [])

    return (
        <>
            <DataHeader
                label="Masterlist"
                name={`(${masterlistSelector.item.id}) ${masterlistSelector.item.name} | ${masterlistSelector.item.category}`}
                movecallback={moveBack}
                returncallback={dataSelector.manager ? returnToList : undefined}
            />
            {
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
            }
        </>
    )
}

export default VariantIndex
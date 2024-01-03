import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useLocation } from "react-router-dom"
import { cleanDisplay, isAdmin, isDev } from "../../../utilities/functions/string.functions"
import useAuth from "../../../utilities/hooks/useAuth"
import DataHeader from "../../../utilities/interface/datastack/data.header"
import DataIndex from "../../../utilities/interface/datastack/data.index"
import { setLocationPath } from "../../../utilities/redux/slices/locateSlice"
import { resetInventoryManager } from "../inventory/inventory.reducer"
import AdjustmentManage from "./inventory.item.manage"
import AdjustmentRecords from "./inventory.item.records"
import { resetAdjustmentItem, resetAdjustmentManager, setAdjustmentData, setAdjustmentNotifier, showAdjustmentManager } from "./inventory.item.reducer"
import { useByInventoryAdjustmentMutation } from "./inventory.item.services"

const AdjustmentIndex = () => {
    const auth = useAuth()
    const [allAdjustment, { isLoading, isError, isSuccess }] = useByInventoryAdjustmentMutation()
    const dataSelector = useSelector(state => state.adjustment)
    const inventorySelector = useSelector(state => state.inventory)
    const [product, setProduct] = useState("")
    const location = useLocation()
    const dispatch = useDispatch()
    const [mounted, setMounted] = useState(false)

    useEffect(() => { setMounted(true) }, [])

    useEffect(() => {
        if (mounted) {
            return () => {
                dispatch(resetAdjustmentManager())
            }
        }
    }, [mounted])

    useEffect(() => {
        dispatch(setLocationPath(`${location?.pathname}/Adjustment`))
    }, [location])

    useEffect(() => {
        const instantiate = async () => {
            await allAdjustment({ item: inventorySelector.item.id })
                .unwrap()
                .then(res => {
                    if (res.success) {
                        dispatch(setAdjustmentData(res?.arrayResult))
                        dispatch(setAdjustmentNotifier(false))
                    }
                })
                .catch(err => console.error(err))
            return
        }
        if (dataSelector.data.length === 0 || dataSelector.notifier || inventorySelector.item.id) {
            instantiate()
        }
    }, [dataSelector.notifier, inventorySelector.item])

    useEffect(() => {
        if (inventorySelector.manager && inventorySelector.item.id) {
            setProduct(`${inventorySelector.item.product_name} (${inventorySelector.item.category}/${inventorySelector.item.variant_serial}/${inventorySelector.item.variant_model}/${inventorySelector.item.variant_brand})`)
        }
    }, [inventorySelector.manager, inventorySelector.item])


    const toggleNewEntry = () => {
        dispatch(resetAdjustmentItem())
        dispatch(showAdjustmentManager())
    }

    const actions = () => {
        return [
            { label: `Add ${dataSelector.display.name}`, callback: toggleNewEntry },
        ]
    }

    const returnToList = useCallback(() => {
        dispatch(resetInventoryManager())
    }, [])

    return (
        <div className="w-full flex flex-col gap-5 -mt-5 lg:mt-0">
            <div className="w-full sticky -top-5 pt-5 lg:pt-0 z-10">
                <DataHeader
                    name={`Inventory Adjustment for: ${cleanDisplay(product)}`}
                    returncallback={returnToList}
                />
            </div>
            {
                (dataSelector.manager) ? (
                    <AdjustmentManage name={dataSelector.display.name} />
                ) : (
                    <DataIndex
                        display={dataSelector.display}
                        actions={(isDev(auth) || isAdmin(auth)) ? actions() : []}
                        data={dataSelector.data}
                        isError={isError}
                        isLoading={isLoading}
                        plain={true}
                    >
                        <AdjustmentRecords />
                    </DataIndex >
                )
            }
        </div>
    )
}

export default AdjustmentIndex
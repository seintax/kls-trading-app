import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useLocation } from "react-router-dom"
import { cleanDisplay, isAdmin, isDev, isEmpty } from "../../../utilities/functions/string.functions"
import useAuth from "../../../utilities/hooks/useAuth"
import DataHeader from "../../../utilities/interface/datastack/data.header"
import DataIndex from "../../../utilities/interface/datastack/data.index"
import { setLocationPath } from "../../../utilities/redux/slices/locateSlice"
import PriceManage from "./price.manage"
import PriceRecords from "./price.records"
import { resetPriceItem, setPriceData, setPriceNotifier, setPriceShown, showPriceManager } from "./price.reducer"
import { useByInventoryPriceMutation } from "./price.services"

const PriceIndex = () => {
    const auth = useAuth()
    const [allPrice, { isLoading, isError, isSuccess }] = useByInventoryPriceMutation()
    const dataSelector = useSelector(state => state.price)
    const inventorySelector = useSelector(state => state.inventory)
    const location = useLocation()
    const dispatch = useDispatch()
    const [mounted, setMounted] = useState(false)

    useEffect(() => { setMounted(true) }, [])

    useEffect(() => {
        if (mounted) {
            return () => {
                dispatch(setPriceShown(false))
            }
        }
    }, [mounted])

    useEffect(() => {
        dispatch(setLocationPath(`${location?.pathname}/Prices`))
    }, [location])

    useEffect(() => {
        const instantiate = async () => {
            if (!isEmpty(inventorySelector.item.id)) {
                await allPrice({ item: inventorySelector.item.id })
                    .unwrap()
                    .then(res => {
                        if (res.success) {
                            dispatch(setPriceData(res?.arrayResult?.map((item, index) => {
                                return {
                                    ...item,
                                    current: index === 0
                                }
                            })))
                            dispatch(setPriceNotifier(false))
                        }
                    })
                    .catch(err => console.error(err))
            }
            return
        }

        instantiate()
    }, [dataSelector.notifier, inventorySelector.item])

    useEffect(() => {
        if (!isLoading && isSuccess) {
            console.info("done")
        }
    }, [isSuccess, isLoading])

    const toggleNewEntry = () => {
        dispatch(resetPriceItem())
        dispatch(showPriceManager())
    }

    const actions = () => {
        return [
            { label: `Adjust ${dataSelector.display.name}`, callback: toggleNewEntry },
        ]
    }

    const returnToList = useCallback(() => {
        dispatch(setPriceShown(false))
    }, [])

    const productName = cleanDisplay(`${inventorySelector.item.product_name} (${inventorySelector.item.category}/${inventorySelector.item.variant_serial}/${inventorySelector.item.variant_model}/${inventorySelector.item.variant_brand}`)

    return (
        <div className="w-full flex flex-col gap-5 -mt-5 lg:mt-0">
            <div className="w-full sticky -top-5 pt-5 lg:pt-0 z-10">
                {
                    (isDev(auth) || isAdmin(auth)) ? (
                        <DataHeader
                            name={`Price Adjustment for: ${productName})`}
                            returncallback={returnToList}
                        />
                    ) : null
                }
            </div>
            {
                (dataSelector.manager) ? (
                    <PriceManage name={dataSelector.display.name} />
                ) : (
                    <DataIndex
                        display={dataSelector.display}
                        actions={(isDev(auth) || isAdmin(auth)) ? actions() : []}
                        data={dataSelector.data}
                        isError={isError}
                        isLoading={isLoading}
                    >
                        <PriceRecords />
                    </DataIndex >
                )
            }
        </div>
    )
}

export default PriceIndex
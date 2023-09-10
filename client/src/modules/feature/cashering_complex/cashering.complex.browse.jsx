import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { setMasterlistData } from "../../library/masterlist/masterlist.reducer"
import { useFetchAllMasterlistMutation } from "../../library/masterlist/masterlist.services"
import { useByAllProductVariantMutation } from "../../library/variant/variant.services"
import { setBrowserProduct, showBrowserManager } from "../browser/browser.reducer"

const CasheringComplexBrowse = () => {
    const dispatch = useDispatch()
    const browserSelector = useSelector(state => state.browser)
    const categorySelector = useSelector(state => state.masterlist)
    const [records, setRecords] = useState()

    const [allMasterlist] = useFetchAllMasterlistMutation()
    const [allVariants] = useByAllProductVariantMutation()

    useEffect(() => {
        const instantiate = async () => {
            if (categorySelector.data.length === 0) {
                // await allMasterlist()
                //     .unwrap()
                //     .then(res => {
                //         if (res.success) {
                //             dispatch(setMasterlistData(res?.arrayResult))
                //         }
                //     })
                //     .catch(err => console.error(err))
                await allVariants()
                    .unwrap()
                    .then(res => {
                        if (res.success) {
                            let productArr = []
                            let result = res.arrayResult?.map(prod => {
                                let exist = productArr.findIndex(farr => farr.product === prod.product_name)
                                if (exist > -1) {
                                    productArr[exist] = {
                                        ...productArr[exist],
                                        variants: [...productArr[exist].variants, prod]
                                    }
                                    return prod
                                }
                                productArr.push({
                                    id: prod.product,
                                    product: prod.product_name,
                                    category: prod.category,
                                    variants: [prod]
                                })
                            })
                            dispatch(setMasterlistData(productArr))
                        }
                    })
                    .catch(err => console.error(err))
            }

            return
        }

        instantiate()
    }, [])

    useEffect(() => {
        if (categorySelector?.data) {
            setRecords(categorySelector?.data?.filter(f => f.category === browserSelector?.category && (
                f.product?.toLowerCase()?.startsWith(browserSelector?.search?.toLowerCase()) ||
                f.variants?.filter(v => v.serial?.toLowerCase()?.startsWith(browserSelector?.search?.toLowerCase()) ||
                    v.model?.toLowerCase()?.startsWith(browserSelector?.search?.toLowerCase() ||
                        v.brand?.toLowerCase()?.startsWith(browserSelector?.search?.toLowerCase())))?.length > 0
            )))
        }
    }, [categorySelector?.data, browserSelector?.search, browserSelector?.category])

    const selectProduct = (product) => {
        dispatch(setBrowserProduct(product))
        dispatch(showBrowserManager())
    }

    return (
        <div className="flex flex-col w-full gap-0 py-5 text-sm md:text-base">
            {
                records?.map(item => (
                    <div key={item?.id} className="flex justify-between py-4 lg:py-2 hover:bg-gray-200 cursor-pointer px-5" onClick={() => selectProduct(item)} >
                        <span>{item?.product}</span>
                    </div>
                ))
            }
        </div>
    )
}

export default CasheringComplexBrowse
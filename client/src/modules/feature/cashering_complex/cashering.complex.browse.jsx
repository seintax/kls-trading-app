import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { forBranch } from "../../../utilities/functions/string.functions"
import useAuth from "../../../utilities/hooks/useAuth"
import { setMasterlistData } from "../../library/masterlist/masterlist.reducer"
import { useFetchAllMasterlistMutation } from "../../library/masterlist/masterlist.services"
import { useByAllProductVariantMutation } from "../../library/variant/variant.services"
import { setBrowserProduct, showBrowserManager } from "../browser/browser.reducer"
import { useFetchAllBrowserByBranchMutation } from "../browser/browser.services"

const CasheringComplexBrowse = () => {
    const auth = useAuth()
    const dispatch = useDispatch()
    const browserSelector = useSelector(state => state.browser)
    const categorySelector = useSelector(state => state.masterlist)
    const [records, setRecords] = useState()

    const [allMasterlist] = useFetchAllMasterlistMutation()
    const [allVariants] = useByAllProductVariantMutation()
    const [allBrowser, { isLoading }] = useFetchAllBrowserByBranchMutation()

    useEffect(() => {
        const instantiate = async () => {
            if (categorySelector.data.length === 0) {
                await allBrowser({ branch: forBranch(auth) })
                    .unwrap()
                    .then(res => {
                        if (res.success) {
                            let productArr = []
                            let result = res.arrayResult?.map(prod => {
                                let exist = productArr.findIndex(farr => farr.product === prod.product_name)
                                if (exist > -1) {
                                    let hasvariant = productArr[exist].variants.findIndex(varr => parseInt(varr.id) === parseInt(prod.variant))
                                    if (hasvariant === -1) {
                                        productArr[exist] = {
                                            ...productArr[exist],
                                            variants: [...productArr[exist].variants, {
                                                id: prod.variant,
                                                serial: prod.variant_serial,
                                                model: prod.variant_model,
                                                brand: prod.variant_brand,
                                                variant: `${prod.variant_serial}/${prod.variant_model}/${prod.variant_brand}`
                                            }]
                                        }
                                    }
                                    return prod
                                }
                                productArr.push({
                                    id: prod.product,
                                    product: prod.product_name,
                                    category: prod.category,
                                    variants: [{
                                        id: prod.variant,
                                        serial: prod.variant_serial,
                                        model: prod.variant_model,
                                        brand: prod.variant_brand,
                                        variant: `${prod.variant_serial}/${prod.variant_model}/${prod.variant_brand}`
                                    }]
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
                f.variants?.filter(v => v.serial?.toLowerCase()?.includes(browserSelector?.search?.toLowerCase()) ||
                    v.model?.toLowerCase()?.includes(browserSelector?.search?.toLowerCase() ||
                        v.brand?.toLowerCase()?.includes(browserSelector?.search?.toLowerCase())))?.length > 0
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
                !isLoading && records?.map(item => (
                    <div key={item?.id} className="flex flex-col md:flex-row justify-between py-4 lg:py-2 hover:bg-gray-200 cursor-pointer px-5" onClick={() => selectProduct(item)} >
                        <span>{item?.product}</span>
                        <span className="text-gray-500">{item?.variants?.length || 0} VARIANT/S</span>
                    </div>
                ))
            }
            {
                isLoading && Array.from({ length: 40 }, (_, i) => i)?.map(item => (
                    <div key={`brws${item}`} className="flex flex-col md:flex-row gap-1 justify-between py-4 lg:py-2 px-5">
                        <div className={`skeleton-loading w-full ${item % 2 !== 0 ? "lg:w-1/3" : "lg:w-1/2"}`}></div>
                        <div className="w-[150px] flex items-center gap-2">
                            <div className="skeleton-loading-rounded w-8"></div>
                            <div className="skeleton-loading w-full"></div>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default CasheringComplexBrowse
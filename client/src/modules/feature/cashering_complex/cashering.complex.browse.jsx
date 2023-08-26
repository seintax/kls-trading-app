import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { setMasterlistData } from "../../library/masterlist/masterlist.reducer"
import { useFetchAllMasterlistMutation } from "../../library/masterlist/masterlist.services"
import { setBrowserProduct, showBrowserManager } from "../browser/browser.reducer"

const CasheringComplexBrowse = () => {
    const dispatch = useDispatch()
    const browserSelector = useSelector(state => state.browser)
    const categorySelector = useSelector(state => state.masterlist)
    const [records, setRecords] = useState()

    const [allMasterlist] = useFetchAllMasterlistMutation()

    useEffect(() => {
        const instantiate = async () => {
            if (categorySelector.data.length === 0) {
                await allMasterlist()
                    .unwrap()
                    .then(res => {
                        if (res.success) {
                            dispatch(setMasterlistData(res?.arrayResult))
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
                f.name?.toLowerCase()?.startsWith(browserSelector?.search?.toLowerCase())
            )))
        }
    }, [categorySelector?.data, browserSelector?.search, browserSelector?.category])

    const selectProduct = (product) => {
        dispatch(setBrowserProduct(product))
        dispatch(showBrowserManager())
    }

    return (
        <div className="flex flex-col w-full gap-0 py-5 text-base">
            {
                records?.map(item => (
                    <div key={item?.id} className="flex justify-between py-4 lg:py-2 hover:bg-gray-200 cursor-pointer px-5" onClick={() => selectProduct(item)} >
                        <span>{item?.name}</span>
                    </div>
                ))
            }
        </div>
    )
}

export default CasheringComplexBrowse
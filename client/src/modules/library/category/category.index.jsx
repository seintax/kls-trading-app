import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { isAdmin, isDev } from "../../../utilities/functions/string.functions"
import useAuth from "../../../utilities/hooks/useAuth"
import DataIndex from "../../../utilities/interface/datastack/data.index"
import CategoryManage from "./category.manage"
import CategoryRecords from "./category.records"
import { resetCategoryItem, setCategoryData, setCategoryNotifier, showCategoryManager } from "./category.reducer"
import { useFetchAllCategoryMutation } from "./category.services"

const CategoryIndex = () => {
    const auth = useAuth()
    const [allCategory, { isLoading, isError, isSuccess }] = useFetchAllCategoryMutation()
    const dataSelector = useSelector(state => state.category)
    const dispatch = useDispatch()

    useEffect(() => {
        const instantiate = async () => {
            await allCategory()
                .unwrap()
                .then(res => {
                    if (res.success) {
                        dispatch(setCategoryData(res?.arrayResult))
                        dispatch(setCategoryNotifier(false))
                    }
                })
                .catch(err => console.error(err))
            return
        }
        if (dataSelector.data.length === 0 || dataSelector.notifier) {
            instantiate()
        }
    }, [dataSelector.notifier])

    const toggleNewEntry = () => {
        dispatch(resetCategoryItem())
        dispatch(showCategoryManager())
    }

    const actions = () => {
        return [
            { label: `Add ${dataSelector.display.name}`, callback: toggleNewEntry, hidden: !isDev(auth) && !isAdmin(auth) },
        ]
    }

    return (
        (dataSelector.manager) ? (
            <CategoryManage name={dataSelector.display.name} />
        ) : (
            <DataIndex
                display={dataSelector.display}
                actions={actions()}
                data={dataSelector.data}
                isError={isError}
                isLoading={isLoading}
            >
                <CategoryRecords />
            </DataIndex >
        )
    )
}

export default CategoryIndex
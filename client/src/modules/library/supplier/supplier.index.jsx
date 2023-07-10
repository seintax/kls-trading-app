import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import DataIndex from "../../../utilities/interface/datastack/data.index"
import SupplierManage from "./supplier.manage"
import SupplierRecords from "./supplier.records"
import { resetSupplierItem, setSupplierData, setSupplierNotifier, showSupplierManager } from "./supplier.reducer"
import { useFetchAllSupplierMutation } from "./supplier.services"

const SupplierIndex = () => {
    const [allSupplier, { isLoading, isError, isSuccess }] = useFetchAllSupplierMutation()
    const dataSelector = useSelector(state => state.supplier)
    const dispatch = useDispatch()

    useEffect(() => {
        const instantiate = async () => {
            await allSupplier()
                .unwrap()
                .then(res => {
                    if (res.success) {
                        dispatch(setSupplierData(res?.arrayResult))
                        dispatch(setSupplierNotifier(false))
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
        dispatch(resetSupplierItem())
        dispatch(showSupplierManager())
    }

    const actions = () => {
        return [
            { label: `Add ${dataSelector.display.name}`, callback: toggleNewEntry },
        ]
    }

    return (
        (dataSelector.manager) ? (
            <SupplierManage name={dataSelector.display.name} />
        ) : (
            <DataIndex
                display={dataSelector.display}
                actions={actions()}
                data={dataSelector.data}
                isError={isError}
                isLoading={isLoading}
            >
                <SupplierRecords />
            </DataIndex >
        )
    )
}

export default SupplierIndex
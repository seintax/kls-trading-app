import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { FormatOptionsWithEmptyLabel } from "../../../utilities/functions/array.functions"
import { getBranch, isEmpty } from "../../../utilities/functions/string.functions"
import useAuth from "../../../utilities/hooks/useAuth"
import DataIndex from "../../../utilities/interface/datastack/data.index"
import { useFetchAllBranchMutation } from "../../library/branch/branch.services"
import { useFetchAllSupplierMutation } from "../../library/supplier/supplier.services"
import { resetReceivableCache, resetReceivableItem } from "../purchase-item/purchase.item.reducer"
import PurchaseManage from "./purchase.manage"
import PurchaseRecords from "./purchase.records"
import { resetPurchaseItem, resetPurchaseManager, resetPurchaseSelector, setPurchaseData, setPurchaseItem, setPurchaseNotifier, showPurchaseManager } from "./purchase.reducer"
import { useByFilterPurchaseMutation } from "./purchase.services"

const PurchaseIndex = () => {
    const auth = useAuth()
    // const [allPurchase, { isLoading, isError }] = useByDatePurchaseMutation()
    const [allPurchase, { isLoading: purchaseLoading, isError }] = useByFilterPurchaseMutation()
    const [allSuppliers, { isLoading: supplierLoading }] = useFetchAllSupplierMutation()
    const [allBranches, { isLoading: branchLoading }] = useFetchAllBranchMutation()
    const dataSelector = useSelector(state => state.purchase)
    const dispatch = useDispatch()
    const [mounted, setMounted] = useState(false)
    const [filters, setFilters] = useState({ status: "", supplier: "", store: isEmpty(getBranch(auth)) ? "" : auth.store })
    const [libSuppliers, setLibSuppliers] = useState([])
    const [libBranchers, setLibBranches] = useState()
    const statuses = [
        "PENDING",
        "PARTIALLY RECEIVED",
        "CLOSED"
    ]

    useEffect(() => { setMounted(true) }, [])

    useEffect(() => {
        if (mounted) {
            return () => {
                dispatch(resetPurchaseManager())
                dispatch(resetReceivableItem())
                dispatch(resetReceivableCache())
            }
        }
    }, [mounted])

    const getAllFilters = async () => {
        await allSuppliers()
            .unwrap()
            .then(res => {
                if (res.success) {
                    setLibSuppliers(FormatOptionsWithEmptyLabel(res?.arrayResult, "id", "name", "ALL SUPPLIERS"))
                }
            })
            .catch(err => console.error(err))
        await allBranches()
            .unwrap()
            .then(res => {
                if (res.success) {
                    setLibBranches(FormatOptionsWithEmptyLabel(res?.arrayResult, "code", "code", "ALL BRANCHES"))
                }
            })
            .catch(err => console.error(err))
    }

    useEffect(() => {
        getAllFilters()
    }, [])

    useEffect(() => {
        const instantiate = async () => {
            if (libBranchers?.length && libSuppliers?.length) {
                await allPurchase({
                    status: filters.status,
                    supplier: filters.supplier,
                    branch: filters.store
                })
                    .unwrap()
                    .then(res => {
                        if (res.success) {
                            dispatch(setPurchaseData(res?.arrayResult))
                            dispatch(setPurchaseNotifier(false))
                            if (dataSelector.selector > 0) {
                                let selection = res?.arrayResult?.filter(item => item.id === dataSelector.selector)
                                if (selection.length === 1) {
                                    let selected = selection[0]
                                    dispatch(setPurchaseItem(selected))
                                    dispatch(resetPurchaseSelector())
                                }
                            }
                        }
                    })
                    .catch(err => console.error(err))
            }
            return
        }
        if (dataSelector.data.length === 0 || dataSelector.notifier || dataSelector.selector > 0) {
            instantiate()
        }
    }, [dataSelector.notifier, dataSelector.selector, libSuppliers, libBranchers])

    const toggleNewEntry = () => {
        dispatch(resetPurchaseItem())
        dispatch(showPurchaseManager())
    }

    const actions = () => {
        return [
            { label: `Add ${dataSelector.display.name} Order`, callback: toggleNewEntry },
        ]
    }

    const onChange = (e) => {
        const { name, value } = e.target
        setFilters(prev => ({ ...prev, [name]: value }))
    }

    const renderStatus = () => {
        return <select name="status" className="report-select-filter text-sm w-full lg:w-[145px]" value={filters.status} onChange={onChange}>
            <option value="">ALL STATUSES</option>
            {
                statuses?.map(stat => (
                    <option key={stat} value={stat}>{stat}</option>
                ))
            }
        </select>
    }

    const renderSupplier = () => {
        return <select name="supplier" className="report-select-filter text-sm w-full lg:w-[145px]" value={filters.supplier} onChange={onChange}>
            {
                libSuppliers?.map(supply => (
                    <option key={supply.key} value={supply.value}>{supply.key}</option>
                ))
            }
        </select>
    }

    const renderStore = () => {
        return <select name="store" className="report-select-filter text-sm w-full lg:w-[145px]" value={filters.store} onChange={onChange}>
            {
                libBranchers?.map(branch => (
                    <option key={branch.key} value={branch.value}>{branch.key}</option>
                ))

            }
        </select>
    }

    const filterArray = [
        { id: "status", component: renderStatus },
        { id: "supplier", component: renderSupplier },
        { id: "branch", component: renderStore }
    ]

    const filterCallback = () => {
        dispatch(setPurchaseNotifier(true))
    }

    return (
        (dataSelector.manager) ? (
            <PurchaseManage name={`${dataSelector.display.name} Order`} />
        ) : (
            <DataIndex
                display={{
                    ...dataSelector.display,
                    name: `${dataSelector.display.name} Order`
                }}
                actions={actions()}
                filterArray={filterArray}
                filterCallback={filterCallback}
                data={dataSelector.data}
                isError={isError}
                isLoading={purchaseLoading || supplierLoading || branchLoading}
                plain={true}
                overrideLoading={true}
            >
                <PurchaseRecords isLoading={purchaseLoading || supplierLoading || branchLoading} />
            </DataIndex >
        )
    )
}

export default PurchaseIndex
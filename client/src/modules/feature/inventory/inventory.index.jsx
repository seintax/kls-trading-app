import { saveAs } from 'file-saver'
import moment from "moment"
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import * as XLSX from 'xlsx'
import { sortBy } from "../../../utilities/functions/array.functions"
import { isAdmin, isDev } from "../../../utilities/functions/string.functions"
import useAuth from "../../../utilities/hooks/useAuth"
import DataIndex from "../../../utilities/interface/datastack/data.index"
import { useFetchAllBranchMutation } from "../../library/branch/branch.services"
import AdjustmentIndex from "../inventory-item/inventory.item.index"
import PriceIndex from "../price/price.index"
import HistoryIndex from "./inventory.history"
import InventoryRecords from "./inventory.records"
import { resetInventoryManager, setInventoryData, setInventoryNotifier } from "./inventory.reducer"
import { useFetchAllInventoryBranchMutation } from "./inventory.services"

const InventoryIndex = () => {
    const auth = useAuth()
    const [allInventory, { isLoading, isError, isSuccess }] = useFetchAllInventoryBranchMutation()
    const dataSelector = useSelector(state => state.inventory)
    const priceSelector = useSelector(state => state.price)
    const dispatch = useDispatch()
    const [mounted, setMounted] = useState(false)
    const [currentBranch, setCurrentBranch] = useState(auth.store)
    const [libBranches, setLibBranches] = useState()

    const [allBranches] = useFetchAllBranchMutation()

    useEffect(() => { setMounted(true) }, [])

    useEffect(() => {
        if (mounted) {
            if (!isDev(auth) && !isAdmin(auth)) {
                setCurrentBranch(auth.store)
            }
            if (isDev(auth) || isAdmin(auth)) {
                setCurrentBranch("JT-MAIN")
            }
            return () => {
                dispatch(resetInventoryManager())
            }
        }
    }, [mounted])

    useEffect(() => {
        const instantiate = async () => {
            await allInventory({ branch: currentBranch })
                .unwrap()
                .then(res => {
                    if (res.success) {
                        dispatch(setInventoryData(res?.arrayResult))
                        dispatch(setInventoryNotifier(false))
                    }
                })
                .catch(err => console.error(err))
            return
        }

        if (dataSelector.data.length === 0 || dataSelector.notifier) {
            instantiate()
        }
    }, [dataSelector.notifier, currentBranch])

    useEffect(() => {
        const instantiate = async () => {
            await allBranches()
                .unwrap()
                .then(res => {
                    if (res.success) {
                        if (!isDev(auth) && !isAdmin(auth)) {
                            setLibBranches(sortBy(res?.arrayResult?.filter(f => f.code === "JT-MAIN" || f.code === auth.store).map((item, index) => {
                                return {
                                    id: index,
                                    key: item.name,
                                    value: item.code
                                }
                            }), { prop: "id", desc: true }))
                        }
                        if (isDev(auth) || isAdmin(auth)) {
                            setLibBranches(res?.arrayResult.map(item => {
                                return {
                                    key: item.name,
                                    value: item.code
                                }
                            }))
                        }
                    }
                })
                .catch(err => console.error(err))
            return
        }

        instantiate()
    }, [auth])

    const printInventory = useCallback(() => {
        if (dataSelector.print?.length) {
            localStorage.setItem("inventory", JSON.stringify({
                title: `Inventory`,
                subtext1: `as of ${moment(new Date()).format("MMMM DD, YYYY hh:mm:ss a")}`,
                subtext2: `Branch: ${currentBranch} `,
                columns: dataSelector.printable,
                data: dataSelector.print
            }))
            window.open(`/#/print/inventory/${moment(new Date()).format("MMDDYYYYHHmmss")}`, '_blank')
        }
    }, [dataSelector.data, dataSelector.print])

    const exportData = useCallback(() => {
        if (dataSelector.data?.length) {
            let type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
            const ws = XLSX.utils.json_to_sheet(dataSelector.data)
            const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] }
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
            const excelData = new Blob([excelBuffer], { type: type })
            saveAs(excelData, `${currentBranch.toLowerCase()?.replaceAll("-", "_")}_inventory_export_on_${moment(new Date()).format('YYYY_MM_DD_HH_mm_ss')}.xlsx`)
        }
    })

    const actions = () => {
        return [
            { label: `Print Inventory`, callback: printInventory },
            { label: `Export Inventory`, callback: () => { } },
        ]
    }

    const sortcallback = (option) => {
        setCurrentBranch(option.value)
        dispatch(setInventoryNotifier(true))
    }

    if (priceSelector.shown) return <PriceIndex />
    if (dataSelector.manager) return <AdjustmentIndex />
    if (dataSelector.ledger) return <HistoryIndex />

    return (
        <DataIndex
            display={dataSelector.display}
            actions={actions()}
            sorts={libBranches}
            sortcallback={sortcallback}
            data={dataSelector.data}
            isError={isError}
            isLoading={isLoading}
            overrideLoading={true}
        >
            <InventoryRecords isLoading={isLoading} />
        </DataIndex >
    )
}

export default InventoryIndex
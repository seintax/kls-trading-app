import moment from "moment"
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import Datepicker from "react-tailwindcss-datepicker"
import { FormatOptionsWithEmptyLabel } from "../../../utilities/functions/array.functions"
import { sqlDate } from "../../../utilities/functions/datetime.functions"
import useAuth from "../../../utilities/hooks/useAuth"
import DataIndex from "../../../utilities/interface/datastack/data.index"
import { useFetchAllBranchMutation } from "../../library/branch/branch.services"
import { resetTransmitCache } from "../transfer-item/transfer.item.reducer"
import TransferManage from "./transfer.manage"
import TransferRecords from "./transfer.records"
import { resetTransferItem, resetTransferManager, resetTransferSelector, setTransferData, setTransferItem, setTransferNotifier, showTransferManager } from "./transfer.reducer"
import { useByFilterTransferMutation } from "./transfer.services"

const TransferIndex = () => {
    const auth = useAuth()
    const [allTransfer, { isLoading: transferLoading, isError }] = useByFilterTransferMutation()
    const [allBranches, { isLoading: branchLoading }] = useFetchAllBranchMutation()
    const dataSelector = useSelector(state => state.transfer)
    const dispatch = useDispatch()
    const [mounted, setMounted] = useState(false)
    const [filters, setFilters] = useState({ status: "", source: "", destination: "", fr: sqlDate(), to: sqlDate(), dated: false })
    const [libSources, setLibSources] = useState([])
    const [libDestinations, setLibDestinations] = useState([])
    const [records, setrecords] = useState()
    const [results, setresults] = useState()
    const [range, setRange] = useState({ startDate: sqlDate(), endDate: sqlDate() })
    const statuses = [
        "PENDING",
        "PARTIALLY RECEIVED",
        "FULLY RECEIVED",
    ]

    const onRangeChange = (newValue) => {
        setRange(newValue)
        setFilters(prev => ({
            ...prev,
            fr: newValue.startDate,
            to: newValue.endDate
        }))
    }

    const onCheckChange = (e) => {
        setFilters(prev => ({ ...prev, dated: e.target.checked }))
    }

    useEffect(() => { setMounted(true) }, [])

    useEffect(() => {
        if (mounted) {
            return () => {
                dispatch(resetTransferManager())
                dispatch(resetTransferItem())
                dispatch(resetTransmitCache())
            }
        }
    }, [mounted])

    const getAllFilters = async () => {
        await allBranches()
            .unwrap()
            .then(res => {
                if (res.success) {
                    setLibDestinations(FormatOptionsWithEmptyLabel(res?.arrayResult, "code", "code", "ALL DESTINATIONS"))
                    setLibSources(FormatOptionsWithEmptyLabel(res?.arrayResult, "code", "code", "ALL SOURCES"))
                }
            })
            .catch(err => console.error(err))
    }

    useEffect(() => {
        getAllFilters()
    }, [])

    useEffect(() => {
        const instantiate = async () => {
            if (libSources?.length) {
                await allTransfer({
                    status: filters.status,
                    source: filters.source,
                    destination: filters.destination,
                    dated: filters.dated,
                    fr: filters.fr,
                    to: filters.to,
                })
                    .unwrap()
                    .then(res => {
                        if (res.success) {
                            setresults(res?.arrayResult)
                            dispatch(setTransferData(res?.arrayResult))
                            dispatch(setTransferNotifier(false))
                            if (dataSelector.selector > 0) {
                                let selection = res?.arrayResult.filter(f => f.id === dataSelector.selector)
                                if (selection.length === 1) {
                                    let selected = selection[0]
                                    dispatch(setTransferItem(selected))
                                    dispatch(resetTransferSelector())
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
    }, [dataSelector.notifier, dataSelector.selector, libSources])

    const toggleNewEntry = () => {
        dispatch(resetTransferItem())
        dispatch(showTransferManager())
    }

    const printList = () => {
        if (records?.length) {
            localStorage.setItem("reports", JSON.stringify({
                title: "List of Stock Transfers",
                subtext1: `as of ${moment(new Date()).format("MMMM DD, YYYY hh:mm A")}`,
                subtext2: `Status: ${filters.dated ? `${filters.fr}-${filters.to}` : "All"} | ${filters.status || "All"} | Supplier: ${filters.supplier || "All"} | Branch: ${filters.store || "All"}`,
                columns: dataSelector.printout,
                data: records?.map(rec => {
                    return {
                        key: rec.key,
                        items: rec.print
                    }
                })
            }))
            window.open(`/#/print/reports/${filters.dated ? `${filters.fr}-${filters.to}` : "All"}-${filters.status || "All"}-${filters.supplier || "All"}-${filters.store || "All"}`, '_blank')
        }
    }

    const actions = () => {
        return [
            { label: `Add ${dataSelector.display.name}`, callback: toggleNewEntry },
            { label: `Print List`, callback: printList },
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

    const renderSource = () => {
        return <select name="source" className="report-select-filter text-sm w-full lg:w-[145px]" value={filters.source} onChange={onChange}>
            {
                libSources?.map(source => (
                    <option key={`source${source.key}`} value={source.value}>{source.key}</option>
                ))

            }
        </select>
    }

    const renderDestination = () => {
        return <select name="destination" className="report-select-filter text-sm w-full lg:w-[145px]" value={filters.destination} onChange={onChange}>
            {
                libDestinations?.map(destination => (
                    <option key={`destination${destination.key}`} value={destination.value}>{destination.key}</option>
                ))

            }
        </select>
    }

    const renderDateFilter = () => {
        return <div className="flex gap-3">
            <div className="flex items-center">
                <input type="checkbox" name="dated" id="dated" onChange={onCheckChange} checked={filters.dated} />
            </div>
            <Datepicker
                value={range}
                onChange={onRangeChange}
                showShortcuts={true}
                disabled={!filters.dated}
                readOnly
            />
        </div>
    }

    const filterArray = [
        { id: "dates", component: renderDateFilter },
        { id: "status", component: renderStatus },
        { id: "source", component: renderSource },
        { id: "destination", component: renderDestination }
    ]

    const filterCallback = () => {
        dispatch(setTransferNotifier(true))
    }

    return (
        <>
            {
                (dataSelector.manager) ? (
                    <TransferManage name={dataSelector.display.name} />
                ) : null
            }
            <DataIndex
                display={dataSelector.display}
                actions={actions()}
                filterArray={filterArray}
                filterCallback={filterCallback}
                data={dataSelector.data}
                isError={isError}
                isLoading={transferLoading || branchLoading}
                plain={true}
                overrideLoading={true}
                hideDisplay={dataSelector.manager}
            >
                <TransferRecords isLoading={transferLoading || branchLoading} records={records} setrecords={setrecords} />
            </DataIndex >
        </>
    )
}

export default TransferIndex
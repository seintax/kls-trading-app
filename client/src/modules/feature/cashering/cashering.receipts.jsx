import { Transition } from "@headlessui/react"
import { ArrowLeftIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid"
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { short12Time, sqlDate } from "../../../utilities/functions/datetime.functions"
import { NumFn } from "../../../utilities/functions/number.funtions"
import { exactSearch, isDev } from "../../../utilities/functions/string.functions"
import useAuth from "../../../utilities/hooks/useAuth"
import { useDebounce } from "../../../utilities/hooks/useDebounce"
import useToast from "../../../utilities/hooks/useToast"
import DataOperation from "../../../utilities/interface/datastack/data.operation"
import DataRecords from "../../../utilities/interface/datastack/data.records"
import { resetTransactionReceipts, setTransactionData, setTransactionItem, setTransactionNotifier, setTransactionSearch, showTransactionLedger } from "./cashering.reducer"
import { useByAccountTransactionMutation, useByAdminTransactionMutation } from "./cashering.services"

const CasheringReceipts = () => {
    const auth = useAuth()
    const dataSelector = useSelector(state => state.transaction)
    const dispatch = useDispatch()
    const [records, setrecords] = useState()
    const [startpage, setstartpage] = useState(1)
    const [sorted, setsorted] = useState()
    const columns = dataSelector.header
    const [search, setSearch] = useState("")
    const [range, setRange] = useState(sqlDate())
    const debounceSearch = useDebounce(search, 500)
    const toast = useToast()

    const [accountTransaction] = useByAccountTransactionMutation()
    const [adminTransaction] = useByAdminTransactionMutation()

    useEffect(() => {
        const instantiate = async () => {
            if (isDev(auth)) {
                await adminTransaction({ date: range })
                    .unwrap()
                    .then(res => {
                        if (res.success) {
                            dispatch(setTransactionData(res?.arrayResult))
                            dispatch(setTransactionNotifier(false))
                            if (dataSelector.ledger) {
                                let itemlist = res?.arrayResult?.filter(f => f.code === dataSelector.item.code)
                                let item = itemlist.length > 0 ? itemlist[0] : {}
                                dispatch(setTransactionItem(item))
                            }
                        }
                    })
                    .catch(err => console.error(err))
                return
            }
            await accountTransaction({ account: auth.id, date: range })
                .unwrap()
                .then(res => {
                    if (res.success) {
                        dispatch(setTransactionData(res?.arrayResult))
                        dispatch(setTransactionNotifier(false))
                        if (dataSelector.ledger) {
                            let itemlist = res?.arrayResult?.filter(f => f.code === dataSelector.item.code)
                            let item = itemlist.length > 0 ? itemlist[0] : {}
                            dispatch(setTransactionItem(item))
                        }
                    }
                })
                .catch(err => console.error(err))
            return
        }
        if (dataSelector.receipts || dataSelector.notifier || auth?.id) {
            instantiate()
        }
    }, [dataSelector.receipts, dataSelector.notifier, auth])

    const onChange = (e) => {
        setSearch(e.target.value)
    }

    const onRangeChange = (e) => {
        setRange(e.target.value)
    }

    const onSearch = () => {
        dispatch(setTransactionNotifier(true))
    }

    useEffect(() => {
        dispatch(setTransactionSearch(debounceSearch))
    }, [debounceSearch])

    const toggleView = (item) => {
        dispatch(setTransactionItem(item))
        dispatch(showTransactionLedger())
    }

    const actions = (item) => {
        return [
            { type: 'button', trigger: () => toggleView(item), label: 'View' },
        ]
    }

    const items = (item) => {
        return [
            { value: item.code },
            { value: short12Time(item.time) },
            { value: item.method },
            { value: item.status },
            { value: NumFn.currency(item.net) },
            { value: <span className="bg-yellow-300 text-xs px-1 py-0.2 rounded-sm shadow-md">{item.account_store}</span> },
            { value: <DataOperation actions={actions(item)} /> }
        ]
    }

    useEffect(() => {
        if (dataSelector?.data) {
            let sought = dataSelector?.search?.toLowerCase()
            let browsed = dataSelector?.data.filter(f =>
                f.code?.toLowerCase()?.includes(sought) ||
                f.method?.toLowerCase()?.includes(sought) ||
                f.status?.toString()?.includes(sought) ||
                f.net?.toString()?.includes(sought) ||
                exactSearch(sought, f.code)
            )
            let data = sorted ? sortBy(browsed, sorted) : browsed
            setrecords(data?.map((item, i) => {
                return {
                    key: item.id,
                    items: items(item),
                    ondoubleclick: () => { },
                }
            }))
        }
    }, [dataSelector?.data, dataSelector?.search, sorted])

    const toggleOffReceipts = () => {
        dispatch(resetTransactionReceipts())
    }

    return (
        <>
            <Transition
                show={dataSelector.receipts}
                enter="transition-opacity ease-linear duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                className={`fixed left-16 lg:left-56 top-12 lg:top-24 mt-2 h-full w-full bg-gradient-to-r from-[#00000070] via-[#00000070] to-[#00000040] z-10 flex items-start justify-end`}
            >
                <Transition.Child
                    enter="transition ease-in-out duration-500 transform"
                    enterFrom="translate-y-full"
                    enterTo="translate-y-0"
                    leave="transition ease-in-out duration-500 transform"
                    leaveFrom="translate-y-0"
                    leaveTo="translate-y-full"
                    className="flex flex-col gap-2 bg-white px-3 w-full h-full text-sm mt-1 pr-20 lg:pr-60 pb-48"
                >
                    <div className="pl-1 pt-3 text-secondary-500 font-bold text-lg flex items-center gap-4">
                        <ArrowLeftIcon className="w-6 h-6 cursor-pointer" onClick={() => toggleOffReceipts()} />
                        <span>Receipts</span>
                    </div>
                    <div className="flex border border-secondary-500 p-0.5 items-center mt-4">
                        <MagnifyingGlassIcon className="w-8 h-8 ml-1 text-secondary-500 hidden lg:flex" />
                        <input
                            type="search"
                            value={search}
                            onChange={onChange}
                            placeholder="Search receipts here"
                            className="w-full text-xs lg:text-sm border-none focus:border-none outline-none ring-0 focus:ring-0 focus:outline-none grow-1"
                        />
                        <input
                            type="date"
                            value={range}
                            onChange={onRangeChange}
                            className="w-[120px] lg:w-[150px] text-xs lg:text-sm flex-none border-none focus:border-none outline-none ring-0 focus:ring-0 focus:outline-none grow-1"
                        />
                        <button className="button-link text-xs lg:text-sm ml-auto px-4 lg:px-9 bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 focus:ring-0" onClick={() => onSearch()}>Search</button>
                    </div>
                    <DataRecords
                        page={startpage}
                        columns={columns}
                        records={records}
                        setsorted={setsorted}
                        setPage={setstartpage}
                        itemsperpage={dataSelector?.perpage}
                        fontsize="lg"
                    />
                </Transition.Child>
            </Transition>
        </>
    )
}

export default CasheringReceipts
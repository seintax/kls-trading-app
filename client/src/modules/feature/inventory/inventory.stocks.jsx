import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { sortBy } from '../../../utilities/functions/array.functions'
import { momentOffset } from "../../../utilities/functions/datetime.functions"
import { cleanDisplay, isAdmin, isDev } from "../../../utilities/functions/string.functions"
import useAuth from "../../../utilities/hooks/useAuth"
import usePermissions from "../../../utilities/hooks/usePermissions"
import DataHeader from "../../../utilities/interface/datastack/data.header"
import DataIndex from "../../../utilities/interface/datastack/data.index"
import DataOperation from "../../../utilities/interface/datastack/data.operation"
import DataRecords from '../../../utilities/interface/datastack/data.records'
import HistoryIndex from "./inventory.history"
import { resetInventoryStocks, setInventoryItem, showInventoryManager } from "./inventory.reducer"
import { useByStockRecordInventoryMutation } from "./inventory.services"

const StocksIndex = () => {
    const auth = useAuth()
    const dataSelector = useSelector(state => state.inventory)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [data, setdata] = useState()
    const [records, setrecords] = useState()
    const [startpage, setstartpage] = useState(1)
    const [sorted, setsorted] = useState()
    const columns = dataSelector.stockage
    const permissions = usePermissions()

    const [stockRecord, { isLoading }] = useByStockRecordInventoryMutation()

    useEffect(() => {
        const instantiate = async () => {
            await stockRecord({
                product: dataSelector.item.product,
                variant: dataSelector.item.variant,
                branch: dataSelector.item.store
            })
                .unwrap()
                .then(res => {
                    if (res.success) {
                        setdata(res?.arrayResult)
                    }
                })
                .catch(err => console.error(err))
            return
        }

        if (dataSelector.stocks && dataSelector.item.store) {
            instantiate()
        }
    }, [dataSelector.item.store, dataSelector.stocks])

    const toggleView = (item) => {
        dispatch(setInventoryItem(item))
        dispatch(resetInventoryStocks())
        dispatch(showInventoryManager())
    }

    const actions = (item) => {
        return [
            { type: 'button', trigger: () => toggleView(item), label: 'Adjust', hidden: !permissions?.inventory_menu?.view_adjustment }
        ]
    }

    const toggleHistory = (item) => {
        dispatch(setInventoryItem(item))
        dispatch(showInventoryLedger(true))
    }

    const items = (item) => {
        return [
            {
                value: <span className="text-blue-500 hover:text-blue-700 cursor-pointer hover:underline">
                    {cleanDisplay(`${item.product_name} ${item.variant_serial} ${item?.variant_model || ""} ${item?.variant_brand || ""}`)}
                </span>,
                onclick: () => toggleHistory(item)
            },
            { value: momentOffset(item.time, 480, "MM-DD-YYYY") },
            { value: `${item?.stocks ? item?.stocks : 0}/${item.received}` },
            { value: item.acquisition },
            { value: <span className="bg-yellow-300 text-xs px-1 py-0.2 rounded-sm shadow-md">{item.store}</span> },
            {
                value: (isDev(auth) || isAdmin(auth) || auth.store === "JT-MAIN")
                    ? <DataOperation actions={actions(item)} />
                    : item.store === "JT-MAIN"
                        ? ""
                        : <DataOperation actions={actions(item)} />
            },
        ]
    }

    useEffect(() => {
        if (data?.length) {
            let temp = sorted ? sortBy(data, sorted) : data
            setrecords(temp?.map((item, i) => {
                return {
                    key: item.id,
                    items: items(item),
                    ondoubleclick: () => { },
                }
            }))
        }
    }, [data, sorted])

    const returnToList = useCallback(() => {
        if (dataSelector.item.inventory) {
            dispatch(resetInventoryStocks())
            navigate(-1)
            return
        }
        dispatch(resetInventoryStocks())
    }, [])

    const productName = dataSelector.item.inventory
        ? cleanDisplay(dataSelector.item.inventory)
        : cleanDisplay(`${dataSelector.item.product_name} (${dataSelector.item.category}/${dataSelector.item.variant_serial}/${dataSelector.item.variant_model}/${dataSelector.item.variant_brand})`)

    if (dataSelector.ledger) return <HistoryIndex />

    return (
        <div className="w-full flex flex-col gap-5 -mt-5 lg:mt-0">
            <div className="w-full sticky -top-5 pt-5 lg:pt-0 z-10">
                <DataHeader
                    name={`Inventory Stock Logs for: ${productName}`}
                    returncallback={returnToList}
                />
            </div>
            <DataIndex
                display={{
                    name: "Receiving",
                    text: "A list of all in-transit stocks from stock transfer.",
                }}
                isLoading={isLoading}
                plain={true}
            >
                <DataRecords
                    page={startpage}
                    columns={columns}
                    records={records}
                    setsorted={setsorted}
                    setPage={setstartpage}
                    loading={isLoading}
                    itemsperpage={dataSelector?.perpage}
                />
            </DataIndex>
        </div>
    )
}

export default StocksIndex
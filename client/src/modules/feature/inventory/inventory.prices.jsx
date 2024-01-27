import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { sortBy } from '../../../utilities/functions/array.functions'
import { NumFn } from "../../../utilities/functions/number.funtions"
import useAuth from "../../../utilities/hooks/useAuth"
import useToast from "../../../utilities/hooks/useToast"
import DataIndex from "../../../utilities/interface/datastack/data.index"
import DataRecords from '../../../utilities/interface/datastack/data.records'
import { setSearchKey } from "../../../utilities/redux/slices/searchSlice"
import { useByPriceCheckInventoryMutation } from "./inventory.services"

const InventoryPrices = () => {
    const auth = useAuth()
    const toast = useToast()
    const searchSelector = useSelector(state => state.search)
    const dispatch = useDispatch()
    const [search, setSearch] = useState('')
    const [result, setResult] = useState()
    const [records, setrecords] = useState()
    const [startpage, setstartpage] = useState(1)
    const [sorted, setsorted] = useState()
    const columns = {
        items: [
            { name: 'Product Name', stack: false, sort: 'inventory' },
            { name: 'Cost', stack: true, sort: 'cost', size: 160 },
            { name: 'Price', stack: true, sort: 'price', size: 160 },
        ]
    }

    const [transmitInventory, { isLoading, isError }] = useByPriceCheckInventoryMutation()

    useEffect(() => {
        const instantiate = async () => {
            await transmitInventory({ search: searchSelector.searchKey })
                .unwrap()
                .then(res => {
                    if (res.success) {
                        setResult(res?.arrayResult)
                    }
                })
                .catch(err => console.error(err))
            return
        }

        if (searchSelector.searchKey) {
            instantiate()
        }
    }, [searchSelector.searchKey])

    const onChange = (e) => {
        setSearch(e.target.value)
    }

    const onSearch = (e) => {
        if (e.code === 'Enter') {
            if (search.length < 4) {
                toast.showWarning("Searched input should have atleast 4 characters.")
                return
            }
            dispatch(setSearchKey(search))
        }
    }

    const items = (item) => {
        return [
            { value: item.inventory },
            { value: NumFn.currency(item.cost) },
            { value: NumFn.currency(item.price) },
        ]
    }

    useEffect(() => {
        if (result) {
            let data = sorted
                ? sortBy(result, sorted)
                : result
            setrecords(data?.map((item, i) => {
                return {
                    key: item.id,
                    items: items(item),
                    ondoubleclick: () => { },
                }
            }))
        }
    }, [result, sorted])

    const newSearch = () => {
        dispatch(setSearchKey(''))
        setResult()
    }

    const actions = () => {
        return [
            { label: `New Search`, callback: newSearch, hidden: !result },
        ]
    }

    return (
        <DataIndex
            display={{
                name: "Inventory Price Check",
                text: "Search and check inventory prices.",
                show: true
            }}
            actions={actions()}
            data={result}
            isError={isError}
            isLoading={isLoading}
            plain={true}
        >
            {
                result?.length ? (
                    <DataRecords
                        page={startpage}
                        columns={columns}
                        records={records}
                        setsorted={setsorted}
                        setPage={setstartpage}
                        itemsperpage={150}
                    />
                ) : (
                    <div className="flex justify-center items-center w-full h-full">
                        <div className="flex flex-col gap-2 text-lg h-32 mb-20">
                            <span>Search for a product name and variant:</span>
                            <input
                                type="text"
                                onChange={onChange}
                                onKeyDown={onSearch}
                                placeholder="Product name, variant"
                            />
                        </div>
                    </div>
                )
            }
        </DataIndex>
    )
}
export default InventoryPrices
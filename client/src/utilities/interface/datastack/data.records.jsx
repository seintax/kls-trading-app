import {
    ChevronUpDownIcon
} from "@heroicons/react/24/outline"
import React, { useEffect, useRef, useState } from 'react'
import DataPagination from "./data.pagination"

const DataRecords = ({ columns, records, page, setPage, itemsperpage, setsorted, rowstyle, itemstyle, keeppagination }) => {
    const refList = useRef()
    const [data, setData] = useState()
    const [order, setOrder] = useState()
    const [pages, setPages] = useState(1)
    const [index, setIndex] = useState(0)

    useEffect(() => {
        setOrder(columns?.items?.map(col => {
            return { ...col, order: "unsorted" }
        }))
    }, [])

    useEffect(() => {
        if (records) {
            let lastindex = (page || 1) * (itemsperpage || 10)
            let firstindex = lastindex - (itemsperpage || 10)
            setIndex(firstindex + 1)
            setPages(Math.ceil(records?.length / itemsperpage) || 1)
            setData(records?.slice(firstindex, lastindex))
        }
    }, [records, page])

    const sortcallback = (index, column) => {
        if (column.sort && setsorted) {
            setsorted({ prop: column.sort, desc: column.order === "asc" })
            let neworder = column.order === "desc" || column.order === "unsorted" ? "asc" : "desc"
            let sortedcolumns = [...order]
            sortedcolumns[index].order = neworder
            setOrder(sortedcolumns)
        }
    }

    const scrollToTop = () => {
        refList.current.scroll({
            top: 0,
            behavior: 'smooth'
        })
    }

    const setPosition = (position, isheader = true) => {
        if (position === "center") {
            if (isheader) return "justify-center pl-4"
            return "text-center"
        }
        if (position === "right") {
            if (isheader) return "justify-end"
            return "text-right"
        }
        if (isheader) return "justify-start"
        return "text-left"
    }

    return (
        <>
            <div ref={refList} className="flex flex-col justify-between mt-8 shadow overflow-auto ring-1 ring-black ring-opacity-5 md:mx-0 md:rounded-t-lg">
                <table className="flex-col min-w-full divide-y border-separate divide-gray-300" style={{ borderSpacing: 0 }}>
                    <thead className="bg-gray-50 no-select">
                        <tr className={`${columns?.style}`}>
                            <th
                                scope="col"
                                className={`hidden lg:table-cell sticky top-0 z-10 bg-gray-200 backdrop-blur border-b border-gray-300 py-3.5 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 w-[50px] bg-gray-200 align-top`}
                            >
                                #
                            </th>
                            {
                                (order?.length) ? (
                                    order?.map((col, colindex) => (
                                        <th
                                            key={colindex}
                                            scope="col"
                                            width={col.size}
                                            className={`${col.stack ? "hidden lg:table-cell" : ""} sticky top-0 z-10 backdrop-blur border-b border-gray-300 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 bg-gray-200 align-top ${col.style}`}
                                        >
                                            <div
                                                className={`w-full flex items-center ${setPosition(col.position)} gap-[10px] group ${col.sort ? "cursor-pointer" : ""}`}
                                                onClick={() => sortcallback(colindex, col)}
                                            >
                                                {col.name}
                                                {col.screenreader ? <span className="sr-only">{col.screenreader}</span> : ""}
                                                {col.sort ? <ChevronUpDownIcon className="h-5 w-5 text-gray-200 group-hover:text-gray-700" /> : ""}
                                            </div>
                                        </th>
                                    ))
                                ) : null
                            }
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {
                            data?.map((row, rowindex) => (
                                <tr
                                    key={row?.key || rowindex}
                                    onClick={row?.onclick}
                                    onDoubleClick={row?.ondoubleclick}
                                    className={`hover:bg-gray-100 ${rowstyle}`}
                                >
                                    <td className="hidden border-b border-gray-200 pl-6 pr-3 py-4 text-sm text-gray-500 lg:table-cell align-top no-select">
                                        {index + rowindex}.
                                    </td>
                                    {
                                        (row.items?.length) ? (
                                            row.items?.map((item, itemindex) => (
                                                <td
                                                    key={itemindex}
                                                    className={`w-full max-w-0 py-4 border-b border-gray-200 pl-4 pr-6 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-6 lg:table-cell align-top ${order[itemindex]?.screenreader ? "flex justify-end gap-2" : ""} ${order[itemindex]?.stack ? "hidden" : ""} ${itemstyle} ${setPosition(order[itemindex]?.position, false)}`}
                                                    onClick={item?.onclick}
                                                    onDoubleClick={item?.ondoubleclick}
                                                >
                                                    {item.value}
                                                    {
                                                        (itemindex === 0) ? (
                                                            <dl className="font-normal lg:hidden">
                                                                {
                                                                    order?.map((col, colindex) => (
                                                                        <div
                                                                            key={colindex}
                                                                            className={`${col.stack ? "" : "hidden"}`}
                                                                        >
                                                                            <dt className="sr-only">{col.name}</dt>
                                                                            <dd className="mt-1 truncate text-gray-400">
                                                                                {row.items[colindex]?.value}
                                                                            </dd>
                                                                        </div>
                                                                    ))
                                                                }
                                                            </dl>
                                                        ) : null
                                                    }
                                                </td>
                                            ))
                                        ) : null
                                    }
                                </tr>
                            ))

                        }
                        {
                            (!data?.length) && (
                                <tr>
                                    <td className="hidden border-b border-gray-200 pl-6 pr-3 py-4 text-sm text-gray-500 lg:table-cell"></td>
                                    <td colSpan={100} className="w-full max-w-0 py-4 border-b border-gray-200 pl-4 pr-6 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-6">
                                        No record listed.
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
            <DataPagination
                itemsperpage={itemsperpage}
                totalitems={records?.length || 0}
                itemcount={data?.length || 0}
                page={page}
                pages={pages}
                setPage={setPage}
                keep={keeppagination}
                scrollToTop={scrollToTop}
            />
        </>
    )
}

export default DataRecords
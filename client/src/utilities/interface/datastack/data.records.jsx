import {
    ChevronUpDownIcon
} from "@heroicons/react/24/outline"
import React, { useEffect, useRef, useState } from 'react'
import DataPagination from "./data.pagination"

const DataRecords = ({ columns, records, page, setPage, itemsperpage, setsorted, rowstyle, itemstyle, keeppagination, loading }) => {
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
            setsorted({ prop: column.sort, desc: column.order !== "asc" })
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
            return "justify-center"
        }
        if (position === "right") {
            if (isheader) return "justify-end"
            return "justify-end"
        }
        if (isheader) return "justify-start"
        return "justify-start"
    }

    return (
        <>
            <div ref={refList} className="flex flex-col justify-between mt-3 shadow overflow-auto ring-1 ring-black ring-opacity-5 md:mx-0 md:rounded-t-lg">
                <table className="flex-col w-full divide-y border-separate divide-gray-300" style={{ borderSpacing: 0 }}>
                    <thead className="">
                        <tr className={`${columns?.style}`}>
                            <th
                                scope="col"
                                className={`hidden lg:table-cell sticky top-0 z-5 bg-gray-200 border-b border-gray-300 py-3.5 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 w-[50px] bg-gray-200 align-top no-select shadow-sm`}
                            >
                                #
                            </th>
                            {
                                (order?.length) ? (
                                    order?.map((col, colindex) => (
                                        <th
                                            key={colindex}
                                            scope="col"
                                            className={`${col.stack ? "hidden lg:table-cell" : "hidden md:table-cell"} sticky top-0 z-5 border-b border-gray-300 py-3.5 px-2 sm:pl-3 text-left text-sm font-semibold text-gray-900 bg-gray-200 align-top shadow-sm ${col.style}`}
                                            style={{ width: `${col.size}px` || "300px" }}
                                        >
                                            <div
                                                className={`w-full flex items-center ${setPosition(col.position)} gap-[10px] group ${col.sort ? "cursor-pointer" : ""}`}
                                                onClick={() => sortcallback(colindex, col)}
                                            >
                                                <span className="hidden lg:flex">{col.name}</span>
                                                <span className={`flex lg:hidden ${col.name ? "" : "hidden"}`}>{col.name ? col.name : "Details"}</span>
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
                                                    className={`w-full max-w-0 py-4 border-b border-gray-200 px-2 sm:pl-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none lg:table-cell align-top ${order && order[itemindex]?.screenreader ? "hidden md:flex justify-end gap-2" : ""} ${order && order[itemindex]?.stack ? "hidden" : ""} ${itemstyle}`}
                                                    onClick={item?.onclick}
                                                    onDoubleClick={item?.ondoubleclick}
                                                >
                                                    <span className={`hidden md:flex ${setPosition(order && order[itemindex]?.position, false)}`}>
                                                        {item.value}
                                                    </span>
                                                    {
                                                        (itemindex === 0) ? (
                                                            <dl className="font-normal lg:hidden">
                                                                {
                                                                    order?.map((col, colindex) => (
                                                                        <div
                                                                            key={colindex}
                                                                            className={`${col.stack ? (row.items[colindex]?.value ? "" : "md:hidden") : "md:hidden"} flex flex-col lg:flex-row items-start gap-1 lg:gap-3 text-xs mt-1`}
                                                                        >
                                                                            <dt className="text-gray-400 text-[10px] lg:text-xs">
                                                                                {col.name ? `${col.name}:` : ""}
                                                                            </dt>
                                                                            <dd className="truncate text-gray-500">
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
                                        {loading ? "Loading..." : "No record listed."}
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
import {
    ChevronUpDownIcon
} from "@heroicons/react/24/outline"
import React, { useEffect, useRef, useState } from 'react'
import { isEmpty } from "../../functions/string.functions"
import DataPagination from "./data.pagination"

const DataRecords = ({ columns, records, page, setPage, itemsperpage, setsorted, rowstyle, itemstyle, keeppagination, loading, total, fontsize = "sm", active }) => {
    const refList = useRef()
    const [data, setData] = useState()
    const [order, setOrder] = useState()
    const [pages, setPages] = useState(1)
    const [index, setIndex] = useState(0)
    const [cachedOrder, setCachedOrder] = useState()

    useEffect(() => {
        setOrder(columns?.items?.map(col => {
            return { ...col, order: "unsorted" }
        }))
    }, [columns])

    useEffect(() => {
        if (records) {
            let lastindex = (page || 1) * (itemsperpage || 10)
            let firstindex = lastindex - (itemsperpage || 10)
            setIndex(firstindex + 1)
            setPages(Math.ceil(records?.length / itemsperpage) || 1)
            setData(records?.slice(firstindex, lastindex))
        }
    }, [records, page, fontsize])

    const sortcallback = (index) => {
        let sortedcolumns = cachedOrder ?? order
        let column = sortedcolumns[index]
        if (column.sort && setsorted) {
            let neworder = column.order !== "desc" ? "desc" : "asc"
            sortedcolumns[index].order = neworder
            setsorted({ prop: column.sort, desc: neworder !== "asc" })
            setCachedOrder(sortedcolumns)
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

    const fontSmall = "text-sm"
    const fontLarge = "text-lg"
    const fontExtraLarge = "text-xl"

    const preferredFont = (size = "sm") => {
        if (size === "xs") return fontExtraSmall
        if (size === "sm") return fontSmall
        if (size === "lg") return fontLarge
        if (size === "xl") return fontExtraLarge
        return fontSmall
    }

    return (
        <>
            <div ref={refList} className="flex flex-col justify-between mt-3 shadow overflow-auto ring-1 ring-black ring-opacity-5 md:mx-0 md:rounded-t-lg">
                <table className="flex-col w-full divide-y border-separate divide-gray-300" style={{ borderSpacing: 0 }}>
                    <thead className="">
                        <tr className={`${columns?.style}`}>
                            <th
                                scope="col"
                                className={`hidden lg:table-cell sticky top-0 z-5 bg-gray-200 border-b border-gray-300 py-3.5 pr-3 text-left font-semibold text-gray-900 sm:pl-6 w-[50px] bg-gray-200 align-top no-select shadow-sm`}
                            >
                                #
                            </th>
                            {
                                (order?.length) ? (
                                    order?.map((col, colindex) => (
                                        <th
                                            key={`${col.name}${colindex}`}
                                            scope="col"
                                            className={`${col.stack ? "hidden lg:table-cell" : "hidden md:table-cell"} sticky top-0 z-5 border-b border-gray-300 py-3.5 px-2 sm:pl-3 text-left ${preferredFont(fontsize)} font-semibold text-gray-900 bg-gray-200 align-top shadow-sm ${col.style}`}
                                            style={{ width: `${col.size}px` || "300px" }}
                                        >
                                            <div
                                                className={`w-full flex items-center ${setPosition(col.position)} gap-[10px] group ${col.sort ? "cursor-pointer" : ""}`}
                                                onClick={() => sortcallback(colindex)}
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
                            (loading) ? (
                                Array.from({ length: 20 }, (_, i) => i)
                                    ?.map((row) => (
                                        <tr
                                            key={`skeleton-${row}`}
                                            className="transition ease-in-out duration-200"
                                        >
                                            <td className="hidden border-b border-gray-200 pl-6 pr-3 py-4 text-gray-500 lg:table-cell align-top no-select">
                                                <div className="skeleton-loading-rounded w-6"></div>
                                            </td>
                                            {
                                                (order?.length) ? (
                                                    order?.map((item, index) => (
                                                        <td
                                                            key={`skeleton-column-${index}`}
                                                            className={`w-full py-1 lg:py-4 border-b border-gray-300 lg:px-2 sm:pl-0 font-medium text-gray-900 sm:w-auto lg:table-cell align-top ${item?.screenreader ? "hidden md:flex justify-end gap-2" : ""} ${item?.stack ? "hidden" : ""}`}
                                                        >
                                                            <div className="skeleton-loading"></div>
                                                            {
                                                                (index === 0) ? (
                                                                    <dl className="font-normal flex flex-col lg:hidden w-full border border-black px-2 pb-1">
                                                                        {
                                                                            order?.map((col, colindex) => (
                                                                                <div
                                                                                    key={`skeleton-stack-${colindex}`}
                                                                                    className="flex flex-row items-start gap-1 text-sm mt-1 w-full"
                                                                                >
                                                                                    <dt className={`${col?.screenreader ? "hidden" : "flex"} w-1/2 flex-none text-gray-400 text-[10px] text-sm ${col.name ? "" : "hidden"}`}>
                                                                                        <div className="skeleton-loading"></div>
                                                                                    </dt>
                                                                                    <dd className={`flex ${col?.screenreader ? "w-full" : "w-1/2"} flex-none text-gray-600 break-all`}>
                                                                                        <div className="skeleton-loading"></div>
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

                            ) : null
                        }
                        {
                            (!loading && data?.length) ? (
                                data?.map((row, rowindex) => (
                                    <tr
                                        key={row?.key || rowindex}
                                        onClick={row?.onclick}
                                        onDoubleClick={row?.ondoubleclick}
                                        className={`transition ease-in-out duration-200 ${index + rowindex - 1 === active ? "bg-primary-300" : "hover:bg-primary-200"} ${rowstyle}`}
                                    >
                                        <td className="hidden border-b border-gray-200 pl-6 pr-3 py-4 text-gray-500 lg:table-cell align-top no-select">
                                            {index + rowindex}.
                                        </td>
                                        {
                                            (row.items?.length) ? (
                                                row.items?.map((item, itemindex) => (
                                                    <td
                                                        key={itemindex}
                                                        className={`w-full py-1 lg:py-4 border-b border-gray-300 lg:px-2 sm:pl-0 ${preferredFont(fontsize)} font-medium text-gray-900 sm:w-auto lg:table-cell align-top ${order && order[itemindex]?.screenreader ? "hidden md:flex justify-end gap-2" : ""} ${order && order[itemindex]?.stack ? "hidden" : ""} ${itemstyle}`}
                                                        onClick={item?.onclick}
                                                        onDoubleClick={item?.ondoubleclick}
                                                    >
                                                        <span className={`hidden lg:flex ${setPosition(order && order[itemindex]?.position, false)} ${item?.style}`}>
                                                            {item?.value}
                                                        </span>
                                                        {
                                                            (itemindex === 0) ? (
                                                                <dl className="font-normal flex flex-col lg:hidden w-full border border-black px-2 pb-1">
                                                                    {
                                                                        order?.map((col, colindex) => (
                                                                            <div
                                                                                key={colindex}
                                                                                className={`${col.stack ? (row.items[colindex]?.value ? "" : "lg:hidden") : "lg:hidden"} flex flex-row items-start gap-1 text-sm mt-1 w-full`}
                                                                            >
                                                                                <dt className={`${col?.screenreader ? "hidden" : "flex"} w-1/2 flex-none text-gray-400 text-[10px] text-sm ${col.name ? "" : "hidden"}`}>
                                                                                    {col.name ? `${col.name}:` : ""}
                                                                                </dt>
                                                                                <dd className={`flex ${col?.screenreader ? "w-full" : "w-1/2"} flex-none text-gray-600 break-all ${row.items[colindex]?.style}`}>
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
                            ) : null
                        }
                        {
                            (!loading && data?.length && total?.length) ? (
                                <tr
                                    className={`hover:bg-gray-100 ${rowstyle}`}
                                >
                                    <td className="hidden lg:table-cell border-b border-gray-200 px-2 py-4 text-sm text-gray-500 no-select">&nbsp;</td>
                                    {
                                        (total?.length) ? (
                                            total?.map((item, totalindex) => (
                                                <td
                                                    key={totalindex}
                                                    className={`hidden lg:table-cell w-auto py-4 border-b border-gray-200 px-2 text-sm text-gray-900 font-bold ${itemstyle}`}
                                                >
                                                    <span className={`hidden lg:flex ${setPosition(order && order[totalindex]?.position, false)} ${item?.style}`}>
                                                        {item?.value}
                                                    </span>
                                                </td>
                                            ))
                                        ) : null
                                    }
                                    <td colSpan={99} className="flex flex-col lg:hidden text-black border border-black border-t-4 px-2 pb-1">
                                        {
                                            (total?.length && order?.length) ? (
                                                total?.map((item, totalindex) => (
                                                    <div
                                                        key={totalindex}
                                                        className={`flex flex-row w-full items-start gap-1 lg:gap-3 text-sm mt-1 ${isEmpty(item.value) ? "hidden" : ""}`}
                                                    >
                                                        <dt className={`text-gray-400 w-1/2 text-[10px] text-sm`}>
                                                            {totalindex === 0 ? <b>{item?.value}</b> : `${order[totalindex]?.name}:`}
                                                        </dt>
                                                        <dd className="truncate text-gray-500 w-1/2">
                                                            {totalindex > 0 ? <b>{item?.value}</b> : ""}
                                                        </dd>
                                                    </div>
                                                ))
                                            ) : null
                                        }
                                    </td>
                                </tr>
                            ) : null
                        }
                        {
                            (!loading && !data?.length) ? (
                                <tr>
                                    <td className="hidden border-b border-gray-200 pl-6 pr-3 py-4 text-sm text-gray-500 lg:table-cell"></td>
                                    <td colSpan={100} className="w-full max-w-0 py-4 border-b border-gray-200 pl-4 pr-6 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-6">
                                        No record retrieved.
                                    </td>
                                </tr>
                            ) : null
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
import React, { useEffect, useRef } from 'react'
import { useDispatch } from "react-redux"
import { useLocation } from "react-router-dom"
import { setLocationPath } from "../../redux/slices/locateSlice"

const DataListing = ({ reference, header, layout, records, appendcallback, savecallback }) => {
    const refList = useRef()
    const location = useLocation()
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setLocationPath(`${location?.pathname}/View`))
    }, [location])

    return (
        <>
            <div ref={refList} className="flex flex-col justify-between mt-8 shadow overflow-auto ring-1 ring-black ring-opacity-5 md:mx-0 md:rounded-t-lg py-3 px-2 border border-b-1 border-b-gray-400 shadow-md rounded-md">
                <div className="flex flex-col no-select">
                    <div className="text-lg font-semibold uppercase flex flex-col md:flex-row lg:justify-between lg:items-center">
                        <span>{header.title}</span>
                        <span className="hidden text-sm md:flex pr-3">
                            {records?.length ? records?.length : "No"} Item{records?.length === 1 ? "" : "s"} Listed
                        </span>
                    </div>
                    <span>{header.description}</span>
                </div>
                <div className="flex flex-col mt-8 gap-4">
                    {
                        records?.map((data, index) => (
                            <div key={data.key} className="w-full flex flex-col lg:flex-row gap-3 px-3 py-4 rounded-sm cursor-pointer hover:bg-gray-300 ease-in duration-100 flex-grow">
                                <div className="no-select w-[50px]">{index + 1}.</div>
                                <div className="flex flex-col w-full">
                                    <div className="flex flex-col lg:flex-row text-sm gap-1 w-full">
                                        {
                                            data?.items?.map((item, index) => (
                                                <div key={index} className={`flex gap-2 ${layout.sizes[index].size}`}>
                                                    <span className={`flex lg:hidden text-xs text-gray-400 ${item?.subtext ? "" : "hidden"}`}>
                                                        {item?.subtext}:
                                                    </span>
                                                    {item.value}
                                                </div>
                                            ))
                                        }
                                    </div>
                                    {
                                        (layout.showsubtext) ? (
                                            <div className="hidden lg:flex flex-none gap-1 mt-1">
                                                {
                                                    data?.items?.map((item, index) => (
                                                        <div key={index} className={`text-[11px] text-gray-400 ${layout.sizes[index].size}`}>
                                                            {item?.subtext || ""}
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        ) : null
                                    }
                                </div>
                                {
                                    (data?.controls?.length) ? (
                                        <div className="flex flex-none gap-4 lg:gap-2 w-[100px] lg:ml-auto text-secondary-600 no-select">
                                            {
                                                data?.controls?.map((control, index) => (
                                                    <span key={index} className={control?.style ? control?.style : "hover:underline"} onClick={() => control?.trigger()}>
                                                        {control.label}
                                                    </span>
                                                ))
                                            }
                                        </div>
                                    ) : null
                                }
                            </div>
                        ))
                    }
                    <div className={`${!records?.length || records?.length === 0 ? "flex" : "hidden"}  w-full gap-3 px-3 py-4 rounded-sm cursor-pointer ease-in duration-100 flex-grow`}>
                        <span className="text-sm font-bold">No items listed.</span>
                    </div>
                    <div className="w-full flex flex-col lg:flex-row gap-3 py-4 rounded-sm cursor-pointer justify-between">
                        <button className={`button-blue text-sm no-select ${reference ? "" : "hidden"}`} onClick={appendcallback}>
                            Add Item to the List
                        </button>
                        <button className={`${!records?.length || records?.length === 0 ? "hidden" : "button-green text-sm no-select"}`} onClick={savecallback}>
                            Save Listing
                        </button>
                    </div>
                </div>
            </div >
        </>
    )
}

export default DataListing
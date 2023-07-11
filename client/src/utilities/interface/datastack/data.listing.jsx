import React, { useRef } from 'react'

const DataListing = ({ reference, header, layout, records, appendcallback, savecallback }) => {
    const refList = useRef()
    return (
        <>
            <div ref={refList} className="flex flex-col justify-between mt-8 shadow overflow-auto ring-1 ring-black ring-opacity-5 md:mx-0 md:rounded-t-lg py-6 px-8 border border-b-1 border-b-gray-400 shadow-md rounded-md">
                <div className="flex flex-col no-select">
                    <div className="text-lg font-semibold uppercase flex flex-col md:flex-row justify-between items-center">
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
                            <div key={data.key} className="w-full flex gap-3 px-3 py-4 rounded-sm cursor-pointer hover:bg-gray-300 ease-in duration-100 flex-grow">
                                <span className="no-select">{index + 1}.</span>
                                <div className="flex flex-col grow">
                                    <div className="flex flex-col md:flex-row w-full text-sm">
                                        {
                                            data?.items?.map((item, index) => (
                                                <span key={index} className={layout.sizes[index].size}>
                                                    {item.value}
                                                </span>
                                            ))
                                        }
                                    </div>
                                    {
                                        (layout.showsubtext) ? (
                                            <div className="hidden md:flex w-full text-[11px] text-gray-400 mt-1">
                                                {
                                                    data?.items?.map((item, index) => (
                                                        <span key={index} className={layout.sizes[index].size}>
                                                            {item?.subtext}
                                                        </span>
                                                    ))
                                                }
                                            </div>
                                        ) : null
                                    }
                                </div>
                                {
                                    (data?.controls?.length) ? (
                                        <div className="flex gap-2 w-fit ml-auto text-secondary-600 flex-none no-select">
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
                    <div className="w-full flex gap-3 py-4 rounded-sm cursor-pointer justify-between">
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
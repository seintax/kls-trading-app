import React, { useEffect } from 'react'
import { useDispatch } from "react-redux"
import { Link, useLocation } from "react-router-dom"
import { setLocationPath } from "../../redux/slices/locateSlice"
import MenuSelect from "../forminput/menu.select"
import DataError from "./data.error"
import DataLoading from "./data.loading"
import DataNoRecord from "./data.norecord"

const DataIndex = ({ display, actions, sorts, sortcallback, data, isLoading, overrideLoading = false, isError, inputLink, filterArray, filterCallback, children, plain = false }) => {
    const location = useLocation()
    const dispatch = useDispatch()

    useEffect(() => {
        // handleTrail(location?.pathname)
        dispatch(setLocationPath(location?.pathname))
    }, [location])

    if (!plain && data?.length === 0 && !isLoading) {
        return (
            <DataNoRecord
                title="No records"
                description={`Get started by creating a new ${display.name}`}
                button={{ name: `Add ${display.name}`, link: inputLink, trigger: actions && actions[0]?.callback }}
            />
        )
    }

    return (
        <div className='flex flex-col w-full h-full'>
            <div className="sm:flex sm:items-center w-full">
                <div className={display.show ? "sm:flex-auto no-select px-2" : "hidden"}>
                    <h1 className="text-2xl font-semibold text-gray-900 capitalize">{display.name.toUpperCase()}</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        {display.text}
                    </p>
                </div>
                <div className={`flex flex-wrap mt-4 lg:mt-0 flex-row-reverse gap-3 items-center sm:flex-none ${display.show ? "sm:ml-16" : "ml-auto"}`}>
                    {
                        sorts?.length
                            ? <MenuSelect options={sorts} callback={sortcallback} />
                            : null
                    }
                    {
                        (actions?.map((action, index) => (
                            <div key={index} className="w-full px-2 lg:w-fit lg:px-0">
                                <Link onClick={action?.callback} className={`${action?.hidden ? "hidden" : "button-link"} w-full`}>
                                    {action.label}
                                </Link>
                            </div>
                        )))
                    }
                    {
                        filterArray?.length ? (
                            <div className="flex flex-wrap lg:flex-nowrap items-center gap-3 w-full  px-2 lg:w-fit lg:px-0">
                                {
                                    filterArray?.map(el => (
                                        <div key={el.id} className="w-full lg:w-fit">
                                            {el?.component()}
                                        </div>
                                    ))
                                }
                                <button
                                    className="button-action w-full lg:w-fit"
                                    onClick={filterCallback
                                        ? () => filterCallback()
                                        : () => { }}>
                                    Apply Filter
                                </button>
                            </div>
                        ) : null
                    }
                </div>
            </div>
            {children}
            {(isLoading && !overrideLoading && (<DataLoading loading={isLoading} />))}
            {(isError && (<DataError />))}
        </div>
    )
}

export default DataIndex
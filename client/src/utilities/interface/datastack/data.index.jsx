import React, { useEffect } from 'react'
import { Link, useLocation } from "react-router-dom"
import { useClientContext } from "../../context/client.context"
import MenuSelect from "../forminput/menu.select"
import DataError from "./data.error"
import DataLoading from "./data.loading"
import DataNoRecord from "./data.norecord"

const DataIndex = ({ display, actions, sorts, sortcallback, data, isLoading, isError, inputLink, children, plain = false }) => {
    const location = useLocation()
    const { handleTrail } = useClientContext()

    useEffect(() => {
        handleTrail(location?.pathname)
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
                <div className={`flex flex-row-reverse gap-3 mt-4 sm:mt-0 sm:flex-none ${display.show ? "sm:ml-16" : "ml-auto"}`}>
                    {
                        sorts?.length
                            ? <MenuSelect options={sorts} callback={sortcallback} />
                            : null
                    }
                    {
                        (actions?.map((action, index) => (
                            <div key={index} className="">
                                <Link onClick={action?.callback} className="button-link">
                                    {action.label}
                                </Link>
                            </div>
                        )))
                    }
                </div>
            </div>
            {children}
            {(isLoading && (<DataLoading loading={isLoading} />))}
            {(isError && (<DataError />))}
        </div>
    )
}

export default DataIndex
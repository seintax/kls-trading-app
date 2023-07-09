import React, { useEffect } from 'react'
import { Link, useLocation } from "react-router-dom"
import { useClientContext } from "../../context/client.context"
import DataError from "./data.error"
import DataLoading from "./data.loading"
import DataNoRecord from "./data.norecord"

const DataIndex = ({ display, actions, data, isLoading, isError, inputLink, children }) => {
    const location = useLocation()
    const { handleTrail } = useClientContext()

    useEffect(() => {
        handleTrail(location?.pathname)
    }, [location])

    if (data?.length === 0 && !isLoading) {
        return (
            <DataNoRecord
                title="No records"
                description={`Get started by creating a new ${display.name}`}
                button={{ name: `Add ${display.name}`, link: inputLink, trigger: actions && actions[0]?.callback }}
            />
        )
    }

    return (
        <div className='flex flex-col py-6 px-4 sm:px-6 lg:px-8 w-full h-full'>
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto no-select">
                    <h1 className="text-2xl font-semibold text-gray-900 capitalize">{display.name.toUpperCase()}</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        {display.text}
                    </p>
                </div>
                <div className="flex flex-row-reverse gap-3 mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
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
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import React from 'react'

const AppInformation = ({ message }) => {
    return (
        <div className="flex relative group">
            <InformationCircleIcon className="group-hover:bg-blue-600 group-hover:text-white w-5 h-5 cursor-pointer rounded-[50%]" />
            {
                message ? (
                    <>
                        <div className="hidden group-hover:flex absolute triangle-up border-b-[5px] border-b-blue-500 z-[99999] top-6 left-[9px] -translate-x-[50%]"></div>
                        <span className="hidden group-hover:flex group-hover:text-white absolute bg-blue-500 text-center px-3 py-2 text-xs min-w-[200px] z-[99999] top-7 left-[9px] -translate-x-[50%] rounded-md transition-all ease-in delay-150 duration-500 bubble-drop-shadow">{message}</span>
                    </>
                ) : null
            }
        </div>
    )
}

export default AppInformation
import React from 'react'

const StaticWrapper = ({ children }) => {
    return (
        <div className={`w-full relative mt-1 rounded-md shadow-sm flex items-center gap-[5px] group`}>
            {children}
        </div>
    )
}

export default StaticWrapper
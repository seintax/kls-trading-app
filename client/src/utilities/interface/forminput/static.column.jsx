import React from 'react'

const StaticColumn = ({ children }) => {
    return (
        <div className={`w-full relative mt-1 rounded-md shadow-sm flex flex-col items-start gap-[5px] group`}>
            {children}
        </div>
    )
}

export default StaticColumn
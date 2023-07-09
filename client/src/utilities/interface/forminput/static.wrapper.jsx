import React from 'react'

const StaticWrapper = ({ isblock = true, children }) => {
    return (
        <div className={`relative mt-1 rounded-md shadow-sm flex ${isblock ? "items-center" : "flex-col "} gap-[5px]`}>
            {children}
        </div>
    )
}

export default StaticWrapper
import React from 'react'

const StaticDisplay = ({ children }) => {
    return (
        <div className="w-full flex flex-col lg:flex-row items-start relative">
            {children}
        </div>
    )
}

export default StaticDisplay
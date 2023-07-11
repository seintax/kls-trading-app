import React from 'react'

const StaticDisplay = ({ children }) => {
    return (
        <div className="w-full flex items-start relative">
            {children}
        </div>
    )
}

export default StaticDisplay
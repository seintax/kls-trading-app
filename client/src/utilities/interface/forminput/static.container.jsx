import React from 'react'

const StaticContainer = ({ style, children }) => {
    return (
        <div className={`w-full flex items-start group relative pb-6`}>
            {children}
        </div>
    )
}

export default StaticContainer
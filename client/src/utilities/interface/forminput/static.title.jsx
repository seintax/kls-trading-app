import React from 'react'

const StaticTitle = ({ label }) => {
    return (
        <div className="w-full flex justify-between no-select pt-3">
            <span
                className="block text-xs lg:text-sm lg:font-medium text-gray-400 lg:text-gray-700"
            >
                {label}
            </span>
        </div>
    )
}

export default StaticTitle
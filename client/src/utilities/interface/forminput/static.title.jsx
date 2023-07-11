import React from 'react'

const StaticTitle = ({ label }) => {
    return (
        <div className="w-full flex justify-between no-select pt-3">
            <span
                className="block text-sm font-medium text-gray-700"
            >
                {label}
            </span>
        </div>
    )
}

export default StaticTitle
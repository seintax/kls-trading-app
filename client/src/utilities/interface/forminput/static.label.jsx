import React from 'react'

const StaticLabel = ({ name, label, optional }) => {
    return (
        <div className="w-full flex justify-between no-select pt-3 group">
            <label
                htmlFor={name}
                className="block text-sm font-medium text-gray-700 group group-hover:text-secondary-400"
            >
                {label}
            </label>
            {optional && <span className="text-sm text-gray-500">Optional</span>}
        </div>
    )
}

export default StaticLabel
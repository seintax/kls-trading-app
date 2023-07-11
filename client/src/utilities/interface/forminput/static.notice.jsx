import React from 'react'

const StaticNotice = ({ name, errors }) => {
    return (
        (errors) ? (
            errors?.[name] && (
                <p className="mt-2 text-sm text-red-600 absolute bottom-0 right-0">
                    {errors?.[name]?.message}
                </p>
            )
        ) : null
    )
}

export default StaticNotice
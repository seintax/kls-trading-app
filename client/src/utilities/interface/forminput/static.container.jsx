import React, { useEffect, useState } from 'react'

const StaticContainer = ({ style, children }) => {
    const [layout, setLayout] = useState(`w-full flex flex-col lg:flex-row items-start group relative pb-6`)

    const deriveLayout = (layoutStyle) => {
        let layoutOptions = [
            { name: "horizontal", style: `w-full flex flex-col lg:flex-row items-start group relative pb-6` },
            { name: "vertical", style: `w-full flex flex-col items-start group relative pb-6` },
        ]
        let hasStyle = layoutOptions.filter(f => f.name === layoutStyle)
        return hasStyle?.length ? hasStyle[0].style : layoutOptions[0].style
    }

    useEffect(() => {
        setLayout(deriveLayout(style))
    }, [style])

    return (
        <div className={layout}>
            {children}
        </div>
    )
}

export default StaticContainer
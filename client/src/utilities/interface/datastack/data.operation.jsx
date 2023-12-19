import React from 'react'
import { Link } from "react-router-dom"

const DataOperation = ({ actions, children, style = "lg:items-center justify-center" }) => {
    return (
        <div className={`flex flex-wrap gap-2 lg:gap-3 lg:gap-[10px] w-full py-2 md:py-0 px-0 md:px-4 no-select h-full ${style}`}>
            {actions?.map((action, index) => (
                (action.type === "link") ? (
                    <Link key={index} to={action?.link} className={`link text-xs lg:text-[12px] hover:text-primary-900 border border-primary-500 rounded-[3px] ${action?.hidden ? "hidden" : ""}`}>{action?.label}</Link>
                ) : (
                    <button key={index} onClick={action?.trigger} className={action?.style ? action?.style : `link text-xs lg:text-[14px] hover:text-primary-900 border border-primary-500 rounded-[3px] ${action?.hidden ? "hidden" : ""}`}>{action?.label}</button>
                )
            ))}
            {children}
        </div>
    )
}

export default DataOperation
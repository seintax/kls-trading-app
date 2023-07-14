import React from 'react'
import { Link } from "react-router-dom"

const DataOperation = ({ actions, children, style = "flex-row items-center justify-end" }) => {
    return (
        <div className={`flex gap-[10px] no-select h-full ${style}`}>
            {actions?.map((action, index) => (
                (action.type === "link") ? (
                    <Link key={index} to={action?.link} className={`link text-[12px] hover:text-primary-900 ${action?.hidden ? "hidden" : ""}`}>{action?.label}</Link>
                ) : (
                    <button key={index} onClick={action?.trigger} className={action?.style ? action?.style : `link text-[12px] hover:text-primary-900 ${action?.hidden ? "hidden" : ""}`}>{action?.label}</button>
                )
            ))}
            {children}
        </div>
    )
}

export default DataOperation
import React from 'react'

const DataHeader = ({ label, name, movecallback, returncallback }) => {
    return (
        <div className="text-sm lg:text-lg w-full py-2 px-8 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-2 justify-between items-center bg-gray-200 border border-b-1 border-b-gray-400 shadow-md rounded-md">
            <div className="flex flex-col gap-2">
                <span className={`text-xs no-select ${label ? "" : "hidden"}`}>Current {label}: </span>
                <span className="font-bold">{name}</span>
            </div>
            <div className="flex gap-3">
                {
                    (movecallback) ? (
                        <button
                            type="button"
                            className="button-back h-10 ease-in duration-100"
                            tabIndex={-1}
                            onClick={movecallback}
                        >
                            Back to {label}
                        </button>
                    ) : null
                }
                {
                    (returncallback) ? (
                        <button
                            type="button"
                            className="button-back h-10 ease-in duration-100 text-xs lg:text-sm"
                            tabIndex={-1}
                            onClick={returncallback}
                        >
                            Return to list
                        </button>
                    ) : null
                }
            </div>
        </div>
    )
}

export default DataHeader
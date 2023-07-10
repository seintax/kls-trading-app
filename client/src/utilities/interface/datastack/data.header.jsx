import React from 'react'

const DataHeader = ({ label, name, callback }) => {
    return (
        <div className="text-lg w-full py-2 px-8 sm:px-6 lg:px-8 flex gap-2 justify-between items-center bg-gray-200 border border-b-1 border-b-gray-400 shadow-md rounded-md">
            <div className="flex flex-col gap-2">
                <span className={`text-xs no-select ${label ? "" : "hidden"}`}>Current {label}: </span>
                <span className="font-bold">{name}</span>
            </div>
            <div className={`flex gap-3 ${callback ? "" : "hidden"}`}>
                <button
                    type="button"
                    className="button-back h-10 ease-in duration-100"
                    tabIndex={-1}
                    onClick={
                        callback?.fn
                            ? () => callback?.fn()
                            : () => { }
                    }
                >
                    Back to {label}
                </button>
                {
                    (callback?.ls) ? (
                        <button
                            type="button"
                            className="button-back h-10 ease-in duration-100"
                            tabIndex={-1}
                            onClick={
                                callback?.ls
                                    ? () => callback?.ls()
                                    : () => { }
                            }
                        >
                            Back to list
                        </button>
                    ) : null
                }
            </div>
        </div>
    )
}

export default DataHeader
import { XMarkIcon } from "@heroicons/react/20/solid"
import { yupResolver } from "@hookform/resolvers/yup"
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { useForm } from "react-hook-form"
import SpinnerIcon from "../../../assets/SpinnerIcon"

const DataInjoin = ({ display, formData, fields, change, submit, closecallback, segmented = false }) => {
    const [populated, setPopulated] = useState(false)
    const isEdit = !!formData.id
    const {
        register,
        setValue,
        watch,
        reset,
        handleSubmit,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(formData.schema),
        defaultValues: formData?.values,
    })

    const keydown = useCallback(e => {
        if (display?.show)
            if (e.key === 'Escape') closecallback()
    })

    useEffect(() => {
        document.addEventListener('keydown', keydown)
        return () => { document.removeEventListener('keydown', keydown) }
    }, [keydown])

    useLayoutEffect(() => {
        if (formData?.values) {
            if (!populated) {
                for (const prop in formData?.values)
                    setValue(prop, formData?.values[prop])
                setPopulated(true)
                return
            }
            for (const prop in formData?.values)
                setValue(prop, formData?.values[prop])
        }
    }, [formData?.values])

    useEffect(() => {
        if (formData?.values && populated) {
            const subscription = watch((value, { name }) => {
                if (populated) {
                    clearErrors(name)
                    change(value, name)
                }
            })
            return () => {
                subscription.unsubscribe()
            }
        }
    }, [watch, formData?.values, populated])

    const doSubmit = (data) => {
        submit(data)
    }

    const toggleReset = () => {
        if (!formData?.values) {
            reset()
            return
        }
        reset(formData?.values, { keepDefaultValues: true })
    }

    const preventSubmit = (e) => {
        e.preventDefault()
    }

    return (
        (display?.show) ? (
            <div className="flex w-screen h-screen items-center justify-center fixed top-0 left-0 bg-black bg-opacity-[40%] overflow-y-auto z-20">
                <div className={`flex flex-col pt-5 px-5 bg-white relative border border-1 border-gray-300 shadow-md rounded-md ${display?.size ? display?.size : "w-[400px] min-h-[400px]"}`}>
                    <div className="flex justify-between mb-3">
                        <div className="font-bold text-[15px]">{display?.title || ""}</div>
                        <div><XMarkIcon className="h-5 w-5 cursor-pointer" onClick={closecallback} /></div>
                    </div>
                    <div className="w-full py-2 px-2">
                        <div className={"h-full px-4 py-2 sm:p-6 shadow bg-white rounded"}>
                            <form
                                onSubmit={submit ? handleSubmit(doSubmit) : preventSubmit}
                                className={`w-full space-y-2 flex flex-col gap-2 ${segmented ? "" : "justify-between"}`}
                            >
                                <div className="space-y-4 divide-y divide-gray-200 sm:space-y-3">
                                    <div className="space-y-6 sm:space-y-5 w-full">
                                        <div className="flex flex-col gap-0">

                                            {fields(errors, register, formData?.values, setValue)}

                                        </div>
                                    </div>
                                </div>
                                <div className={`${submit ? "" : "hidden"}`}>
                                    <div className="py-2 flex justify-end gap-2">
                                        <button
                                            type="button"
                                            className="button-blue mr-auto"
                                            onClick={() => toggleReset()}
                                            tabIndex={-1}
                                        >
                                            Reset
                                        </button>
                                        <button
                                            type="button"
                                            className="button-cancel ease-in duration-300"
                                            onClick={closecallback}
                                            tabIndex={-1}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            disabled={isSubmitting}
                                            type="submit"
                                            className={`button-submit`}
                                        >
                                            {isSubmitting && <SpinnerIcon />}
                                            {isSubmitting ? "Saving..." : "Save"}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        ) : null
    )
}

export default DataInjoin
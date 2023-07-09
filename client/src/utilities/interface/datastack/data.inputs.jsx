import { yupResolver } from "@hookform/resolvers/yup"
import React, { useEffect } from 'react'
import { useForm } from "react-hook-form"
import { useLocation } from "react-router-dom"
import SpinnerIcon from "../../../assets/SpinnerIcon"
import { useClientContext } from "../../context/client.context"

const DataInputs = ({ formData, fields, change, submit, closed }) => {
    const location = useLocation()
    const { handleTrail } = useClientContext()
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

    useEffect(() => {
        handleTrail(location.pathname.split("/").filter(fvar => fvar !== formData.id).join("/"))
    }, [location])

    useEffect(() => {
        if (formData?.values)
            for (const prop in formData?.values)
                setValue(prop, formData?.values[prop])
    }, [formData?.values])

    useEffect(() => {
        if (formData?.values) {
            const subscription = watch((value, { name }) => {
                clearErrors(name)
                change(value, name)
            })
            return () => {
                subscription.unsubscribe()
            }
        }
    }, [watch, formData?.values])

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

    const toggleCancel = () => {
        closed()
    }

    const preventSubmit = (e) => {
        e.preventDefault()
    }

    return (
        <div className="w-full h-full py-2 px-4 sm:px-6 lg:px-8">
            <div className={"h-full px-4 py-5 sm:p-6 shadow bg-white rounded"}>
                <form
                    onSubmit={submit ? handleSubmit(doSubmit) : preventSubmit}
                    className="w-full h-full space-y-8 flex flex-col justify-between"
                >
                    <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                        <div className="space-y-6 sm:space-y-5 w-full">
                            <div className="flex items-center justify-between pb-5">
                                <div className="text-lg font-medium leading-6 text-[#010a3a] uppercase">
                                    {isEdit ? `Edit ${formData.name}` : `Add ${formData.name}`}
                                </div>
                            </div>

                            {fields(errors, register, formData?.values, setValue)}

                        </div>
                    </div>
                    <div className={`${submit ? "" : "hidden"}`}>
                        <div className=" py-4 flex justify-end">
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
                                className="button-cancel"
                                onClick={() => toggleCancel()}
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
    )
}

export default DataInputs
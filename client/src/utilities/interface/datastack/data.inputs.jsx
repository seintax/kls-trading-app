import { SquaresPlusIcon } from "@heroicons/react/20/solid"
import { yupResolver } from "@hookform/resolvers/yup"
import React, { useEffect } from 'react'
import { useForm } from "react-hook-form"
import { useLocation } from "react-router-dom"
import SpinnerIcon from "../../../assets/SpinnerIcon"
import { useClientContext } from "../../context/client.context"

const DataInputs = ({ formData, fields, change, submit, closed, listing, mutation, header = true }) => {
    const location = useLocation()
    const { handleTrail } = useClientContext()
    const isEdit = !!formData.id
    const saveText = isEdit ? "Update" : "Save"
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
        if (mutation) {
            for (const prop in mutation)
                setValue(prop, mutation[prop])
        }
    }, [mutation])

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

    const preventSubmit = (e) => {
        e.preventDefault()
    }

    return (
        <div className="w-full h-full py-2 px-2">
            <div className="h-full px-6 py-4 shadow bg-white rounded">
                <form
                    onSubmit={submit ? handleSubmit(doSubmit) : preventSubmit}
                    className={`w-full h-full flex flex-col ${listing ? "" : "justify-between"}`}
                >
                    <div className="space-y-4 divide-y divide-gray-200 sm:space-y-5">
                        <div className="space-y-6 sm:space-y-5 w-full">
                            <div className={header ? "flex items-center justify-between pb-5" : "hidden"}>
                                <div className="text-lg font-medium leading-6 text-[#010a3a] uppercase">
                                    {
                                        formData.name.startsWith("!")
                                            ? formData.name.replaceAll("!", "")
                                            : (isEdit
                                                ? `Edit ${formData.name}`
                                                : `Add ${formData.name}`)
                                    }
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">

                                {fields(errors, register, formData?.values, setValue)}

                            </div>
                        </div>
                    </div>
                    <div className={`${submit ? "" : "hidden"}`}>
                        <div className=" py-4 flex flex-col gap-2 lg:gap-0 lg:flex-row justify-end">
                            <button
                                type="button"
                                className="button-blue lg:mr-auto"
                                onClick={() => toggleReset()}
                                tabIndex={-1}
                            >
                                Reset
                            </button>
                            {
                                (closed) ? (
                                    <button
                                        type="button"
                                        className="button-cancel ease-in duration-300"
                                        onClick={closed}
                                        tabIndex={-1}
                                    >
                                        Cancel
                                    </button>
                                ) : null
                            }
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="button-submit flex gap-3 items-center"
                            >
                                {isSubmitting
                                    ? <SpinnerIcon />
                                    : <SquaresPlusIcon className="w-4 h-4" />}
                                {isSubmitting
                                    ? "Saving..."
                                    : saveText}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default DataInputs
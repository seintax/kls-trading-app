import { PencilSquareIcon } from "@heroicons/react/20/solid"
import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FormatOptionsWithEmptyLabel } from "../../../utilities/functions/array.functions"
import { longDate, sqlDate } from "../../../utilities/functions/datetime.functions"
import { isEmpty } from "../../../utilities/functions/string.functions"
import useAuth from "../../../utilities/hooks/useAuth"
import useToast from "../../../utilities/hooks/useToast"
import useYup from "../../../utilities/hooks/useYup"
import DataHeader from "../../../utilities/interface/datastack/data.header"
import DataInputs from "../../../utilities/interface/datastack/data.inputs"
import FormEl from "../../../utilities/interface/forminput/input.active"
import { useFetchAllBranchMutation } from "../../library/branch/branch.services"
import { useFetchAllCategoryMutation } from "../../library/category/category.services"
import TransmitListing from "../transfer-item/transfer.item.listing"
import { resetTransferManager, setTransferNotifier } from "./transfer.reducer"
import { useCreateTransferMutation, useUpdateTransferMutation } from "./transfer.services"

const TransferManage = () => {
    const auth = useAuth()
    const dataSelector = useSelector(state => state.transfer)
    // const transmitSelector = useSelector(state => state.transmit)
    const dispatch = useDispatch()
    const [instantiated, setInstantiated] = useState(false)
    const [listener, setListener] = useState()
    const [element, setElement] = useState()
    const [editMode, setEditMode] = useState(dataSelector?.item?.id ? false : true)
    const [values, setValues] = useState()
    const { yup } = useYup()
    const toast = useToast()

    const [libSources, setLibSources] = useState()
    const [libDestinations, setLibDestinations] = useState()
    const [libCategories, setLibCategories] = useState()

    const [allBranches] = useFetchAllBranchMutation()
    const [allCategories] = useFetchAllCategoryMutation()
    const [createTransfer] = useCreateTransferMutation()
    const [updateTransfer] = useUpdateTransferMutation()

    useEffect(() => {
        const instantiate = async () => {
            await allBranches()
                .unwrap()
                .then(res => {
                    if (res.success) {
                        setLibSources(FormatOptionsWithEmptyLabel(res?.arrayResult, "code", "name", "Select source"))
                        setLibDestinations(FormatOptionsWithEmptyLabel(res?.arrayResult, "code", "name", "Select destination"))
                    }
                })
                .catch(err => console.error(err))
            await allCategories()
                .unwrap()
                .then(res => {
                    if (res.success) {
                        setLibCategories(FormatOptionsWithEmptyLabel(res?.arrayResult, "name", "name", "Select category"))
                    }
                })
                .catch(err => console.error(err))
            setInstantiated(true)
        }

        instantiate()
    }, [])

    const init = (value, initial = "") => {
        if (!isEmpty(value)) {
            return value
        }
        return initial
    }

    useEffect(() => {
        if (instantiated) {
            let item = dataSelector.item
            setValues({
                source: init(item.source),
                destination: init(item.destination),
                category: init(item.category),
                date: init(sqlDate(item.date)),
            })
        }
    }, [instantiated])

    const onFields = (errors, register, values, setValue) => {
        return (
            <>
                <FormEl.Date
                    label='Transfer Date'
                    register={register}
                    name='date'
                    errors={errors}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
                <FormEl.Select
                    label='Source'
                    register={register}
                    name='source'
                    errors={errors}
                    options={libSources}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
                <FormEl.Select
                    label='Destination'
                    register={register}
                    name='destination'
                    errors={errors}
                    options={libDestinations}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
                <FormEl.Select
                    label='Category'
                    register={register}
                    name='category'
                    errors={errors}
                    options={libCategories}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
            </>
        )
    }

    const onChange = (values, element) => {
        setListener(values)
        setElement(element)
    }

    useEffect(() => {
        if (listener) {
            // console.log(`${element}`, listener[element])
        }
    }, [listener])

    const onSchema = yup.object().shape({
        source: yup
            .string()
            .required('Field is required.'),
        destination: yup
            .string()
            .required('Field is required.'),
        category: yup
            .string()
            .required('Field is required.'),
    })

    const onClose = useCallback(() => {
        setEditMode(false)
    }, [])

    const onCompleted = () => {
        dispatch(setTransferNotifier(true))
        if (id) dispatch(showPurchaseSelector(id))
        setEditMode(false)
    }

    const onSubmit = async (data) => {
        if (dataSelector.item.id) {
            // if (receivableSelector.data?.length) {
            //     let sortByCategory = receivableSelector.data?.filter(f => f.purchase_category === data?.category)
            //     if (sortByCategory.length !== receivableSelector.data?.length) {
            //         toast.showWarning("Cannot change category when purchase order items contains unsimilar category.")
            //         return
            //     }
            // }
            await updateTransfer({ ...data, id: dataSelector.item.id })
                .unwrap()
                .then(res => {
                    if (res.success) {
                        toast.showUpdate("Transfer successfully updated.")
                        onCompleted()
                    }
                })
                .catch(err => console.error(err))
            return
        }
        await createTransfer(data)
            .unwrap()
            .then(res => {
                if (res.success) {
                    toast.showCreate("Transfer successfully created.")
                    onCompleted()
                }
            })
            .catch(err => console.error(err))
    }

    const inputFormData = {
        id: dataSelector.item.id,
        name: dataSelector.display.name,
        values: values,
        schema: onSchema
    }

    const returnToList = useCallback(() => {
        console.log("closing appender...")
        dispatch(resetTransferManager())
    }, [])

    const onEdit = () => {
        setEditMode(true)
    }

    const provideValueFromLib = (arrayData, valueSought) => {
        if (instantiated && valueSought && arrayData) {
            let array = arrayData?.filter(arr => arr.value === valueSought)
            let value = array?.length ? array[0] : undefined
            return value.key
        }
        return ""
    }

    return (
        <div className="w-full flex flex-col gap-5 -mt-5 lg:mt-0">
            <div className="w-full sticky -top-5 mt-5 pt-5 lg:pt-0 z-10">
                <DataHeader name="Stock Transfer" returncallback={returnToList} />
            </div>

            <div className="w-full border border-b-1 border-b-gray-400">
                {
                    (editMode) ? (
                        <DataInputs
                            formData={inputFormData}
                            fields={onFields}
                            change={onChange}
                            submit={onSubmit}
                            closed={dataSelector.item.id ? onClose : undefined}
                            listing={true}
                            header={false}
                        />
                    ) : (
                        <div className="w-full h-full pt-2 pb-5 px-2">
                            <div className="flex flex-col gap-3 h-full px-6 py-4 shadow bg-white rounded">
                                <FormEl.Item
                                    label="Transfer Date"
                                    value={longDate(dataSelector?.item?.date)}
                                    style="text-sm lg:w-1/2"
                                />
                                <FormEl.Item
                                    label="Source"
                                    value={provideValueFromLib(libSources, dataSelector?.item?.source)}
                                    style="text-sm lg:w-1/2"
                                />
                                <FormEl.Item
                                    label="Supplier"
                                    value={provideValueFromLib(libDestinations, dataSelector?.item?.destination)}
                                    style="text-sm lg:w-1/2"
                                />
                                <FormEl.Item
                                    label="Category"
                                    value={provideValueFromLib(libCategories, dataSelector?.item?.category)}
                                    style="text-sm lg:w-1/2"
                                />
                                <div className="w-full">
                                    <div className=" pt-4 flex justify-end">
                                        <button
                                            type="button"
                                            className="button-submit flex gap-3 items-center"
                                            onClick={() => onEdit()}
                                        >
                                            <PencilSquareIcon className="w-4 h-4" /> Edit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
            <div className="w-full min-h-[100px]">
                <TransmitListing />
            </div>
        </div>
    )
}

export default TransferManage
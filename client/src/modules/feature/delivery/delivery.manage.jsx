import { PencilSquareIcon } from "@heroicons/react/20/solid"
import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FormatOptionsWithEmptyLabel } from "../../../utilities/functions/array.functions"
import { longDate, sqlDate } from "../../../utilities/functions/datetime.functions"
import { isEmpty, safeValue } from "../../../utilities/functions/string.functions"
import useAuth from "../../../utilities/hooks/useAuth"
import useToast from "../../../utilities/hooks/useToast"
import useYup from "../../../utilities/hooks/useYup"
import DataHeader from "../../../utilities/interface/datastack/data.header"
import DataInputs from "../../../utilities/interface/datastack/data.inputs"
import FormEl from "../../../utilities/interface/forminput/input.active"
import { useFetchAllBranchMutation } from "../../library/branch/branch.services"
import { useFetchAllSupplierMutation } from "../../library/supplier/supplier.services"
import ReceiptListing from "../delivery-item/delivery.item.listing"
import { resetDeliveryManager, setDeliveryNotifier, showDeliverySelector } from "./delivery.reducer"
import { useCreateDeliveryMutation, useUpdateDeliveryMutation } from "./delivery.services"

const DeliveryManage = () => {
    const auth = useAuth()
    const dataSelector = useSelector(state => state.delivery)
    // const receivableSelector = useSelector(state => state.receivable)
    const dispatch = useDispatch()
    const [instantiated, setInstantiated] = useState(false)
    const [listener, setListener] = useState()
    const [element, setElement] = useState()
    const [editMode, setEditMode] = useState(dataSelector?.item?.id ? false : true)
    const [values, setValues] = useState()
    const { yup } = useYup()
    const toast = useToast()

    const [libBranches, setLibBranches] = useState()
    const [libSuppliers, setLibSuppliers] = useState()

    const [allBranches] = useFetchAllBranchMutation()
    const [allSuppliers] = useFetchAllSupplierMutation()
    const [createDelivery] = useCreateDeliveryMutation()
    const [updateDelivery] = useUpdateDeliveryMutation()

    useEffect(() => {
        const instantiate = async () => {
            await allBranches()
                .unwrap()
                .then(res => {
                    if (res.success) {
                        setLibBranches(FormatOptionsWithEmptyLabel(res?.arrayResult, "code", "name", "Select branch"))
                    }
                })
                .catch(err => console.error(err))
            await allSuppliers()
                .unwrap()
                .then(res => {
                    if (res.success) {
                        setLibSuppliers(FormatOptionsWithEmptyLabel(res?.arrayResult, "id", "name", "Select supplier"))
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
                supplier: init(item.supplier),
                refcode: init(item.refcode),
                store: init(item.store),
                date: init(sqlDate(item.date)),
                remarks: init(item.remarks),
            })
        }
    }, [instantiated])

    const onFields = (errors, register, values, setValue) => {
        return (
            <>
                <FormEl.Select
                    label='Supplier'
                    register={register}
                    name='supplier'
                    errors={errors}
                    options={libSuppliers}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
                <FormEl.Text
                    label='Supplier DR No.'
                    register={register}
                    name='refcode'
                    errors={errors}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
                <FormEl.Select
                    label='Branch'
                    register={register}
                    name='store'
                    errors={errors}
                    options={libBranches}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
                <FormEl.Date
                    label='Delivery Date'
                    register={register}
                    name='date'
                    errors={errors}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
                <FormEl.Text
                    label='Remarks'
                    register={register}
                    name='remarks'
                    errors={errors}
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
        supplier: yup
            .number()
            .typeError('Supplier is required.')
            .min(1, 'Supplier is required.'),
        store: yup
            .string()
            .required('Branch is required.'),
        refcode: yup
            .string()
            .required('DR No. is required.')
    })

    const onClose = useCallback(() => {
        setEditMode(false)
    }, [])

    const onCompleted = (id = undefined) => {
        dispatch(setDeliveryNotifier(true))
        if (id) dispatch(showDeliverySelector(id))
        // dispatch(resetDeliveryManager())
        setEditMode(false)
    }

    const onSubmit = async (data) => {
        if (dataSelector.item.id) {
            await updateDelivery({ ...data, id: dataSelector.item.id })
                .unwrap()
                .then(res => {
                    if (res.success) {
                        toast.showUpdate("Delivery successfully updated.")
                        onCompleted(dataSelector.item.id)
                    }
                })
                .catch(err => console.error(err))
            return
        }
        await createDelivery(data)
            .unwrap()
            .then(res => {
                if (res.success) {
                    toast.showCreate("Delivery successfully created.")
                    onCompleted(res.insertResult.id)
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
        dispatch(resetDeliveryManager())
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
        // <DataInputs
        //     formData={inputFormData}
        //     fields={onFields}
        //     change={onChange}
        //     submit={onSubmit}
        //     closed={onClose}
        // />
        <div className="w-full flex flex-col gap-5">
            <div className="w-full sticky -top-5 z-10">
                <DataHeader name="Delivery Request" returncallback={returnToList} />
            </div>

            <div className="w-full border border-b-1 border-b-gray-400 shadow-lg border-shadow">
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
                                    label="Supplier"
                                    value={provideValueFromLib(libSuppliers, dataSelector?.item?.supplier)}
                                    style="text-sm lg:w-1/2"
                                />
                                <FormEl.Item
                                    label="Supplier DR No."
                                    value={safeValue(dataSelector?.item?.refcode)}
                                    style="text-sm lg:w-1/2"
                                />
                                <FormEl.Item
                                    label="For Branch"
                                    value={provideValueFromLib(libBranches, dataSelector?.item?.store)}
                                    style="text-sm lg:w-1/2"
                                />
                                <FormEl.Item
                                    label="Delivery Date"
                                    value={longDate(dataSelector?.item?.date)}
                                    style="text-sm lg:w-1/2"
                                />
                                <FormEl.Item
                                    label="Remarks"
                                    value={safeValue(dataSelector?.item?.remarks)}
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
                <ReceiptListing />
            </div>
        </div>
    )
}

export default DeliveryManage
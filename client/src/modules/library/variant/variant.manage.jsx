import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FormatOptionsNoLabel } from "../../../utilities/functions/array.functions"
import { isEmpty } from "../../../utilities/functions/string.functions"
import useToast from "../../../utilities/hooks/useToast"
import useYup from "../../../utilities/hooks/useYup"
import DataInputs from "../../../utilities/interface/datastack/data.inputs"
import FormEl from "../../../utilities/interface/forminput/input.active"
import { useFetchAllOptionMutation } from "../option/option.services"
import { resetVariantManager, setVariantNotifier } from "./variant.reducer"
import { useCreateVariantMutation, useUpdateVariantMutation } from "./variant.services"

const VariantManage = () => {
    const dataSelector = useSelector(state => state.variant)
    const masterlistSelector = useSelector(state => state.masterlist)
    const dispatch = useDispatch()
    const [instantiated, setInstantiated] = useState(false)
    const [listener, setListener] = useState()
    const [element, setElement] = useState()
    const [values, setValues] = useState()
    const { yup } = useYup()
    const toast = useToast()

    const [libOptions, setLibOptions] = useState()

    const [allOption] = useFetchAllOptionMutation()
    const [createVariant] = useCreateVariantMutation()
    const [updateVariant] = useUpdateVariantMutation()

    useEffect(() => {
        const instantiate = async () => {
            setInstantiated(true)
            // fetch all library dependencies here. (e.g. dropdown values, etc.)
            await allOption()
                .unwrap()
                .then(res => {
                    if (res.success)
                        setLibOptions(FormatOptionsNoLabel(res?.arrayResult, "id", "name"))
                })
                .catch(err => console.error(err))
        }

        instantiate()
        return () => {
            setInstantiated(false)
        }
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
                serial: init(item.serial),
                option1: init(item.option1),
                model: init(item.model),
                option2: init(item.option2),
                brand: init(item.brand),
                option3: init(item.option3),
            })
        }
    }, [instantiated])

    const onFields = (errors, register, values, setValue) => {
        return (
            <>
                <FormEl.Listbox
                    label='Option 1'
                    register={register}
                    name='option1'
                    setter={setValue}
                    values={values}
                    items={libOptions}
                    errors={errors}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
                <FormEl.Text
                    label='Serial No.'
                    register={register}
                    name='serial'
                    errors={errors}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
                <FormEl.Listbox
                    label='Option 2'
                    register={register}
                    name='option2'
                    setter={setValue}
                    values={values}
                    items={libOptions}
                    errors={errors}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
                <FormEl.Text
                    label='Model'
                    register={register}
                    name='model'
                    errors={errors}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
                <FormEl.Listbox
                    label='Option 3'
                    register={register}
                    name='option3'
                    setter={setValue}
                    values={values}
                    items={libOptions}
                    errors={errors}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
                <FormEl.Text
                    label='Brand'
                    register={register}
                    name='brand'
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
        serial: yup
            .string()
            .required('Serial No. is required.'),
        model: yup
            .string()
            .required('Model is required.'),
        brand: yup
            .string()
            .required('Brand is required.')
    })

    const onClose = () => {
        dispatch(resetVariantManager())
    }

    const onCompleted = () => {
        dispatch(setVariantNotifier(true))
        dispatch(resetVariantManager())
    }

    const onSubmit = async (data) => {
        if (dataSelector.item.id) {
            await updateVariant({ ...data, id: dataSelector.item.id })
                .unwrap()
                .then(res => {
                    if (res.success) {
                        toast.showUpdate("Variant successfully updated.")
                        onCompleted()
                    }
                })
                .catch(err => console.error(err))
            return
        }
        await createVariant({ ...data, product: masterlistSelector.item.id, category: masterlistSelector.item.category })
            .unwrap()
            .then(res => {
                if (res.success) {
                    toast.showCreate("Variant successfully created.")
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

    return (
        <>
            <div className="text-lg w-full py-6 px-8 sm:px-12 lg:px-14 flex flex-col gap-2 bg-gray-300 rounded-md">
                <span className="text-xs no-select">Current Masterlist: </span>
                <span className="font-bold">{masterlistSelector.item.name} | {masterlistSelector.item.category}</span>
            </div>
            <DataInputs
                formData={inputFormData}
                fields={onFields}
                change={onChange}
                submit={onSubmit}
                closed={onClose}
            />
        </>
    )
}

export default VariantManage
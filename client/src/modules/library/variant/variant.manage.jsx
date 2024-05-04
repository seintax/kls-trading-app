import { useCallback, useEffect, useState } from "react"
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
    const [libOption1, setLibOption1] = useState()
    const [libOption2, setLibOption2] = useState()
    const [libOption3, setLibOption3] = useState()

    const [allOption] = useFetchAllOptionMutation()
    const [createVariant] = useCreateVariantMutation()
    const [updateVariant] = useUpdateVariantMutation()

    useEffect(() => {
        const instantiate = async () => {
            // fetch all library dependencies here. (e.g. dropdown values, etc.)
            await allOption()
                .unwrap()
                .then(res => {
                    if (res.success)
                        setLibOptions(FormatOptionsNoLabel(res?.arrayResult, "name", "name"))
                })
                .catch(err => console.error(err))
            setInstantiated(true)
        }

        instantiate()
    }, [])

    useEffect(() => {
        if (instantiated) {
            return () => {
                setInstantiated(false)
                dispatch(resetVariantManager())
            }
        }
    }, [instantiated])


    const init = (value, initial = "") => {
        if (!isEmpty(value)) {
            return value
        }
        return initial
    }

    const listboxitem = (array, value) => {
        if (!value || !value.length) return array
        let arrvalue = JSON.parse(value)
        return array?.map(arr => {
            if (arrvalue?.includes(arr.value)) {
                return { ...arr, selected: true }
            }
            return { ...arr, selected: false }
        })
    }

    useEffect(() => {
        if (instantiated) {
            let item = dataSelector.item
            let option1 = JSON.stringify(item.option1?.split("/"))
            let option2 = JSON.stringify(item.option2?.split("/"))
            let option3 = JSON.stringify(item.option3?.split("/"))
            setValues({
                serial: init(item.serial),
                option1: init(option1),
                model: init(item.model),
                option2: init(option2),
                brand: init(item.brand),
                option3: init(option3),
                alert: init(item.alert),
            })
            if (libOptions) {
                setLibOption1(listboxitem(libOptions, option1))
                setLibOption2(listboxitem(libOptions, option2))
                setLibOption3(listboxitem(libOptions, option3))
            }
        }
    }, [instantiated, libOptions])

    const cleanUpLabel = (label, defaults) => {
        if (label === "[]" || isEmpty(label)) {
            return `Option Label/${defaults}`
        }
        return label
            .replace("[", "")
            .replace("]", "")
            .replaceAll("\"", "")
            .replaceAll(",", "/")
    }

    const onFields = (errors, register, values, setValue) => {
        return (
            <>
                <FormEl.Number
                    label="Stock Alert Level"
                    register={register}
                    name='alert'
                    errors={errors}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
                <FormEl.Listbox
                    label={"Option 1"}
                    register={register}
                    name='option1'
                    setter={setValue}
                    values={values}
                    items={libOption1}
                    errors={errors}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
                <FormEl.Text
                    label={cleanUpLabel(listener?.option1, "Serial No.")}
                    register={register}
                    name='serial'
                    errors={errors}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                    style="uppercase"
                />
                <FormEl.Listbox
                    label='Option 2'
                    register={register}
                    name='option2'
                    setter={setValue}
                    values={values}
                    items={libOption2}
                    errors={errors}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
                <FormEl.Text
                    label={cleanUpLabel(listener?.option2, "Model")}
                    register={register}
                    name='model'
                    errors={errors}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                    style="uppercase"
                />
                <FormEl.Listbox
                    label='Option 3'
                    register={register}
                    name='option3'
                    setter={setValue}
                    values={values}
                    items={libOption3}
                    errors={errors}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
                <FormEl.Text
                    label={cleanUpLabel(listener?.option3, "Brand")}
                    register={register}
                    name='brand'
                    errors={errors}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                    style="uppercase"
                />
            </>
        )
    }

    const onChange = (values, element) => {
        setListener(values)
        setElement(element)
    }

    const onSchema = yup.object().shape({
        serial: yup
            .string()
            .required('Serial No. is required.'),
        model: yup
            .string()
            .required('Model is required.'),
        brand: yup
            .string()
            .required('Brand is required.'),
        alert: yup
            .number()
            .typeError("Stock Alert level is required")
            .min(0, "Stock Alert level is required"),
    })

    const onClose = useCallback(() => {
        dispatch(resetVariantManager())
    }, [])

    const onCompleted = () => {
        dispatch(setVariantNotifier(true))
        dispatch(resetVariantManager())
    }

    const onSubmit = async (data) => {
        let formData = {
            ...data,
            option1: JSON.parse(data.option1)?.join("/"),
            serial: data.serial?.toUpperCase(),
            option2: JSON.parse(data.option2)?.join("/"),
            model: data.model?.toUpperCase(),
            option3: JSON.parse(data.option3)?.join("/"),
            alert: data.alert,
            brand: data.brand?.toUpperCase(),
        }
        if (dataSelector.item.id) {
            await updateVariant({ ...formData, id: dataSelector.item.id })
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
        await createVariant({ ...formData, product: masterlistSelector.item.id, category: masterlistSelector.item.category })
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
        <DataInputs
            formData={inputFormData}
            fields={onFields}
            change={onChange}
            submit={onSubmit}
            closed={onClose}
        />
    )
}

export default VariantManage
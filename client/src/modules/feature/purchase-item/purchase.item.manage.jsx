import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { isEmpty } from "../../../utilities/functions/string.functions"
import useToast from "../../../utilities/hooks/useToast"
import useYup from "../../../utilities/hooks/useYup"
import DataInputs from "../../../utilities/interface/datastack/data.inputs"
import FormEl from "../../../utilities/interface/forminput/input.active"
import { resetReceivableManager, setReceivableNotifier } from "./purchase.item.reducer"
import { useCreateReceivableMutation, useUpdateReceivableMutation } from "./purchase.item.services"

const ReceivableManage = () => {
    const dataSelector = useSelector(state => state.receivable)
    const dispatch = useDispatch()
    const [instantiated, setInstantiated] = useState(false)
    const [listener, setListener] = useState()
    const [element, setElement] = useState()
    const [values, setValues] = useState()
    const { yup } = useYup()
    const toast = useToast()

    const [createReceivable] = useCreateReceivableMutation()
    const [updateReceivable] = useUpdateReceivableMutation()

    useEffect(() => {
        const instantiate = async () => {
            setInstantiated(true)
            // fetch all library dependencies here. (e.g. dropdown values, etc.)
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
                product: init(item.product),
                variant: init(item.variant),
                ordered: init(item.ordered),
                costing: init(item.costing),
            })
        }
    }, [instantiated])

    const onFields = (errors, register, values, setValue) => {
        return (
            <>
                <FormEl.Select
                    label='Product Name'
                    register={register}
                    name='product'
                    errors={errors}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
                <FormEl.Select
                    label='Variant'
                    register={register}
                    name='variant'
                    errors={errors}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
                <FormEl.Decimal
                    label='Quantity'
                    register={register}
                    name='variant'
                    errors={errors}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
                <FormEl.Currency
                    label='Purchase Cost'
                    register={register}
                    name='costing'
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
        product: yup
            .string()
            .required('Product name is required.'),
        variant: yup
            .string()
            .required('Product variant is required.'),
        ordered: yup
            .number()
            .min(1, "Quantity is required"),
        costing: yup
            .number()
            .min(1, "Purchase cost is required")
    })

    const onClose = () => {
        dispatch(resetReceivableManager())
    }

    const onCompleted = () => {
        dispatch(setReceivableNotifier(true))
        dispatch(resetReceivableManager())
    }

    const onSubmit = async (data) => {
        if (dataSelector.item.id) {
            await updateReceivable({ ...data, id: dataSelector.item.id })
                .unwrap()
                .then(res => {
                    if (res.success) {
                        toast.showUpdate("Receivable successfully updated.")
                        onCompleted()
                    }
                })
                .catch(err => console.error(err))
            return
        }
        await createReceivable(data)
            .unwrap()
            .then(res => {
                if (res.success) {
                    toast.showCreate("Receivable successfully created.")
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

export default ReceivableManage
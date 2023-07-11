import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { isEmpty } from "../../../utilities/functions/string.functions"
import useToast from "../../../utilities/hooks/useToast"
import useYup from "../../../utilities/hooks/useYup"
import DataInputs from "../../../utilities/interface/datastack/data.inputs"
import FormEl from "../../../utilities/interface/forminput/input.active"
import { resetSupplierManager, setSupplierNotifier } from "./supplier.reducer"
import { useCreateSupplierMutation, useUpdateSupplierMutation } from "./supplier.services"

const SupplierManage = () => {
    const dataSelector = useSelector(state => state.supplier)
    const dispatch = useDispatch()
    const [instantiated, setInstantiated] = useState(false)
    const [listener, setListener] = useState()
    const [element, setElement] = useState()
    const [values, setValues] = useState()
    const { yup } = useYup()
    const toast = useToast()

    const [createSupplier] = useCreateSupplierMutation()
    const [updateSupplier] = useUpdateSupplierMutation()

    useEffect(() => {
        const instantiate = async () => {
            // fetch all library dependencies here. (e.g. dropdown values, etc.)

            setInstantiated(true)
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
                name: init(item.name),
                address: init(item.address),
                details: init(item.details),
                telephone: init(item.telephone),
                cellphone: init(item.cellphone),
                email: init(item.email),
            })
        }
    }, [instantiated])

    const onFields = (errors, register, values, setValue) => {
        return (
            <>
                <FormEl.Text
                    label='Name'
                    register={register}
                    name='name'
                    errors={errors}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
                <FormEl.Text
                    label='Address'
                    register={register}
                    name='address'
                    errors={errors}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
                <FormEl.Text
                    label='Details'
                    register={register}
                    name='details'
                    errors={errors}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
                <FormEl.Text
                    label='Telephone No.'
                    register={register}
                    name='telephone'
                    errors={errors}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
                <FormEl.Text
                    label='Cellphone No.'
                    register={register}
                    name='cellphone'
                    errors={errors}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
                <FormEl.Email
                    label='Email Address'
                    register={register}
                    name='email'
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
        name: yup
            .string()
            .required('Supplier name is required.'),
        address: yup
            .string()
            .required('Address is required.'),
        cellphone: yup
            .string()
            .required('Cellphone no. is required.')
    })

    const onClose = useCallback(() => {
        dispatch(resetSupplierManager())
    }, [])

    const onCompleted = () => {
        dispatch(setSupplierNotifier(true))
        dispatch(resetSupplierManager())
    }

    const onSubmit = async (data) => {
        if (dataSelector.item.id) {
            await updateSupplier({ ...data, id: dataSelector.item.id })
                .unwrap()
                .then(res => {
                    if (res.success) {
                        toast.showUpdate("Supplier successfully updated.")
                        onCompleted()
                    }
                })
                .catch(err => console.error(err))
            return
        }
        await createSupplier(data)
            .unwrap()
            .then(res => {
                if (res.success) {
                    toast.showCreate("Supplier successfully created.")
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

export default SupplierManage
import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { isEmpty } from "../../../utilities/functions/string.functions"
import useToast from "../../../utilities/hooks/useToast"
import useYup from "../../../utilities/hooks/useYup"
import DataInputs from "../../../utilities/interface/datastack/data.inputs"
import FormEl from "../../../utilities/interface/forminput/input.active"
import { resetCustomerManager, setCustomerNotifier } from "./customer.reducer"
import { useCreateCustomerMutation, useUpdateCustomerMutation } from "./customer.services"

const CustomerManage = () => {
    const dataSelector = useSelector(state => state.customer)
    const dispatch = useDispatch()
    const [instantiated, setInstantiated] = useState(false)
    const [listener, setListener] = useState()
    const [element, setElement] = useState()
    const [values, setValues] = useState()
    const { yup } = useYup()
    const toast = useToast()

    const [createCustomer] = useCreateCustomerMutation()
    const [updateCustomer] = useUpdateCustomerMutation()

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
                contact: init(item.contact),
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
                    label='Contact No.'
                    register={register}
                    name='contact'
                    errors={errors}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
                <FormEl.Text
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

    const onSchema = yup.object().shape({
        name: yup
            .string()
            .required('Customer name is required.'),
        contact: yup
            .string()
            .required('Contact no. is required.')
    })

    const onClose = useCallback(() => {
        dispatch(resetCustomerManager())
    }, [])

    const onCompleted = () => {
        dispatch(setCustomerNotifier(true))
        dispatch(resetCustomerManager())
    }

    const onSubmit = async (data) => {
        if (dataSelector.item.id) {
            await updateCustomer({ ...data, id: dataSelector.item.id })
                .unwrap()
                .then(res => {
                    if (res.success) {
                        toast.showUpdate("Customer successfully updated.")
                        onCompleted()
                    }
                })
                .catch(err => console.error(err))
            return
        }
        await createCustomer(data)
            .unwrap()
            .then(res => {
                if (res.success) {
                    toast.showCreate("Customer successfully created.")
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

export default CustomerManage
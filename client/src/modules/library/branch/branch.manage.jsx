import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { isEmpty } from "../../../utilities/functions/string.functions"
import useToast from "../../../utilities/hooks/useToast"
import useYup from "../../../utilities/hooks/useYup"
import DataInputs from "../../../utilities/interface/datastack/data.inputs"
import FormEl from "../../../utilities/interface/forminput/input.active"
import { resetBranchManager, setBranchNotifier } from "./branch.reducer"
import { useCreateBranchMutation, useUpdateBranchMutation } from "./branch.services"

const BranchManage = () => {
    const dataSelector = useSelector(state => state.branch)
    const dispatch = useDispatch()
    const [instantiated, setInstantiated] = useState(false)
    const [listener, setListener] = useState()
    const [element, setElement] = useState()
    const [values, setValues] = useState()
    const { yup } = useYup()
    const toast = useToast()

    const [createBranch] = useCreateBranchMutation()
    const [updateBranch] = useUpdateBranchMutation()

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
                code: init(item.code),
                address: init(item.address),
                contact: init(item.contact),
            })
        }
    }, [instantiated])

    const onFields = (errors, register, values, setValue) => {
        return (
            <>
                <FormEl.Text
                    label='Branch Name'
                    register={register}
                    name='name'
                    errors={errors}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
                <FormEl.Text
                    label='Code'
                    register={register}
                    name='code'
                    errors={errors}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                    style="uppercase"
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
            .required('Branch name is required.'),
        code: yup
            .string()
            .required('Branch code is required.'),
        contact: yup
            .string()
            .required('Contact no. is required.')
    })

    const onClose = useCallback(() => {
        dispatch(resetBranchManager())
    }, [])

    const onCompleted = () => {
        dispatch(setBranchNotifier(true))
        dispatch(resetBranchManager())
    }

    const onSubmit = async (data) => {
        const formData = {
            ...data,
            code: data.code?.toUpperCase()?.replaceAll(" ", "")
        }
        if (dataSelector.item.id) {
            await updateBranch({ ...formData, id: dataSelector.item.id })
                .unwrap()
                .then(res => {
                    if (res.success) {
                        toast.showUpdate("Branch successfully updated.")
                        onCompleted()
                    }
                })
                .catch(err => console.error(err))
            return
        }
        await createBranch(formData)
            .unwrap()
            .then(res => {
                if (res.success) {
                    toast.showCreate("Branch successfully created.")
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

export default BranchManage
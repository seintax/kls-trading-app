import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { isEmpty } from "../../../utilities/functions/string.functions"
import useToast from "../../../utilities/hooks/useToast"
import useYup from "../../../utilities/hooks/useYup"
import DataInputs from "../../../utilities/interface/datastack/data.inputs"
import FormEl from "../../../utilities/interface/forminput/input.active"
import { resetRolesManager, setRolesNotifier } from "./roles.reducer"
import { useCreateRolesMutation, useUpdateRolesMutation } from "./roles.services"

const RolesManage = () => {
    const dataSelector = useSelector(state => state.roles)
    const dispatch = useDispatch()
    const [instantiated, setInstantiated] = useState(false)
    const [listener, setListener] = useState()
    const [element, setElement] = useState()
    const [values, setValues] = useState()
    const { yup } = useYup()
    const toast = useToast()

    const [libPermissions, setLibPermissions] = useState()

    const [createRoles] = useCreateRolesMutation()
    const [updateRoles] = useUpdateRolesMutation()

    useEffect(() => {
        const instantiate = async () => {
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
                name: init(item.name),
            })
        }
    }, [instantiated])

    const onFields = (errors, register, values, setValue) => {
        return (
            <>
                <FormEl.Text
                    label='Role Name'
                    register={register}
                    name='name'
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
            .required('Role name is required.'),
    })

    const onClose = () => {
        dispatch(resetRolesManager())
    }

    const onCompleted = () => {
        dispatch(setRolesNotifier(true))
        dispatch(resetRolesManager())
    }

    const onSubmit = async (data) => {
        const formData = data
        if (dataSelector.item.id) {
            await updateRoles({ ...data, id: dataSelector.item.id })
                .unwrap()
                .then(res => {
                    if (res.success) {
                        toast.showUpdate("Roles successfully updated.")
                        onCompleted()
                    }
                })
                .catch(err => console.error(err))
            return
        }
        await createRoles(data)
            .unwrap()
            .then(res => {
                if (res.success) {
                    toast.showCreate("Roles successfully created.")
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

export default RolesManage
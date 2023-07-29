import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FormatOptionsWithEmptyLabel } from "../../../utilities/functions/array.functions"
import { isDev, isEmpty } from "../../../utilities/functions/string.functions"
import useAuth from "../../../utilities/hooks/useAuth"
import useToast from "../../../utilities/hooks/useToast"
import useYup from "../../../utilities/hooks/useYup"
import DataInputs from "../../../utilities/interface/datastack/data.inputs"
import FormEl from "../../../utilities/interface/forminput/input.active"
import { useFetchAllRolesMutation } from "../roles/roles.services"
import { resetAccountRole, setAccountNotifier } from "./account.reducer"
import { useUpdateAccountMutation } from "./account.services"

const AccountRoles = () => {
    const auth = useAuth()
    const dataSelector = useSelector(state => state.account)
    const dispatch = useDispatch()
    const [instantiated, setInstantiated] = useState(false)
    const [listener, setListener] = useState()
    const [element, setElement] = useState()
    const [values, setValues] = useState()
    const { yup } = useYup()
    const toast = useToast()

    const [libRoles, setLibRoles] = useState()

    const [allRoles] = useFetchAllRolesMutation()
    const [updateAccount] = useUpdateAccountMutation()

    useEffect(() => {
        const instantiate = async () => {
            await allRoles()
                .unwrap()
                .then(res => {
                    if (res.success) {
                        if (isDev(auth)) {
                            setLibRoles(FormatOptionsWithEmptyLabel(res?.arrayResult, "name", "name", "Select user roles"))
                            return
                        }
                        setLibRoles(FormatOptionsWithEmptyLabel(res?.arrayResult
                            ?.filter(f => f.name !== "DevOp" && f.name !== "SysAd"), "name", "name", "Select user roles"))
                    }
                })
                .catch(err => console.error(err))
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
                user: init(item.user),
                name: init(item.name),
                store: init(item.store),
                role: init(item.role),
            })
        }
    }, [instantiated])

    const onFields = (errors, register, values, setValue) => {
        return (
            <>
                <FormEl.Display
                    label='Email Address'
                    register={register}
                    name='user'
                />
                <FormEl.Display
                    label='Fullname'
                    register={register}
                    name='name'
                />
                <FormEl.Display
                    label='Branch'
                    register={register}
                    name='store'
                />
                <FormEl.Select
                    label='User Role'
                    register={register}
                    name='role'
                    errors={errors}
                    options={libRoles}
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
        }
    }, [listener])

    const onSchema = yup.object().shape({
        role: yup
            .string()
            .required('Please enter your username.'),
    })

    const onClose = useCallback(() => {
        dispatch(resetAccountRole())
    }, [])

    const onCompleted = () => {
        dispatch(setAccountNotifier(true))
        dispatch(resetAccountRole())
    }

    const onSubmit = async (data) => {
        if (dataSelector.item.id) {
            await updateAccount({ role: data.role, id: dataSelector.item.id })
                .unwrap()
                .then(res => {
                    if (res.success) {
                        toast.showUpdate("Account successfully updated.")
                        onCompleted()
                    }
                })
                .catch(err => console.error(err))
            return
        }
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

export default AccountRoles
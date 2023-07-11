import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FormatOptionsWithEmptyLabel, FormatOptionsWithNewOption } from "../../../utilities/functions/array.functions"
import { isAdmin, isDev, isEmpty } from "../../../utilities/functions/string.functions"
import useAuth from "../../../utilities/hooks/useAuth"
import useToast from "../../../utilities/hooks/useToast"
import useYup from "../../../utilities/hooks/useYup"
import DataInputs from "../../../utilities/interface/datastack/data.inputs"
import FormEl from "../../../utilities/interface/forminput/input.active"
import { useFetchAllBranchMutation } from "../../library/branch/branch.services"
import { resetAccountManager, setAccountNotifier } from "./account.reducer"
import { useCreateAccountMutation, useUpdateAccountMutation } from "./account.services"

const AccountManage = () => {
    const auth = useAuth()
    const dataSelector = useSelector(state => state.account)
    const dispatch = useDispatch()
    const [instantiated, setInstantiated] = useState(false)
    const [listener, setListener] = useState()
    const [element, setElement] = useState()
    const [values, setValues] = useState()
    const { yup } = useYup()
    const toast = useToast()

    const [libBranches, setLibBranches] = useState()

    const [allBranches] = useFetchAllBranchMutation()
    const [createAccount] = useCreateAccountMutation()
    const [updateAccount] = useUpdateAccountMutation()

    useEffect(() => {
        const instantiate = async () => {
            // fetch all library dependencies here. (e.g. dropdown values, etc.)
            await allBranches()
                .unwrap()
                .then(res => {
                    if (res.success) {
                        let initial = FormatOptionsWithEmptyLabel(res?.arrayResult, "code", "name", "Select branch")
                        let devteam = [
                            { value: "SysAd", key: "System Administrator", data: {} },
                            { value: auth.store, key: "Development Team", data: {} },
                        ]
                        let admin = [
                            { value: "SysAd", key: "System Administrator", data: {} }
                        ]
                        let options = isDev(auth) || isAdmin(auth)
                            ? FormatOptionsWithNewOption(initial, isDev(auth) ? devteam : admin)
                            : initial
                        setLibBranches(options)

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
                pass: "",
                confirm: ""
            })
        }
    }, [instantiated])

    const onFields = (errors, register, values, setValue) => {
        return (
            <>
                <FormEl.Email
                    label='Email Address'
                    register={register}
                    name='user'
                    errors={errors}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
                <FormEl.Text
                    label='Fullname'
                    register={register}
                    name='name'
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
                    wrapper='lg:w-1/2'
                />
                <FormEl.Password
                    label='Password'
                    register={register}
                    name='pass'
                    errors={errors}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
                <FormEl.Password
                    label='Confirm Password'
                    register={register}
                    name='confirm'
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
        user: yup
            .string()
            .required('Please enter your username.'),
        pass: yup
            .string()
            .required('Please enter your password.')
            .min(8, "Password must contain atleast 8 characters"),
        confirm: yup
            .string()
            .required('Please confirm your password.')
            .min(8, "Password must contain atleast 8 characters")
            .required('Please confirm your password.')
            .oneOf([yup.ref('pass'), null], "Passwords do not match."),
    })

    const onClose = useCallback(() => {
        dispatch(resetAccountManager())
    }, [])

    const onCompleted = () => {
        dispatch(setAccountNotifier(true))
        dispatch(resetAccountManager())
    }

    const onSubmit = async (data) => {
        const { user, name, pass, confirm } = data
        if (dataSelector.item.id) {
            await updateAccount({ ...data, id: dataSelector.item.id })
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
        await createAccount(data)
            .unwrap()
            .then(res => {
                if (res.success) {
                    toast.showCreate("Account successfully created.")
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

export default AccountManage
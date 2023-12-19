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
import { useFetchAllRolesMutation } from "../roles/roles.services"
import { resetAccountManager, setAccountNotifier } from "./account.reducer"
import { useCreateAccountMutation, useHashedUpdateAccountMutation } from "./account.services"

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
    const [libRoles, setLibRoles] = useState()

    const [allBranches] = useFetchAllBranchMutation()
    const [allRoles] = useFetchAllRolesMutation()
    const [createAccount] = useCreateAccountMutation()
    const [updateAccount] = useHashedUpdateAccountMutation()

    useEffect(() => {
        const instantiate = async () => {
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
                pass: "",
                repass: "",
                role: init(item.role),
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
                {
                    dataSelector.item.id
                        ?
                        <div>
                            <FormEl.Display
                                label='Branch'
                                register={register}
                                name='store'
                            />
                            <div className="flex w-full pb-2">
                                <div className="w-1/2"></div>
                                <div className="w-1/2 px-2">
                                    <b>Note</b>: Account branch cannot be modified. <br /> In any case that a user needs access to <u>multiple</u> branches, create a <u>separate</u> account.
                                    <br />
                                    {isDev(auth) ? "Unique code given to users are directly linked to the auto-generated transaction no." : ""}
                                    <br />
                                    This rule is being observed as a precaution.
                                </div>
                            </div>
                        </div>
                        : <FormEl.Select
                            label='Branch'
                            register={register}
                            name='store'
                            errors={errors}
                            options={libBranches}
                            wrapper='lg:w-1/2'
                        />
                }

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
                    name='repass'
                    errors={errors}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
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
        user: yup
            .string()
            .required('Please enter your username.'),
        pass: yup
            .string()
            .required('Please enter your password.')
            .min(8, "Password must contain atleast 8 characters"),
        repass: yup
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
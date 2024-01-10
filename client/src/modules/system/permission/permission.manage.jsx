import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { isEmpty } from "../../../utilities/functions/string.functions"
import useToast from "../../../utilities/hooks/useToast"
import useYup from "../../../utilities/hooks/useYup"
import DataInputs from "../../../utilities/interface/datastack/data.inputs"
import FormEl from "../../../utilities/interface/forminput/input.active"
import { resetPermissionManager, setPermissionNotifier } from "./permission.reducer"
import { useCreatePermissionMutation, useUpdatePermissionMutation } from "./permission.services"

const PermissionManage = () => {
    const dataSelector = useSelector(state => state.permission)
    const dispatch = useDispatch()
    const [instantiated, setInstantiated] = useState(false)
    const [listener, setListener] = useState()
    const [mutation, setMutation] = useState()
    const [element, setElement] = useState()
    const [values, setValues] = useState()
    const [continues, setContinues] = useState(false)
    const { yup } = useYup()
    const toast = useToast()

    const [createPermission] = useCreatePermissionMutation()
    const [updatePermission] = useUpdatePermissionMutation()

    useEffect(() => {
        const instantiate = async () => {
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
            let json = JSON.parse(item?.json || null)
            let inner = JSON.parse(item?.json || null)
            if (inner) {
                delete inner.show
                delete inner.create
                delete inner.read
                delete inner.update
                delete inner.delete
            }
            if (JSON.stringify(inner) === "{}") inner = null
            setValues({
                name: init(item.name),
                show: json?.show,
                create: json?.create,
                read: json?.read,
                update: json?.update,
                delete: json?.delete,
                inner: JSON.stringify(inner)
                    .replace("{", "{\n\t")
                    .replaceAll(":", ": ")
                    .replaceAll(`,"`, `,\n\t"`)
                    .replace("}", "\n}")
                    .replace("null", ""),
                continues: false
            })
        }
    }, [instantiated])

    const selectCrud = () => {
        setMutation(prev => ({
            ...prev,
            create: true,
            read: true,
            update: true,
            delete: true,
        }))
    }

    useEffect(() => {
        if (listener && dataSelector.manager) {
            if (element === "crud") {
                if (listener[element]) {
                    setMutation(prev => ({
                        ...prev,
                        inner: listener['inner']?.replace("{", `{\n\tcreate: true,\n\tread: true,\n\tupdate: true,\n\tdelete: true,\n`)
                    }))
                    return
                }
                setMutation(prev => ({
                    ...prev,
                    watas: "0"
                }))
            }
            if (element === "continues") {
                setContinues(listener[element])
            }
        }
    }, [listener, dataSelector.manager])

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
                <div className="w-1/2 gap-5 lg:gap-0 lg:ml-auto flex">
                    <FormEl.Check
                        label='Menu'
                        register={register}
                        name='show'
                        wrapper='lg:w-1/2'
                    />
                    <FormEl.Check
                        label='Create'
                        register={register}
                        name='create'
                        wrapper='lg:w-1/2'
                    />
                    <FormEl.Check
                        label='Read'
                        register={register}
                        name='read'
                        wrapper='lg:w-1/2'
                    />
                    <FormEl.Check
                        label='Update'
                        register={register}
                        name='update'
                        wrapper='lg:w-1/2'
                    />
                    <FormEl.Check
                        label='Delete'
                        register={register}
                        name='delete'
                        wrapper='lg:w-1/2'
                    />
                </div>
                <div className="w-1/2 lg:ml-auto flex">
                    <button
                        type="button"
                        className="button-link"
                        onClick={() => selectCrud()}
                    >
                        Select All CRUD
                    </button>
                </div>
                <FormEl.Area
                    label='Inner Permissions'
                    register={register}
                    name='inner'
                    setter={setValue}
                    state={listener?.inner}
                    errors={errors}
                    nobreak={true}
                    notab={true}
                    placeholder={`{\n\t"custom-permission": true,\n}`}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
                <div className="w-1/2 lg:ml-auto">
                    <FormEl.Check
                        label='Continues'
                        register={register}
                        name='continues'
                        wrapper='lg:w-1/2'
                    />
                </div>
            </>
        )
    }

    const onChange = (values, element) => {
        setListener(values)
        setElement(element)
    }

    const onContinuesChange = (e) => {
        setContinues(e.target.checked)
    }

    const onSchema = yup.object().shape({
        name: yup
            .string()
            .required('Field is required.'),
    })

    const onClose = () => {
        dispatch(resetPermissionManager())
    }

    const onCompleted = () => {
        dispatch(setPermissionNotifier(true))
        if (continues)
            setValues(prev => ({
                ...prev,
                name: "",
                continues: continues
            }))
        if (!continues)
            dispatch(resetPermissionManager())
    }

    const onSubmit = async (data) => {
        let inner = data.inner ? JSON.parse(data.inner) : undefined
        let formData = {
            name: data.name,
            json: JSON.stringify({
                show: data.show || false,
                create: data.create || false,
                read: data.read || false,
                update: data.update || false,
                delete: data.delete || false,
                ...inner
            })
        }
        if (dataSelector.item.id) {
            await updatePermission({ ...formData, id: dataSelector.item.id })
                .unwrap()
                .then(res => {
                    if (res.success) {
                        toast.showUpdate("Permission successfully updated.")
                        onCompleted()
                    }
                })
                .catch(err => console.error(err))
            return
        }
        await createPermission(formData)
            .unwrap()
            .then(res => {
                if (res.success) {
                    toast.showCreate("Permission successfully created.")
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
            mutation={mutation}
            fields={onFields}
            change={onChange}
            submit={onSubmit}
            closed={onClose}
        />
    )
}

export default PermissionManage
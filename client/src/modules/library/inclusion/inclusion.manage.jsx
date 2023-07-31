import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { isEmpty } from "../../../utilities/functions/string.functions"
import useToast from "../../../utilities/hooks/useToast"
import useYup from "../../../utilities/hooks/useYup"
import DataInputs from "../../../utilities/interface/datastack/data.inputs"
import FormEl from "../../../utilities/interface/forminput/input.active"
import { resetInclusionManager, setInclusionNotifier } from "./inclusion.reducer"
import { useCreateInclusionMutation, useUpdateInclusionMutation } from "./inclusion.services"

const InclusionManage = () => {
    const dataSelector = useSelector(state => state.inclusion)
    const dispatch = useDispatch()
    const [instantiated, setInstantiated] = useState(false)
    const [listener, setListener] = useState()
    const [element, setElement] = useState()
    const [values, setValues] = useState()
    const { yup } = useYup()
    const toast = useToast()

    const [createInclusion] = useCreateInclusionMutation()
    const [updateInclusion] = useUpdateInclusionMutation()

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
            })
        }
    }, [instantiated])

    const onFields = (errors, register, values, setValue) => {
        return (
            <>
                <FormEl.Text
                    label='Account Name'
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
            .required('Account name is required.'),
    })

    const onClose = () => {
        dispatch(resetInclusionManager())
    }

    const onCompleted = () => {
        dispatch(setInclusionNotifier(true))
        dispatch(resetInclusionManager())
    }

    const onSubmit = async (data) => {
        const formData = data
        if (dataSelector.item.id) {
            await updateInclusion({ ...data, id: dataSelector.item.id })
                .unwrap()
                .then(res => {
                    if (res.success) {
                        toast.showUpdate("Inclusion successfully updated.")
                        onCompleted()
                    }
                })
                .catch(err => console.error(err))
            return
        }
        await createInclusion(data)
            .unwrap()
            .then(res => {
                if (res.success) {
                    toast.showCreate("Inclusion successfully created.")
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

export default InclusionManage
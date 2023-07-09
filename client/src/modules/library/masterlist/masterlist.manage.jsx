import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FormatOptionsWithEmptyLabel } from "../../../utilities/functions/array.functions"
import { isEmpty } from "../../../utilities/functions/string.functions"
import useToast from "../../../utilities/hooks/useToast"
import useYup from "../../../utilities/hooks/useYup"
import DataInputs from "../../../utilities/interface/datastack/data.inputs"
import FormEl from "../../../utilities/interface/forminput/input.active"
import { useFetchAllCategoryMutation } from "../category/category.services"
import { resetMasterlistManager, setMasterlistNotifier } from "./masterlist.reducer"
import { useCreateMasterlistMutation, useUpdateMasterlistMutation } from "./masterlist.services"

const MasterlistManage = () => {
    const dataSelector = useSelector(state => state.masterlist)
    const dispatch = useDispatch()
    const [instantiated, setInstantiated] = useState(false)
    const [listener, setListener] = useState()
    const [element, setElement] = useState()
    const [values, setValues] = useState()
    const { yup } = useYup()
    const toast = useToast()

    const [libCategories, setLibCategories] = useState()

    const [allCategory] = useFetchAllCategoryMutation()
    const [createMasterlist] = useCreateMasterlistMutation()
    const [updateMasterlist] = useUpdateMasterlistMutation()

    useEffect(() => {
        const instantiate = async () => {
            setInstantiated(true)
            // fetch all library dependencies here. (e.g. dropdown values, etc.)
            await allCategory()
                .unwrap()
                .then(res => {
                    if (res.success)
                        setLibCategories(FormatOptionsWithEmptyLabel(res?.arrayResult, "name", "name", "Select category"))
                })
                .catch(err => console.error(err))
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
                category: init(item.category),
            })
        }
    }, [instantiated])

    const onFields = (errors, register, values, setValue) => {
        return (
            <>
                <FormEl.Text
                    label='Product Name'
                    register={register}
                    name='name'
                    errors={errors}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                    style="uppercase"
                />
                <FormEl.Select
                    label='Category'
                    register={register}
                    name='category'
                    errors={errors}
                    options={libCategories}
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
            .required('Product name is required.'),
        category: yup
            .string()
            .required('Category is required.')
    })

    const onClose = () => {
        dispatch(resetMasterlistManager())
    }

    const onCompleted = () => {
        dispatch(setMasterlistNotifier(true))
        dispatch(resetMasterlistManager())
    }

    const onSubmit = async (data) => {
        const formData = {
            ...data,
            name: data?.name?.toUpperCase()
        }
        if (dataSelector.item.id) {
            await updateMasterlist({ ...formData, id: dataSelector.item.id })
                .unwrap()
                .then(res => {
                    if (res.success) {
                        toast.showUpdate("Masterlist successfully updated.")
                        onCompleted()
                    }
                })
                .catch(err => console.error(err))
            return
        }
        await createMasterlist(formData)
            .unwrap()
            .then(res => {
                if (res.success) {
                    toast.showCreate("Masterlist successfully created.")
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

export default MasterlistManage
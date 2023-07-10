import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FormatOptionsWithEmptyLabel } from "../../../utilities/functions/array.functions"
import { isEmpty } from "../../../utilities/functions/string.functions"
import useToast from "../../../utilities/hooks/useToast"
import useYup from "../../../utilities/hooks/useYup"
import DataHeader from "../../../utilities/interface/datastack/data.header"
import DataInputs from "../../../utilities/interface/datastack/data.inputs"
import FormEl from "../../../utilities/interface/forminput/input.active"
import { useFetchAllBranchMutation } from "../../library/branch/branch.services"
import { useFetchAllCategoryMutation } from "../../library/category/category.services"
import { useFetchAllSupplierMutation } from "../../library/supplier/supplier.services"
import ReceivableIndex from "../purchase-item/purchase.item.index"
import { resetPurchaseManager, setPurchaseNotifier } from "./purchase.reducer"
import { useCreatePurchaseMutation, useUpdatePurchaseMutation } from "./purchase.services"

const PurchaseManage = () => {
    const dataSelector = useSelector(state => state.purchase)
    const dispatch = useDispatch()
    const [instantiated, setInstantiated] = useState(false)
    const [listener, setListener] = useState()
    const [element, setElement] = useState()
    const [values, setValues] = useState()
    const { yup } = useYup()
    const toast = useToast()

    const [libBranches, setLibBranches] = useState()
    const [libCategories, setLibCategories] = useState()
    const [libSuppliers, setLibSuppliers] = useState()

    const [allBranches] = useFetchAllBranchMutation()
    const [allCategories] = useFetchAllCategoryMutation()
    const [allSuppliers] = useFetchAllSupplierMutation()
    const [createPurchase] = useCreatePurchaseMutation()
    const [updatePurchase] = useUpdatePurchaseMutation()

    useEffect(() => {
        const instantiate = async () => {
            setInstantiated(true)
            // fetch all library dependencies here. (e.g. dropdown values, etc.)
            await allBranches()
                .unwrap()
                .then(res => {
                    if (res.success) {
                        setLibBranches(FormatOptionsWithEmptyLabel(res?.arrayResult, "name", "name", "Select branch"))
                    }
                })
                .catch(err => console.error(err))
            await allCategories()
                .unwrap()
                .then(res => {
                    if (res.success) {
                        setLibCategories(FormatOptionsWithEmptyLabel(res?.arrayResult, "name", "name", "Select categories"))
                    }
                })
                .catch(err => console.error(err))
            await allSuppliers()
                .unwrap()
                .then(res => {
                    if (res.success) {
                        setLibSuppliers(FormatOptionsWithEmptyLabel(res?.arrayResult, "name", "name", "Select supplier"))
                    }
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
                date: init(item.date),
                branch: init(item.store),
                category: init(item.category),
                supplier: init(item.supplier),
            })
        }
    }, [instantiated])

    const onFields = (errors, register, values, setValue) => {
        return (
            <>
                <FormEl.Date
                    label='Purchase Order Date'
                    register={register}
                    name='date'
                    errors={errors}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
                <FormEl.Select
                    label='For Branch'
                    register={register}
                    name='store'
                    errors={errors}
                    options={libBranches}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
                <FormEl.Select
                    label='Category'
                    register={register}
                    name='category'
                    errors={errors}
                    options={libCategories}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
                <FormEl.Select
                    label='Supplier'
                    register={register}
                    name='supplier'
                    errors={errors}
                    options={libSuppliers}
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
            .required('Field is required.'),
        pass: yup
            .string()
            .required('Field is required.')
    })

    const onClose = () => {
        dispatch(resetPurchaseManager())
    }

    const onCompleted = () => {
        dispatch(setPurchaseNotifier(true))
        dispatch(resetPurchaseManager())
    }

    const onSubmit = async (data) => {
        const formData = data
        if (dataSelector.item.id) {
            await updatePurchase({ ...data, id: dataSelector.item.id })
                .unwrap()
                .then(res => {
                    if (res.success) {
                        toast.showUpdate("Purchase successfully updated.")
                        onCompleted()
                    }
                })
                .catch(err => console.error(err))
            return
        }
        await createPurchase(data)
            .unwrap()
            .then(res => {
                if (res.success) {
                    toast.showCreate("Purchase successfully created.")
                    onCompleted()
                }
            })
            .catch(err => console.error(err))
    }

    const inputFormData = {
        id: dataSelector.item.id,
        name: `${dataSelector.display.name} Order`,
        values: values,
        schema: onSchema
    }

    return (
        <div className="w-full flex flex-col gap-5">
            <div className="w-full border border-b-1 border-b-secondary-400 shadow-xl border-shadow">
                <DataInputs
                    formData={inputFormData}
                    fields={onFields}
                    change={onChange}
                    submit={onSubmit}
                    closed={onClose}
                    segmented={true}
                />
            </div>
            <div className="w-full h-[500px]">
                <DataHeader name="Items" />
                <ReceivableIndex />
            </div>
        </div>
    )
}

export default PurchaseManage
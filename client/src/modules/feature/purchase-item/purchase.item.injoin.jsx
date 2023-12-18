import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FormatOptionsWithEmptyLabel } from "../../../utilities/functions/array.functions"
import { isEmpty } from "../../../utilities/functions/string.functions"
import useToast from "../../../utilities/hooks/useToast"
import useYup from "../../../utilities/hooks/useYup"
import DataInjoin from "../../../utilities/interface/datastack/data.injoin"
import FormEl from "../../../utilities/interface/forminput/input.active"
import { useByCategoryMasterlistMutation } from "../../library/masterlist/masterlist.services"
import { useByCategoryVariantMutation } from "../../library/variant/variant.services"
import { resetReceivableInjoiner, resetReceivableItem, setReceivableNotifier } from "./purchase.item.reducer"
import { useCreateReceivableMutation, useSqlReceivableMutation, useUpdateReceivableMutation } from "./purchase.item.services"

const ReceivableInjoin = () => {
    const dataSelector = useSelector(state => state.receivable)
    const purchaseSelector = useSelector(state => state.purchase)
    const dispatch = useDispatch()
    const [instantiated, setInstantiated] = useState(false)
    const [listener, setListener] = useState()
    const [element, setElement] = useState()
    const [values, setValues] = useState()
    const { yup } = useYup()
    const toast = useToast()

    const [libProducts, setLibProducts] = useState()
    const [cacheVariants, setCacheVariants] = useState()
    const [libVariants, setLibVariants] = useState()

    const [categoryProducts] = useByCategoryMasterlistMutation()
    const [categoryVariants] = useByCategoryVariantMutation()
    const [createReceivable] = useCreateReceivableMutation()
    const [updateReceivable] = useUpdateReceivableMutation()
    const [sqlReceivable] = useSqlReceivableMutation()

    useEffect(() => {
        if (dataSelector.injoiner.show) {
            return () => {
                dispatch(resetReceivableItem())
            }
        }
    }, [dataSelector.injoiner.show])

    useEffect(() => {
        const instantiate = async () => {
            await categoryProducts({ category: purchaseSelector?.item?.category })
                .unwrap()
                .then(res => {
                    if (res.success) {
                        setLibProducts(FormatOptionsWithEmptyLabel(res?.arrayResult, "id", "name", "Select product"))
                    }
                })
                .catch(err => console.error(err))
            await categoryVariants({ category: purchaseSelector?.item?.category })
                .unwrap()
                .then(res => {
                    if (res.success) {
                        setCacheVariants(res?.arrayResult)
                        setLibVariants([{ value: "", key: "Select variant", data: {} }])
                    }
                })
                .catch(err => console.error(err))
            setInstantiated(true)
        }
        if (dataSelector.injoiner.show && purchaseSelector.item.id) {
            instantiate()
        }
    }, [purchaseSelector.item.id, dataSelector.injoiner.show])

    const init = (value, initial = "") => {
        if (!isEmpty(value)) {
            return value
        }
        return initial
    }

    useEffect(() => {
        if (dataSelector.injoiner.show && instantiated && cacheVariants.length) {
            let item = dataSelector.item
            if (item.product) {
                let array = cacheVariants
                    ?.filter(arr => parseInt(arr.product) === parseInt(item.product))
                    ?.map(arr => {
                        return {
                            value: arr.id,
                            key: `${arr.serial}/${arr.model}/${arr.brand}`,
                            data: arr
                        }
                    })
                setLibVariants([{ value: "", key: "Select variant", data: {} }, ...array])
            }
            setValues({
                category: init(item.category, purchaseSelector?.item?.category),
                product: init(item.product),
                variety: init(item.variant),
                ordered: init(item.ordered, 0),
                costing: init(item.costing, 0),
            })
        }
    }, [dataSelector.injoiner.show, instantiated, cacheVariants])

    useEffect(() => {
        if (listener) {
            if (cacheVariants.length && element === "product") {
                let product = listener[element]
                if (product) {
                    let array = cacheVariants?.filter(arr => parseInt(arr.product) === parseInt(product))?.map(arr => {
                        return { value: arr.id, key: `${arr.serial}/${arr.model}/${arr.brand}`, data: arr }
                    })
                    setLibVariants([{ value: "", key: "Select variant", data: {} }, ...array])
                    return
                }
                setLibVariants([{ value: "", key: "Select variant", data: {} }])
            }
        }
    }, [listener, cacheVariants, setLibVariants])

    const onFields = (errors, register, values, setValue) => {
        return (
            <>
                <FormEl.Display
                    label='Category'
                    register={register}
                    name='category'
                />
                <FormEl.Select
                    label='Product Name'
                    register={register}
                    name='product'
                    errors={errors}
                    options={libProducts}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
                <FormEl.Select
                    label='Variant'
                    register={register}
                    name='variety'
                    errors={errors}
                    options={libVariants}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
                <FormEl.Decimal
                    label='Quantity'
                    register={register}
                    name='ordered'
                    errors={errors}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
                <FormEl.Currency
                    label='Purchase Cost'
                    register={register}
                    name='costing'
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
        product: yup
            .string()
            .required('Product name is required.'),
        variety: yup
            .string()
            .required('Product variant is required.'),
        ordered: yup
            .number()
            .min(1, "Quantity is required"),
        costing: yup
            .number()
            .min(0, "Purchase cost is required. Minimum value of 0.")
    })

    const onCompleted = () => {
        dispatch(setReceivableNotifier(true))
        dispatch(resetReceivableItem())
        dispatch(resetReceivableInjoiner())
    }

    const onSubmit = async (data) => {
        if (!purchaseSelector.item.id) return
        let formData = {
            receivable: {
                purchase: purchaseSelector.item.id,
                product: data.product,
                variant: data.variety,
                costing: data.costing,
                ordered: data.ordered,
                balance: data.ordered,
                id: dataSelector.item.id
            },
            purchase: {
                id: purchaseSelector.item.id
            }
        }
        await sqlReceivable(formData)
            .unwrap()
            .then(res => {
                if (res.success) {
                    toast.showUpdate("Purchase Order successfully updated.")
                    onCompleted()
                }
            })
            .catch(err => {
                console.error(err)
                toast.showError("Something went wrong while submitting the data.")
            })
    }

    const closeAppender = useCallback(() => {
        dispatch(resetReceivableInjoiner())
    }, [])

    const inputFormData = {
        id: dataSelector.item.id,
        name: dataSelector.display.name,
        values: values,
        schema: onSchema
    }

    return (
        (dataSelector.injoiner.show) ? (
            <DataInjoin
                display={dataSelector.injoiner}
                formData={inputFormData}
                fields={onFields}
                change={onChange}
                submit={onSubmit}
                closecallback={closeAppender}
            />
        ) : null
    )
}

export default ReceivableInjoin
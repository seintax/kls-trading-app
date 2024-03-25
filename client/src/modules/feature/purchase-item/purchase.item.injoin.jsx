import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FormatOptionsNoLabel } from "../../../utilities/functions/array.functions"
import { cleanDisplay, isEmpty } from "../../../utilities/functions/string.functions"
import useToast from "../../../utilities/hooks/useToast"
import useYup from "../../../utilities/hooks/useYup"
import DataInjoin from "../../../utilities/interface/datastack/data.injoin"
import FormEl from "../../../utilities/interface/forminput/input.active"
import { useByCategoryMasterlistMutation } from "../../library/masterlist/masterlist.services"
import { useByCategoryVariantMutation } from "../../library/variant/variant.services"
import { useByReceivableReceiptMutation } from "../delivery-item/delivery.item.services"
import { resetReceivableInjoiner, resetReceivableItem, setReceivableEditCost, setReceivableNotifier } from "./purchase.item.reducer"
import { useCreateReceivableMutation, useSqlReceivableMutation } from "./purchase.item.services"

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
    const [receipt, setReceipt] = useState()

    const [cacheProducts, setCacheProducts] = useState()
    const [libProducts, setLibProducts] = useState()
    const [cacheVariants, setCacheVariants] = useState()
    const [libVariants, setLibVariants] = useState()

    const [categoryProducts, { isLoading: productLoading }] = useByCategoryMasterlistMutation()
    const [categoryVariants, { isLoading: variantLoading }] = useByCategoryVariantMutation()
    const [createReceivable] = useCreateReceivableMutation()
    const [receivableReceipt] = useByReceivableReceiptMutation()
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
                        setCacheProducts(res?.arrayResult)
                        setLibProducts(FormatOptionsNoLabel(res?.arrayResult, "id", "name"))
                    }
                })
                .catch(err => console.error(err))
            await categoryVariants({ category: purchaseSelector?.item?.category })
                .unwrap()
                .then(res => {
                    if (res.success) {
                        setCacheVariants(res?.arrayResult)
                        setLibVariants([])
                    }
                })
                .catch(err => console.error(err))
            if (dataSelector?.item.id) {
                await receivableReceipt({ receivable: dataSelector?.item.id })
                    .unwrap()
                    .then(res => {
                        if (res.success && res.recordCount === 1) {
                            setReceipt(res?.arrayResult[0])
                        }
                    })
                    .catch(err => console.error(err))
            }
            setInstantiated(true)
        }
        if (dataSelector.injoiner.show && purchaseSelector.item.id) {
            instantiate()
        }
    }, [purchaseSelector.item.id, dataSelector.injoiner.show, dataSelector.item])

    const init = (value, initial = "") => {
        if (!isEmpty(value)) {
            return value
        }
        return initial
    }

    useEffect(() => {
        if (dataSelector.injoiner.show && instantiated) {
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
                setLibVariants(array)
            }
            setValues({
                category: init(item.category, purchaseSelector?.item?.category),
                product: init(item.product),
                variety: init(item.variant),
                ordered: init(item.ordered, 0),
                costing: init(item.rawcost, 0),
            })
        }
    }, [dataSelector.injoiner.show, instantiated, dataSelector.item])

    useEffect(() => {
        if (listener) {
            if (cacheVariants.length && element === "product") {
                let product = listener[element]
                if (product) {
                    let array = cacheVariants?.filter(arr => parseInt(arr.product) === parseInt(product))?.map(arr => {
                        return { value: arr.id, key: cleanDisplay(`${arr.serial}/${arr.model}/${arr.brand}`), data: arr }
                    })
                    setLibVariants(array)
                    return
                }
                setLibVariants([])
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
                <FormEl.SearchBox
                    label='Product Name'
                    register={register}
                    name='product'
                    setter={setValue}
                    values={values}
                    errors={errors}
                    style='vertical'
                    items={libProducts}
                    loading={productLoading}
                    placeholder="Search for product name"
                    readOnly={dataSelector.editcost}
                />
                <FormEl.SearchBox
                    label='Variant'
                    register={register}
                    name='variety'
                    setter={setValue}
                    values={values}
                    errors={errors}
                    style='vertical'
                    items={libVariants}
                    loading={variantLoading}
                    placeholder="Search for variant"
                    readOnly={dataSelector.editcost}
                />
                <FormEl.Decimal
                    label='Quantity'
                    register={register}
                    name='ordered'
                    errors={errors}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                    readOnly={dataSelector.editcost}
                />
                <FormEl.Float
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
            .number()
            .typeError("Product name is required")
            .min(1, "Product name is required"),
        variety: yup
            .number()
            .typeError("Product variant is required")
            .min(1, "Product variant is required"),
        ordered: yup
            .number()
            .min(1, "Quantity is required"),
        costing: yup
            .number()
            .min(0, "Purchase cost is required. Minimum value of 0.")
    })

    const onCompleted = () => {
        dispatch(setReceivableEditCost(false))
        dispatch(setReceivableNotifier(true))
        dispatch(resetReceivableItem())
        dispatch(resetReceivableInjoiner())
    }

    const validCost = (cost) => {
        const strCost = String(cost)
        if (strCost?.includes(".")) {
            const parsedCost = strCost?.split(".")
            if (parsedCost[1].length > 8) {
                return false
            }
            return true
        }
        return true
    }

    const onSubmit = async (data) => {
        if (!validCost(data.cost)) {
            toast.showWarning("Allowed decimal places for cost is upto 8th only.")
            return
        }
        if (!purchaseSelector.item.id) return
        let formData = {
            receivable: {
                purchase: purchaseSelector.item.id,
                product: data.product,
                variant: data.variety,
                costing: data.costing,
                rawcost: data.costing,
                ordered: data.ordered,
                balance: data.ordered,
                id: dataSelector.item.id
            },
            purchase: {
                id: purchaseSelector.item.id
            }
        }
        if (dataSelector.editcost) {
            formData = {
                receivable: {
                    costing: data.costing,
                    rawcost: data.costing,
                    id: dataSelector.item.id
                },
                purchase: {
                    id: purchaseSelector.item.id
                },
                inventory: {
                    cost: data.costing,
                    receipt: receipt.id
                }
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
        dispatch(setReceivableEditCost(false))
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
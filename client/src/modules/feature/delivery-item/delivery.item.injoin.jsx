import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FormatOptionsNoLabel } from "../../../utilities/functions/array.functions"
import { StrFn, isEmpty } from "../../../utilities/functions/string.functions"
import useToast from "../../../utilities/hooks/useToast"
import useYup from "../../../utilities/hooks/useYup"
import DataInjoin from "../../../utilities/interface/datastack/data.injoin"
import FormEl from "../../../utilities/interface/forminput/input.active"
import { useFetchAllSupplierMutation } from "../../library/supplier/supplier.services"
import { useByBalanceReceivableMutation } from "../purchase-item/purchase.item.services"
import { resetReceiptInjoiner, resetReceiptItem, setReceiptNotifier } from "./delivery.item.reducer"
import { useSqlReceiptMutation } from "./delivery.item.services"

const ReceiptInjoin = () => {
    const dataSelector = useSelector(state => state.receipt)
    const deliverySelector = useSelector(state => state.delivery)
    const dispatch = useDispatch()
    const [instantiated, setInstantiated] = useState(false)
    const [listener, setListener] = useState()
    const [element, setElement] = useState()
    const [values, setValues] = useState()
    const { yup } = useYup()
    const toast = useToast()

    const [libReceivables, setLibReceivables] = useState()
    const [libSuppliers, setLibSuppliers] = useState()

    const [balancedReceivables] = useByBalanceReceivableMutation()
    const [allSuppliers] = useFetchAllSupplierMutation()
    const [sqlReceipt] = useSqlReceiptMutation()

    useEffect(() => {
        if (dataSelector.injoiner.show) {
            return () => {
                dispatch(resetReceiptItem())
            }
        }
    }, [dataSelector.injoiner.show])

    useEffect(() => {
        const instantiate = async () => {
            await balancedReceivables()
                .unwrap()
                .then(res => {
                    if (res.success) {
                        let array = res?.arrayResult?.filter(arr => parseInt(arr.purchase_supplier) === parseInt(deliverySelector.item.supplier) && arr.purchase_store === deliverySelector.item.store)?.map(arr => {
                            return {
                                value: arr.id,
                                key: `(PO#${StrFn.formatWithZeros(arr.purchase, 6)}) ${arr.product_name} | ${arr.variant_serial}/${arr.variant_model}/${arr.variant_brand}`,
                                data: arr
                            }
                        })
                        setLibReceivables([{ value: "", key: "Select receivable", data: {} }, ...array])
                    }
                })
                .catch(err => console.error(err))
            await allSuppliers()
                .unwrap()
                .then(res => {
                    if (res.success) {
                        setLibSuppliers(FormatOptionsNoLabel(res?.arrayResult, "id", "name", "Select supplier"))
                    }
                })
                .catch(err => console.error(err))
            setInstantiated(true)
        }
        if (dataSelector.injoiner.show && deliverySelector.item.id) {
            instantiate()
        }
    }, [deliverySelector.item.id, dataSelector.injoiner.show])

    const init = (value, initial = "") => {
        if (!isEmpty(value)) {
            return value
        }
        return initial
    }

    const provideValueFromLib = (arrayData, valueSought) => {
        if (instantiated && valueSought && arrayData) {
            let array = arrayData?.filter(arr => arr.value === valueSought)
            let value = array?.length ? array[0] : undefined
            return value.key
        }
        return ""
    }

    useEffect(() => {
        if (dataSelector.injoiner.show && instantiated) {
            let item = dataSelector.item
            let variant = item.variant
                ? `${item.variant_serial}/${item.variant_model}/${item.variant_brand}`
                : ""
            setValues({
                receivable: init(item.receivable, ""),
                supplier_name: init(provideValueFromLib(libSuppliers, item.delivery_supplier)),
                supplier: init(item.purchase_supplier),
                purchase: init(item.purchase),
                product: init(item.product),
                variety_name: init(variant, ""),
                variety: init(item.variant),
                ordered: init(item.receivable_ordered),
                costing: init(item.receivable_costing),
                balance: init(item.receivable_ordered),
                remaining: init(item.receivable_balance),
                received: init(item.receivable_received),
                receiving: init(item.receivable_received),
                quantity: init(item.quantity),
                pricing: init(item.pricing),
                purchase_category: init(item.purchase_category),
                purchase_receivedtotal: init(item.purchase_receivedtotal),
                store: deliverySelector.item.store
            })
        }
    }, [dataSelector.injoiner.show, instantiated])

    useEffect(() => {
        if (listener && dataSelector.injoiner.show) {
            if (element === "receivable") {
                let receivable = listener[element]
                if (receivable) {
                    let selection = libReceivables?.filter(f => parseInt(f.value) === parseInt(receivable))
                    let selected = selection?.length ? selection[0] : undefined
                    if (selected?.data) {
                        setValues({
                            purchase: selected?.data?.purchase,
                            supplier_name: provideValueFromLib(libSuppliers, selected?.data?.purchase_supplier),
                            supplier: selected?.data?.purchase_supplier,
                            product: selected?.data?.product,
                            costing: selected?.data?.costing,
                            variety_name: `${selected?.data?.variant_serial} / ${selected?.data?.variant_model} / ${selected?.data?.variant_brand}`,
                            variety: selected?.data?.variant,
                            ordered: selected?.data?.ordered,
                            balance: selected?.data?.balance,
                            remaining: parseInt(selected?.data?.balance) - parseInt(listener["quantity"] || 0),
                            received: selected?.data?.received,
                            receiving: parseInt(selected?.data?.received) + parseInt(listener["quantity"] || 0),
                            purchase_receivedtotal: selected?.data?.purchase_receivedtotal,
                            receivedtotal: parseInt(selected?.data?.purchase_receivedtotal) + parseInt(listener["quantity"] || 0),
                            purchase_category: selected?.data?.purchase_category,
                        })
                        return
                    }
                }
                setValues({
                    purchase: "",
                    supplier_name: "",
                    supplier: "",
                    product: "",
                    costing: "",
                    variety_name: "",
                    variety: "",
                    ordered: "",
                    balance: "",
                    remaining: "",
                    received: "",
                    receiving: "",
                    receivedtotal: "",
                    purchase_category: "",
                })
            }
            if (element === "quantity") {
                setValues({
                    remaining: parseInt(listener["balance"] || 0) - parseInt(listener["quantity"] || 0),
                    receiving: parseInt(listener["received"] || 0) + parseInt(listener["quantity"] || 0),
                    receivedtotal: parseInt(listener["purchase_receivedtotal"] || 0) + parseInt(listener["quantity"] || 0),
                })
            }
        }
    }, [listener, dataSelector.injoiner.show])

    const onFields = (errors, register, values, setValue) => {

        return (
            <>
                <FormEl.Select
                    label='Receivable'
                    register={register}
                    name='receivable'
                    errors={errors}
                    options={libReceivables}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
                <FormEl.Display
                    label='Supplier'
                    register={register}
                    name='supplier_name'
                />
                <FormEl.Display
                    label='Variant'
                    register={register}
                    name='variety_name'
                />
                <FormEl.Display
                    label='Requested'
                    register={register}
                    name='ordered'
                    errors={errors}
                />
                <FormEl.Display
                    label='Cost'
                    register={register}
                    name='costing'
                />
                <FormEl.Display
                    label='Balance'
                    register={register}
                    name='remaining'
                    errors={errors}
                />
                <FormEl.Decimal
                    label='Received Qty.'
                    register={register}
                    name='quantity'
                    errors={errors}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
                <FormEl.Currency
                    label='Item Price'
                    register={register}
                    name='pricing'
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
        receivable: yup
            .number()
            .typeError("Receivable is required")
            .min(1, "Receivable is required"),
        quantity: yup
            .number()
            .typeError("Received qty is required")
            .min(1, "Received qty is required"),
        remaining: yup
            .number()
            .typeError("Remaining balance is required")
            .min(0, "Exceed the number of allowed received qty."),
        pricing: yup
            .number()
            .typeError("Item price is required")
            .min(1, "Item price is required")
    })

    const onCompleted = () => {
        dispatch(setReceiptNotifier(true))
        dispatch(resetReceiptItem())
        dispatch(resetReceiptInjoiner())
    }

    const onSubmit = async (data) => {
        if (!deliverySelector.item.id) return
        let formData = {
            receipt: {
                delivery: deliverySelector.item.id,
                receivable: data.receivable,
                purchase: data.purchase,
                product: data.product,
                variant: data.variety,
                quantity: data.quantity,
                pricing: data.pricing,
                id: dataSelector.item.id
            },
            delivery: {
                id: deliverySelector.item.id
            },
            receivable: {
                remaining: data.remaining,
                id: data.receivable
            },
            purchase: {
                id: data.purchase
            },
            inventory: {
                product: data.product,
                variant: data.variety,
                category: data.purchase_category,
                delivery: deliverySelector.item.id,
                purchase: data.purchase,
                supplier: data.supplier,
                store: data.store,
                received: data.quantity,
                stocks: data.quantity,
                cost: data.costing,
                base: data.pricing,
                price: data.pricing,
                acquisition: "PROCUREMENT",
                id: dataSelector.item.id
                    ? dataSelector.item.inventory_id
                    : undefined
            }
        }
        await sqlReceipt(formData)
            .unwrap()
            .then(res => {
                if (res.success) {
                    toast.showUpdate("Delivery receipt successfully updated.")
                    onCompleted()
                }
            })
            .catch(err => {
                console.error(err)
                toast.showError("Something went wrong while submitting the data.")
            })
    }

    const closeAppender = useCallback(() => {
        dispatch(resetReceiptInjoiner())
    }, [])

    const inputFormData = {
        id: dataSelector.item.id,
        name: dataSelector.display.name,
        values: values,
        schema: onSchema
    }

    return (
        <DataInjoin
            display={dataSelector.injoiner}
            formData={inputFormData}
            fields={onFields}
            change={onChange}
            submit={onSubmit}
            closecallback={closeAppender}
        />
    )
}

export default ReceiptInjoin
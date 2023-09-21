import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FormatOptionsNoLabel } from "../../../utilities/functions/array.functions"
import { amount } from "../../../utilities/functions/number.funtions"
import { StrFn, isEmpty } from "../../../utilities/functions/string.functions"
import useToast from "../../../utilities/hooks/useToast"
import useYup from "../../../utilities/hooks/useYup"
import DataInjoin from "../../../utilities/interface/datastack/data.injoin"
import FormEl from "../../../utilities/interface/forminput/input.active"
import { useFetchAllSupplierMutation } from "../../library/supplier/supplier.services"
import { useByStocksInventoryMutation } from "../inventory/inventory.services"
import { resetTransmitInjoiner, resetTransmitItem, setTransmitNotifier } from "./transfer.item.reducer"
import { useSqlTransmitMutation } from "./transfer.item.services"

const TransmitInjoin = () => {
    const dataSelector = useSelector(state => state.transmit)
    const transferSelector = useSelector(state => state.transfer)
    const dispatch = useDispatch()
    const [instantiated, setInstantiated] = useState(false)
    const [listener, setListener] = useState()
    const [element, setElement] = useState()
    const [values, setValues] = useState()
    const { yup } = useYup()
    const toast = useToast()

    const [libInventory, setLibInventory] = useState()
    const [libSuppliers, setLibSuppliers] = useState()

    const [stockedInventory] = useByStocksInventoryMutation()
    const [allSuppliers] = useFetchAllSupplierMutation()
    // const [createTransmit] = useCreateTransmitBySqlTransactionMutation()
    // const [updateTransmit] = useUpdateTransmitMutation()
    const [sqlTransmit] = useSqlTransmitMutation()

    useEffect(() => {
        const instantiate = async () => {
            await stockedInventory({ branch: transferSelector.item.source, category: transferSelector.item.category })
                .unwrap()
                .then(res => {
                    if (res.success) {
                        // let array = res?.arrayResult?.filter(arr => arr.store === transferSelector.item.source && arr.category === transferSelector.item.category)?.map(arr => {
                        //     return {
                        //         value: arr.id,
                        //         key: `(ITEM#${StrFn.formatWithZeros(arr.id, 6)}) ${arr.product_name} | ${arr.variant_serial}/${arr.variant_model}/${arr.variant_brand}`,
                        //         data: arr
                        //     }
                        // })
                        let array = res?.arrayResult?.map(arr => {
                            return {
                                value: arr.id,
                                key: `(ITEM#${StrFn.formatWithZeros(arr.id, 6)}) ${arr.product_name} | ${arr.variant_serial || "-"}/${arr.variant_model || "-"}/${arr.variant_brand || "-"}`,
                                data: arr
                            }
                        })
                        setLibInventory([{ value: "", key: "Select inventory item", data: {} }, ...array])
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
        if (dataSelector.injoiner.show && transferSelector.item.id) {
            instantiate()
        }
    }, [transferSelector.item.id, dataSelector.injoiner.show])

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
        if (dataSelector.injoiner.show && instantiated && libInventory.length) {
            let item = dataSelector.item
            let variant = item.variant
                ? `${item.variant_serial}/${item.variant_model}/${item.variant_brand}`
                : ""
            let selection = libInventory?.filter(f => parseInt(f.value) === parseInt(item.item))
            let selected = selection?.length ? selection[0] : undefined
            let source = selected?.data
            setValues({
                item: init(item.item),
                supplier: init(item.inventory_supplier),
                supplier_name: init(item.supplier_name),
                product: init(item.product),
                variety_name: init(variant),
                variety: init(item.variant),
                cost: init(item.inventory_cost),
                pricing: init(item.pricing),
                stocks: init(amount(source?.stocks) + amount(item.quantity)),
                remaining: init(source?.stocks),
                quantity: init(item.quantity),
                category: init(source?.category),
                source: init(item.destination_source),
                destination: transferSelector.item.destination,
            })
        }
    }, [dataSelector.injoiner.show, instantiated, libInventory])

    useEffect(() => {
        if (listener && dataSelector.injoiner.show) {
            if (element === "item") {
                let item = listener[element]
                if (item) {
                    let selection = libInventory?.filter(f => parseInt(f.value) === parseInt(item))
                    let selected = selection?.length ? selection[0] : undefined
                    if (selected?.data) {
                        setValues({
                            supplier: selected?.data?.supplier,
                            supplier_name: provideValueFromLib(libSuppliers, selected?.data?.supplier),
                            product: selected?.data?.product,
                            variety_name: `${selected?.data?.variant_serial} / ${selected?.data?.variant_model} / ${selected?.data?.variant_brand}`,
                            variety: selected?.data?.variant,
                            cost: selected?.data?.cost,
                            pricing: selected?.data?.base,
                            stocks: selected?.data?.stocks,
                            balance: selected?.data?.stocks,
                            remaining: parseInt(selected?.data?.stocks) - parseInt(listener["quantity"] || 0),
                            category: selected?.data?.category,
                            source: selected?.data?.store,
                        })
                        return
                    }
                }
                setValues({
                    supplier: "",
                    supplier_name: "",
                    variety_name: "",
                    variety: "",
                    cost: "",
                    pricing: "",
                    stocks: "",
                    balance: "",
                    remaining: "",
                    category: "",
                    source: "",
                })
            }
            if (element === "quantity") {
                setValues({
                    remaining: parseInt(listener["stocks"] || 0) - parseInt(listener["quantity"] || 0),
                })
            }
        }
    }, [listener, dataSelector.injoiner.show])

    const onFields = (errors, register, values, setValue) => {
        return (
            <>
                <FormEl.Select
                    label='Item Name'
                    register={register}
                    name='item'
                    errors={errors}
                    options={libInventory}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
                <FormEl.Display
                    label='Category'
                    register={register}
                    name='category'
                />
                <FormEl.Display
                    label='Item Source'
                    register={register}
                    name='source'
                />
                <FormEl.Display
                    label='Price'
                    register={register}
                    name='pricing'
                />
                <FormEl.Display
                    label='Available Stocks'
                    register={register}
                    name='stocks'
                />
                <FormEl.Decimal
                    label='Received Qty.'
                    register={register}
                    name='quantity'
                    errors={errors}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
                <FormEl.Display
                    label='Remaining Balance'
                    register={register}
                    name='remaining'
                    errors={errors}
                />
            </>
        )
    }

    const onChange = (values, element) => {
        setListener(values)
        setElement(element)
    }

    const onSchema = yup.object().shape({
        item: yup
            .number()
            .typeError("Inventory item is required")
            .min(1, "Inventory item is required"),
        quantity: yup
            .number()
            .typeError("Received qty is required")
            .min(1, "Received qty is required"),
        remaining: yup
            .number()
            .typeError("Remaining balance is required")
            .min(0, "Exceed the number of allowed received qty."),
    })

    const onCompleted = () => {
        dispatch(setTransmitNotifier(true))
        dispatch(resetTransmitItem())
        dispatch(resetTransmitInjoiner())
    }

    const getQtyDifference = (quantity) => {
        if (dataSelector.item.id) {
            return Math.abs(amount(quantity) - amount(dataSelector.item.quantity))
        }
        return 0
    }

    const getSymbolDifference = (quantity) => {
        if (dataSelector.item.id) {
            let difference = amount(quantity) - amount(dataSelector.item.quantity)
            return difference < 0 ? "+" : "-"
        }
        return "-"
    }

    const onSubmit = async (data) => {
        if (!transferSelector.item.id) return
        let formData = {
            transmit: {
                transfer: transferSelector.item.id,
                item: data.item,
                product: data.product,
                variant: data.variety,
                quantity: data.quantity,
                pricing: data.pricing,
                id: dataSelector.item.id
            },
            transfer: {
                id: transferSelector.item.id
            },
            source: {
                id: data.item,
                operator: getSymbolDifference(data.quantity),
                quantity: dataSelector.item.id
                    ? getQtyDifference(data.quantity)
                    : data.quantity
            },
            destination: {
                product: data.product,
                variant: data.variety,
                category: data.category,
                supplier: data.supplier,
                store: data.destination,
                received: data.quantity,
                stocks: data.quantity,
                cost: data.cost,
                base: data.pricing,
                price: data.pricing,
                acquisition: "TRANSMIT",
                source: data.source,
                transfer: transferSelector.item.id,
                id: dataSelector.item.id
                    ? dataSelector.item.destination_id
                    : undefined
            }
        }
        await sqlTransmit(formData)
            .unwrap()
            .then(res => {
                if (res.success) {
                    toast.showUpdate("Stock transfer successfully updated.")
                    onCompleted()
                }
            })
            .catch(err => console.error(err))
        // let formData = {
        //     ...data,
        //     transfer: transferSelector.item.id,
        //     variant: data.variety,
        // }
        // if (dataSelector.item.id) {
        //     await updateTransmit({ ...formData, id: dataSelector.item.id })
        //         .unwrap()
        //         .then(res => {
        //             if (res.success) {
        //                 toast.showUpdate("Transmit successfully updated.")
        //                 onCompleted()
        //             }
        //         })
        //         .catch(err => console.error(err))
        //     return
        // }
        // await createTransmit(formData)
        //     .unwrap()
        //     .then(res => {
        //         if (res.success) {
        //             toast.showCreate("Transmit successfully created.")
        //             onCompleted()
        //         }
        //     })
        //     .catch(err => console.error(err))
    }

    const closeAppender = useCallback(() => {
        dispatch(resetTransmitInjoiner())
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

export default TransmitInjoin
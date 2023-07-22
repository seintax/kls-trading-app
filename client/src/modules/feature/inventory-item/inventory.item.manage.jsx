import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { provideValueFromLibrary } from "../../../utilities/functions/array.functions"
import { NumFn } from "../../../utilities/functions/number.funtions"
import { isEmpty } from "../../../utilities/functions/string.functions"
import useAuth from "../../../utilities/hooks/useAuth"
import useToast from "../../../utilities/hooks/useToast"
import useYup from "../../../utilities/hooks/useYup"
import DataInputs from "../../../utilities/interface/datastack/data.inputs"
import FormEl from "../../../utilities/interface/forminput/input.active"
import { setInventoryNotifier } from "../inventory/inventory.reducer"
import { resetAdjustmentManager, setAdjustmentNotifier } from "./inventory.item.reducer"
import { useSqlAdjustmentMutation } from "./inventory.item.services"

const AdjustmentManage = () => {
    const auth = useAuth()
    const dataSelector = useSelector(state => state.adjustment)
    const inventorySelector = useSelector(state => state.inventory)
    const dispatch = useDispatch()
    const [instantiated, setInstantiated] = useState(false)
    const [listener, setListener] = useState()
    const [element, setElement] = useState()
    const [values, setValues] = useState()
    const { yup } = useYup()
    const toast = useToast()
    const addition = { operator: "+", operation: "ADDITION" }
    const deduction = { operator: "-", operation: "DEDUCTION" }
    const reasonOptions = [
        { value: "", key: "Select a reason", data: {} },
        { value: "Add Inventory", key: "Add Inventory", data: addition },
        { value: "Deduct Inventory", key: "Deduct Inventory", data: deduction },
        { value: "Loss", key: "Loss", data: deduction },
        { value: "Damaged", key: "Damaged", data: deduction },
    ]

    const [sqlAdjustment] = useSqlAdjustmentMutation()

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
                stocks: init(inventorySelector.item.stocks),
                price: init(NumFn.currency(inventorySelector.item.price)),
                branch: init(inventorySelector.item.store),
                details: init(item.details),
                quantity: init(item.quantity),
            })
        }
    }, [instantiated])

    const onFields = (errors, register, values, setValue) => {
        return (
            <>
                <FormEl.Display
                    label='Available Stocks'
                    register={register}
                    name='stocks'
                />
                <FormEl.Display
                    label='Price'
                    register={register}
                    name='price'
                />
                <FormEl.Display
                    label='Branch'
                    register={register}
                    name='branch'
                />
                <FormEl.Select
                    label='Reason'
                    register={register}
                    name='details'
                    errors={errors}
                    options={reasonOptions}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
                <FormEl.Decimal
                    label='Quantity'
                    register={register}
                    name='quantity'
                    errors={errors}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
                <FormEl.Text
                    label='Remarks'
                    register={register}
                    name='remarks'
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
        details: yup
            .string()
            .required('Reason is required.'),
        quantity: yup
            .number()
            .min(1, "Quantity is required.")
            .typeError('Quantity is required.'),
    })

    const onClose = () => {
        dispatch(resetAdjustmentManager())
    }

    const onCompleted = () => {
        dispatch(setAdjustmentNotifier(true))
        dispatch(setInventoryNotifier(true))
        dispatch(resetAdjustmentManager())
    }

    const onSubmit = async (data) => {
        const formData = {
            adjustment: {
                item: inventorySelector.item.id,
                product: inventorySelector.item.product,
                variant: inventorySelector.item.variant,
                quantity: data.quantity,
                pricing: inventorySelector.item.price,
                operator: provideValueFromLibrary(reasonOptions, data.details).data.operation,
                details: data.details,
                remarks: data.remarks,
                by: auth.id,
                store: inventorySelector.item.store
            },
            inventory: {
                id: inventorySelector.item.id,
                operator: provideValueFromLibrary(reasonOptions, data.details).data.operator,
                quantity: data.quantity,
            }
        }
        await sqlAdjustment(formData)
            .unwrap()
            .then(res => {
                if (res.success) {
                    toast.showCreate("Adjustment successfully created.")
                    onCompleted()
                }
            })
            .catch(err => console.error(err))
        // if (dataSelector.item.id) {
        //     await updateAdjustment({ ...data, id: dataSelector.item.id })
        //         .unwrap()
        //         .then(res => {
        //             if (res.success) {
        //                 toast.showUpdate("Adjustment successfully updated.")
        //                 onCompleted()
        //             }
        //         })
        //         .catch(err => console.error(err))
        //     return
        // }
        // await createAdjustment(data)
        //     .unwrap()
        //     .then(res => {
        //         if (res.success) {
        //             toast.showCreate("Adjustment successfully created.")
        //             onCompleted()
        //         }
        //     })
        //     .catch(err => console.error(err))
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

export default AdjustmentManage
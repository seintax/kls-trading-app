import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { sqlDate } from "../../../utilities/functions/datetime.functions"
import { NumFn } from "../../../utilities/functions/number.funtions"
import { isEmpty } from "../../../utilities/functions/string.functions"
import useToast from "../../../utilities/hooks/useToast"
import useYup from "../../../utilities/hooks/useYup"
import DataInputs from "../../../utilities/interface/datastack/data.inputs"
import FormEl from "../../../utilities/interface/forminput/input.active"
import { resetInventoryManager, setInventoryNotifier } from "./inventory.reducer"
import { useSqlAcquireInventoryMutation } from "./inventory.services"

const InventoryManage = () => {
    const dataSelector = useSelector(state => state.inventory)
    const dispatch = useDispatch()
    const [instantiated, setInstantiated] = useState(false)
    const [listener, setListener] = useState()
    const [element, setElement] = useState()
    const [values, setValues] = useState()
    const { yup } = useYup()
    const toast = useToast()

    const [acquireInventory] = useSqlAcquireInventoryMutation()

    useEffect(() => {
        const instantiate = async () => {
            setInstantiated(true)
        }

        instantiate()
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
                product: init(`${item.product_name} (${item.category}/${item.variant_serial}/${item.variant_model}/${item.variant_brand})`),
                quantity: init(item.received),
                source: init(item.source),
                base: init(NumFn.currency(item.base)),
                sku: init(item.sku),
                barcode: init(item.barcode),
                price: init(item.price),
                alert: init(item.alert, 0),
                arrival: init(sqlDate()),
            })
        }
    }, [instantiated])

    const onFields = (errors, register, values, setValue) => {
        return (
            <>
                <FormEl.Display
                    label='Product'
                    register={register}
                    name='product'
                    wrapper='lg:w-1/2'
                />
                <FormEl.Display
                    label='Quantity'
                    register={register}
                    name='quantity'
                    wrapper='lg:w-1/2'
                />
                <FormEl.Display
                    label='Source'
                    register={register}
                    name='source'
                    wrapper='lg:w-1/2'
                />
                <FormEl.Display
                    label='Price'
                    register={register}
                    name='base'
                    wrapper='lg:w-1/2'
                />
                <FormEl.Date
                    label='Date Received'
                    register={register}
                    name='arrival'
                    errors={errors}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
                <FormEl.Text
                    label='SKU'
                    register={register}
                    name='sku'
                    errors={errors}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
                <FormEl.Text
                    label='Barcode'
                    register={register}
                    name='barcode'
                    errors={errors}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
                <FormEl.Currency
                    label='Branch Price'
                    register={register}
                    name='price'
                    errors={errors}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
                <FormEl.Number
                    label='Alert Level'
                    register={register}
                    name='alert'
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

    useEffect(() => {
        if (listener) {
            // console.log(`${element}`, listener[element])
        }
    }, [listener])

    const onSchema = yup.object().shape({
        arrival: yup
            .date()
            .required('Date received is required.'),
        price: yup
            .number()
            .min(1, 'Branch price is required.')
            .typeError('Branch price is required.'),
    })

    const onClose = () => {
        dispatch(resetInventoryManager())
    }

    const onCompleted = () => {
        dispatch(setInventoryNotifier(true))
        dispatch(resetInventoryManager())
    }

    const onSubmit = async (data) => {
        if (!dataSelector.item.id) {
            toast.showWarning("Item does not exist.")
            return
        }
        const formData = {
            inventory: {
                sku: data.sku,
                barcode: data.barcode,
                price: data.price,
                alert: data.alert,
                acquisition: "TRANSFER",
                id: dataSelector.item.id
            },
            transmit: {
                arrival: data.arrival,
                received: data.quantity,
                id: dataSelector.item.transmit
            },
            transfer: {
                id: dataSelector.item.transfer
            }
        }
        await acquireInventory(formData)
            .unwrap()
            .then(res => {
                if (res.success) {
                    toast.showUpdate("Inventory successfully received and updated.")
                    onCompleted()
                }
            })
            .catch(err => console.error(err))
        return
    }

    const inputFormData = {
        id: dataSelector.item.id,
        name: `!Accept Inventory`,
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

export default InventoryManage
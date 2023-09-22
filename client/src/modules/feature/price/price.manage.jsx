import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { NumFn } from "../../../utilities/functions/number.funtions"
import { isEmpty } from "../../../utilities/functions/string.functions"
import useAuth from "../../../utilities/hooks/useAuth"
import useToast from "../../../utilities/hooks/useToast"
import useYup from "../../../utilities/hooks/useYup"
import DataInputs from "../../../utilities/interface/datastack/data.inputs"
import FormEl from "../../../utilities/interface/forminput/input.active"
import { setInventoryNotifier } from "../inventory/inventory.reducer"
import { resetPriceManager, setPriceNotifier } from "./price.reducer"
import { useCreatePriceMutation, useSqlAdjustPriceMutation, useUpdatePriceMutation } from "./price.services"

const PriceManage = () => {
    const auth = useAuth()
    const dataSelector = useSelector(state => state.price)
    const inventorySelector = useSelector(state => state.inventory)
    const dispatch = useDispatch()
    const [instantiated, setInstantiated] = useState(false)
    const [listener, setListener] = useState()
    const [element, setElement] = useState()
    const [values, setValues] = useState()
    const { yup } = useYup()
    const toast = useToast()

    const [createPrice] = useCreatePriceMutation()
    const [updatePrice] = useUpdatePriceMutation()
    const [sqlAdjustPrice] = useSqlAdjustPriceMutation()

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
        if (instantiated && inventorySelector.item.id) {
            let item = dataSelector.item
            setValues({
                old_price: init(item.old_price, NumFn.acctg.currency(inventorySelector.item.price)),
                new_price: init(item.new_price),
                item: inventorySelector.item.id,
                product: inventorySelector.item.product,
                variant: inventorySelector.item.variant,
                stocks: inventorySelector.item.stocks,
                account: auth.id,
                store: inventorySelector.item.store
            })
        }
    }, [instantiated])

    const onFields = (errors, register, values, setValue) => {
        return (
            <>
                <FormEl.Display
                    label='Old Price'
                    register={register}
                    name='old_price'
                />
                <FormEl.Currency
                    label='New Price'
                    register={register}
                    name='new_price'
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
            // console.info(`${element}`, listener[element])
        }
    }, [listener])

    const onSchema = yup.object().shape({
        new_price: yup
            .number()
            .typeError("New price is required")
            .min(1, "New price is required"),
    })

    const onClose = () => {
        dispatch(resetPriceManager())
    }

    const onCompleted = () => {
        dispatch(setPriceNotifier(true))
        dispatch(setInventoryNotifier(true))
        dispatch(resetPriceManager())
    }

    const onSubmit = async (data) => {
        const formData = {
            price: {
                ...data
            },
            inventory: {
                id: inventorySelector.item.id,
                price: data.new_price
            }
        }
        await sqlAdjustPrice(formData)
            .unwrap()
            .then(res => {
                if (res.success) {
                    toast.showCreate("Price successfully created.")
                    onCompleted()
                }
            })
            .catch(err => console.error(err))
    }

    const inputFormData = {
        id: dataSelector.item.id,
        name: "!Adjust Price",
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

export default PriceManage
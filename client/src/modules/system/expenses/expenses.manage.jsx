import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { amount } from "../../../utilities/functions/number.funtions"
import { isEmpty } from "../../../utilities/functions/string.functions"
import useToast from "../../../utilities/hooks/useToast"
import useYup from "../../../utilities/hooks/useYup"
import DataInputs from "../../../utilities/interface/datastack/data.inputs"
import FormEl from "../../../utilities/interface/forminput/input.active"
import { resetExpensesManager, setExpensesNotifier } from "./expenses.reducer"
import { useCreateExpensesMutation, useUpdateExpensesMutation } from "./expenses.services"

const ExpensesManage = () => {
    const dataSelector = useSelector(state => state.expenses)
    const dispatch = useDispatch()
    const [instantiated, setInstantiated] = useState(false)
    const [listener, setListener] = useState()
    const [element, setElement] = useState()
    const [values, setValues] = useState()
    const { yup } = useYup()
    const toast = useToast()

    const [createExpenses] = useCreateExpensesMutation()
    const [updateExpenses] = useUpdateExpensesMutation()

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
                particulars: init(item.particulars),
                purchase: init(item.purchase),
                cash: init(item.cash),
                change: init(item.change),
                remarks: init(item.remarks),
                notes: init(item.notes),
            })
        }
    }, [instantiated])

    const onFields = (errors, register, values, setValue) => {
        return (
            <>
                <FormEl.Text
                    label='Particulars'
                    register={register}
                    name='particulars'
                    errors={errors}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
                <FormEl.Currency
                    label='Cash-on-Hand'
                    register={register}
                    name='cash'
                    errors={errors}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
                <FormEl.Currency
                    label='Expense'
                    register={register}
                    name='purchase'
                    errors={errors}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
                <FormEl.Currency
                    label='Supplementary'
                    register={register}
                    name='change'
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
                <FormEl.Text
                    label='Notes'
                    register={register}
                    name='notes'
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
        }
    }, [listener])

    const onSchema = yup.object().shape({
        particulars: yup
            .string()
            .required('Particulars is required.'),
        purchase: yup
            .string()
            .required('Purchase amount is required.'),
        cash: yup
            .string()
            .required('Cash-on-Hand is required.'),
    })

    const onClose = () => {
        dispatch(resetExpensesManager())
    }

    const onCompleted = () => {
        dispatch(setExpensesNotifier(true))
        dispatch(resetExpensesManager())
    }

    const onSubmit = async (data) => {
        let balance = amount(data.cash) - (amount(data.purchase) + amount(data.change))
        if (balance !== 0) {
            toast.showWarning("You have entered an imbalance entry.\nPlease settle the discrepancy and try again.")
            return
        }
        if (dataSelector.item.id) {
            await updateExpenses({ ...data, id: dataSelector.item.id })
                .unwrap()
                .then(res => {
                    if (res.success) {
                        toast.showUpdate("Expenses successfully updated.")
                        onCompleted()
                    }
                })
                .catch(err => console.error(err))
            return
        }
        await createExpenses(data)
            .unwrap()
            .then(res => {
                if (res.success) {
                    toast.showCreate("Expenses successfully created.")
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

export default ExpensesManage
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FormatOptionsWithEmptyLabel, FormatOptionsWithNewOption } from "../../../utilities/functions/array.functions"
import { sqlDate } from "../../../utilities/functions/datetime.functions"
import { isEmpty } from "../../../utilities/functions/string.functions"
import useAuth from "../../../utilities/hooks/useAuth"
import useToast from "../../../utilities/hooks/useToast"
import useYup from "../../../utilities/hooks/useYup"
import DataInputs from "../../../utilities/interface/datastack/data.inputs"
import FormEl from "../../../utilities/interface/forminput/input.active"
import { useFetchAllBranchMutation } from "../../library/branch/branch.services"
import { useFetchAllInclusionMutation } from "../../library/inclusion/inclusion.services"
import { resetExpensesManager, setExpensesNotifier } from "./expenses.reducer"
import { useCreateExpensesMutation, useUpdateExpensesMutation } from "./expenses.services"

const ExpensesManage = () => {
    const auth = useAuth()
    const dataSelector = useSelector(state => state.expenses)
    const dispatch = useDispatch()
    const [instantiated, setInstantiated] = useState(false)
    const [listener, setListener] = useState()
    const [element, setElement] = useState()
    const [values, setValues] = useState()
    const { yup } = useYup()
    const toast = useToast()

    const [libInclusion, setLibInclusion] = useState()
    const [libBranches, setLibBranches] = useState()

    const [allBranches] = useFetchAllBranchMutation()
    const [allInclusion] = useFetchAllInclusionMutation()
    const [createExpenses] = useCreateExpensesMutation()
    const [updateExpenses] = useUpdateExpensesMutation()

    useEffect(() => {
        const instantiate = async () => {
            // fetch all library dependencies here. (e.g. dropdown values, etc.)
            await allBranches()
                .unwrap()
                .then(res => {
                    if (res.success) {
                        let branchArr = FormatOptionsWithEmptyLabel(res?.arrayResult, "code", "name", "Select a branch")
                        console.log(branchArr)
                        setLibBranches(FormatOptionsWithNewOption(branchArr, [{
                            value: "BACK-OFFICE",
                            key: "Back Office",
                            data: undefined
                        }]))
                    }
                })
                .catch(err => console.error(err))
            await allInclusion()
                .unwrap()
                .then(res => {
                    if (res.success) {
                        setLibInclusion(FormatOptionsWithEmptyLabel(res?.arrayResult, "name", "name", "Select account inclusion"))
                    }
                })
                .catch(err => console.error(err))
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
                inclusion: init(item.inclusion),
                particulars: init(item.particulars),
                purchase: init(item.purchase),
                // cash: init(item.cash),
                // change: init(item.change),
                // remarks: init(item.remarks),
                account: auth.id,
                date: sqlDate(item.date),
                store: init(item.store)
                // notes: init(item.notes),
            })
        }
    }, [instantiated])

    const onFields = (errors, register, values, setValue) => {
        return (
            <>
                <FormEl.Date
                    label='Date'
                    register={register}
                    name='date'
                    errors={errors}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
                <FormEl.Select
                    label='Account Inclusion'
                    register={register}
                    name='inclusion'
                    errors={errors}
                    options={libInclusion}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
                <FormEl.Text
                    label='Particulars'
                    register={register}
                    name='particulars'
                    errors={errors}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
                {/* <FormEl.Currency
                    label='Cash-on-Hand'
                    register={register}
                    name='cash'
                    errors={errors}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                /> */}
                <FormEl.Currency
                    label='Amount'
                    register={register}
                    name='purchase'
                    errors={errors}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
                {/* <FormEl.Currency
                    label='Supplementary'
                    register={register}
                    name='change'
                    errors={errors}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                /> */}
                {/* <FormEl.Text
                    label='Notes'
                    register={register}
                    name='notes'
                    errors={errors}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                /> */}
                <FormEl.Select
                    label='Branch'
                    register={register}
                    name='store'
                    errors={errors}
                    options={libBranches}
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
        inclusion: yup
            .string()
            .required('Account inclusion is required.'),
        particulars: yup
            .string()
            .required('Particulars is required.'),
        purchase: yup
            .string()
            .required('Purchase amount is required.'),
        store: yup
            .string()
            .required('Branch is required.'),
    })

    const onClose = () => {
        dispatch(resetExpensesManager())
    }

    const onCompleted = () => {
        dispatch(setExpensesNotifier(true))
        dispatch(resetExpensesManager())
    }

    const onSubmit = async (data) => {
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
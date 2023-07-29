import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { shortDate, sqlDate } from "../../../utilities/functions/datetime.functions"
import { NumFn, amount } from "../../../utilities/functions/number.funtions"
import { isEmpty } from "../../../utilities/functions/string.functions"
import useAuth from "../../../utilities/hooks/useAuth"
import useToast from "../../../utilities/hooks/useToast"
import useYup from "../../../utilities/hooks/useYup"
import DataInputs from "../../../utilities/interface/datastack/data.inputs"
import FormEl from "../../../utilities/interface/forminput/input.active"
import { useSqlChequePaymentMutation } from "../payment/payment.services"
import { resetChequeManager, setChequeNotifier } from "./cheque.reducer"

const ChequeManage = () => {
    const auth = useAuth()
    const dataSelector = useSelector(state => state.cheque)
    const dispatch = useDispatch()
    const [instantiated, setInstantiated] = useState(false)
    const [listener, setListener] = useState()
    const [element, setElement] = useState()
    const [values, setValues] = useState()
    const [replace, setReplace] = useState(false)
    const { yup } = useYup()
    const toast = useToast()
    const statusOptions = [
        { value: "", key: "Select cheque status" },
        { value: "UNCLAIMED", key: "UNCLAIMED" },
        { value: "CLAIMED", key: "CLAIMED" },
        { value: "CANCELLED", key: "CANCELLED" },
        { value: "PAID WITH CASH", key: "PAID WITH CASH" },
        { value: "PAID WITH OTHER METHOD", key: "PAID WITH OTHER METHOD" },
        { value: "CHEQUE REPLACEMENT", key: "CHEQUE REPLACEMENT" },
    ]

    const [sqlChequePayment] = useSqlChequePaymentMutation()

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
                status: init(item.refstat),
                amount: init(NumFn.currency(item.amount)),
                oldcode: init(item.refcode),
                olddate: init(shortDate(item.refdate)),
                refdate: sqlDate()
            })
        }
    }, [instantiated])

    useEffect(() => {
        if (listener && dataSelector.manager) {
            if (element === "status") {
                let status = listener[element]
                if (status === "CHEQUE REPLACEMENT") {
                    setReplace(true)
                    return
                }
                setReplace(false)
            }
        }
    }, [listener, dataSelector.manager])

    const onFields = (errors, register, values, setValue) => {
        return (
            <>
                <FormEl.Display
                    label='Amount'
                    register={register}
                    name='amount'
                />
                <FormEl.Display
                    label='Cheque No.'
                    register={register}
                    name='oldcode'
                />
                <FormEl.Display
                    label='Cheque Date.'
                    register={register}
                    name='olddate'
                />
                <FormEl.Select
                    label='Cheque Status'
                    register={register}
                    name='status'
                    errors={errors}
                    options={statusOptions}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
                <div className={`flex flex-col ${replace ? "" : "hidden"}`}>
                    <FormEl.Text
                        label='Cheque Replacement No.'
                        register={register}
                        name='refcode'
                        errors={errors}
                        autoComplete='off'
                        wrapper='lg:w-1/2'
                    />
                    <FormEl.Date
                        label='Cheque Replacement Date'
                        register={register}
                        name='refdate'
                        errors={errors}
                        autoComplete='off'
                        wrapper='lg:w-1/2'
                    />
                </div>
            </>
        )
    }

    const onChange = (values, element) => {
        setListener(values)
        setElement(element)
    }

    const onSchema = yup.object().shape({
        status: yup
            .string()
            .required('Cheque status is required.'),
    })

    const onClose = () => {
        dispatch(resetChequeManager())
    }

    const onCompleted = () => {
        dispatch(setChequeNotifier(true))
        dispatch(resetChequeManager())
    }

    const onSubmit = async (data) => {
        if (!dataSelector.item.id) return
        if (data.status === "CHEQUE REPLACEMENT") {
            if (isEmpty(data.refcode)) {
                toast.showWarning("Replacement cheque no. is empty.")
                return
            }
            if (sqlDate(data.refdate) === sqlDate()) {
                toast.showWarning("Replacement cheque date is set to the current date.")
                return
            }
        }
        let formData = {
            payment: {
                refstat: data.status,
                id: dataSelector.item.id
            }
        }
        if (data.status === "CHEQUE REPLACEMENT") {
            formData = {
                ...formData,
                payment: {
                    ...formData.payment,
                    refcode: data.refcode,
                    refdate: data.refdate,
                    refstat: "UNCLAIMED",
                },
                cheque: {
                    payment: dataSelector.item.id,
                    amount: amount(dataSelector.item.amount || 0),
                    oldcode: dataSelector.item.refcode,
                    olddate: sqlDate(dataSelector.item.olddate),
                    refcode: data.refcode,
                    refdate: data.refdate,
                    account: auth.id
                }
            }
        }
        await sqlChequePayment(formData)
            .unwrap()
            .then(res => {
                if (res.success) {
                    toast.showCreate("Cheque status successfully updated.")
                    onCompleted()
                }
            })
            .catch(err => console.error(err))
    }

    const inputFormData = {
        id: dataSelector.item.id,
        name: `!Update Cheque Status`,
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

export default ChequeManage
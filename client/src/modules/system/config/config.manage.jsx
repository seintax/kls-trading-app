import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { isEmpty } from "../../../utilities/functions/string.functions"
import useAuth from "../../../utilities/hooks/useAuth"
import useToast from "../../../utilities/hooks/useToast"
import useYup from "../../../utilities/hooks/useYup"
import DataInputs from "../../../utilities/interface/datastack/data.inputs"
import FormEl from "../../../utilities/interface/forminput/input.active"
import { resetSettingsManager, setSettingsConfig, setSettingsNotifier, setSettingsUpdater } from "./config.reducer"
import { useCreateConfigMutation, useUpdateConfigMutation } from "./config.services"

const ConfigManage = () => {
    const auth = useAuth()
    const dataSelector = useSelector(state => state.settings)
    const dispatch = useDispatch()
    const [instantiated, setInstantiated] = useState(false)
    const [listener, setListener] = useState()
    const [element, setElement] = useState()
    const [values, setValues] = useState()
    const { yup } = useYup()
    const toast = useToast()

    const [createConfig] = useCreateConfigMutation()
    const [updateConfig] = useUpdateConfigMutation()

    useEffect(() => {
        const instantiate = async () => {
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
            let item = dataSelector?.item?.json
            setValues({
                discount: init(item?.discount, "Amount"),
                ratelimit: init(item?.ratelimit, "100"),
                shownetdiscount: init(item?.shownetdiscount, "Yes"),
                simplifiedcashering: init(item?.simplifiedcashering, "No")
            })
        }
    }, [instantiated, dataSelector?.item])


    const YesNoOption = [
        { value: "Yes", key: "Yes" },
        { value: "No", key: "No" }
    ]

    const onFields = (errors, register, values, setValue) => {
        return (
            <>
                <div className="mb-3 text-gray-500 text-sm">Cashier Configuration:</div>
                <FormEl.Select
                    label='Default Discount Option'
                    register={register}
                    name='discount'
                    errors={errors}
                    options={[
                        { value: "", key: "Select a default option" },
                        { value: "Amount", key: "Amount" },
                        { value: "Percent", key: "Percent" }
                    ]}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
                <FormEl.Number
                    label='Maximum Allowed Discount Rate (1%-100%)'
                    register={register}
                    name='ratelimit'
                    errors={errors}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
                <FormEl.Select
                    label='Show Net Discount on Checkout'
                    register={register}
                    name='shownetdiscount'
                    errors={errors}
                    options={YesNoOption}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
                <FormEl.Select
                    label='Simplified Cashering'
                    register={register}
                    name='simplifiedcashering'
                    errors={errors}
                    options={YesNoOption}
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
        discount: yup
            .string()
            .required('Field is required.'),
        ratelimit: yup
            .string()
            .min(1, "Minumum input is 1.")
            .max(100, "Maximum input is 100.")
            .typeError('Field is required.'),
        shownetdiscount: yup
            .string()
            .required('Field is required.'),
    })

    const onClose = useCallback(() => {
        dispatch(resetSettingsManager())
    }, [])

    const onCompleted = () => {
        dispatch(setSettingsNotifier(true))
        dispatch(setSettingsUpdater(true))
        dispatch(resetSettingsManager())
    }

    const onSubmit = async (data) => {
        const formData = {
            account: auth.id,
            json: JSON.stringify({
                discount: data.discount,
                ratelimit: data.ratelimit,
                shownetdiscount: data.shownetdiscount,
                simplifiedcashering: data.simplifiedcashering
            })
        }
        if (dataSelector.item.id) {
            await updateConfig({ ...formData, id: dataSelector.item.id })
                .unwrap()
                .then(res => {
                    if (res.success) {
                        toast.showUpdate("Config successfully updated.")
                        dispatch(setSettingsConfig(data))
                        onCompleted()
                    }
                })
                .catch(err => console.error(err))
            return
        }
        await createConfig(formData)
            .unwrap()
            .then(res => {
                if (res.success) {
                    toast.showCreate("Config successfully created.")
                    dispatch(setSettingsConfig(data))
                    onCompleted()
                }
            })
            .catch(err => console.error(err))
    }

    const inputFormData = {
        id: dataSelector?.item?.id,
        name: `!${dataSelector?.display?.name}`,
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

export default ConfigManage
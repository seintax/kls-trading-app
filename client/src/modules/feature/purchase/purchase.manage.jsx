import { PencilSquareIcon } from "@heroicons/react/20/solid"
import moment from "moment"
import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FormatOptionsWithEmptyLabel } from "../../../utilities/functions/array.functions"
import { longDate, sqlDate } from "../../../utilities/functions/datetime.functions"
import { StrFn, isEmpty } from "../../../utilities/functions/string.functions"
import useAuth from "../../../utilities/hooks/useAuth"
import useToast from "../../../utilities/hooks/useToast"
import useYup from "../../../utilities/hooks/useYup"
import DataHeader from "../../../utilities/interface/datastack/data.header"
import DataInputs from "../../../utilities/interface/datastack/data.inputs"
import FormEl from "../../../utilities/interface/forminput/input.active"
import { useFetchAllBranchMutation } from "../../library/branch/branch.services"
import { useFetchAllCategoryMutation } from "../../library/category/category.services"
import { useFetchAllSupplierMutation } from "../../library/supplier/supplier.services"
import ReceivableListing from "../purchase-item/purchase.item.listing"
import { resetReceivableCache } from "../purchase-item/purchase.item.reducer"
import { resetPurchaseManager, setPurchaseNotifier, showPurchaseSelector } from "./purchase.reducer"
import { useCreatePurchaseMutation, useUpdatePurchaseMutation } from "./purchase.services"

const PurchaseManage = () => {
    const auth = useAuth()
    const dataSelector = useSelector(state => state.purchase)
    const receivableSelector = useSelector(state => state.receivable)
    const dispatch = useDispatch()
    const [instantiated, setInstantiated] = useState(false)
    const [listener, setListener] = useState()
    const [element, setElement] = useState()
    const [editMode, setEditMode] = useState(dataSelector?.item?.id ? false : true)
    const [values, setValues] = useState()
    const { yup } = useYup()
    const toast = useToast()

    const [libBranches, setLibBranches] = useState()
    const [libCategories, setLibCategories] = useState()
    const [libSuppliers, setLibSuppliers] = useState()

    const [allBranches] = useFetchAllBranchMutation()
    const [allCategories] = useFetchAllCategoryMutation()
    const [allSuppliers] = useFetchAllSupplierMutation()
    const [createPurchase] = useCreatePurchaseMutation()
    const [updatePurchase] = useUpdatePurchaseMutation()

    useEffect(() => {
        const instantiate = async () => {
            await allBranches()
                .unwrap()
                .then(res => {
                    if (res.success) {
                        setLibBranches(FormatOptionsWithEmptyLabel(res?.arrayResult, "code", "name", "Select branch"))
                    }
                })
                .catch(err => console.error(err))
            await allCategories()
                .unwrap()
                .then(res => {
                    if (res.success) {
                        setLibCategories(FormatOptionsWithEmptyLabel(res?.arrayResult, "name", "name", "Select category"))
                    }
                })
                .catch(err => console.error(err))
            await allSuppliers()
                .unwrap()
                .then(res => {
                    if (res.success) {
                        setLibSuppliers(FormatOptionsWithEmptyLabel(res?.arrayResult, "id", "name", "Select supplier"))
                    }
                })
                .catch(err => console.error(err))
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
                date: init(sqlDate(item.date)),
                store: init(item.store),
                category: init(item.category),
                supplier: init(item.supplier),
                by: init(item.by || auth.id)
            })
        }
    }, [instantiated])

    const onFields = (errors, register, values, setValue) => {
        return (
            <>
                <FormEl.Date
                    label='Purchase Order Date'
                    register={register}
                    name='date'
                    errors={errors}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
                <FormEl.Select
                    label='For Branch'
                    register={register}
                    name='store'
                    errors={errors}
                    options={libBranches}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
                <FormEl.Select
                    label='Supplier'
                    register={register}
                    name='supplier'
                    errors={errors}
                    options={libSuppliers}
                    autoComplete='off'
                    wrapper='lg:w-1/2'
                />
                <FormEl.Select
                    label='Category'
                    register={register}
                    name='category'
                    errors={errors}
                    options={libCategories}
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
        store: yup
            .string()
            .required('Branch is required.'),
        category: yup
            .string()
            .required('Category is required.'),
        supplier: yup
            .number()
            .min(1, 'Supplier is required.'),
    })

    const onClose = useCallback(() => {
        setEditMode(false)
    }, [])

    const onCompleted = (id = undefined) => {
        dispatch(setPurchaseNotifier(true))
        if (id) dispatch(showPurchaseSelector(id))
        setEditMode(false)
    }

    const onSubmit = async (data) => {
        if (dataSelector.item.id) {
            if (receivableSelector.data?.length) {
                let sortByCategory = receivableSelector.data?.filter(f => f.purchase_category === data?.category)
                if (sortByCategory.length !== receivableSelector.data?.length) {
                    toast.showWarning("Cannot change category when purchase order items contains unsimilar category.")
                    return
                }
            }
            await updatePurchase({ ...data, id: dataSelector.item.id })
                .unwrap()
                .then(res => {
                    if (res.success) {
                        toast.showUpdate("Purchase order successfully updated.")
                        onCompleted(dataSelector.item.id)
                    }
                })
                .catch(err => console.error(err))
            return
        }
        await createPurchase(data)
            .unwrap()
            .then(res => {
                if (res.success) {
                    toast.showCreate("Purchase order successfully created.")
                    onCompleted(res.insertResult.id)
                }
            })
            .catch(err => console.error(err))
    }

    const inputFormData = {
        id: dataSelector.item.id,
        name: `${dataSelector.display.name}`,
        values: values,
        schema: onSchema
    }

    const returnToList = useCallback(() => {
        dispatch(resetPurchaseManager())
        dispatch(resetReceivableCache())
    }, [])

    const printOrder = useCallback(() => {
        if (receivableSelector.data?.length) {
            localStorage.setItem("purchase", JSON.stringify({
                title: `Purchase Order PO-${StrFn.formatWithZeros(dataSelector.item.id, 5)}`,
                info: dataSelector.item,
                data: receivableSelector.data
            }))
            window.open(`/#/print/purchase/${moment(new Date()).format("MMDDYYYY")}${StrFn.formatWithZeros(dataSelector.item.id, 5)}`, '_blank')
        }
    }, [receivableSelector.data, dataSelector.item])

    const onEdit = () => {
        setEditMode(true)
    }

    const provideValueFromLib = (arrayData, valueSought) => {
        if (instantiated && valueSought && arrayData) {
            let array = arrayData?.filter(arr => arr.value === valueSought)
            let value = array?.length ? array[0] : undefined
            return value?.key
        }
        return ""
    }

    return (
        <div className="w-full flex flex-col gap-5 -mt-5 lg:mt-0">
            <div className="w-full sticky -top-5 pt-5 lg:pt-0 z-10">
                <DataHeader name="Purchase Order" returncallback={returnToList} printcallback={printOrder} />
            </div>

            <div className="w-full border border-b-1 border-b-gray-400">
                {
                    (editMode) ? (
                        <DataInputs
                            formData={inputFormData}
                            fields={onFields}
                            change={onChange}
                            submit={onSubmit}
                            closed={dataSelector.item.id ? onClose : undefined}
                            listing={true}
                            header={false}
                        />
                    ) : (
                        <div className="w-full h-full pt-2 pb-5 px-2">
                            <div className="flex flex-col gap-3 h-full px-6 py-4 shadow bg-white rounded">
                                <FormEl.Item
                                    label="Purchase Order Date"
                                    value={longDate(dataSelector?.item?.date)}
                                    style="text-sm lg:w-1/2"
                                />
                                <FormEl.Item
                                    label="For Branch"
                                    value={provideValueFromLib(libBranches, dataSelector?.item?.store)}
                                    style="text-sm lg:w-1/2"
                                />
                                <FormEl.Item
                                    label="Supplier"
                                    value={provideValueFromLib(libSuppliers, dataSelector?.item?.supplier)}
                                    style="text-sm lg:w-1/2"
                                />
                                <FormEl.Item
                                    label="Category"
                                    value={provideValueFromLib(libCategories, dataSelector?.item?.category)}
                                    style="text-sm lg:w-1/2"
                                />
                                <div className="w-full">
                                    <div className=" pt-4 flex justify-end">
                                        <button
                                            type="button"
                                            className="button-submit flex gap-3 items-center"
                                            onClick={() => onEdit()}
                                        >
                                            <PencilSquareIcon className="w-4 h-4" /> Edit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
            <div className="w-full min-h-[100px]">
                <ReceivableListing />
            </div>
        </div>
    )
}

export default PurchaseManage
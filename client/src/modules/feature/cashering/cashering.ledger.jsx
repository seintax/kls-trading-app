import { Transition } from "@headlessui/react"
import { ArrowLeftIcon } from "@heroicons/react/20/solid"
import moment from "moment"
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { sortBy } from "../../../utilities/functions/array.functions"
import { longDate } from "../../../utilities/functions/datetime.functions"
import { NumFn, amount } from "../../../utilities/functions/number.funtions"
import { formatVariant } from "../../../utilities/functions/string.functions"
import useAuth from "../../../utilities/hooks/useAuth"
import useToast from "../../../utilities/hooks/useToast"
import DataOperation from "../../../utilities/interface/datastack/data.operation"
import { useDistinctBranchMutation } from "../../library/branch/branch.services"
import { useByCodeDispensingMutation, useByCodeReturnedMutation } from "../browser/browser.services"
import { resetCreditItem, setCreditItem } from "../credit/credit.reducer"
import { useByFirstCreditMutation, useByOngoingCreditMutation } from "../credit/credit.services"
import CasheringLedgerPurchase from "./cashering.ledger.purchase"
import CasheringLedgerReturned from "./cashering.ledger.returned"
import { resetTransactionLedger } from "./cashering.reducer"
import { setDispensingData, setDispensingItem, setDispensingNotifier, showDispensingManager } from "./dispensing.reducer"
import { setReimburseTotal, showReimburseManager } from "./reimburse.reducer"
import { setReturnedData, setReturnedNotifier } from "./returned.reducer"

const CasheringLedger = () => {
    const qtyRef = useRef(null)
    const auth = useAuth()
    const dataSelector = useSelector(state => state.transaction)
    const dispensingSelector = useSelector(state => state.dispensing)
    const returnedSelector = useSelector(state => state.returned)
    const printingSelector = useSelector(state => state.printing)
    const creditSelector = useSelector(state => state.credit)
    const dispatch = useDispatch()
    const [branch, setBranch] = useState()
    const [records, setrecords] = useState()
    const [credits, setCredits] = useState()
    const [sorted, setsorted] = useState()
    const [tab, setTab] = useState("DISPENSE")
    const columns = dispensingSelector.header
    const toast = useToast()

    const [distinctBranch] = useDistinctBranchMutation()
    const [firstCredit] = useByFirstCreditMutation()
    const [byCodeDispensing, { isLoading: dispensedLoading }] = useByCodeDispensingMutation()
    const [byCodeReturned, { isLoading: returnedLoading }] = useByCodeReturnedMutation()
    const [byOngoingCredit] = useByOngoingCreditMutation()

    useEffect(() => {
        const instantiate = async () => {
            await distinctBranch({ code: auth.store })
                .unwrap()
                .then(res => {
                    if (res.success) {
                        setBranch(res.distinctResult)
                    }
                })
                .catch(err => console.error(err))
        }

        instantiate()
    }, [])

    useEffect(() => {
        const instantiate = async () => {
            await byCodeDispensing({ code: dataSelector.item.code })
                .unwrap()
                .then(res => {
                    if (res.success) {
                        let dispensed = res?.arrayResult?.map(item => {
                            return {
                                ...item,
                                remaintotal: item.total,
                                remainvat: item.vat,
                                remainless: item.less,
                                remainnet: item.net,
                            }
                        })
                        dispatch(setDispensingData(dispensed))
                        dispatch(setDispensingNotifier(false))
                    }
                })
                .catch(err => console.error(err))
            await byCodeReturned({ code: dataSelector.item.code })
                .unwrap()
                .then(res => {
                    if (res.success) {
                        dispatch(setReturnedData(res?.arrayResult))
                        dispatch(setReturnedNotifier(false))
                    }
                })
                .catch(err => console.error(err))
            await firstCredit({ code: dataSelector.item.code })
                .unwrap()
                .then(res => {
                    if (res.success) {
                        setCredits(res.distinctResult.data.length === 1 ? res.distinctResult.data[0] : undefined)
                    }
                })
                .catch(err => console.error(err))
            return
        }
        if (dataSelector.item.code || dispensingSelector.notifier || returnedSelector.notifier) {
            instantiate()
        }
    }, [dataSelector.item.code, dispensingSelector.notifier, returnedSelector.notifier])

    useEffect(() => {
        if (dataSelector.ledger) {
            setTab("DISPENSE")
            const asyncFunc = async () => {
                await byOngoingCredit({ code: dataSelector.item.code })
                    .unwrap()
                    .then(res => {
                        if (res.success) {
                            console.log(res)
                            if (res.recordCount > 0) {
                                dispatch(setCreditItem(res?.arrayResult[0]))
                                return
                            }
                            dispatch(resetCreditItem())
                        }
                    })
                    .catch(err => console.error(err))
            }
            asyncFunc()
        }
    }, [dataSelector.ledger])

    const selectItem = (item) => {
        dispatch(setDispensingItem(item))
        dispatch(showDispensingManager())
    }

    const actions = (item) => {
        return [
            { type: 'button', trigger: () => selectItem(item), label: 'Return' },
        ]
    }

    const items = (item) => {
        return [
            {
                value:
                    <div className="flex gap-1 flex-wrap">
                        <span className="bg-white px-1 rounded-md border border-gray-500">
                            {item.product_name}
                        </span>
                        <span className={`${item.category ? "" : "hidden"} bg-gradient-to-b from-white to-red-200 px-1 rounded-md border border-gray-400`}>
                            {item.category}
                        </span>
                        <span className={`${item.variant_serial?.replaceAll("-", "") ? "" : "hidden"} bg-gradient-to-b from-white to-blue-200 px-1 rounded-md border border-gray-400`}>
                            {item.variant_serial}
                        </span>
                        <span className={`${item.variant_model?.replaceAll("-", "") ? "" : "hidden"} bg-gradient-to-b from-white to-blue-200 px-1 rounded-md border border-gray-400`}>
                            {item.variant_model}
                        </span>
                        <span className={`${item.variant_brand?.replaceAll("-", "") ? "" : "hidden"} bg-gradient-to-b from-white to-blue-200 px-1 rounded-md border border-gray-400`}>
                            {item.variant_brand}
                        </span>
                        <span className={`${item.inventory_supplier ? "" : "hidden"} bg-gradient-to-b from-white to-green-200 px-1 rounded-md border border-gray-400`}>
                            Supplier: {item.supplier_name}
                        </span>
                    </div>
            },
            { value: NumFn.currency(item.price) },
            { value: item.dispense },
            { value: NumFn.currency(item.total) },
            { value: NumFn.currency(item.less) },
            { value: NumFn.currency(item.net) },
            { value: item.toreturn || "" },
            { value: <DataOperation actions={actions(item)} /> }
        ]
    }

    useEffect(() => {
        if (dispensingSelector?.data) {
            let data = sorted
                ? sortBy(dispensingSelector?.data, sorted)
                : dispensingSelector?.data
            setrecords(data?.map((item, i) => {
                return {
                    key: item.id,
                    items: items(item),
                    ondoubleclick: () => { },
                }
            }))
        }
    }, [dispensingSelector?.data, sorted])

    const toggleOffLedger = () => {
        dispatch(resetTransactionLedger())
    }

    const onSubmit = () => {
        if (returnedLoading || dispensedLoading) {
            toast.showWarning("Please wait for the page data to be fully loaded.")
            return
        }
        let hasReturn = dispensingSelector?.data?.filter(f => f.toreturn > 0).length > 0
        if (hasReturn) {
            let returns = dispensingSelector?.data?.filter(f => f.toreturn > 0)
            let returnNet = returns?.reduce((prev, curr) => prev + amount(curr.returnnet), 0)
            dispatch(setReimburseTotal(returnNet))
            dispatch(showReimburseManager())
        }
    }

    const onPrint = () => {
        let credit = amount(credits?.total) - amount(credits?.partial)
        let printdata = {
            branch: branch?.data?.name || printingSelector.defaults.branch,
            address: branch?.data?.address || printingSelector.defaults.address,
            service: printingSelector.defaults.service,
            subtext: printingSelector.defaults.subtext,
            contact: branch?.data?.contact || printingSelector.defaults.contact,
            customer: {
                name: dataSelector.item.customer_name,
                address: dataSelector.item.customer_address
            },
            cashier: auth.name,
            transaction: dataSelector.item.code,
            items: dispensingSelector.data?.map(item => {
                let total = amount(item.dispense) * amount(item.price)
                let less = total * amount(dataSelector.item.discount)
                return {
                    product: `${item.product_name} (${formatVariant(item.variant_serial, item.variant_model, item.variant_brand)})`,
                    quantity: item.dispense,
                    price: item.price,
                    item: item.id,
                    total: total,
                    less: amount(less) + amount(item.markdown),
                }
            }),
            discount: {
                rate: dataSelector.item.discount * 100,
                amount: amount(dataSelector.item.less) + amount(dataSelector.item.markdown)
            },
            total: dataSelector.item.net,
            cash: credit > 0 ? credits.partial : dataSelector.item.tended,
            change: dataSelector.item.change,
            credit: credit,
            reprint: true
        }
        localStorage.setItem("rcpt", JSON.stringify(printdata))
        window.open(`/#/print/receipt/${dataSelector.item.code}${moment(new Date()).format("MMDDYYYYHHmmss")}`, '_blank')
    }

    return (
        <>
            <Transition
                show={dataSelector.ledger}
                enter="transition-opacity ease-linear duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                className={`fixed left-16 lg:left-56 top-12 lg:top-24 mt-2 h-full w-full bg-gradient-to-r from-[#00000070] via-[#00000070] to-[#00000040] z-10 flex items-start justify-end`}
            >
                <Transition.Child
                    enter="transition ease-in-out duration-500 transform"
                    enterFrom="translate-y-full"
                    enterTo="translate-y-0"
                    leave="transition ease-in-out duration-500 transform"
                    leaveFrom="translate-y-0"
                    leaveTo="translate-y-full"
                    className="flex flex-col gap-2 bg-white px-3 w-full h-full text-sm mt-1 pr-20 lg:pr-60 pb-[70px]"
                >
                    <div className="pl-1 pt-3 text-secondary-500 font-bold text-lg flex items-center gap-4">
                        <ArrowLeftIcon className="w-6 h-6 cursor-pointer" onClick={() => toggleOffLedger()} />
                        <span>Transaction Ledger:</span>
                        <span>{dataSelector.item.customer_name}</span>
                    </div>
                    <div className="px-1 flex flex-wrap justify-start lg:justify-start my-4 gap-2 lg:gap-3">
                        <div className="lg:min-w-[200px] lg:w-1/7 flex flex-col px-2 md:px-4 py-0.5 md:py-2 lg:px-3 bg-gradient-to-b from-white via-white to-primary-200 border border-secondary-500 gap-1 rounded-md text-xs md:text-base">
                            <span className="text-[10px] md:text-xs text-gray-500 no-select">
                                Transaction No.
                            </span>
                            <div>{dataSelector.item.code}</div>
                        </div>
                        <div className="lg:min-w-[200px] lg:w-1/7 flex flex-col px-2 md:px-4 py-0.5 md:py-2 lg:px-3 bg-gradient-to-b from-white via-white to-primary-200 border border-secondary-500 gap-1 rounded-md text-xs md:text-base">
                            <span className="text-[10px] md:text-xs text-gray-500 no-select">
                                Type
                            </span>
                            <div>{dataSelector.item.method}</div>
                        </div>
                        <div className="lg:min-w-[200px] lg:w-1/7 flex flex-col px-2 md:px-4 py-0.5 md:py-2 lg:px-3 bg-gradient-to-b from-white via-white to-primary-200 border border-secondary-500 gap-1 rounded-md text-xs md:text-base">
                            <span className="text-[10px] md:text-xs text-gray-500 no-select">
                                Status
                            </span>
                            <div>{dataSelector.item.status}</div>
                        </div>
                        <div className="lg:min-w-[200px] lg:w-1/7 flex flex-col px-2 md:px-4 py-0.5 md:py-2 lg:px-3 bg-gradient-to-b from-white via-white to-primary-200 border border-secondary-500 gap-1 rounded-md text-xs md:text-base">
                            <span className="text-[10px] md:text-xs text-gray-500 no-select">
                                Total
                            </span>
                            <div>{NumFn.currency(dataSelector.item.total)}</div>
                        </div>
                        <div className="lg:min-w-[200px] lg:w-1/7 flex flex-col px-2 md:px-4 py-0.5 md:py-2 lg:px-3 bg-gradient-to-b from-white via-white to-primary-200 border border-secondary-500 gap-1 rounded-md text-xs md:text-base">
                            <span className="text-[10px] md:text-xs text-gray-500 no-select">
                                Less
                            </span>
                            <div>{NumFn.currency(dataSelector.item.less + dataSelector.item.markdown)}</div>
                        </div>
                        <div className="lg:min-w-[200px] lg:w-1/7 flex flex-col px-2 md:px-4 py-0.5 md:py-2 lg:px-3 bg-gradient-to-b from-white via-white to-primary-200 border border-secondary-500 gap-1 rounded-md text-xs md:text-base">
                            <span className="text-[10px] md:text-xs text-gray-500 no-select">
                                Net
                            </span>
                            <div>{NumFn.currency(dataSelector.item.net)}</div>
                        </div>
                        <div className="lg:min-w-[200px] lg:w-1/7 flex flex-col px-2 md:px-4 py-0.5 md:py-2 lg:px-3 bg-gradient-to-b from-white via-white to-primary-200 border border-secondary-500 gap-1 rounded-md text-xs md:text-base">
                            <span className="text-[10px] md:text-xs text-gray-500 no-select">
                                Date
                            </span>
                            <div>{longDate(dataSelector.item.date)}</div>
                        </div>
                        <div className="lg:min-w-[200px] lg:w-1/7 flex flex-col px-2 md:px-4 py-0.5 md:py-2 lg:px-3 bg-gradient-to-b from-white via-white to-primary-200 border border-secondary-500 gap-1 rounded-md text-xs md:text-base">
                            <span className="text-[10px] md:text-xs text-gray-500 no-select">
                                Partial (For Credit)
                            </span>
                            <div>{NumFn.currency(dataSelector.item.partial)}</div>
                        </div>
                    </div>
                    <div className="w-full h-full overflow-y-scroll px-5 pb-5 lg:pb-12 bg-gray-300">
                        <div className="pt-5 px-3 text-sm md:text-base">Returned:</div>
                        <CasheringLedgerReturned />
                        <div className="pt-5 px-3 text-sm md:text-base">Purchased:</div>
                        <CasheringLedgerPurchase />
                        <div className="py-1 w-full flex flex-col gap-2 lg:gap-0 lg:flex-row justify-between mt-3">
                            <button className="button-blue w-full lg:w-fit text-lg" onClick={() => onPrint()}>Reprint Receipt</button>
                            <button className="button-link w-full lg:w-fit text-lg" disabled={returnedLoading || dispensedLoading} onClick={() => onSubmit()}>Save Changes</button>
                        </div>
                    </div>

                </Transition.Child>
            </Transition >
        </>
    )
}

export default CasheringLedger
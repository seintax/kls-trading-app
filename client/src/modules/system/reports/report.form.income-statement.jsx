import { ArrowPathIcon, PlusIcon, PresentationChartLineIcon, PrinterIcon } from "@heroicons/react/24/outline"
import moment from "moment"
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import Datepicker from "react-tailwindcss-datepicker"
import { checkForSeparateMonths, firstDayOfTheMonth, lastDayOfTheMonth, sqlDate, uniqueMonthFromDates, uniqueYearFromDates } from "../../../utilities/functions/datetime.functions"
import { NumFn } from "../../../utilities/functions/number.funtions"
import { StrFn, StringHash, getBranch, isEmpty } from "../../../utilities/functions/string.functions"
import useAuth from "../../../utilities/hooks/useAuth"
import useToast from "../../../utilities/hooks/useToast"
import { useFetchAllBranchMutation } from "../../library/branch/branch.services"
import { useFetchAllCategoryMutation } from "../../library/category/category.services"
import { useCreatePrintsMutation } from "../prints/print.services"
import { useExpensesIncomeMutation, useGoodsInIncomeMutation, useGoodsOutIncomeMutation, usePurchasesIncomeMutation, useSalesIncomeMutation } from "./reports.income"
import ReportsModalIncomeData from "./reports.modal.income-data"
import { setReportShowIncome } from "./reports.reducer"
import { useByFilterStatementMutation, useCreateStatementMutation, useUpdateStatementMutation } from "./reports.statement"

const ReportsFormIncomeStatement = () => {
    const auth = useAuth()
    const toast = useToast()
    const dispatch = useDispatch()
    const reportSelector = useSelector(state => state.reports)
    const [refetch, setRefetch] = useState(false)
    const [data, setdata] = useState({ beginning: null, freight: null })
    const [statement, setStatement] = useState()
    const [printing, setPrinting] = useState(false)
    const [filters, setFilters] = useState({
        fr: sqlDate(firstDayOfTheMonth(new Date())),
        to: sqlDate(lastDayOfTheMonth(new Date())),
        store: getBranch(auth) || "",
        category: ""
    })
    const [range, setRange] = useState({ startDate: sqlDate(firstDayOfTheMonth(new Date())), endDate: sqlDate(lastDayOfTheMonth(new Date())) })
    const [mounted, setMounted] = useState(false)
    useEffect(() => { setMounted(true) }, [])

    useEffect(() => {
        if (mounted) {
            return () => {
                localStorage.removeItem("reports")
            }
        }
    }, [mounted])

    const onChange = (e) => {
        const { name, value } = e.target
        setFilters(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const onRangeChange = (newValue) => {
        setRange(newValue)
        setFilters(prev => ({
            ...prev,
            fr: newValue.startDate,
            to: newValue.endDate
        }))
    }

    const [libBranches, setLibBranches] = useState()
    const [libCategories, setLibCategoies] = useState()

    const [allBranches, { isLoading: branchesLoading }] = useFetchAllBranchMutation()
    const [allCategories, { isLoading: categoriesLoading }] = useFetchAllCategoryMutation()
    const [sales, { isLoading: salesLoading }] = useSalesIncomeMutation()
    const [purchases, { isLoading: purchasesLoading }] = usePurchasesIncomeMutation()
    const [goodsin, { isLoading: goodsinLoading }] = useGoodsInIncomeMutation()
    const [goodsout, { isLoading: goodsoutLoading }] = useGoodsOutIncomeMutation()
    const [expenses, { isLoading: expensesLoading }] = useExpensesIncomeMutation()
    const [byFilter, { isLoading: filterLoading }] = useByFilterStatementMutation()
    const [createStatement] = useCreateStatementMutation()
    const [updateStatement] = useUpdateStatementMutation()
    const [createPrints] = useCreatePrintsMutation()

    const statementLoading = filterLoading || branchesLoading || categoriesLoading || salesLoading || purchasesLoading || goodsinLoading || goodsoutLoading || expensesLoading

    const totalGoods = useMemo(() => {
        const total = Number(data?.beginning) + Number(data?.purchases) + data?.goods_in?.reduce((prev, curr) => prev + Number(curr.value), 0) + Number(data?.freight)
        return total
    }, [data])

    const endInventory = useMemo(() => {
        const beginning = Number(data?.beginning)
        const purchases = Number(data?.purchases)
        const freight = Number(data?.freight)
        const goodsout = data?.goods_out?.reduce((prev, curr) => prev + Number(curr.value), 0)
        const endBalance = beginning + data?.goods_in?.reduce((prev, curr) => prev + Number(curr.value), 0) + purchases + freight - goodsout
        return endBalance
    }, [data])

    const grossIncome = useMemo(() => {
        return Number(data?.sales) - Number(data?.goods_cost)
    }, [data])

    const totalExpenses = useMemo(() => {
        return data?.expenses?.reduce((prev, curr) => prev + Number(curr.expenses), 0)
    }, [data])

    const netIncome = useMemo(() => {
        const gross = Number(data?.sales) - Number(data?.goods_cost)
        const expenses = data?.expenses?.reduce((prev, curr) => prev + Number(curr.expenses), 0)
        return gross - expenses
    }, [data])

    const noOfDays = useMemo(() => {
        return moment(filters.to).diff(filters.fr, 'days') + 1
    }, [filters])

    useEffect(() => {
        const instantiate = async () => {
            if (noOfDays > 31) {
                toast.showWarning("Cannot generate statement for more than 31 days.")
                return
            }
            await allBranches()
                .unwrap()
                .then(res => {
                    if (res.success) {
                        setLibBranches(res?.arrayResult.map(item => {
                            return {
                                key: item?.code,
                                value: item?.code
                            }
                        }))
                    }
                })
                .catch(err => console.error(err))
            await allCategories()
                .unwrap()
                .then(res => {
                    if (res.success) {
                        setLibCategoies(res?.arrayResult.map(item => {
                            return {
                                key: item.name,
                                value: item.name
                            }
                        }))
                    }
                })
                .catch(err => {
                    console.error(err)
                })
            if (reportSelector.report === "Income Statement") {
                await byFilter(filters)
                    .unwrap()
                    .then(async (res) => {
                        if (res.success && res.recordCount === 1) {
                            setStatement(res.arrayResult[0])
                            setdata(JSON.parse(res.arrayResult[0].data))
                        }
                        else {
                            setStatement()
                            setdata({ beginning: null, freight: null })
                            await sales({ fr: filters.fr, to: filters.to, store: filters.store, category: filters.category })
                                .unwrap()
                                .then(res => {
                                    if (res.success && res.length === 1) {
                                        setdata(prev => ({ ...prev, ...res.data }))
                                    }
                                })
                                .catch(err => console.error(err))
                            await purchases({ fr: filters.fr, to: filters.to, store: filters.store, category: filters.category })
                                .unwrap()
                                .then(res => {
                                    if (res.success && res.length === 1) {
                                        setdata(prev => ({ ...prev, ...res.data }))
                                    }
                                })
                                .catch(err => console.error(err))
                            await goodsin({ fr: filters.fr, to: filters.to, store: filters.store, category: filters.category })
                                .unwrap()
                                .then(res => {
                                    if (res.success) {
                                        setdata(prev => ({ ...prev, goods_in: res.data }))
                                    }
                                })
                                .catch(err => console.error(err))
                            await goodsout({ fr: filters.fr, to: filters.to, store: filters.store, category: filters.category })
                                .unwrap()
                                .then(res => {
                                    if (res.success) {
                                        setdata(prev => ({ ...prev, goods_out: res.data }))
                                    }
                                })
                                .catch(err => console.error(err))
                            await expenses({ fr: filters.fr, to: filters.to, store: filters.store })
                                .unwrap()
                                .then(res => {
                                    if (res.success) {
                                        setdata(prev => ({ ...prev, expenses: res.data }))
                                    }
                                })
                                .catch(err => console.error(err))
                        }
                    })
                    .catch(err => console.error(err))
            }
            setRefetch(false)
        }
        if (!isEmpty(reportSelector.report) || refetch) {
            instantiate()
        }
    }, [reportSelector.report, refetch, noOfDays])

    useEffect(() => {
        const check = async () => {

        }
        if (reportSelector.report === "Income Statement") {
            check()
        }
    }, [filters, reportSelector.report])


    const printData = async () => {
        if (data && !printing) {
            setPrinting(true)
            const route = `/#/print/statement/${moment(filters.fr).format("MMDDYYYY")}-${moment(filters.to).format("MMDDYYYY")}-${filters.store || "All"}-${filters.category || "All"}`
            const hashed = StringHash(route)
            const formData = {
                hash: hashed,
                data: JSON.stringify(data),
                by: auth.id
            }
            await createPrints(formData)
                .unwrap()
                .then(res => {
                    if (res.success) {
                        localStorage.setItem("statement", JSON.stringify({
                            title: "Income Statement",
                            subtext1: `Date: ${moment(filters.fr).format("MMMM DD, YYYY")} - ${moment(filters.to).format("MMMM DD, YYYY")}`,
                            subtext2: `Branch: ${filters.store || "All"} | Category: ${filters.category || "All"}`,
                            data: data,
                            branches: libBranches,
                            hashed: hashed
                        }))
                        setPrinting(false)
                        window.open(route, '_blank')
                    }
                    else {
                        toast.showError("Error encountered during pre-print validation.")
                        setPrinting(false)
                    }
                })
                .catch(err => {
                    toast.showError("Error encountered before print can been compiled.")
                    console.error(err)
                    setPrinting(false)
                })
        }
    }

    const reLoad = () => {
        if (!checkForSeparateMonths(filters.fr, filters.to)) {
            toast.showWarning("Cannot process range covering different months.")
            return
        }
        setRefetch(true)
    }

    const addData = () => {
        dispatch(setReportShowIncome(true))
    }

    const generateReference = (statement) => {
        const reference = `Reference No.: ${parseInt(moment(statement?.beg).format("MMDDYYYYHHmmss"))}-${parseInt(moment(statement?.end).format("MMDDYYYYHHmmss"))}-${StrFn.formatWithZeros(Number(statement?.id), 5)}`
        return reference
    }

    const onSave = async () => {
        if (!data?.beginning) {
            toast.showWarning("Beginning inventory is required.")
            return
        }
        const formData = {
            beg: filters.fr,
            end: filters.to,
            month: uniqueMonthFromDates(filters.to),
            year: uniqueYearFromDates(filters.to),
            noofdays: noOfDays,
            branch: filters.store,
            category: filters.category,
            data: JSON.stringify(data),
            inventory: endInventory,
            by: auth.id
        }
        if (statement?.id) {
            await updateStatement({ ...formData, id: statement?.id })
                .unwrap()
                .then(res => {
                    if (res.success) {
                        toast.showCreate("Income statement has been updated.")
                        setRefetch(true)
                    }
                })
                .catch(err => console.error(err))
        }
        else {
            await createStatement(formData)
                .unwrap()
                .then(res => {
                    if (res.success) {
                        toast.showCreate("Income statement has been successfully recorded.")
                        setRefetch(true)
                    }
                })
                .catch(err => console.error(err))
        }
    }

    return (
        (reportSelector.manager && reportSelector.report === "Income Statement") ? (
            <>
                <div className="w-full uppercase font-bold flex flex-col lg:flex-row justify-start gap-3 lg:gap-0 lg:justify-between lg:items-center no-select text-base lg:text-lg px-3 lg:px-0">
                    <div className="flex gap-4 ml-14 items-center lg:ml-16 py-2 text-sm lg:text-base">
                        <PresentationChartLineIcon className="w-8 h-8" />INCOME STATEMENT
                    </div>
                    <div className="flex flex-wrap lg:flex-nowrap items-center gap-2">
                        <Datepicker
                            value={range}
                            onChange={onRangeChange}
                            showShortcuts={true}
                            readOnly
                        />
                        <select name="store" className="report-select-filter text-sm w-full lg:w-[200px]" value={filters.store} onChange={onChange}>
                            {
                                isEmpty(getBranch(auth))
                                    ? <option value="">ALL BRANCHES</option>
                                    : null
                            }
                            {
                                isEmpty(getBranch(auth))
                                    ? (
                                        libBranches?.map(branch => (
                                            <option key={branch.key} value={branch.value}>{branch.key}</option>
                                        ))
                                    )
                                    : <option key={auth.store} value={auth.store}>{auth.store}</option>

                            }
                        </select>
                        <select name="category" className="report-select-filter text-sm w-full lg:w-[200px]" value={filters.category} onChange={onChange}>
                            <option value="" className="text-gray-500 font-bold">ALL CATEGORIES</option>
                            {
                                libCategories?.map(category => (
                                    <option key={category.value} value={category.value}>{category.key}</option>
                                ))

                            }
                        </select>
                        <div className="flex gap-2">
                            <button className="button-red py-2" onClick={() => reLoad()}>
                                <ArrowPathIcon className="w-5 h-5" />
                            </button>
                            <button className="button-red py-2" onClick={() => printData()}>
                                <PrinterIcon className="w-5 h-5" />
                            </button>
                            <button className="button-green py-2" onClick={() => addData()}>
                                <PlusIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
                {
                    statementLoading ? (
                        <div className="flex flex-col justify-between mt-3 overflow-auto md:mx-0 md:rounded-t-lg py-2 px-[1px] gap-3 cursor-default">
                            <div className="flex justify-between shadow p-5 ring-1 ring-black ring-opacity-5 gap-10">
                                <div className="skeleton-loading"></div>
                                <div className="skeleton-loading w-[150px]"></div>
                            </div>
                            <div className="flex justify-between shadow p-5 ring-1 ring-black ring-opacity-5 gap-10">
                                <div className="skeleton-loading"></div>
                                <div className="skeleton-loading w-[150px]"></div>
                            </div>
                            <div className="flex justify-between shadow p-5 ring-1 ring-black ring-opacity-5 gap-10">
                                <div className="skeleton-loading"></div>
                                <div className="skeleton-loading w-[150px]"></div>
                            </div>
                            <div className="flex flex-col shadow p-5 ring-1 ring-black ring-opacity-5 gap-5">
                                <div className="flex w-[75%] gap-10">
                                    <div className="skeleton-loading"></div>
                                    <div className="skeleton-loading w-[150px]"></div>
                                </div>
                                <div className="flex w-[75%] gap-10">
                                    <div className="skeleton-loading"></div>
                                    <div className="skeleton-loading w-[150px]"></div>
                                </div>
                                <div className="flex w-[75%] gap-10">
                                    <div className="skeleton-loading"></div>
                                    <div className="skeleton-loading w-[150px]"></div>
                                </div>
                                <div className="flex w-[75%] gap-10">
                                    <div className="skeleton-loading"></div>
                                    <div className="skeleton-loading w-[150px]"></div>
                                </div>
                                <div className="flex w-[75%] gap-10">
                                    <div className="skeleton-loading"></div>
                                    <div className="skeleton-loading w-[150px]"></div>
                                </div>
                            </div>
                            <div className="flex justify-between shadow p-5 ring-1 ring-black ring-opacity-5 gap-10">
                                <div className="skeleton-loading"></div>
                                <div className="skeleton-loading w-[150px]"></div>
                            </div>
                            <div className="flex justify-between shadow p-5 ring-1 ring-black ring-opacity-5 gap-10">
                                <div className="skeleton-loading"></div>
                                <div className="skeleton-loading w-[150px]"></div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col justify-between mt-3 overflow-auto md:mx-0 md:rounded-t-lg py-2 px-[1px] gap-3 cursor-default">
                            <div className="flex items-center justify-between shadow p-2 pl-5 ring-1 ring-black ring-opacity-5 bg-gray-300 transition ease-in delay-100">
                                <span className="font-bold underline">
                                    {statement?.id ? generateReference(statement) : "New Income Statement"}
                                </span>
                                <div className="flex gap-3">
                                    <button className={statement?.id ? "button-blue" : "button-green"} onClick={onSave}>{statement?.id ? "Update Income Statement" : "Save Income Statement"}</button>
                                </div>
                            </div>
                            <div className="flex justify-between shadow p-5 ring-1 ring-black ring-opacity-5 hover:bg-gray-200 transition ease-in delay-100">
                                <span className="font-bold">Sales</span>
                                <div className="flex gap-3">
                                    <span>{NumFn.acctg.monetize(data?.sales)}</span>
                                </div>
                            </div>
                            <div className="flex justify-between shadow p-5 ring-1 ring-black ring-opacity-5 hover:bg-gray-200 transition ease-in delay-100">
                                <span className="font-bold">Cost of Goods Sold</span>
                                <div className="flex gap-3">
                                    <span>{NumFn.acctg.monetize(data?.goods_cost)}</span>
                                </div>
                            </div>
                            <div className="flex flex-col shadow py-5 px-16 ring-1 ring-black ring-opacity-5 gap-2">
                                <div className="flex justify-between w-[50%] group">
                                    <span className="font-bold group-hover:text-blue-500 transition ease-in delay-100">
                                        Inventory beg.
                                    </span>
                                    <div className="flex gap-3 group-hover:text-blue-500 transition ease-in delay-100">
                                        <span>{NumFn.acctg.monetize(data?.beginning)}</span>
                                    </div>
                                </div>
                                <div className="flex justify-between w-[50%] group">
                                    <span className="font-bold group-hover:text-blue-500 transition ease-in delay-100">
                                        Add: Purchases
                                    </span>
                                    <div className="flex gap-3 group-hover:text-blue-500 transition ease-in delay-100">
                                        <span>{NumFn.acctg.monetize(data?.purchases)}</span>
                                    </div>
                                </div>
                                {
                                    libBranches?.length > 0 ? (
                                        libBranches?.map(branch => (
                                            <div key={branch?.key} className="flex justify-between w-[50%] group">
                                                <span className="font-bold group-hover:text-blue-500 transition ease-in delay-100">
                                                    Goods In - {StrFn.properCase(branch?.key?.replace("JT-", ""))}
                                                </span>
                                                <div className="flex gap-3 group-hover:text-blue-500 transition ease-in delay-100">
                                                    <span>{NumFn.acctg.monetize(data?.goods_in?.find(f => f.branch === branch?.key)?.value)}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : null
                                }
                                <div className="flex justify-between w-[50%] group">
                                    <span className="font-bold group-hover:text-blue-500 transition ease-in delay-100">
                                        Freight In
                                    </span>
                                    <div className="flex gap-3 group-hover:text-blue-500 transition ease-in delay-100">
                                        <span>{NumFn.acctg.monetize(data?.freight)}</span>
                                    </div>
                                </div>
                                <div className="flex w-[50%] border border-black"></div>
                                <div className="flex justify-between w-[50%] group">
                                    <span className="font-bold group-hover:text-blue-500 transition ease-in delay-100">
                                        Total Goods Available for Sale
                                    </span>
                                    <div className="flex gap-3 group-hover:text-blue-500 transition ease-in delay-100">
                                        <span>{NumFn.acctg.monetize(totalGoods)}</span>
                                    </div>
                                </div>
                                {
                                    libBranches?.length > 0 ? (
                                        libBranches?.map(branch => (
                                            <div key={branch?.key} className="flex justify-between w-[50%] group text-gray-400">
                                                <span className="font-bold group-hover:text-blue-500 transition ease-in delay-100">
                                                    Goods Out - {StrFn.properCase(branch?.key?.replace("JT-", ""))}
                                                </span>
                                                <div className="flex gap-3 group-hover:text-blue-500 transition ease-in delay-100">
                                                    <span>{NumFn.acctg.monetize(data?.goods_out?.find(f => f.branch === branch?.key)?.value)}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : null
                                }
                                <div className="flex justify-between w-[50%] group text-red-400">
                                    <span className="font-bold group-hover:text-blue-500 transition ease-in delay-100">
                                        Inventory end
                                    </span>
                                    <div className="flex gap-3 group-hover:text-blue-500 transition ease-in delay-100">
                                        <span>{NumFn.acctg.monetize(endInventory)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between shadow p-5 ring-1 ring-black ring-opacity-5 hover:bg-gray-200 transition ease-in delay-100">
                                <span className="font-bold">Gross Income</span>
                                <div className="flex gap-3">
                                    <span>{NumFn.acctg.monetize(grossIncome)}</span>
                                </div>
                            </div>
                            <div className="flex flex-col shadow py-5 pl-16 pr-5 ring-1 ring-black ring-opacity-5 gap-2">
                                <div className="flex justify-between w-[50%] pr-5 group mb-5">
                                    <span className="font-bold group-hover:text-blue-500 transition ease-in delay-100">
                                        Less: Operating Expenses
                                    </span>
                                    <div className="flex gap-3 group-hover:text-blue-500 transition ease-in delay-100">
                                        <span className="text-gray-400">{NumFn.acctg.monetize(totalExpenses)}</span>
                                    </div>
                                </div>
                                {
                                    data?.expenses?.length > 0 ? (
                                        data?.expenses?.map(expense => (
                                            <div key={expense?.inclusion} className="flex justify-between group">
                                                <span className="font-bold group-hover:text-blue-500 transition ease-in delay-100">
                                                    {expense?.inclusion}
                                                </span>
                                                <div className="flex gap-3 group-hover:text-blue-500 transition ease-in delay-100">
                                                    <span>{NumFn.acctg.monetize(expense?.expenses)}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : null
                                }
                            </div>
                            <div className="flex justify-between shadow p-5 ring-1 ring-black ring-opacity-5 hover:bg-gray-200 transition ease-in delay-100">
                                <span className="font-bold">Net Income</span>
                                <div className="flex gap-3">
                                    <span>{NumFn.acctg.monetize(netIncome)}</span>
                                </div>
                            </div>
                        </div>
                    )
                }
                <ReportsModalIncomeData setdata={setdata} statement={statement} filters={filters} />
            </>
        ) : null
    )
}

export default ReportsFormIncomeStatement
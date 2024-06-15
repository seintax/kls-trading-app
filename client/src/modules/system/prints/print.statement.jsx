import React, { useEffect, useMemo, useState } from 'react'
import { NumFn } from "../../../utilities/functions/number.funtions"
import { StrFn } from "../../../utilities/functions/string.functions"
import AppLogo from "../../../utilities/interface/application/aesthetics/app.logo"

const PrintStatement = () => {
    const reportname = "statement"
    const [print, setprint] = useState({})
    const [data, setdata] = useState()
    const [branches, setbranches] = useState()
    const [mounted, setMounted] = useState(false)
    const [hashed, setHashed] = useState("")

    useEffect(() => { setMounted(true) }, [])

    useEffect(() => {
        if (mounted) {
            const storage = JSON.parse(localStorage.getItem(reportname))
            setprint(storage)
            setdata(storage?.data)
            setbranches(storage?.branches)
            setHashed(storage?.hashed)
            return () => {
                localStorage.removeItem(reportname)
            }
        }
    }, [mounted])

    const onAfterPrinting = () => {
        window.close()
    }

    useEffect(() => {
        if (mounted && data?.hasOwnProperty("beginning")) {
            window.print()
            window.onafterprint = onAfterPrinting()
        }
    }, [data, mounted])

    const header = () => {
        return (
            <div className="w-full flex flex-col gap-[5px] mb-2 items-center">
                <div className="font-bold">{print?.title}</div>
                <div className={`text-sm ${print?.subtext1 ? "" : "hidden"}`}>
                    {print?.subtext1}
                </div>
                <div className={`text-sm ${print?.subtext2 ? "" : "hidden"}`}>
                    {print?.subtext2}
                </div>
            </div>
        )
    }

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

    return (
        <div className="w-full min-h-screen flex flex-col items-start bg-white py-5">
            <div className="w-full text-center">
                <AppLogo style="h-[100px]" />
            </div>
            {header()}
            <div className="flex gap-2 text-xs italic mt-2 mb-1 w-full">
                <span>Generated with Hashed Map Reference: {hashed}</span>
            </div>
            <div className="flex justify-between border-t-2 border-t-black border-b-2 border-b-black py-1 pr-8 text-lg mb-12 w-full">
                <span>SALES</span>
                <span>{NumFn.acctg.monetize(data?.sales)}</span>
            </div>
            <div className="flex justify-between border-t-2 border-t-black border-b-2 border-b-black py-1 pr-8 text-lg mb-3 w-full">
                <span>Cost of Goods Sold</span>
                <span>{NumFn.acctg.monetize(data?.goods_cost)}</span>
            </div>
            <div className="flex flex-col py-1 px-10 w-full">
                <div className="flex justify-between w-[75%]">
                    <span>Inventory beg.</span>
                    <span>-</span>
                </div>
                <div className="flex justify-between w-[75%]">
                    <span>Add: Purchases</span>
                    <span>{NumFn.acctg.monetize(data?.purchases)}</span>
                </div>
                {
                    branches?.length > 0 ? (
                        branches?.map(branch => (
                            <div key={branch?.key} className="flex justify-between w-[75%]">
                                <span>
                                    Goods In - {StrFn.properCase(branch?.key?.replace("JT-", ""))}
                                </span>
                                <div>
                                    <span>{NumFn.acctg.monetize(data?.goods_in?.find(f => f.branch === branch?.key)?.value)}</span>
                                </div>
                            </div>
                        ))
                    ) : null
                }
                <div className="flex justify-between w-[75%]">
                    <span>Freight In</span>
                    <span>{NumFn.acctg.monetize(data?.freight)}</span>
                </div>
                <div className="flex w-[75%] my-2 border border-black"></div>
                <div className="flex justify-between w-[75%]">
                    <span>Total Goods Available for Sale</span>
                    <span>{NumFn.acctg.monetize(totalGoods)}</span>
                </div>
                {
                    branches?.length > 0 ? (
                        branches?.map(branch => (
                            <div key={branch?.key} className="flex justify-between w-[75%] text-gray-400">
                                <span>
                                    Goods Out - {StrFn.properCase(branch?.key?.replace("JT-", ""))}
                                </span>
                                <div>
                                    <span>{NumFn.acctg.monetize(data?.goods_out?.find(f => f.branch === branch?.key)?.value)}</span>
                                </div>
                            </div>
                        ))
                    ) : null
                }
                <div className="flex justify-between w-[75%] text-red-400">
                    <span>Inventory end</span>
                    <span>{NumFn.acctg.monetize(endInventory)}</span>
                </div>
            </div>
            <div className="flex justify-between border-t-2 border-t-black border-b-2 border-b-black py-1 pr-8 text-lg mt-3 mb-3 w-full">
                <span>GROSS INCOME</span>
                <span>{NumFn.acctg.monetize(grossIncome)}</span>
            </div>
            <div className="flex flex-col py-1 px-10 w-full">
                <div className="flex justify-between w-[75%]">
                    <span>Less: Operating Expenses</span>
                    <span>-</span>
                </div>
                {
                    data?.expenses?.length > 0 ? (
                        data?.expenses?.map(expense => (
                            <div key={expense?.inclusion} className="flex justify-between">
                                <span>
                                    {expense?.inclusion}
                                </span>
                                <div>
                                    <span>{NumFn.acctg.monetize(expense?.expenses)}</span>
                                </div>
                            </div>
                        ))
                    ) : null
                }
            </div>
            <div className="flex justify-between border-t-2 border-t-black border-b-2 border-b-black py-1 pr-8 text-lg mt-3 mb-5 w-full">
                <span>NET INCOME</span>
                <span>{NumFn.acctg.monetize(netIncome)}</span>
            </div>
            <div className="flex gap-10 w-full mt-5">
                <div className="flex flex-col w-full">
                    <span>Prepared by:</span>
                    <span className="border-t-2 border-black mt-10">
                        GLENDEYL ARENDAIN
                    </span>
                    <span className="text-sm">Assistant Accounting</span>
                </div>
                <div className="flex flex-col w-full">
                    <span>Noted by:</span>
                    <span className="border-t-2 border-black mt-10">
                        SAUD CALALAGAN
                    </span>
                    <span className="text-sm">Chief Operations Officer</span>
                </div>
            </div>
            <div className="flex gap-2 text-xs italic mt-10">
                <span>Generated with Hashed Map Reference: {hashed}</span>
            </div>
        </div>
    )
}

export default PrintStatement
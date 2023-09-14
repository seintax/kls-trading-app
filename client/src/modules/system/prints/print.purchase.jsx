import React, { useEffect, useLayoutEffect, useState } from 'react'
import { longDate } from "../../../utilities/functions/datetime.functions"
import { NumFn } from "../../../utilities/functions/number.funtions"
import AppLogo from "../../../utilities/interface/application/aesthetics/app.logo"

const PrintPurchase = () => {
    const reportname = "purchase"
    const [print, setprint] = useState({})
    const [records, setrecords] = useState([])
    const [mounted, setMounted] = useState(false)

    useEffect(() => { setMounted(true) }, [])

    useEffect(() => {
        if (mounted) {
            const storage = JSON.parse(localStorage.getItem(reportname))
            setprint(storage)
            setrecords(storage?.data)
            return () => {
                localStorage.removeItem(reportname)
            }
        }
    }, [mounted])

    useLayoutEffect(() => {
        if (records?.length) {
            setTimeout(function () { window.print() }, 500)
            window.onafterprint = function () {
                setTimeout(function () {
                    localStorage.removeItem(reportname)
                    window.close()
                }, 500)
            }
        }
    }, [records])

    return (
        <div className="w-full min-h-screen flex flex-col items-start bg-white">
            <div className="w-full text-center mt-5">
                <AppLogo style="h-[100px]" />
            </div>
            <div className="w-full px-10 mt-10">
                <div className="font-bold text-3xl">
                    {print?.title}
                </div>
                <div className="mt-5">
                    <span className="font-bold">PO Date:</span> {longDate(print?.info?.date)}
                </div>
                <div className="mt-1">
                    <span className="font-bold">Ordered By:</span> {print?.info?.account_name}
                </div>
                <div className="flex w-full">
                    <div className="flex flex-col w-full">
                        <div className="mt-10 font-bold">
                            Supplier:
                        </div>
                        <div className="mt-1">
                            {print?.info?.supplier_name}
                        </div>
                    </div>
                    <div className="flex flex-col w-full">
                        <div className="mt-10 font-bold">
                            Ship to:
                        </div>
                        <div className="mt-1">
                            {print?.info?.store}
                        </div>
                    </div>
                </div>
                <div className="mt-10 font-bold">
                    Supply Category:
                </div>
                <div className="mt-1">
                    {print?.info?.category}
                </div>
                <div className="w-full flex flex-col mt-10">
                    <div className="w-full flex font-bold border-b border-b-black py-2">
                        <div className="w-full">Item Name</div>
                        <div className="w-[300px] text-right">Quantity</div>
                        <div className="w-[300px] text-right">Price</div>
                        <div className="w-[300px] text-right">Amount</div>
                    </div>
                    {
                        records?.map((item) => (
                            <div key={item.id} className="w-full flex py-2">
                                <div className="w-full flex">
                                    {item.product_name} (<span className="text-gray-500">{item.variant_serial}/{item.variant_model}/{item.variant_brand}</span>)
                                </div>
                                <div className="w-[300px] text-right">{item.purchase_ordertotal}</div>
                                <div className="w-[300px] text-right">{NumFn.acctg.currency(item.costing)}</div>
                                <div className="w-[300px] text-right">{NumFn.acctg.currency(item.purchase_ordertotal * item.costing)}</div>
                            </div>
                        ))
                    }
                    <div className="w-full flex font-bold border-t border-t-black py-2 mt-2">
                        <div className="w-full">&nbsp;</div>
                        <div className="w-[300px] text-right">&nbsp;</div>
                        <div className="w-[300px] text-right font-bold">Total</div>
                        <div className="w-[300px] text-right">{NumFn.acctg.currency(records?.reduce((prev, curr) => prev + ((curr.purchase_ordertotal || 0) * (curr.costing || 0)), 0))}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PrintPurchase
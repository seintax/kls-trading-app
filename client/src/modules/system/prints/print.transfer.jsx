import React, { useEffect, useLayoutEffect, useState } from 'react'
import { longDate } from "../../../utilities/functions/datetime.functions"
import { NumFn } from "../../../utilities/functions/number.funtions"
import AppLogo from "../../../utilities/interface/application/aesthetics/app.logo"

const PrintTransfer = () => {
    const reportname = "transfer"
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
                    <span className="font-bold">Transfer Date:</span> {longDate(print?.info?.date)}
                </div>
                {/* <div className="mt-1">
                    <span className="font-bold">Ordered By:</span> {print?.info?.account_name}
                </div> */}
                <div className="flex w-full">
                    <div className="flex flex-col w-full">
                        <div className="mt-10 font-bold">
                            From:
                        </div>
                        <div className="mt-1">
                            {print?.info?.source}
                        </div>
                    </div>
                    <div className="flex flex-col w-full">
                        <div className="mt-10 font-bold">
                            To:
                        </div>
                        <div className="mt-1">
                            {print?.info?.destination}
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
                        <div className="w-[300px] text-right">Received</div>
                        <div className="w-[300px] text-right">Cost</div>
                        <div className="w-[300px] text-right">Amount</div>
                    </div>
                    {
                        records?.map((item) => (
                            <div key={item.id} className="w-full flex py-2">
                                <div className="w-full flex">
                                    {item.product_name} <p className="text-gray-500 ml-2">({item.variant_serial?.trim()}/{item.variant_model?.trim()}/{item.variant_brand?.trim()})</p>
                                </div>
                                <div className="w-[300px] text-right">{item.quantity}</div>
                                <div className="w-[300px] text-right">{item.received}</div>
                                <div className="w-[300px] text-right">{NumFn.acctg.currency(item.invt_base)}</div>
                                <div className="w-[300px] text-right">{NumFn.acctg.currency(item.received * item.invt_base)}</div>
                            </div>
                        ))
                    }
                    <div className="w-full flex font-bold border-t border-t-black py-2 mt-2">
                        <div className="w-full">&nbsp;</div>
                        <div className="w-[300px] text-right">&nbsp;</div>
                        <div className="w-[300px] text-right">&nbsp;</div>
                        <div className="w-[300px] text-right font-bold">Total</div>
                        <div className="w-[300px] text-right">{NumFn.acctg.currency(records?.reduce((prev, curr) => prev + ((curr.received || 0) * (curr.invt_base || 0)), 0))}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PrintTransfer
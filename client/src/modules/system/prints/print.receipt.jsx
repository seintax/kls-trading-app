import moment from "moment"
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { currency } from "../../../utilities/functions/number.funtions"
import AppLogo from "../../../utilities/interface/application/aesthetics/app.logo"
import { resetPrintingPrint, setPrintingPrint } from "./printing.reducer"

const PrintReceipt = () => {
    const dataSelector = useSelector(state => state.printing)
    const dispatch = useDispatch()
    const [mounted, setMounted] = useState(false)

    useEffect(() => { setMounted(true) }, [])

    useEffect(() => {
        if (mounted) {
            const printdata = JSON.parse(localStorage.getItem("rcpt"))
            dispatch(setPrintingPrint(printdata))

            return () => {
                dispatch(resetPrintingPrint())
                localStorage.removeItem("rcpt")
            }
        }
    }, [mounted])

    const onAfterPrinting = () => {
        localStorage.setItem("printcompleted", "true")
        // window.close()
    }

    useEffect(() => {
        if (dataSelector.print?.transaction && mounted) {
            window.print()
            window.onafterprint = onAfterPrinting()
        }
    }, [dataSelector.print?.transaction, mounted])

    return (
        <div id="receipt" className="w-[52mm] min-h-screen bg-blue-900 bg-opacity-50 flex justify-center items-center">
            {
                (dataSelector.print?.transaction) ? (
                    <div className="w-[50mm] bg-white h-fit pt-8 text-[11px]">
                        <div className="grayscale">
                            <AppLogo />
                        </div>
                        <div className="flex flex-col w-full items-center mt-5 px-0">
                            <div className="font-bold text-center">
                                {dataSelector.print?.branch}
                            </div>
                            <div className="font-normal text-center">
                                {dataSelector.print?.address}
                            </div>
                            <div className="font-normal text-center">
                                {dataSelector.print?.service}
                            </div>
                            <div className="font-normal text-center">
                                {dataSelector.print?.subtext}
                            </div>
                            <div className="font-normal text-center">
                                {dataSelector.print?.contact}
                            </div>
                            <div className="w-full border border-b-black mt-1 border-dashed mt-3"></div>
                            <div className="font-normal text-center mt-3">
                                Customer:
                            </div>
                            <div className="font-normal text-center">
                                {dataSelector.print?.customer.name}
                            </div>
                            <div className="font-normal text-center">
                                {dataSelector.print?.customer.address}
                            </div>
                            <div className="font-normal text-center mt-3">
                                Cashier: {dataSelector.print?.cashier}
                            </div>
                            <div className="font-normal text-center mt-0.5">
                                Transaction:
                            </div>
                            <div className="font-normal text-center mt-0.5">
                                {dataSelector.print?.transaction}
                            </div>
                            <div className="font-normal text-center mt-0.5">
                                {moment(new Date).format("MM/DD/YYYY hh:mm:ss A")}
                            </div>
                            <div className={`font-normal text-[10px] text-center mt-0.5 ${dataSelector.print?.reprint ? "" : "hidden"}`}>
                                **Note: This is a reprinted copy.
                            </div>
                            <div className="w-full border border-b-black border-dashed mt-3"></div>
                            <div className="w-[50mm] flex flex-col gap-3 py-2 text-[11px] pr-3">
                                {
                                    (dataSelector.print?.items?.map((item, index) => (
                                        <div key={index} className="flex flex-col">
                                            <div className=" flex">
                                                <div className="flex flex-col w-full text-[11px]">
                                                    <div className="w-full">{item.product}</div>
                                                    <div className="flex justify-between">
                                                        <span className="text-[10px]">
                                                            {item.quantity} x {currency(item.price)}
                                                        </span>
                                                        <span className="text-[11px]">
                                                            {currency(item.total)}
                                                        </span>
                                                    </div>
                                                </div>
                                                {/* <div className="flex w-[100px] justify-end">
                                                    {currency(item.total)}
                                                </div> */}
                                            </div>
                                            <div className={`${item.less > 0 ? "flex" : "hidden"} justify-between`}>
                                                <div className="w-full text-right">
                                                    Less:
                                                </div>
                                                <div className="flex w-[100px] justify-end">
                                                    -{currency(item.less)}
                                                </div>
                                            </div>
                                        </div>
                                    )))
                                }
                            </div>
                            <div className="w-full border border-t-black border-dashed"></div>
                            <div className={`${dataSelector.print.discount.amount > 0 ? "flex" : "hidden"} w-full justify-between font-normal my-3 pr-3`}>
                                {/* <span>Discount ({dataSelector.print.discount.rate}%)</span> */}
                                <span>Discount</span>
                                <span>{currency(dataSelector.print.discount.amount || 0)}</span>
                            </div>
                            <div className="w-full border border-t-black border-dashed"></div>
                            <div className="w-full flex justify-between my-3 text-sm font-bold pr-3">
                                <span>Total</span>
                                <span>{currency(dataSelector.print.total)}</span>
                            </div>
                            {
                                dataSelector.print.mode === "SALES" ? (
                                    <div className="w-full flex justify-between my1 text-xs pr-3">
                                        <span>Payment</span>
                                        <span>{currency(dataSelector.print.payment)}</span>
                                    </div>
                                ) : null
                            }
                            {
                                dataSelector.print.mode === "CREDIT" ? (
                                    <div className="w-full flex justify-between my-1 mb-3 text-xs pr-3">
                                        <span>Credit</span>
                                        <span>{currency(dataSelector.print.credit)}</span>
                                    </div>
                                ) : null
                            }
                            {
                                dataSelector.print.mode === "CREDIT" ? (
                                    <div className="w-full flex justify-between my-1 mb-3 text-xs pr-3">
                                        <span>Partial</span>
                                        <span>{currency(dataSelector.print.partial)}</span>
                                    </div>
                                ) : null
                            }
                            <div className="w-full flex justify-between my-1 text-xs pr-3">
                                <span>Change</span>
                                <span>{currency(dataSelector.print.change)}</span>
                            </div>
                            <div className="w-full border border-t-black border-dashed"></div>
                            <div className="font-normal text-center my-3 mb-3">
                                Thank you and come again.
                            </div>
                        </div>
                    </div>
                ) : null
            }
        </div>
    )
}

export default PrintReceipt
import React, { useEffect, useState } from 'react'
import AppLogo from "../../../utilities/interface/application/aesthetics/app.logo"
import DataPrint from "../../../utilities/interface/datastack/data.print"

const PrintReports = () => {
    const reportname = "reports"
    const [print, setprint] = useState({})
    const [records, setrecords] = useState([])
    const [columns, setcolumns] = useState()
    const [mounted, setMounted] = useState(false)

    useEffect(() => { setMounted(true) }, [])

    useEffect(() => {
        if (mounted) {
            const storage = JSON.parse(localStorage.getItem(reportname))
            setprint(storage)
            setcolumns(storage?.columns)
            setrecords(storage?.data)

            return () => {
                localStorage.removeItem(reportname)
            }
        }
    }, [mounted])

    // useEffect(() => {
    //     const storage = JSON.parse(localStorage.getItem(reportname))
    //     setprint(storage)
    //     setrecords(storage?.data)
    //     settotal(storage?.data?.reduce((prev, curr) => prev + Number(curr?.items[5]?.value?.startsWith("-") ? 0 : Number(curr?.items[3]?.value.replaceAll(",", ""))), 0))
    //     setexpired(storage?.data?.reduce((prev, curr) => prev + Number(curr?.items[5]?.value?.startsWith("-") ? Number(curr?.items[3]?.value.replaceAll(",", "")) : 0), 0))
    // }, [localStorage.getItem(reportname)])

    const trigger = () => {
        var css = '@page { size: portrait; }',
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style')

        style.type = 'text/css'
        style.media = 'print'

        if (style.styleSheet) {
            style.styleSheet.cssText = css
        } else {
            style.appendChild(document.createTextNode(css))
        }

        head.appendChild(style)
        // window.print()
    }

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

    return (
        <div className="w-full min-h-screen flex flex-col items-start bg-white">
            <div className="w-full text-center">
                <AppLogo style="h-[100px]" />
            </div>
            <DataPrint
                columns={columns}
                records={records}
                header={header}
                trigger={trigger}
            />
            {/* <div className="w-full mt-5 font-bold flex gap-10">
                <span>Total Claimable: {currencyFormat.format(total)}</span>
                <span>Total Expired: {currencyFormat.format(expired)}</span>
            </div> */}
        </div>
    )
}

export default PrintReports
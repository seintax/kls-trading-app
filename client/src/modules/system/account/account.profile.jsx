import React, { useEffect, useState } from 'react'
import { useDispatch } from "react-redux"
import { useLocation } from "react-router-dom"
import { NumFn } from "../../../utilities/functions/number.funtions"
import { StrFn } from "../../../utilities/functions/string.functions"
import useAuth from "../../../utilities/hooks/useAuth"
import { setLocationPath } from "../../../utilities/redux/slices/locateSlice"

const AccountProfile = () => {
    const location = useLocation()
    const dispatch = useDispatch()
    const auth = useAuth()
    const [emoji, setEmoji] = useState("😎")

    useEffect(() => {
        dispatch(setLocationPath(location?.pathname))
    }, [location])

    const branchDisplay = () => {
        if (auth.role === "Admin" && auth.store === "SysAd") return "Back Office"
        if (auth.role === "SysAd" && auth.store === "SysAd") return "System Administrator"
        if (auth.role === "DevOp" && auth.store === "DevOp") return "All Access"
        if (auth.store.includes("JT-")) return `Jally Trading - ${StrFn.properCase(auth.store?.replace("JT-", ""))} Branch`
    }

    const emojiArray = ["🤖", "😵‍💫", "🤡", "🥸", "😶‍🌫️", "😉", "😁", "😎", "👽", "🐵", "🐶", "🐷", "🦝", "🦊", "🐯", "🐮", "🐱", "🦁", "🐼", "🐨", "🐻", "🐰", "🐹", "🐻‍❄️", "🐭", "🐸", "🦉", "🐥", "🐧", "🐣", "👩", "👨", "🧑", "👧", "👦", "🧒", "👶", "👵", "👴", "🧓", "👩‍🦰", "👨‍🦰", "👨‍🦱", "🧑‍🦱", "👩‍🦲", "👨‍🦲", "🧑‍🦲", "👩‍🦳", "👨‍🦳", "🧑‍🦳", "👱‍♀️", "👱‍♂️", "👱", "👳‍♀️", "👳‍♂️", "👳", "🎅", "🤶", "🧑‍🎄", "🧔", "🧔‍♂️", "🧔‍♀️"]

    useEffect(() => {
        setEmoji(emojiArray[NumFn.randomInRange(0, emojiArray.length - 1)])
    }, [])

    return (
        <div className='flex flex-col px-4 py-5 sm:px-6 lg:px-8 h-full gap-[40px]'>
            <div className="font-bold text-xl">My Profile</div>
            <div className="flex items-center justify-center text-[100px] border border-gray-600 w-[150px] h-[120px] pb-3 rounded-xl text-center relative no-select">
                {emoji}
                <div className="absolute right-0 bottom-2 text-[20px] cursor-pointer" onClick={() => setEmoji(emojiArray[NumFn.randomInRange(0, emojiArray.length - 1)])}>🔄️</div>
            </div>
            <div className="flex flex-col gap-[20px] text-lg">
                <div className="flex items-center">
                    <div className="w-[120px] text-[#7c7b7b] text-sm no-select">
                        Username
                    </div>
                    <div className="no-select">: 👤</div>
                    <div className="font-medium pl-2">
                        {StrFn.properCase(auth.user)}
                    </div>
                </div>
                <div className="flex items-center">
                    <div className="w-[120px] text-[#7c7b7b] text-sm no-select">
                        Fullname
                    </div>
                    <div className="no-select">: 🪪</div>
                    <div className="font-medium pl-2">
                        {StrFn.properCase(auth.name)}
                    </div>
                </div>
                <div className="flex items-center">
                    <div className="w-[120px] text-[#7c7b7b] text-sm no-select">
                        Branch Access
                    </div>
                    <div className="no-select">: 🏠</div>
                    <div className="font-medium pl-2">
                        {branchDisplay()}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AccountProfile
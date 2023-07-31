import { Transition } from "@headlessui/react"
import { XMarkIcon } from "@heroicons/react/20/solid"
import moment from "moment"
import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FormatOptionsNoLabel, FormatOptionsWithEmptyLabel, provideValueFromLibrary } from "../../../utilities/functions/array.functions"
import { dateRangedFormat, sqlDate } from "../../../utilities/functions/datetime.functions"
import { getBranch, isEmpty } from "../../../utilities/functions/string.functions"
import useAuth from "../../../utilities/hooks/useAuth"
import useToast from "../../../utilities/hooks/useToast"
import { useFetchAllBranchMutation } from "../../library/branch/branch.services"
import { resetDashboardFilters, setDashboardBranch, setDashboardRange, setDashboardStart, setDashboardStore } from "./dashboard.reducer"

const DashboardFilters = () => {
    const auth = useAuth()
    const dashboardSelector = useSelector(state => state.dashboard)
    const dispatch = useDispatch()
    const [instantiated, setInstantiated] = useState(false)
    const [filters, setFilters] = useState({
        from: dashboardSelector.start,
        to: dateRangedFormat(dashboardSelector.start, "add", dashboardSelector.range - 1, "YYYY-MM-DD"),
        store: isEmpty(getBranch(auth)) ? dashboardSelector.store : auth.store
    })
    const toast = useToast()

    const [libBranches, setLibBranches] = useState()

    const [allBranches] = useFetchAllBranchMutation()

    const keydown = useCallback(e => {
        if (dashboardSelector.filters)
            if (e.key === 'Escape') onClose()
    })

    useEffect(() => {
        document.addEventListener('keydown', keydown)
        return () => { document.removeEventListener('keydown', keydown) }
    }, [keydown])

    useEffect(() => {
        const instantiate = async () => {
            await allBranches()
                .unwrap()
                .then(res => {
                    if (res.success) {
                        setLibBranches(
                            isEmpty(getBranch(auth))
                                ? FormatOptionsWithEmptyLabel(res?.arrayResult, "code", "name", "All Branches")
                                : FormatOptionsNoLabel(res?.arrayResult?.filter(f => f.code === auth.store), "code", "name")
                        )
                    }
                })
                .catch(err => console.error(err))
            setInstantiated(true)
        }

        instantiate()
    }, [])

    const onChange = (e) => {
        const { name, value } = e.target
        setFilters(prev => ({
            ...prev,
            [name]: value,
        }))
    }

    const onClose = () => {
        dispatch(resetDashboardFilters())
    }

    const onReset = () => {
        setFilters({
            from: dashboardSelector.start,
            to: dateRangedFormat(dashboardSelector.start, "add", dashboardSelector.range - 1, "YYYY-MM-DD"),
            store: dashboardSelector.store
        })
    }

    const onSubmit = (e) => {
        e.preventDefault()
        var from = moment(filters.from, "YYYY-MM-DD")
        var to = moment(filters.to, "YYYY-MM-DD")
        let days = moment.duration(to.diff(from)).asDays()

        dispatch(setDashboardRange(days + 1))
        dispatch(setDashboardStart(sqlDate(filters.from)))
        dispatch(setDashboardStore(filters.store))
        dispatch(setDashboardBranch(provideValueFromLibrary(libBranches, filters.store)?.key || "All Branches"))
        dispatch(resetDashboardFilters())
    }

    return (
        <Transition
            show={dashboardSelector.filters}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            className={`fixed left-0 top-0 h-full w-full bg-gradient-to-r from-[#00000070] via-[#00000070] to-[#00000040] z-20 flex items-start justify-center`}
        >
            <Transition.Child
                enter="transition ease-in-out duration-500 transform"
                enterFrom="translate-y-full"
                enterTo="translate-y-0"
                leave="transition ease-in-out duration-500 transform"
                leaveFrom="translate-y-0"
                leaveTo="translate-y-full"
                className="flex items-center justify-center h-full w-full lg:w-[550px]"
            >
                <div className="flex flex-col gap-2 bg-white p-3 w-[60%] lg:w-[550px] h-fit text-sm mt-1">
                    <div className="flex items-center justify-between">
                        <div>DASHBOARD FILTER</div>
                        <div onClick={() => onClose()}>
                            <XMarkIcon className="w-5 h-5 cursor-pointer" />
                        </div>
                    </div>
                    <form onSubmit={onSubmit} className="flex flex-col gap-3 mt-2 p-5">
                        <div className="flex border border-secondary-500 p-0.5 items-center">
                            <input
                                type="date"
                                name="from"
                                value={filters.from}
                                onChange={onChange}
                                className="w-full border-none focus:border-none outline-none ring-0 focus:ring-0 focus:outline-none grow-1"
                            />
                        </div>
                        <div className="flex border border-secondary-500 p-0.5 items-center">
                            <input
                                type="date"
                                name="to"
                                value={filters.to}
                                onChange={onChange}
                                className="w-full border-none focus:border-none outline-none ring-0 focus:ring-0 focus:outline-none grow-1"
                            />
                        </div>
                        <div className="flex border border-secondary-500 p-0.5 items-center">
                            <select
                                name="store"
                                value={filters.store}
                                onChange={onChange}
                                autoFocus
                                className="w-full border-none focus:border-none outline-none ring-0 focus:ring-0 focus:outline-none grow-1">
                                {
                                    libBranches?.map(branch => (
                                        <option key={branch.value} value={branch.value}>{branch.key}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className="flex justify-end mt-5">
                            <button type="button" tabIndex={-1} className="button-cancel" onClick={() => onClose()}>Cancel</button>
                            <button type="submit" className="button-submit">Apply Filter</button>
                        </div>
                    </form>
                </div>
            </Transition.Child>
        </Transition>
    )
}

export default DashboardFilters
import { Transition } from "@headlessui/react"
import { XMarkIcon } from "@heroicons/react/20/solid"
import { useCallback, useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FormatOptionsNoLabel } from "../../../utilities/functions/array.functions"
import { createInstance } from "../../../utilities/functions/datetime.functions"
import useToast from "../../../utilities/hooks/useToast"
import { useCreateCustomerMutation, useFetchAllCustomerMutation } from "../../library/customer/customer.services"
import { resetPaymentPayor, setPaymentCustomer } from "./payment.reducer"

const PaymentCustomer = () => {
    const amtRef = useRef()
    const dataSelector = useSelector(state => state.payment)
    const dispatch = useDispatch()
    const [instantiated, setInstantiated] = useState(false)
    const [instance, setInstance] = useState(createInstance())
    const [newCustomer, setNewCustomer] = useState(false)
    const [search, setSearch] = useState("")
    const [customer, setCustomer] = useState({
        customer: "0",
        customer_name: "Walkin Customer",
        customer_address: "",
        newcustomer: "",
        newaddress: "",
        newcontact: "",
    })
    const toast = useToast()

    const keydown = useCallback(e => {
        if (dataSelector.payor)
            if (e.key === 'Escape') onClose()
    })

    useEffect(() => {
        document.addEventListener('keydown', keydown)
        return () => { document.removeEventListener('keydown', keydown) }
    }, [keydown])

    const [libCustomers, setLibCustomers] = useState()

    const [allCustomer] = useFetchAllCustomerMutation()
    const [createCustomer] = useCreateCustomerMutation()

    useEffect(() => {
        const instantiate = async () => {
            await allCustomer()
                .unwrap()
                .then(res => {
                    if (res.success) {
                        setLibCustomers(FormatOptionsNoLabel(res?.arrayResult, "id", "name", "Select a customer"))
                    }
                })
                .catch(err => console.error(err))
            setInstantiated(true)
        }

        instantiate()
    }, [dataSelector.payor, instance])

    const onSearchChange = (e) => {
        let key = e.target.value
        setSearch(key)
        let found = libCustomers?.filter(f => f.key?.toLowerCase().startsWith(key.toLowerCase()))
        if (found.length > 0) {
            let firstrecord = found[0]
            setCustomer(prev => ({
                ...prev,
                customer: firstrecord.value,
                customer_name: firstrecord.key,
                customer_address: firstrecord.data?.address,
            }))
        }
    }

    const onChange = (e) => {
        const { name, value } = e.target
        if (name === "customer") {
            let customers = libCustomers?.filter(f => String(f.value) === String(value))
            let customer = customers.length ? customers[0] : undefined
            setCustomer(prev => ({
                ...prev,
                customer: value,
                customer_name: customer?.key,
                customer_address: customer?.data?.address,
            }))
            return
        }
        setCustomer(prev => ({
            ...prev,
            [name]: value,
        }))
    }

    const onClose = () => {
        dispatch(resetPaymentPayor())
    }

    const onReset = () => {
        setCustomer({
            customer: "4339",
            customer_name: "Walkin",
            customer_address: "",
            newcustomer: "",
            newaddress: "",
            newcontact: "",
        })
    }

    const onSelect = (item) => {
        dispatch(setPaymentCustomer({
            id: item.data?.id,
            name: item.data?.name,
            address: item.data?.address,
        }))
        dispatch(resetPaymentPayor())
    }

    const onSubmit = (e) => {
        e.preventDefault()
        dispatch(setPaymentCustomer({
            id: customer.customer,
            name: customer.customer_name,
            address: customer.customer_address,
        }))
        dispatch(resetPaymentPayor())
    }

    const onRegister = async () => {
        if (!customer.newcustomer) {
            toast.showWarning("Customer name is required.")
            return
        }
        if (!customer.newcontact) {
            toast.showWarning("Customer contact no. is required.")
            return
        }
        let data = {
            name: customer.newcustomer,
            address: customer.newaddress,
            constact: customer.newcontact
        }
        await createCustomer(data)
            .unwrap()
            .then(res => {
                if (res.success) {
                    setInstance(createInstance())
                    setCustomer(prev => ({
                        ...prev,
                        newcustomer: "",
                        newaddress: "",
                        newcontact: "",
                    }))
                    setSearch("")
                    setNewCustomer(false)
                    toast.showSuccess("Customer has been successfully added to the list.")
                }
            })
            .catch(err => console.error(err))
    }

    useEffect(() => {
        if (dataSelector.payor) {
            setNewCustomer(false)
            setSearch(dataSelector?.customer?.name || "")
            if (!dataSelector?.customer?.name) {
                onReset()
                return
            }
            setCustomer({
                customer: dataSelector?.customer?.id,
                customer_name: dataSelector?.customer?.name,
                customer_address: dataSelector?.customer?.address,
                newcustomer: "",
                newaddress: "",
                newcontact: "",
            })
        }
    }, [dataSelector.payor])

    return (
        <Transition
            show={dataSelector.payor}
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
                <div className="flex flex-col gap-2 bg-white p-3 w-screen lg:w-[600px] h-fit text-lg mt-1 transition ease-in-out duration-300">
                    <div className="flex items-center justify-between">
                        <div>PAYMENT OPTIONS</div>
                        <div onClick={() => onClose()}>
                            <XMarkIcon className="w-5 h-5 cursor-pointer" />
                        </div>
                    </div>
                    <form onSubmit={onSubmit} className="flex flex-col gap-3 mt-2 p-5">
                        <div className="flex border border-secondary-500 p-0.5 items-center">
                            <input
                                type="search"
                                name="search"
                                value={search}
                                onChange={onSearchChange}
                                autoComplete="off"
                                autoFocus
                                tabIndex={0}
                                placeholder="Search customer here..."
                                className="w-full border-none focus:border-none outline-none ring-0 focus:ring-0 focus:outline-none grow-1"
                            />
                        </div>
                        <div className="flex flex-col border border-secondary-500 p-0.5 items-center h-[200px] text-lg overflow-y-scroll">
                            {
                                libCustomers?.filter(f => f?.key?.toLowerCase()?.includes(search?.toLowerCase())).map(lib => (
                                    <div key={lib.value} className="flex items-center w-full px-2 cursor-pointer hover:bg-primary-200 py-3 lg:py-2 text-base" onClick={() => onSelect(lib)}>
                                        {lib.key}
                                        <button type="button" className="ml-auto button-link py-1 no-select">Select</button>
                                    </div>
                                ))
                            }
                        </div>
                        {/* <div className="flex border border-secondary-500 p-0.5 items-center">
                            <select
                                name="customer"
                                value={customer.customer}
                                onChange={onChange}
                                required
                                className="w-full border-none focus:border-none outline-none ring-0 focus:ring-0 focus:outline-none grow-1 disabled:bg-gray-300">
                                {
                                    libCustomers?.map(lib => (
                                        <option
                                            key={lib.value}
                                            value={lib.value} className="text-sm"
                                        >
                                            {lib.key}
                                        </option>
                                    ))
                                }
                            </select>
                        </div> */}
                        <div className={`${newCustomer ? "hidden" : "flex"} w-full justify-end`}>
                            <button type="button" className="button-blue" onClick={() => setNewCustomer(!newCustomer)}>Create New Customer</button>
                        </div>
                        <div className={`${newCustomer ? "flex" : "hidden"} flex-col gap-3 mt-2 p-5 border border-secondary-500`}>
                            <div>New Customer:</div>
                            <div className="flex border border-secondary-500 p-0.5 items-center">
                                <input
                                    type="text"
                                    name="newcustomer"
                                    value={customer.newcustomer}
                                    onChange={onChange}
                                    autoComplete="off"
                                    required={newCustomer}
                                    placeholder="Customer Name"
                                    className="w-full border-none focus:border-none outline-none ring-0 focus:ring-0 focus:outline-none grow-1"
                                />
                            </div>
                            <div className="flex border border-secondary-500 p-0.5 items-center">
                                <input
                                    type="text"
                                    name="newaddress"
                                    value={customer.newaddress}
                                    onChange={onChange}
                                    autoComplete="off"
                                    placeholder="Customer Address"
                                    className="w-full border-none focus:border-none outline-none ring-0 focus:ring-0 focus:outline-none grow-1"
                                />
                            </div>
                            <div className="flex border border-secondary-500 p-0.5 items-center">
                                <input
                                    type="text"
                                    name="newcontact"
                                    value={customer.newcontact}
                                    onChange={onChange}
                                    autoComplete="off"
                                    required={newCustomer}
                                    placeholder="Customer Contact"
                                    className="w-full border-none focus:border-none outline-none ring-0 focus:ring-0 focus:outline-none grow-1"
                                />
                            </div>
                            <div className={`${newCustomer ? "flex" : "hidden"} w-full justify-end gap-3`}>
                                <button type="button" className="button-cancel" onClick={() => setNewCustomer(false)}>Cancel</button>
                                <button type="button" className="button-blue" onClick={() => onRegister()}>Register Customer</button>
                            </div>
                        </div>
                        <div className={`${newCustomer ? "hidden" : ""} text-xs ml-auto`}>
                            **Note: Add Customer button will apply the very first customer in the list above.
                        </div>
                        <div className="flex flex-col-reverse md:flex-row gap-2 lg:gap-0 justify-end">
                            <button type="button" tabIndex={-1} className="button-cancel w-full md:w-fit" onClick={() => onClose()}>Cancel</button>
                            <button type="submit" className="button-submit disabled:bg-gray-400" disabled={newCustomer}>Add Customer</button>
                        </div>
                    </form>
                </div>
            </Transition.Child>
        </Transition>
    )
}

export default PaymentCustomer
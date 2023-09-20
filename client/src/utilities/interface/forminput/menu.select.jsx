import { Listbox, Transition } from "@headlessui/react"
import { CheckIcon, ChevronDownIcon, Square2StackIcon } from "@heroicons/react/20/solid"
import { Fragment, useState } from "react"

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function MenuSelect({ options, callback }) {
    const [selected, setSelected] = useState(options ? options[0] : undefined)

    const onSelect = (option) => {
        setSelected(option)
        if (callback) callback(option)
    }

    return (
        <Listbox value={selected} onChange={onSelect}>
            {({ open }) => (
                <>
                    {/* <Listbox.Label className="sr-only">Change published status</Listbox.Label> */}
                    <div className="relative w-500">
                        <div className="inline-flex divide-x divide-indigo-700 rounded-md shadow-sm">
                            <div className="inline-flex items-center gap-x-3 rounded-l-md bg-indigo-600 px-3 py-2 text-white shadow-sm">
                                <Square2StackIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                                <p className="text-sm font-semibold">{options ? selected?.key : "No options"}</p>
                            </div>
                            <Listbox.Button autoFocus={false} tabIndex={-1} className="inline-flex items-center rounded-l-none rounded-r-md bg-indigo-600 p-2 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:ring-offset-gray-50">
                                {/* <span className="sr-only">Change published status</span> */}
                                <ChevronDownIcon className="h-5 w-5 text-white" aria-hidden="true" />
                            </Listbox.Button>
                        </div>

                        <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Listbox.Options className="absolute right-0 z-20 mt-2 w-72 origin-top-right divide-y divide-gray-200 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                {options?.map((option) => (
                                    <Listbox.Option
                                        key={option.value}
                                        className={({ active }) =>
                                            classNames(
                                                active ? 'bg-indigo-700 text-white' : 'bg-indigo-600 text-white',
                                                'cursor-default select-none p-2 text-sm'
                                            )
                                        }
                                        value={option}
                                    >
                                        {({ selected, active }) => (
                                            <div className="flex flex-col cursor-pointer">
                                                <div className="flex justify-between">
                                                    <p className={selected ? 'font-semibold' : 'font-normal'}>{option?.key}</p>
                                                    {selected ? (
                                                        <span className={active ? 'text-white' : 'text-indigo-600'}>
                                                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                        </span>
                                                    ) : null}
                                                </div>
                                                {/* <p className={classNames(active ? 'text-indigo-200 text-xs' : 'text-indigo-200 text-xs', 'mt-1')}>
                                                    {option?.description}
                                                </p> */}
                                            </div>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Transition>
                    </div>
                </>
            )}
        </Listbox>
    )
}
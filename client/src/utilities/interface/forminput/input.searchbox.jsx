import { ExclamationCircleIcon, XCircleIcon } from "@heroicons/react/20/solid"
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { useEffect, useRef, useState } from "react"
import { isEmpty } from "../../functions/string.functions"
import StaticContainer from "./static.container"
import StaticLabel from "./static.label"

export default function SearchBox(props) {
    const [list, setList] = useState([])
    const [selected, setSelected] = useState()
    const [search, setSearch] = useState("")
    const [key, setKey] = useState("")
    const [initialize, setInitialize] = useState(true)
    const [initValue, setInitValue] = useState(0)

    const {
        name,
        label,
        style,
        wrapper,
        appendSearch,
        placeholder,
        loading,
        items,
        setter,
        values,
        optional,
        register,
        errors,
        ...rest
    } = props

    const searchRef = useRef(name)

    useEffect(() => {
        register(`${name}_items`)
        register(`${name}_exact`)
        register(`${name}_search`)
    }, [name])

    const onKeyDown = async (e) => {
        if (e.key === "Tab") {
            if (search && !key) {
                e.preventDefault()
                if (list.length) {
                    let topmatch = list[0]
                    topmatch.selected = true
                    setList([topmatch])
                    setter(name, topmatch.value)
                    setKey(topmatch.key)
                    return
                }
                // if (appendSearch) await appendSearch(search)
            }
        }
        if (e.key === "Enter") {
            if (search && !key) {
                e.preventDefault()
                if (appendSearch) await appendSearch(search)
            }
        }
    }

    const performAppend = async () => {
        if (appendSearch) await appendSearch(search)
    }

    useEffect(() => {
        if (selected?.key) {
            setList(prev => prev?.map(f => {
                if (f.value === selected.value) {
                    return { ...f, selected: true }
                }
                return { ...f, selected: false }
            }))
            setSelected({ key: "", value: "", selected: false })
            return
        }
    }, [selected])

    useEffect(() => {
        if (items.length) {
            if (initialize) {
                let newList = items
                setList(newList)

                if (values?.hasOwnProperty(name)) {
                    if (values[name]) {
                        let loaded = newList.filter(f => f.value === values[name])
                        setter(name, loaded[0].value)
                        setKey(loaded[0].key)
                        setInitValue(loaded[0].value)
                        setList(loaded)
                    }
                }

                setInitialize(false)
                return
            }
            let newList = items.map(f => { return { ...f, selected: false } })

            setter(name, 0)
            if (!search) {
                setList(newList)
                return
            }
            let similar = newList.filter(f => f.key?.toLowerCase()?.trim().includes(search?.toLowerCase()?.trim()))
            setList(similar)
        }
    }, [search, items, values])

    useEffect(() => {
        setter(`${name}_items`, list.length || 0)
        setter(`${name}_exact`, 0)
        let exact = list.filter(f => f.key?.toLowerCase().trim() === search?.toLowerCase().trim())
        if (exact?.length === 1) {
            setter(`${name}_exact`, 1)
        }
    }, [list])

    const selectItem = (item) => {
        setter(name, item.value)
        setSelected(item)
        setKey(item.key)
    }

    const onSearch = (e) => {
        if (!key) {
            setSearch(e.target.value)
            setter(`${name}_search`, e.target.value)
        }
    }

    const clearKey = () => {
        setSelected({ key: "", value: "", selected: false })
        setKey()
        setter(name, 0)
        searchRef.current.focus()
        if (search) {
            setList(prev => prev?.map(f => {
                return { ...f, selected: false }
            }))
        }
        setList(items?.map(f => {
            return { ...f, selected: false }
        }))
    }

    return (
        <StaticContainer style={wrapper}>
            {label && (<StaticLabel name={name} label={label} optional={optional} />)}
            <StaticWrapper>
                <div className="flex relative items-center">
                    <input
                        ref={searchRef}
                        type="text"
                        className={`${errors?.[name] ? "input-field-error" : "input-field"} ${style}`}
                        placeholder={placeholder}
                        id={`${name}_search`}
                        value={key ? key : search}
                        onChange={onSearch}
                        onKeyDown={onKeyDown}
                        autoComplete="off"
                        {...rest}
                    />
                    <div className="flex gap-1 absolute right-2">
                        <XMarkIcon
                            className={`w-5 h-5 cursor-pointer ${search && !key ? "" : "hidden"}`}
                            onClick={() => setSearch("")}
                        />
                        <XCircleIcon
                            className={`w-5 h-5 cursor-pointer ${key ? "" : "hidden"}`}
                            onClick={() => clearKey()}
                        />
                    </div>
                </div>
                <div className="w-full min-h-[150px] max-h-[170px] overflow-auto rounded border border-gray-300 flex flex-col mt-3">
                    <div
                        className="text-sm py-2 px-3 text-blue-700 cursor-pointer hover:text-blue-800 hover:underline no-select"
                        onClick={() => performAppend()}
                    >
                        Append search input to list
                    </div>
                    {
                        (!loading) ? (
                            list?.map((item, index) => (
                                <div
                                    key={index}
                                    className="space-y-5 w-full no-select cursor-pointer hover:bg-gray-200 px-3"
                                    onClick={() => selectItem(item)}
                                >
                                    <div className="relative flex items-center justify-between my-1">
                                        <div className="text-sm leading-6">
                                            <label htmlFor={item.key} className="font-medium text-gray-900">
                                                {item?.key}
                                            </label>
                                        </div>
                                        <div className="flex h-full items-center">
                                            <CheckIcon className={`w-5 h-5 ${item.selected ? "" : "hidden"}`} />
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="space-y-5 px-3 py-2">
                                Loading...
                            </div>
                        )
                    }
                    <div
                        className={`text-xs py-2 px-3 text-gray-700 no-select absolute bottom-0 ${searchRef.current === document.activeElement && ((!list.length && !isEmpty(search)) || (!isEmpty(search) && list?.filter(f => f.key?.toLowerCase().trim() === search?.toLowerCase().trim()).length === 1)) ? "" : "hidden"}`}
                    >
                        Press <b>ENTER</b> to <u>register</u> search input
                    </div>
                    <div
                        className={`text-xs py-2 px-3 text-gray-700 no-select absolute bottom-0 ${searchRef.current === document.activeElement && (!isEmpty(search) && list?.length === 1) ? "" : "hidden"}`}
                    >
                        Press <b>TAB</b> to <u>select</u> available option <br />
                        Press <b>ENTER</b> to <u>register</u> search input
                    </div>
                </div>
                <input
                    type="hidden"
                    className={
                        errors?.[name] ? "input-field-error" : "input-field"
                    }
                    id={name}
                    {...register(name)}
                />
            </StaticWrapper>
            {errors?.[name] && (
                <div className="flex pointer-events-none items-start mt-2 gap-2">
                    <ExclamationCircleIcon
                        className="h-5 w-5 text-red-500 flex-none"
                        aria-hidden="true"
                    />
                    <p className="text-sm text-red-600">
                        {errors?.[name]?.message}
                    </p>
                </div>
            )}
            {errors?.[`${name}_exact`] && (
                <div className="flex pointer-events-none items-start mt-2 gap-2">
                    <ExclamationCircleIcon
                        className="h-5 w-5 text-red-500 flex-none"
                        aria-hidden="true"
                    />
                    <p className="text-sm text-red-600">
                        {errors?.[`${name}_exact`]?.message}
                    </p>
                </div>
            )}
        </StaticContainer>
    )
}
import { useRef } from "react"
import StaticContainer from "./static.container"
import StaticInvalid from "./static.invalid"
import StaticLabel from "./static.label"
import StaticWrapper from "./static.wrapper"

export default function Area(props) {
    const areaRef = useRef(null)

    const {
        ref,
        name,
        label,
        style,
        wrapper,
        setter,
        state,
        placeholder,
        nobreak,
        notab,
        optional,
        register,
        errors,
        ...rest
    } = props

    const onKeyDown = async (e) => {
        if (e.key == 'Tab') {
            e.preventDefault()
            const { selectionStart, selectionEnd } = e.target

            const newText = state.substring(0, selectionStart) + '    ' + state.substring(selectionEnd, state.length)

            setter(name, newText)
            e.target.focus()
            e.target.setSelectionRange(selectionStart + 4, selectionStart + 4)
        }
    }

    return (
        <StaticContainer style={wrapper}>
            <StaticLabel name={name} label={label} optional={optional} />
            <StaticWrapper>
                <textarea
                    ref={areaRef}
                    id={name}
                    className={`${errors?.[name] ? "input-field-error" : "input-field"} ${style}`}
                    cols="30"
                    rows="10"
                    placeholder={placeholder}
                    onKeyDown={onKeyDown}
                    {...register(name)}
                    {...rest}
                >
                </textarea>
            </StaticWrapper>
            <StaticInvalid name={name} errors={errors} />
        </StaticContainer>
    )
}
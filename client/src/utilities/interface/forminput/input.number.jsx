import StaticContainer from "./static.container"
import StaticInvalid from "./static.invalid"
import StaticLabel from "./static.label"
import StaticWrapper from "./static.wrapper"

export default function Number(props) {
    const {
        name,
        label,
        style,
        wrapper,
        placeholder,
        optional,
        register,
        errors,
        ...rest
    } = props

    return (
        <StaticContainer style={wrapper}>
            <StaticLabel name={name} label={label} optional={optional} />
            <StaticWrapper>
                <input
                    id={name}
                    type="number"
                    className={`${errors?.[name] ? "input-field-error" : "input-field"} ${style}`}
                    placeholder={placeholder}
                    {...register(name)}
                    {...rest}
                />
                {/* <StaticError name={name} errors={errors} /> */}
            </StaticWrapper>
            {/* <StaticNotice name={name} errors={errors} /> */}
            <StaticInvalid name={name} errors={errors} />
        </StaticContainer>
    )
}
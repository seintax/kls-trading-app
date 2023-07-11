import StaticContainer from "./static.container"
import StaticInvalid from "./static.invalid"
import StaticLabel from "./static.label"
import StaticWrapper from "./static.wrapper"

export default function Select(props) {
    const {
        name,
        label,
        style,
        wrapper,
        options,
        optional,
        register,
        errors,
        ...rest
    } = props

    const renderOptions = (options) => {
        register(`${name}data`)
        return (
            (options?.length) ? (
                <>
                    {
                        options?.map((option, index) => (
                            <option key={index} value={option.value}>
                                {option.key}
                            </option>
                        ))
                    }
                </>
            ) : (
                <option value="" disabled>
                    No options provided.
                </option>
            )
        )
    }

    return (
        <StaticContainer style={wrapper}>
            {label && (
                <StaticLabel name={name} label={label} optional={optional} />
            )}
            <StaticWrapper>
                <select
                    id={name}
                    className={`${errors?.[name] ? "input-field-error" : "select-field"} ${style}`}
                    {...register(name)}
                    {...rest}
                >
                    {renderOptions(options)}
                </select>
                {/* <StaticError name={name} errors={errors} /> */}
            </StaticWrapper>
            {/* <StaticNotice name={name} errors={errors} /> */}
            <StaticInvalid name={name} errors={errors} />
        </StaticContainer>
    )
}
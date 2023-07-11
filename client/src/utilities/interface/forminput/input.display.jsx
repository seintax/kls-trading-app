import StaticContainer from "./static.container"
import StaticInvalid from "./static.invalid"
import StaticLabel from "./static.label"
import StaticWrapper from "./static.wrapper"

export default function Display(props) {
    const {
        name,
        label,
        style,
        wrapper,
        register,
        errors,
        ...rest
    } = props

    return (
        <StaticContainer style={wrapper}>
            <StaticLabel name={name} label={label} />
            <StaticWrapper>
                <input
                    id={name}
                    type="text"
                    className={`input-field ${style}`}
                    readOnly={true}
                    tabIndex={-1}
                    {...register(name)}
                    {...rest}
                />
            </StaticWrapper>
            <StaticInvalid name={name} errors={errors} />
        </StaticContainer>
    )
}
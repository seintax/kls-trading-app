import StaticDisplay from "./static.display"
import StaticTitle from "./static.title"
import StaticWrapper from "./static.wrapper"

export default function Item(props) {
    const {
        label,
        value,
        style
    } = props

    return (
        <StaticDisplay>
            <StaticTitle label={label} />
            <StaticWrapper>
                <div className="hidden lg:flex">:</div>
                <div className="w-full">
                    <input
                        type="text"
                        className={`item-field border-b border-b-gray-400 focus:read-only:border-b-gray-400 ${style}`}
                        value={value}
                        readOnly={true}
                    />
                </div>
            </StaticWrapper>
        </StaticDisplay>
    )
}
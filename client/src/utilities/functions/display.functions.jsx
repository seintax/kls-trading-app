export const ItemView = ({ main, subtext, reverse = false }) => {
    return <div className={`w-full flex gap-3 ${reverse ? "flex-col-reverse" : "flex-col"}`}>
        <div className="text-sm">{main}</div>
        <div className="text-xs text-gray-700">{subtext}</div>
    </div>
}
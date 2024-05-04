export const ItemView = ({ main, subtext, reverse = false }) => {
    return <div className={`w-full flex gap-2 pl-1 ${reverse ? "flex-col-reverse" : "flex-col"}`}>
        <div className="text-sm">{main}</div>
        <div className="text-[11px] text-gray-500">{subtext}</div>
    </div>
}
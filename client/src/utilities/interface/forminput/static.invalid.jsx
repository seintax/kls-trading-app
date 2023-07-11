import { ExclamationCircleIcon } from "@heroicons/react/20/solid"

const StaticInvalid = ({ name, errors }) => {
    return (
        (errors) ? (
            errors?.[name] && (
                <div className="flex pointer-events-none absolute bottom-0 right-0 items-center pr-3 gap-2">
                    <ExclamationCircleIcon
                        className="h-5 w-5 text-red-500"
                        aria-hidden="true"
                    />
                    <p className="text-sm text-red-600">
                        {errors?.[name]?.message}
                    </p>
                </div>
            )
        ) : null
    )
}

export default StaticInvalid
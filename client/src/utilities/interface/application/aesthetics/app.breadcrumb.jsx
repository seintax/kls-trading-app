import { HomeIcon } from "@heroicons/react/20/solid"
import { Link } from "react-router-dom"
import { StrFn } from "../../../functions/string.functions"

const AppBreadcrumbs = ({ pages }) => {

    const formatPageName = (name) => {
        if (name.includes("-")) {
            return name?.split("-")?.map(f => { return StrFn.properCase(f) })?.join(" ")
        }
        return name
    }

    return (
        <nav
            className="hidden sm:flex bg-white border border-b-primary-500 top-0 z-11 py-2 pl-4 no-select text-xs drop-shadow-lg"
            aria-label="Breadcrumb"
        >
            <ol role="list" className="flex items-center space-x-2">
                <li>
                    <div>
                        <Link to="/dashboard" className="text-gray-400 hover:text-primary-500 ">
                            <HomeIcon
                                className="h-5 w-5 flex-shrink-0 fill-primary-500 hover:fill-[#132061]"
                                aria-hidden="true"
                            />
                            <span className="sr-only">Home</span>
                        </Link>
                    </div>
                </li>
                {pages?.map((page) => (
                    <li key={page.name} className={!isNaN(page.name) ? "hidden" : ""}>
                        <div className="flex items-center">
                            <span className="mx-2 text-secondary-300">&#10095;</span>
                            {page.current ? (
                                <span className="ml-2 text-sm text-primary-500 px-2 font-bold rounded-[5px] py-1">{formatPageName(page.name)}</span>
                            ) : (
                                <Link
                                    to={page.href}
                                    className="ml-2 text-sm text-primary-400 px-2 font-medium rounded-[5px] py-1"
                                    aria-current={page.current ? "page" : undefined}
                                >
                                    {formatPageName(page.name)}
                                </Link>
                            )}
                        </div>
                    </li>
                ))}
            </ol>
        </nav>
    )
}

export default AppBreadcrumbs
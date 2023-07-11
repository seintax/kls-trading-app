import moment from "moment"
import { toast } from 'react-toastify'

export default function useToast() {
    const userNotify = (name) => {
        let options = {
            style: {
                borderWidth: 1,
                borderColor: "#048b0f",
            },
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
        }
        toast(<>
            <div className="flex py-2 h-full items-start">
                <span className="mr-3 text-3xl">👋🏽</span>
                <span className="text-md h-full flex items-center py-2">Welcome, {name}</span>
            </div>
        </>, options)
    }

    const showError = (message) => {
        let options = {
            style: {
                background: `#fac1c1`,
                borderWidth: 2,
                borderColor: "#f50909",
                color: '#960505'
            },
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
        }
        toast(<>
            <div className="flex flex-col gap-1 pb-2">
                <div className="flex py-2 h-full items-start">
                    <span className="mr-3 text-xl">🚫</span>
                    <span className="text-sm h-full flex items-start justify-center py-1">
                        <b>Error</b>:
                    </span>
                </div>
                <div className="pl-10 text-sm">{message}</div>
            </div>
        </>, options)
    }

    const showSuccess = (message) => {
        let options = {
            style: {
                background: `#baf7bf`,
                borderWidth: 2,
                borderColor: "#048b0f",
                color: '#037729'
            },
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
        }
        toast(<>
            <div className="flex py-2 h-full items-start">
                <span className="mr-3 text-xl">✅</span>
                <span className="text-sm h-full flex items-center py-1">
                    {message}
                </span>
            </div>
        </>, options)
    }

    const showWarning = (message) => {
        let options = {
            style: {
                borderWidth: 2,
                borderColor: "#fd9b07",
                color: '#817f07'
            },
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
        }
        toast(<>
            <div className="flex py-2 h-full items-start">
                <span className="mr-3 text-xl">⚠️</span>
                <span className="text-sm h-full flex items-center py-1">
                    {message}
                </span>
            </div>
        </>, options)
    }

    const showDelete = (message) => {
        let options = {
            style: {
                borderWidth: 2,
                borderColor: "#048b0f",
            },
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
        }
        toast(<>
            <div className="flex flex-col gap-1 pb-2">
                <div className="flex py-2 h-full items-start">
                    <span className="mr-3 text-lg">🧻</span>
                    <span className="text-xs h-full flex items-start justify-center py-1">
                        <b>Deletion</b>: {moment(new Date()).format("MM-DD-YYYY hh:mm:ss A")}
                    </span>
                </div>
                <div className="pl-10 text-sm">{message}</div>
            </div>
        </>, options)
    }

    const showUpdate = (message) => {
        let options = {
            style: {
                borderWidth: 2,
                borderColor: "#048b0f",
            },
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
        }
        toast(<>
            <div className="flex flex-col gap-1 pb-2">
                <div className="flex py-2 h-full items-start">
                    <span className="mr-3 text-lg">📝</span>
                    <span className="text-xs h-full flex items-start justify-center py-1">
                        <b>Modification</b>: {moment(new Date()).format("MM-DD-YYYY hh:mm:ss A")}
                    </span>
                </div>
                <div className="pl-10 text-sm">{message}</div>
            </div>
        </>, options)
    }

    const showCreate = (message) => {
        let options = {
            style: {
                borderWidth: 2,
                borderColor: "#048b0f",
            },
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
        }
        toast(<>
            <div className="flex flex-col gap-1 pb-2">
                <div className="flex py-2 h-full items-start">
                    <span className="mr-3 text-lg">📃</span>
                    <span className="text-xs h-full flex items-start justify-center py-1">
                        <b>Creation</b>: {moment(new Date()).format("MM-DD-YYYY hh:mm:ss A")}
                    </span>
                </div>
                <div className="pl-10 text-sm">{message}</div>
            </div>
        </>, options)
    }

    const showPending = (promise, pending, success, error) => {
        let options = {
            style: {
                borderWidth: 1,
                borderColor: "#05c936",
            },
            position: "bottom-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
        }
        toast.promise(promise, { pending, success, error }, options)
    }

    const showLoading = (initialmsg) => {
        let options = {
            style: {
                borderWidth: 1,
                borderColor: "#05c936",
            },
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
        }
        return toast.loading(initialmsg, options)
    }

    const updateLoading = (id, render, isLoading, type) => {
        return toast.update(id, { render, type, isLoading, autoClose: 2000 })
    }

    const customToast = (message) => {
        let options = {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
        }
        toast(<>
            <div className="flex py-2">
                <span className="mr-3">🚮</span>
                <span className="text-sm">{message}</span>
            </div>
        </>, options)
    }

    return {
        userNotify,
        showError,
        showSuccess,
        showWarning,
        showCreate,
        showUpdate,
        showDelete,
        showPending,
        showLoading,
        updateLoading,
        customToast
    }
}
import { ArchiveBoxXMarkIcon, PencilSquareIcon } from "@heroicons/react/20/solid"
import { toast } from 'react-toastify'

export default function useToast() {
    const userNotify = (name) => {
        let options = {
            style: {
                background: `linear-gradient(40deg, #dcfa30, #87f806, #04fa56, #04fad9, #04d5fa, #f204fa)`,
                color: '#fd0303'
            },
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "colored",
        }
        toast(`Welcome, ${name}`, options)
    }

    const showError = (message) => {
        let options = {
            style: {
                background: `#fc6f6f`,
                borderWidth: 1,
                borderColor: "#f50909",
                color: '#960505'
            },
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "colored",
        }
        toast.error(message, options)
    }

    const showSuccess = (message) => {
        let options = {
            style: {
                background: `#3bfc4b`,
                borderWidth: 1,
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
        toast.success(message, options)
    }

    const showWarning = (message) => {
        let options = {
            style: {
                background: `#e7e415`,
                borderWidth: 1,
                borderColor: "#aaa705",
                color: '#817f07'
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
        toast.warning(message, options)
    }

    const showDelete = (message) => {
        let options = {
            style: {
                background: `#26f8dc`,
                borderWidth: 1,
                borderColor: "#01a08b",
                color: '#027061'
            },
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "colored",
        }
        toast(
            <span className="flex gap-2 items-center">
                <ArchiveBoxXMarkIcon className="w-6 h-6 flex-none text-[#03879e]" /> {message}
            </span>,
            options
        )
    }

    const showUpdate = (message) => {
        let options = {
            style: {
                background: `#fd40ed`,
                borderWidth: 1,
                borderColor: "#af04a1",
                color: '#800575'
            },
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "colored",
        }
        toast(
            <span className="flex gap-2 items-center">
                <PencilSquareIcon className="w-6 h-6 flex-none text-[#800575]" /> {message}
            </span>,
            options
        )
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

    return {
        userNotify,
        showError,
        showSuccess,
        showWarning,
        showDelete,
        showUpdate,
        showPending,
        showLoading,
        updateLoading
    }
}
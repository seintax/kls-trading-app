import { useMutation, useQueryClient } from "react-query"
import useSystemTool from "../hooks/useSystem"
import useToast from "../hooks/useToast"

export const processForm = (id, name, updateFunc, createFunc, queryKey, callBack) => {
    const toast = useToast()
    const { dataErrorHandler } = useSystemTool()
    const queryClient = useQueryClient()

    const { mutate } = useMutation(id ? updateFunc : createFunc, {
        onSuccess: data => {
            if (data.success) {
                toast.showSuccess(`${name} has been ${id ? 'updated' : 'added'}.`)
            }
            else {
                toast.showError(dataErrorHandler(data))
            }
        },
        onError: () => {
            toast.showError('An error occured during data mutation.')
        },
        onSettled: async () => {
            if (callBack) await callBack()
            queryClient.invalidateQueries(queryKey || `${name?.toLowerCase()}-index`)
        }
    })

    return { mutate }
}

export const specifyArgs = (array) => {
    return {
        array: JSON.stringify(array)
    }
}
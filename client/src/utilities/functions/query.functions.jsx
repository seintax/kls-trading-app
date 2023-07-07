import { useMutation, useQueryClient } from "react-query"
import { useNotifyContext } from "../context/notify.context"
import useSystemTool from "../hooks/useSystem"

export const processForm = (id, name, updateFunc, createFunc, queryKey, callBack) => {
    const { notify } = useNotifyContext()
    const { dataErrorHandler } = useSystemTool()
    const queryClient = useQueryClient()

    const { mutate } = useMutation(id ? updateFunc : createFunc, {
        onSuccess: data => {
            if (data.success) {
                notify({
                    type: 'success',
                    message: `${name} has been ${id ? 'updated' : 'added'}.`,
                })
            }
            else {
                notify({
                    type: 'error',
                    message: dataErrorHandler(data),
                })
            }
        },
        onError: () => {
            notify({
                type: 'error',
                message: 'An error occured during data mutation.',
            })
        },
        onSettled: async () => {
            if (callBack) await callBack()
            queryClient.invalidateQueries(queryKey || `${name?.toLowerCase()}-index`)
        }
    })

    return { mutate }
}
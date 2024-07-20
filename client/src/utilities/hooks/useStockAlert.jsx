import { useDispatch, useSelector } from "react-redux"
import { setNotificationNotify } from "../../modules/system/notification/notification.reducer"
import { useLatestNotificationMutation } from "../../modules/system/notification/notification.services"
import { momentPST } from "../functions/datetime.functions"
import useToast from "./useToast"

export default function useStockAlert() {
    const [latest, { isLoading }] = useLatestNotificationMutation()
    const toast = useToast()
    const dispatch = useDispatch()
    const notifySelector = useSelector(state => state.notification)
    const notifversion = localStorage.getItem("notify") || 0

    const validate = async () => {
        await latest({ type: "STOCK ALERT", limit: 10, date: momentPST(new Date(), "YYYY-MM-DD") })
            .unwrap()
            .then(res => {
                if (res.success && res?.data?.length === 1) {
                    const data = res?.data[0]
                    if (!String(notifversion).includes(`:${String(data.ntfy_id)}:`)) {
                        toast.showCreate(data.ntfy_message)
                        localStorage.setItem("notify", `:${data.ntfy_id}:NEW`)
                        dispatch(setNotificationNotify(true))
                        return
                    }
                    if (notifversion.includes("NEW")) {
                        dispatch(setNotificationNotify(true))
                    }
                }
            })
            .catch(err => console.error(err))
    }

    return { validate, isLoading }
}
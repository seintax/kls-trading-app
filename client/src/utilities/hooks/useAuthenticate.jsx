import { useDispatch, useSelector } from "react-redux"
import { resetLoggedIn } from "../redux/slices/authSlice"

const parseJwt = (token) => {
    try {
        return JSON.parse(atob(token.split(".")[1]))
    } catch (e) { return null }
}

export default function useAuthenticate() {
    const authSelector = useSelector(state => state.auth)
    const token = authSelector.token
    const logged = authSelector.loggedin
    const dispatch = useDispatch()

    if (logged) {
        dispatch(resetLoggedIn())
        return true
    }

    if (token) {
        const decodedJwt = parseJwt(token)
        if (decodedJwt?.exp * 1000 > Date.now()) {
            return true
        }
        return false
    }

    return false
}
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useLogoutMutation } from "../../modules/system/account/account.services"
import { clearCredentials } from "../redux/slices/authSlice"

export default function useLogout() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [authLogout] = useLogoutMutation()

    const logout = async () => {
        await authLogout().unwrap()
            .then(res => {
                dispatch(clearCredentials())
                navigate('/')
            })
            .catch(err => console.error(err))
    }

    return {
        logout,
    }
}

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user_info: localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')) : null,
    token: localStorage.getItem('token') ? localStorage.getItem('token') : "",
    loggedin: false,
    role: ""
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.user_info = action.payload
            localStorage.setItem('auth', JSON.stringify(action.payload))
        },
        setRole: (state, action) => {
            state.role = action.payload
        },
        setToken: (state, action) => {
            state.token = action.payload
            state.loggedin = true
            localStorage.setItem('token', action.payload)
        },
        resetLoggedIn: (state) => {
            state.loggedin = false
        },
        clearCredentials: (state) => {
            state.user_info = null
            state.token = ""
            localStorage.removeItem('auth')
        }
    }
})

const authReducer = authSlice.reducer

export const {
    setRole,
    setToken,
    setCredentials,
    resetLoggedIn,
    clearCredentials
} = authSlice.actions
export default authReducer
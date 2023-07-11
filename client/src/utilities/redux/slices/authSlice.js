import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user_info: localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')) : null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.user_info = action.payload
            localStorage.setItem('auth', JSON.stringify(action.payload))
        },
        clearCredentials: (state) => {
            state.user_info = null
            localStorage.removeItem('auth')
        }
    }
})

const authReducer = authSlice.reducer

export const { setCredentials, clearCredentials } = authSlice.actions
export default authReducer
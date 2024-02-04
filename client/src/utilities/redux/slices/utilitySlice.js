import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    scrollY: 0,
    isLogged: false,
    onScrollY: false,
}

const utilitySlice = createSlice({
    name: 'utility',
    initialState,
    reducers: {
        setLogged: (state) => {
            state.isLogged = true
        },
        setUnlogged: (state) => {
            state.isLogged = false
        },
        setScrollY: (state, action) => {
            state.scrollY = action.payload
            state.isLogged = false
        },
        setOnScrollY: (state, action) => {
            state.onScrollY = action.payload
        },
        resetUtility: (state) => {
            state.scrollY = 0
            state.isLogged = false
            state.onScrollY = false
        },
    }
})

const utilityReducer = utilitySlice.reducer

export const {
    setLogged,
    setUnlogged,
    setScrollY,
    setOnScrollY,
    resetUtility
} = utilitySlice.actions
export default utilityReducer
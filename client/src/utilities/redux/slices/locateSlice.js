import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    location: "",
}

const locateSlice = createSlice({
    name: 'locate',
    initialState,
    reducers: {
        setLocationPath: (state, action) => {
            state.location = action.payload
        },
        resetLocationPath: (state) => {
            state.location = ""
        },
    }
})

const locateReducer = locateSlice.reducer

export const { setLocationPath, resetLocationPath } = locateSlice.actions
export default locateReducer
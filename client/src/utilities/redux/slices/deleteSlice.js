import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    shown: false,
    description: "Description",
    reference: ""
}

const deleteSlice = createSlice({
    name: 'deleteModal',
    initialState,
    reducers: {
        showDelete: (state, action) => {
            state.shown = true
            state.description = action.payload.description
            state.reference = action.payload.reference
        },
        closeDelete: (state) => {
            state.shown = false
            state.description = "Description"
            state.reference = ""
        },
    }
})

const deleteReducer = deleteSlice.reducer

export const { showDelete, closeDelete } = deleteSlice.actions
export default deleteReducer
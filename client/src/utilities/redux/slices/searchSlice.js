import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    searchKey: "",
}

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setSearchKey: (state, action) => {
            state.searchKey = action.payload
        },
        resetSearchKey: (state) => {
            state.searchKey = ""
        },
    }
})

const searchReducer = searchSlice.reducer

export const { setSearchKey, resetSearchKey } = searchSlice.actions
export default searchReducer
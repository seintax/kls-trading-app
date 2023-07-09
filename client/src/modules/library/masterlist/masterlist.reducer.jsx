import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: "masterlist",
    data: [],
    item: {},
    manager: false,
    notifier: false,
    perpage: 150,
    display: {
        name: "Masterlist",
        text: "A list of all masterlist registered in the system."
    },
    header: {
        items: [
            { name: 'Product Name', stack: true, sort: 'name' },
            { name: 'Category', stack: false, sort: 'category', size: 250 },
            { name: '', stack: false, screenreader: 'Action', size: 200 }
        ]
    }
}

const masterlistSlice = createSlice({
    name: 'masterlist',
    initialState,
    reducers: {
        setMasterlistData: (state, action) => {
            state.data = action.payload
        },
        setMasterlistItem: (state, action) => {
            state.item = action.payload
        },
        resetMasterlistItem: (state) => {
            state.item = {}
        },
        showMasterlistManager: (state) => {
            state.manager = true
        },
        resetMasterlistManager: (state) => {
            state.manager = false
        },
        setMasterlistNotifier: (state, action) => {
            state.notifier = action.payload
        },
        resetMasterlist: (state) => {
            state.data = []
            state.item = {}
            state.manager = false
            state.notifier = false
        }
    }
})

const masterlistReducer = masterlistSlice.reducer

export const {
    setMasterlistData,
    setMasterlistItem,
    resetMasterlistItem,
    setMasterlistNotifier,
    showMasterlistManager,
    resetMasterlistManager,
    resetMasterlist
} = masterlistSlice.actions

export default masterlistReducer
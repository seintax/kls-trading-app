import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: "category",
    data: [],
    item: {},
    manager: false,
    notifier: false,
    perpage: 150,
    display: {
        name: "Category",
        text: "A list of all categories registered in the system."
    },
    header: {
        items: [
            { name: 'Category', stack: true, sort: 'name' },
            { name: 'Status', stack: false, sort: 'status', size: 250 },
            { name: '', stack: false, screenreader: 'Action', size: 200 }
        ]
    }
}

const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        setCategoryData: (state, action) => {
            state.data = action.payload
        },
        setCategoryItem: (state, action) => {
            state.item = action.payload
        },
        resetCategoryItem: (state) => {
            state.item = {}
        },
        showCategoryManager: (state) => {
            state.manager = true
        },
        resetCategoryManager: (state) => {
            state.manager = false
        },
        setCategoryNotifier: (state, action) => {
            state.notifier = action.payload
        },
        resetCategory: (state) => {
            state.data = []
            state.item = {}
            state.manager = false
            state.notifier = false
        }
    }
})

const categoryReducer = categorySlice.reducer

export const {
    setCategoryData,
    setCategoryItem,
    resetCategoryItem,
    setCategoryNotifier,
    showCategoryManager,
    resetCategoryManager,
    resetCategory
} = categorySlice.actions

export default categoryReducer
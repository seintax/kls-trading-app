import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: "receivable",
    data: [],
    item: {},
    manager: false,
    notifier: false,
    perpage: 150,
    display: {
        name: "Product",
        text: "",
        show: false
    },
    header: {
        items: [
            { name: 'Product Name', stack: true, sort: 'product' },
            { name: 'Variant', stack: false, sort: 'variant', size: 250 },
            { name: 'Requested', stack: false, sort: 'ordered', size: 250 },
            { name: 'Received', stack: false, sort: 'received', size: 250 },
            { name: 'Cost', stack: false, sort: 'consting', size: 250 },
            { name: '', stack: false, screenreader: 'Action', size: 200 }
        ]
    }
}

const receivableSlice = createSlice({
    name: 'receivable',
    initialState,
    reducers: {
        setReceivableData: (state, action) => {
            state.data = action.payload
        },
        setReceivableItem: (state, action) => {
            state.item = action.payload
        },
        resetReceivableItem: (state) => {
            state.item = {}
        },
        showReceivableManager: (state) => {
            state.manager = true
        },
        resetReceivableManager: (state) => {
            state.manager = false
        },
        setReceivableNotifier: (state, action) => {
            state.notifier = action.payload
        },
        resetReceivable: (state) => {
            state.data = []
            state.item = {}
            state.manager = false
            state.notifier = false
        }
    }
})

const receivableReducer = receivableSlice.reducer

export const {
    setReceivableData,
    setReceivableItem,
    resetReceivableItem,
    setReceivableNotifier,
    showReceivableManager,
    resetReceivableManager,
    resetReceivable
} = receivableSlice.actions

export default receivableReducer
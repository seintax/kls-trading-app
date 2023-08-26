import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: "returned",
    data: [],
    item: {},
    manager: false,
    notifier: false,
    perpage: 150,
    display: {
        name: "Returned",
        text: "A list of all returned in a transaction."
    },
    header: {
        items: [
            { name: 'Returned Product', stack: false, sort: 'product_name' },
            { name: 'Price', stack: true, sort: 'price', size: 150 },
            { name: 'Quantity', stack: true, sort: 'dispense', size: 200 },
            { name: 'Total', stack: true, sort: 'total', size: 150 },
            { name: 'Less', stack: true, sort: 'less', size: 150 },
            { name: 'Net', stack: false, sort: 'net', size: 150 },
            { name: 'Returned', stack: false, size: 100 },
            { name: '', stack: false, screenreader: 'Action', size: 100 }
        ]
    }
}

const returnedSlice = createSlice({
    name: 'returned',
    initialState,
    reducers: {
        setReturnedData: (state, action) => {
            state.data = action.payload
        },
        setReturnedItem: (state, action) => {
            state.item = action.payload
        },
        resetReturnedItem: (state) => {
            state.item = {}
        },
        showReturnedManager: (state) => {
            state.manager = true
        },
        resetReturnedManager: (state) => {
            state.manager = false
        },
        setReturnedNotifier: (state, action) => {
            state.notifier = action.payload
        },
        resetReturned: (state) => {
            state.data = []
            state.item = {}
            state.manager = false
            state.notifier = false
        }
    }
})

const returnedReducer = returnedSlice.reducer

export const {
    setReturnedData,
    setReturnedItem,
    resetReturnedItem,
    setReturnedNotifier,
    showReturnedManager,
    resetReturnedManager,
    resetReturned
} = returnedSlice.actions

export default returnedReducer
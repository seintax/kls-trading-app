import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: "price",
    data: [],
    item: {},
    shown: false,
    manager: false,
    notifier: false,
    perpage: 150,
    display: {
        name: "Price",
        text: "A list of all item price history for this inventory."
    },
    header: {
        items: [
            { name: 'Details', stack: false, sort: 'details' },
            { name: 'Date Applied', stack: true, sort: 'time', size: 300 },
            { name: 'Old Price', stack: false, sort: 'old_price', size: 150 },
            { name: 'New Price', stack: false, sort: 'new_price', size: 150 },
            { name: 'Adjusted By', stack: false, sort: 'account_name', size: 250 },
            { name: 'Status', stack: false, sort: 'current', size: 200 },
        ]
    }
}

const priceSlice = createSlice({
    name: 'price',
    initialState,
    reducers: {
        setPriceData: (state, action) => {
            state.data = action.payload
        },
        setPriceItem: (state, action) => {
            state.item = action.payload
        },
        resetPriceItem: (state) => {
            state.item = {}
        },
        setPriceShown: (state, action) => {
            state.shown = action.payload
        },
        showPriceManager: (state) => {
            state.manager = true
        },
        resetPriceManager: (state) => {
            state.manager = false
        },
        setPriceNotifier: (state, action) => {
            state.notifier = action.payload
        },
        resetPrice: (state) => {
            state.data = []
            state.item = {}
            state.shown = false
            state.manager = false
            state.notifier = false
        }
    }
})

const priceReducer = priceSlice.reducer

export const {
    setPriceData,
    setPriceItem,
    resetPriceItem,
    setPriceNotifier,
    setPriceShown,
    showPriceManager,
    resetPriceManager,
    resetPrice
} = priceSlice.actions

export default priceReducer
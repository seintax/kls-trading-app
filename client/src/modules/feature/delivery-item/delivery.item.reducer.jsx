import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: "receipt",
    data: [],
    item: {},
    manager: false,
    notifier: false,
    perpage: 150,
    display: {
        name: "Receipt",
        text: "A list of all delivery receipt registered in the system."
    },
    header: {
        items: [
            { name: 'Product Name', stack: true, sort: 'product' },
            { name: 'Variant', stack: false, sort: 'variant', size: 250 },
            { name: 'Purchase Order', stack: false, sort: 'purchase', size: 250 },
            { name: 'Received', stack: false, sort: 'quantity', size: 250 },
            { name: 'Cost', stack: false, sort: 'costing', size: 250 },
            { name: '', stack: false, screenreader: 'Action', size: 200 }
        ]
    },
    injoiner: {
        show: false,
        size: "w-screen lg:w-[800px] min-h-[400px]",
        title: "Delivery Receipt Item",
    },
    listing: {
        title: "Delivery Receipt Items",
        description: "List of items contained in a single delivery request",
        layout: {
            showsubtext: true,
            sizes: [
                { size: "w-full" },
                { size: "w-[150px] flex-none" },
                { size: "w-[100px] flex-none" },
                { size: "w-[150px] flex-none" },
                { size: "w-[150px] flex-none" },
            ]
        },
    },
}

const receiptSlice = createSlice({
    name: 'receipt',
    initialState,
    reducers: {
        setReceiptData: (state, action) => {
            state.data = action.payload
        },
        setReceiptItem: (state, action) => {
            state.item = action.payload
        },
        resetReceiptItem: (state) => {
            state.item = {}
        },
        showReceiptManager: (state) => {
            state.manager = true
        },
        resetReceiptManager: (state) => {
            state.manager = false
        },
        showReceiptInjoiner: (state) => {
            state.injoiner = {
                ...state.injoiner,
                show: true
            }
        },
        resetReceiptInjoiner: (state) => {
            state.injoiner = {
                ...state.injoiner,
                show: false
            }
        },
        setReceiptNotifier: (state, action) => {
            state.notifier = action.payload
        },
        resetReceiptCache: (state) => {
            state.data = []
            state.item = {}
        },
        resetReceipt: (state) => {
            state.data = []
            state.item = {}
            state.manager = false
            state.notifier = false
        }
    }
})

const receiptReducer = receiptSlice.reducer

export const {
    setReceiptData,
    setReceiptItem,
    resetReceiptItem,
    setReceiptNotifier,
    showReceiptManager,
    resetReceiptManager,
    showReceiptInjoiner,
    resetReceiptInjoiner,
    resetReceiptCache,
    resetReceipt
} = receiptSlice.actions

export default receiptReducer
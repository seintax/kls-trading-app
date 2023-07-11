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
        show: false
    },
    header: {
        items: [
            { name: 'Product Name', stack: true, sort: 'product' },
            { name: 'Variant', stack: false, sort: 'variant', size: 250 },
            { name: 'Requested', stack: false, sort: 'ordered', size: 250 },
            { name: 'Received', stack: false, sort: 'received', size: 250 },
            { name: 'Cost', stack: false, sort: 'costing', size: 250 },
            { name: '', stack: false, screenreader: 'Action', size: 200 }
        ]
    },
    injoiner: {
        show: false,
        size: "w-[800px] min-h-[400px]",
        title: "Purchase Order Item",
    },
    listing: {
        title: "Purchase Order Items",
        description: "List of items contained in a single purchase order",
        layout: {
            showsubtext: true,
            sizes: [
                { size: "w-full" },
                { size: "w-[100px] flex-none" },
                { size: "w-[100px] flex-none" },
                { size: "w-[150px] flex-none" },
            ]
        },
    },
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
        showReceivableInjoiner: (state) => {
            state.injoiner = {
                ...state.injoiner,
                show: true
            }
        },
        resetReceivableInjoiner: (state) => {
            state.injoiner = {
                ...state.injoiner,
                show: false
            }
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
    showReceivableInjoiner,
    resetReceivableInjoiner,
    resetReceivable
} = receivableSlice.actions

export default receivableReducer
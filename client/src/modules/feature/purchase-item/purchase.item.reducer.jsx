import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: "receivable",
    data: [],
    item: {},
    manager: false,
    notifier: false,
    perpage: 150,
    editcost: false,
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
            { name: 'Cost', stack: false, sort: 'rawcost', size: 250 },
            { name: '', stack: false, screenreader: 'Action', size: 200 }
        ]
    },
    injoiner: {
        show: false,
        size: "w-screen lg:w-[800px] min-h-[400px]",
        title: "Purchase Order Item",
    },
    listing: {
        title: "Purchase Order Items",
        description: "List of items contained in a single purchase order",
        layout: {
            showsubtext: true,
            sizes: [
                { size: "w-full" },
                { size: "w-[150px]" },
                { size: "w-[150px]" },
                { size: "w-[150px]" },
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
        setReceivableEditCost: (state, action) => {
            state.editcost = action.payload
        },
        setReceivableItem: (state, action) => {
            state.item = action.payload
        },
        appendReceivableItem: (state, action) => {
            state.item = {
                ...state.item,
                ...action.payload
            }
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
        resetReceivableCache: (state) => {
            state.data = []
            state.item = {}
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
    setReceivableEditCost,
    setReceivableItem,
    appendReceivableItem,
    resetReceivableItem,
    setReceivableNotifier,
    showReceivableManager,
    resetReceivableManager,
    showReceivableInjoiner,
    resetReceivableInjoiner,
    resetReceivableCache,
    resetReceivable
} = receivableSlice.actions

export default receivableReducer
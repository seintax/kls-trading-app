import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: "inventory",
    data: [],
    item: {},
    receive: [],
    shown: false,
    manager: false,
    notifier: false,
    perpage: 150,
    display: {
        name: "Inventory",
        text: "A list of all inventory items registered in the system.",
        show: true
    },
    header: {
        items: [
            { name: 'Product Name', stack: false, sort: 'product_name' },
            { name: 'Supplier', stack: true, sort: 'supplier_name', size: 220 },
            { name: 'Date', stack: true, sort: 'time', size: 100 },
            { name: 'Category', stack: true, sort: 'category', size: 140 },
            { name: 'Stocks', stack: true, sort: 'stocks', size: 130, position: "center" },
            { name: 'Cost', stack: true, sort: 'cost', size: 130, position: "center" },
            { name: 'Price', stack: true, sort: 'price', size: 130, position: "center" },
            { name: '', stack: true, sort: 'store', size: 160, position: "right" },
            { name: '', stack: false, screenreader: 'Action', size: 100 }
        ]
    },
    printable: {
        items: [
            { name: 'Product Name', stack: false, sort: 'product_name' },
            { name: 'Supplier', stack: true, sort: 'supplier_name', size: 250 },
            { name: 'Category', stack: true, sort: 'category', size: 150 },
            { name: 'Stocks', stack: true, sort: 'stocks', size: 150 },
            { name: 'Cost', stack: true, sort: 'cost', size: 160 },
            { name: 'Price', stack: true, sort: 'price', size: 160 },
        ]
    },
    print: []
}

const inventorySlice = createSlice({
    name: 'inventory',
    initialState,
    reducers: {
        setInventoryData: (state, action) => {
            state.data = action.payload
        },
        setInventoryPrint: (state, action) => {
            state.print = action.payload
        },
        setInventoryItem: (state, action) => {
            state.item = action.payload
        },
        resetInventoryItem: (state) => {
            state.item = {}
        },
        setInventoryShown: (state) => {
            state.shown = true
        },
        resetInventoryShown: (state) => {
            state.shown = false
        },
        setInventoryReceive: (state, action) => {
            state.receive = action.payload
        },
        showInventoryManager: (state) => {
            state.manager = true
        },
        resetInventoryManager: (state) => {
            state.manager = false
        },
        setInventoryNotifier: (state, action) => {
            state.notifier = action.payload
        },
        setInventoryDisplay: (state, action) => {
            state.display = {
                ...state.display,
                show: action.payload
            }
        },
        resetInventory: (state) => {
            state.data = []
            state.item = {}
            state.receive = []
            state.manager = false
            state.notifier = false
        }
    }
})

const inventoryReducer = inventorySlice.reducer

export const {
    setInventoryData,
    setInventoryPrint,
    setInventoryItem,
    resetInventoryItem,
    setInventoryShown,
    resetInventoryShown,
    setInventoryReceive,
    setInventoryNotifier,
    showInventoryManager,
    resetInventoryManager,
    setInventoryDisplay,
    resetInventory
} = inventorySlice.actions

export default inventoryReducer
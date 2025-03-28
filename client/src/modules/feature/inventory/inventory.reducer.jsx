import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: "inventory",
    data: [],
    item: {},
    receive: [],
    shown: false,
    manager: false,
    ledger: false,
    stocks: false,
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
            { name: 'Part No.', stack: true, sort: 'variant_serial', size: 150 },
            { name: 'Inventory No.', stack: true, sort: 'supplier_name', size: 200 },
            { name: 'Date', stack: true, sort: 'time', size: 100 },
            { name: 'Category', stack: true, sort: 'category', size: 140 },
            { name: 'Stocks', stack: true, sort: 'stocks', size: 100 },
            { name: 'Cost', stack: true, sort: 'cost', size: 120 },
            { name: 'Price', stack: true, sort: 'price', size: 120 },
            { name: 'Source', stack: true, sort: 'store', size: 120 },
            { name: '', stack: false, screenreader: 'Action', size: 200 }
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
    history: {
        items: [
            { name: 'Product Name', stack: false },
            { name: 'Time', stack: true, sort: 'time', size: 250 },
            { name: 'Quantity', stack: true, sort: 'category', size: 150 },
            { name: 'Mode of Transaction', stack: true, sort: 'transaction', size: 200 },
            { name: 'Branch', stack: true, sort: 'store', size: 200 },
        ]
    },
    stockage: {
        items: [
            { name: 'Product Name', stack: false },
            { name: 'Date', stack: true, sort: 'time', size: 250 },
            { name: 'Stocks', stack: true, sort: 'stocks', size: 150 },
            { name: 'Acquisition', stack: true, sort: 'acquisition', size: 200 },
            { name: 'Branch', stack: true, sort: 'store', size: 200 },
            { name: '', stack: false, screenreader: 'Action', size: 160 },
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
        showInventoryLedger: (state) => {
            state.ledger = true
        },
        resetInventoryLedger: (state) => {
            state.ledger = false
        },
        showInventoryStocks: (state) => {
            state.stocks = true
        },
        resetInventoryStocks: (state) => {
            state.stocks = false
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
            state.ledger = false
            state.stocks = false
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
    showInventoryLedger,
    resetInventoryLedger,
    showInventoryStocks,
    resetInventoryStocks,
    setInventoryDisplay,
    resetInventory
} = inventorySlice.actions

export default inventoryReducer
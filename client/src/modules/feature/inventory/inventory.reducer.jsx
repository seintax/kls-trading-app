import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: "inventory",
    data: [],
    item: {},
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
            { name: 'Product Name', stack: true, sort: 'product_name' },
            { name: 'Supplier', stack: false, sort: 'supplier_name', size: 250 },
            { name: 'DR No.', stack: false, sort: 'delivery_refcode', size: 150 },
            { name: 'Stocks', stack: false, sort: 'stocks', size: 150, position: "center" },
            { name: 'Price', stack: false, sort: 'price', size: 150, position: "center" },
            { name: 'Branch', stack: false, sort: 'store', size: 160, position: "center" },
            { name: '', stack: false, screenreader: 'Action', size: 200 }
        ]
    }
}

const inventorySlice = createSlice({
    name: 'inventory',
    initialState,
    reducers: {
        setInventoryData: (state, action) => {
            state.data = action.payload
        },
        setInventoryItem: (state, action) => {
            state.item = action.payload
        },
        resetInventoryItem: (state) => {
            state.item = {}
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
        resetInventory: (state) => {
            state.data = []
            state.item = {}
            state.manager = false
            state.notifier = false
        }
    }
})

const inventoryReducer = inventorySlice.reducer

export const {
    setInventoryData,
    setInventoryItem,
    resetInventoryItem,
    setInventoryNotifier,
    showInventoryManager,
    resetInventoryManager,
    resetInventory
} = inventorySlice.actions

export default inventoryReducer
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: "transfer",
    data: [],
    item: {},
    manager: false,
    notifier: false,
    selector: 0,
    perpage: 150,
    display: {
        name: "Stock Transfer",
        text: "A list of all transfer requests registered in the system.",
        show: true
    },
    header: {
        items: [
            { name: 'TR No.', stack: false, sort: 'id' },
            { name: 'Category', stack: true, sort: 'category', size: 280 },
            { name: 'TR Date', stack: false, sort: 'date', size: 180 },
            { name: 'Status', stack: true, sort: 'status', size: 180 },
            { name: 'Total Cost', stack: true, sort: 'value', size: 180 },
            { name: 'Total SRP', stack: true, sort: 'srp', size: 180 },
            { name: 'Source', stack: true, sort: 'source', size: 150 },
            { name: 'Destination', stack: true, sort: 'destination', size: 150 },
            { name: '', stack: false, screenreader: 'Action', size: 200 }
        ]
    },
    printout: {
        items: [
            { name: 'TR No.', stack: false, sort: 'id' },
            { name: 'Category', stack: true, sort: 'category', size: 280 },
            { name: 'TR Date', stack: false, sort: 'date', size: 180 },
            { name: 'Status', stack: true, sort: 'status', size: 180 },
            { name: 'Total Cost', stack: true, sort: 'value', size: 180 },
            { name: 'Total SRP', stack: true, sort: 'srp', size: 180 },
            { name: 'Source', stack: true, sort: 'source', size: 150 },
            { name: 'Destination', stack: true, sort: 'destination', size: 150 },
        ]
    }
}

const transferSlice = createSlice({
    name: 'transfer',
    initialState,
    reducers: {
        setTransferData: (state, action) => {
            state.data = action.payload
        },
        showTransferSelector: (state, action) => {
            state.selector = action.payload
        },
        resetTransferSelector: (state) => {
            state.selector = 0
        },
        setTransferItem: (state, action) => {
            state.item = action.payload
        },
        resetTransferItem: (state) => {
            state.item = {}
        },
        showTransferManager: (state) => {
            state.manager = true
        },
        resetTransferManager: (state) => {
            state.manager = false
        },
        setTransferNotifier: (state, action) => {
            state.notifier = action.payload
        },
        resetTransfer: (state) => {
            state.data = []
            state.item = {}
            state.manager = false
            state.notifier = false
        }
    }
})

const transferReducer = transferSlice.reducer

export const {
    setTransferData,
    showTransferSelector,
    resetTransferSelector,
    setTransferItem,
    resetTransferItem,
    setTransferNotifier,
    showTransferManager,
    resetTransferManager,
    resetTransfer
} = transferSlice.actions

export default transferReducer
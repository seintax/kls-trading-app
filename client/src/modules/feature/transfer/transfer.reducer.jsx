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
        name: "Transfer",
        text: "A list of all transfer requests registered in the system.",
        show: true
    },
    header: {
        items: [
            { name: 'Source', stack: true, sort: 'source' },
            { name: 'Destination', stack: false, sort: 'destination' },
            { name: 'TR No.', stack: false, sort: 'id', size: 150 },
            { name: 'Category', stack: false, sort: 'category', size: 180 },
            { name: 'Date', stack: false, sort: 'date', size: 150 },
            { name: 'Status', stack: false, sort: 'Status', size: 150 },
            { name: '', stack: false, screenreader: 'Action', size: 200 }
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
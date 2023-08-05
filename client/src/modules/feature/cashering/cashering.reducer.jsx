import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: "transaction",
    data: [],
    item: {},
    manager: false,
    notifier: false,
    receipts: false,
    ledger: false,
    perpage: 150,
    display: {
        name: "Transaction",
        text: "A list of all transactions processed in the system."
    },
    header: {
        items: [
            { name: 'Transaction', stack: false, sort: 'code' },
            { name: 'Time', stack: true, sort: 'time', size: 200 },
            { name: 'Type', stack: true, sort: 'method', size: 150 },
            { name: 'Status', stack: true, sort: 'status', size: 250 },
            { name: 'Net Amount', stack: false, size: 200 },
            { name: '', sort: 'account_store', stack: true, size: 120, position: 'right' },
            { name: '', stack: false, screenreader: 'Action', size: 70 }
        ]
    },
    search: ""
}

const transactionSlice = createSlice({
    name: 'transaction',
    initialState,
    reducers: {
        setTransactionData: (state, action) => {
            state.data = action.payload
        },
        setTransactionItem: (state, action) => {
            state.item = action.payload
        },
        resetTransactionItem: (state) => {
            state.item = {}
        },
        showTransactionManager: (state) => {
            state.manager = true
        },
        resetTransactionManager: (state) => {
            state.manager = false
        },
        showTransactionReceipts: (state) => {
            state.receipts = true
        },
        resetTransactionReceipts: (state) => {
            state.receipts = false
        },
        showTransactionLedger: (state) => {
            state.ledger = true
        },
        resetTransactionLedger: (state) => {
            state.ledger = false
        },
        setTransactionSearch: (state, action) => {
            state.search = action.payload
        },
        resetTransactionSearch: (state) => {
            state.search = ""
        },
        setTransactionNotifier: (state, action) => {
            state.notifier = action.payload
        },
        resetTransaction: (state) => {
            state.data = []
            state.item = {}
            state.manager = false
            state.notifier = false
        }
    }
})

const transactionReducer = transactionSlice.reducer

export const {
    setTransactionData,
    setTransactionItem,
    resetTransactionItem,
    setTransactionNotifier,
    showTransactionManager,
    resetTransactionManager,
    showTransactionReceipts,
    resetTransactionReceipts,
    showTransactionLedger,
    resetTransactionLedger,
    setTransactionSearch,
    resetTransactionSearch,
    resetTransaction
} = transactionSlice.actions

export default transactionReducer
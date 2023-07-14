import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: "transaction",
    data: [],
    item: {},
    manager: false,
    notifier: false,
    perpage: 150,
    display: {
        name: "Transaction",
        text: "A list of all transactions registered in the system."
    },
    header: {
        items: [
            { name: 'ColumnName', stack: true, sort: 'FieldName' },
            { name: 'ColumnName', stack: false, sort: 'FieldName', size: 250 },
            { name: '', stack: false, screenreader: 'Action', size: 200 }
        ]
    }
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
    resetTransaction
} = transactionSlice.actions

export default transactionReducer
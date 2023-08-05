import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: "cheque",
    data: [],
    item: {},
    manager: false,
    notifier: false,
    perpage: 150,
    display: {
        name: "Cheque",
        text: "A list of all cheques monitored in the system.",
        show: true
    },
    header: {
        items: [
            { name: 'Transaction', stack: false, sort: 'code' },
            { name: 'Cheque No.', stack: true, sort: 'refcode', size: 150 },
            { name: 'Cheque Date', stack: true, sort: 'refdate', size: 150 },
            { name: 'Amount', stack: true, sort: 'amount', size: 150 },
            { name: 'Type', stack: true, sort: 'type', size: 150 },
            { name: 'Status', stack: true, sort: 'refstat', size: 150 },
            { name: '', sort: 'account_store', stack: true, size: 120, position: 'right' },
            { name: '', stack: false, screenreader: 'Action', size: 100 }
        ]
    }
}

const chequeSlice = createSlice({
    name: 'cheque',
    initialState,
    reducers: {
        setChequeData: (state, action) => {
            state.data = action.payload
        },
        setChequeItem: (state, action) => {
            state.item = action.payload
        },
        resetChequeItem: (state) => {
            state.item = {}
        },
        showChequeManager: (state) => {
            state.manager = true
        },
        resetChequeManager: (state) => {
            state.manager = false
        },
        setChequeNotifier: (state, action) => {
            state.notifier = action.payload
        },
        resetCheque: (state) => {
            state.data = []
            state.item = {}
            state.manager = false
            state.notifier = false
        }
    }
})

const chequeReducer = chequeSlice.reducer

export const {
    setChequeData,
    setChequeItem,
    resetChequeItem,
    setChequeNotifier,
    showChequeManager,
    resetChequeManager,
    resetCheque
} = chequeSlice.actions

export default chequeReducer
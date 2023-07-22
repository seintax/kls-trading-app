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
            { name: 'Transaction', stack: true, sort: 'code' },
            { name: 'Cheque No.', stack: false, sort: 'refcode', size: 150 },
            { name: 'Cheque Date', stack: false, sort: 'refdate', size: 150 },
            { name: 'Amount', stack: false, sort: 'amount', size: 150 },
            { name: 'Type', stack: false, sort: 'type', size: 150 },
            { name: 'Status', stack: false, sort: 'refstat', size: 150 },
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
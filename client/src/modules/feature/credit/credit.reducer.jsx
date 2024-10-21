import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: "credit",
    data: [],
    item: {},
    shown: false,
    manager: false,
    notifier: false,
    customer: undefined,
    history: undefined,
    branch: "JT-MAIN",
    perpage: 150,
    display: {
        name: "Credit",
        text: "A list of all credits registered in the system.",
        show: true
    },
    columns: {
        items: [
            { name: 'Customer', stack: false, sort: 'customer_name' },
            { name: 'Credit', stack: true, sort: 'value', size: 200 },
            { name: 'Payment', stack: true, sort: 'paid', size: 200 },
            { name: 'Balance', stack: true, size: 200 },
            { name: '', sort: 'store', stack: true, size: 100, position: 'right' },
            { name: '', stack: false, screenreader: 'Action', size: 450 }
        ]
    },
    header: {
        items: [
            { name: 'Customer', stack: false, sort: 'customer_name' },
            { name: 'Transaction', stack: true, sort: 'code', size: 250 },
            { name: 'Partial', stack: true, sort: 'partial', size: 130 },
            { name: 'Payment', stack: true, sort: 'payment', size: 130 },
            { name: 'Waived', stack: true, sort: 'waived', size: 120 },
            { name: 'Returned', stack: false, sort: 'returned', size: 120 },
            { name: 'Balance', stack: false, sort: 'outstand', size: 120 },
            { name: 'Status', stack: true, sort: 'status', size: 100 },
            { name: '', sort: 'account_store', stack: true, size: 120, position: 'right' },
            { name: '', stack: false, screenreader: 'Action', size: 80 }
        ]
    }
}

const creditSlice = createSlice({
    name: 'credit',
    initialState,
    reducers: {
        setCreditData: (state, action) => {
            state.data = action.payload
        },
        setCreditItem: (state, action) => {
            state.item = action.payload
        },
        resetCreditItem: (state) => {
            state.item = {}
        },
        setCreditCustomer: (state, action) => {
            state.customer = action.payload
        },
        setCreditHistory: (state, action) => {
            state.history = action.payload
        },
        setCreditShown: (state) => {
            state.shown = true
        },
        resetCreditShown: (state) => {
            state.shown = false
        },
        showCreditManager: (state) => {
            state.manager = true
        },
        resetCreditManager: (state) => {
            state.manager = false
        },
        setCreditBranch: (state, action) => {
            state.branch = action.payload
        },
        setCreditNotifier: (state, action) => {
            state.notifier = action.payload
        },
        setCreditDisplay: (state, action) => {
            state.display = {
                ...state.display,
                show: action.payload
            }
        },
        resetCredit: (state) => {
            state.data = []
            state.item = {}
            state.manager = false
            state.notifier = false
        }
    }
})

const creditReducer = creditSlice.reducer

export const {
    setCreditData,
    setCreditItem,
    resetCreditItem,
    setCreditCustomer,
    setCreditHistory,
    setCreditShown,
    resetCreditShown,
    setCreditBranch,
    setCreditNotifier,
    showCreditManager,
    resetCreditManager,
    setCreditDisplay,
    resetCredit
} = creditSlice.actions

export default creditReducer
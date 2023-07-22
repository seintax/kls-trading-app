import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: "credit",
    data: [],
    item: {},
    manager: false,
    notifier: false,
    perpage: 150,
    display: {
        name: "Credit",
        text: "A list of all credits registered in the system.",
        show: true
    },
    header: {
        items: [
            { name: 'Customer', stack: false, sort: 'customer_name' },
            { name: 'Transaction', stack: true, sort: 'code', size: 250 },
            { name: 'Total Purchase', stack: true, sort: 'total', size: 150 },
            { name: 'Partial', stack: true, sort: 'partial', size: 130 },
            { name: 'Payment', stack: true, sort: 'payment', size: 130 },
            { name: 'Waived', stack: true, sort: 'waived', size: 120 },
            { name: 'Returned', stack: false, sort: 'returned', size: 120 },
            { name: 'Balance', stack: false, sort: 'outstand', size: 120 },
            { name: 'Status', stack: true, sort: 'status', size: 100 },
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
        showCreditManager: (state) => {
            state.manager = true
        },
        resetCreditManager: (state) => {
            state.manager = false
        },
        setCreditNotifier: (state, action) => {
            state.notifier = action.payload
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
    setCreditNotifier,
    showCreditManager,
    resetCreditManager,
    resetCredit
} = creditSlice.actions

export default creditReducer
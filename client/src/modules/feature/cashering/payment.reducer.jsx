import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: "payment",
    data: [],
    item: {},
    manager: false,
    notifier: false,
    perpage: 150,
    display: {
        name: "Payment",
        text: "A list of all payments in the system."
    },
    header: {
        items: [
            { name: 'ColumnName', stack: true, sort: 'FieldName' },
            { name: 'ColumnName', stack: false, sort: 'FieldName', size: 250 },
            { name: '', stack: false, screenreader: 'Action', size: 200 }
        ]
    }
}

const paymentSlice = createSlice({
    name: 'payment',
    initialState,
    reducers: {
        setPaymentData: (state, action) => {
            state.data = action.payload
        },
        setPaymentItem: (state, action) => {
            state.item = action.payload
        },
        resetPaymentItem: (state) => {
            state.item = {}
        },
        showPaymentManager: (state) => {
            state.manager = true
        },
        resetPaymentManager: (state) => {
            state.manager = false
        },
        setPaymentNotifier: (state, action) => {
            state.notifier = action.payload
        },
        resetPayment: (state) => {
            state.data = []
            state.item = {}
            state.manager = false
            state.notifier = false
        }
    }
})

const paymentReducer = paymentSlice.reducer

export const {
    setPaymentData,
    setPaymentItem,
    resetPaymentItem,
    setPaymentNotifier,
    showPaymentManager,
    resetPaymentManager,
    resetPayment
} = paymentSlice.actions

export default paymentReducer
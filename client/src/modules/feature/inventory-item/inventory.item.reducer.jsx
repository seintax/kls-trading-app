import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: "adjustment",
    data: [],
    item: {},
    manager: false,
    notifier: false,
    perpage: 150,
    display: {
        name: "Adjustment",
        text: "A list of all adjustment logged in this inventory.",
    },
    header: {
        items: [
            { name: 'Details', stack: false, sort: 'details' },
            { name: 'Operation', stack: true, sort: 'product_name', size: 150 },
            { name: 'Quantity', stack: false, sort: 'quantity', size: 150 },
            { name: 'Remarks', stack: true, sort: 'remarks', size: 200 },
            { name: 'Adjusted by', stack: true, sort: 'by', size: 150 },
            { name: 'Branch', stack: true, sort: 'store', size: 100 },
            { name: '', stack: false, screenreader: 'Action', size: 150 }
        ]
    }
}

const adjustmentSlice = createSlice({
    name: 'adjustment',
    initialState,
    reducers: {
        setAdjustmentData: (state, action) => {
            state.data = action.payload
        },
        setAdjustmentItem: (state, action) => {
            state.item = action.payload
        },
        resetAdjustmentItem: (state) => {
            state.item = {}
        },
        showAdjustmentManager: (state) => {
            state.manager = true
        },
        resetAdjustmentManager: (state) => {
            state.manager = false
        },
        setAdjustmentNotifier: (state, action) => {
            state.notifier = action.payload
        },
        resetAdjustment: (state) => {
            state.data = []
            state.item = {}
            state.manager = false
            state.notifier = false
        }
    }
})

const adjustmentReducer = adjustmentSlice.reducer

export const {
    setAdjustmentData,
    setAdjustmentItem,
    resetAdjustmentItem,
    setAdjustmentNotifier,
    showAdjustmentManager,
    resetAdjustmentManager,
    resetAdjustment
} = adjustmentSlice.actions

export default adjustmentReducer
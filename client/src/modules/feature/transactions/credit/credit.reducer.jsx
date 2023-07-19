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
        text: "A list of all credits registered in the system."
    },
    header: {
        items: [
            { name: 'ColumnName', stack: true, sort: 'FieldName' },
            { name: 'ColumnName', stack: false, sort: 'FieldName', size: 250 },
            { name: '', stack: false, screenreader: 'Action', size: 200 }
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
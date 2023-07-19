import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: "reimburse",
    data: [],
    item: {},
    temp: [],
    total: 0,
    manager: false,
    notifier: false,
    perpage: 150,
    display: {
        name: "Reimburse",
        text: "A list of all reimbursed transaction registered in the system."
    },
    header: {
        items: [
            { name: 'ColumnName', stack: true, sort: 'FieldName' },
            { name: 'ColumnName', stack: false, sort: 'FieldName', size: 250 },
            { name: '', stack: false, screenreader: 'Action', size: 200 }
        ]
    }
}

const reimburseSlice = createSlice({
    name: 'reimburse',
    initialState,
    reducers: {
        setReimburseData: (state, action) => {
            state.data = action.payload
        },
        setReimburseTotal: (state, action) => {
            state.total = action.payload
        },
        setReimburseItem: (state, action) => {
            state.item = action.payload
        },
        resetReimburseItem: (state) => {
            state.item = {}
        },
        setReimburseTemp: (state, action) => {
            state.temp = action.payload
        },
        resetReimburseTemp: (state) => {
            state.temp = {}
        },
        showReimburseManager: (state) => {
            state.manager = true
        },
        resetReimburseManager: (state) => {
            state.manager = false
        },
        setReimburseNotifier: (state, action) => {
            state.notifier = action.payload
        },
        resetReimburse: (state) => {
            state.data = []
            state.item = {}
            state.total = 0
            state.manager = false
            state.notifier = false
        }
    }
})

const reimburseReducer = reimburseSlice.reducer

export const {
    setReimburseData,
    setReimburseTotal,
    setReimburseItem,
    resetReimburseItem,
    setReimburseTemp,
    resetReimburseTemp,
    setReimburseNotifier,
    showReimburseManager,
    resetReimburseManager,
    resetReimburse
} = reimburseSlice.actions

export default reimburseReducer
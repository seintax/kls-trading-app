import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: "expenses",
    data: [],
    item: {},
    manager: false,
    notifier: false,
    perpage: 150,
    display: {
        name: "Expenses",
        text: "A list of all expenses logged in the system.",
        show: true
    },
    header: {
        items: [
            { name: 'Particulars', stack: true, sort: 'particulars' },
            { name: 'Inclusion', stack: false, sort: 'inclusion', size: 250 },
            { name: 'Cash-on-Hand', stack: false, sort: 'cash', size: 150 },
            { name: 'Expense', stack: false, sort: 'purchase', size: 150 },
            { name: 'Supplimentary', stack: false, sort: 'change', size: 150 },
            { name: '', stack: false, screenreader: 'Action', size: 200 }
        ]
    }
}

const expensesSlice = createSlice({
    name: 'expenses',
    initialState,
    reducers: {
        setExpensesData: (state, action) => {
            state.data = action.payload
        },
        setExpensesItem: (state, action) => {
            state.item = action.payload
        },
        resetExpensesItem: (state) => {
            state.item = {}
        },
        showExpensesManager: (state) => {
            state.manager = true
        },
        resetExpensesManager: (state) => {
            state.manager = false
        },
        setExpensesNotifier: (state, action) => {
            state.notifier = action.payload
        },
        resetExpenses: (state) => {
            state.data = []
            state.item = {}
            state.manager = false
            state.notifier = false
        }
    }
})

const expensesReducer = expensesSlice.reducer

export const {
    setExpensesData,
    setExpensesItem,
    resetExpensesItem,
    setExpensesNotifier,
    showExpensesManager,
    resetExpensesManager,
    resetExpenses
} = expensesSlice.actions

export default expensesReducer
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: "account",
    data: [],
    item: {},
    manager: false,
    notifier: false,
    role: false,
    perpage: 150,
    display: {
        name: "Account",
        text: "A list of all accounts registered in the system.",
        show: true
    },
    header: {
        items: [
            { name: 'Username', stack: false, sort: 'user' },
            { name: 'Fullname', stack: true, sort: 'name', size: 350 },
            { name: 'Branch Access', stack: true, sort: 'store', size: 350 },
            { name: 'Confirmed', stack: true, sort: 'confirm', size: 100 },
            { name: '', stack: false, screenreader: 'Action', size: 250 },
        ]
    }
}

const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        setAccountData: (state, action) => {
            state.data = action.payload
        },
        setAccountItem: (state, action) => {
            state.item = action.payload
        },
        resetAccountItem: (state) => {
            state.item = {}
        },
        showAccountManager: (state) => {
            state.manager = true
        },
        resetAccountManager: (state) => {
            state.manager = false
        },
        showAccountRole: (state) => {
            state.role = true
        },
        resetAccountRole: (state) => {
            state.role = false
        },
        setAccountNotifier: (state, action) => {
            state.notifier = action.payload
        },
        resetAccount: (state) => {
            state.data = []
            state.item = {}
            state.manager = false
            state.notifier = false
        }
    }
})

const accountReducer = accountSlice.reducer

export const {
    setAccountData,
    setAccountItem,
    resetAccountItem,
    setAccountNotifier,
    showAccountManager,
    resetAccountManager,
    showAccountRole,
    resetAccountRole,
    resetAccount
} = accountSlice.actions

export default accountReducer
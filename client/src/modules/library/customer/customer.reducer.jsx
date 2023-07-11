import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: "customer",
    data: [],
    item: {},
    manager: false,
    notifier: false,
    perpage: 150,
    display: {
        name: "Customer",
        text: "A list of all customers registered in the system.",
        show: true
    },
    header: {
        items: [
            { name: 'Customer Name', stack: true, sort: 'name' },
            { name: 'Address', stack: false, sort: 'address', size: 250 },
            { name: 'Contact No.', stack: false, sort: 'contact', size: 250 },
            { name: 'Email', stack: false, sort: 'email', size: 250 },
            { name: '', stack: false, screenreader: 'Action', size: 200 }
        ]
    }
}

const customerSlice = createSlice({
    name: 'customer',
    initialState,
    reducers: {
        setCustomerData: (state, action) => {
            state.data = action.payload
        },
        setCustomerItem: (state, action) => {
            state.item = action.payload
        },
        resetCustomerItem: (state) => {
            state.item = {}
        },
        showCustomerManager: (state) => {
            state.manager = true
        },
        resetCustomerManager: (state) => {
            state.manager = false
        },
        setCustomerNotifier: (state, action) => {
            state.notifier = action.payload
        },
        resetCustomer: (state) => {
            state.data = []
            state.item = {}
            state.manager = false
            state.notifier = false
        }
    }
})

const customerReducer = customerSlice.reducer

export const {
    setCustomerData,
    setCustomerItem,
    resetCustomerItem,
    setCustomerNotifier,
    showCustomerManager,
    resetCustomerManager,
    resetCustomer
} = customerSlice.actions

export default customerReducer
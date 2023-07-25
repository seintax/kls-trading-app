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
            { name: 'Customer Name', stack: false, sort: 'name' },
            { name: 'Address', stack: true, sort: 'address', size: 250 },
            { name: 'Contact No.', stack: true, sort: 'contact', size: 200 },
            { name: 'Email', stack: true, sort: 'email', size: 200 },
            { name: 'Credit Count', stack: true, sort: 'count', size: 150 },
            { name: 'Credit Value', stack: true, sort: 'value', size: 150 },
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
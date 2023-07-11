import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: "supplier",
    data: [],
    item: {},
    manager: false,
    notifier: false,
    perpage: 150,
    display: {
        name: "Supplier",
        text: "A list of all suppliers registered in the system.",
        show: true
    },
    header: {
        items: [
            { name: 'Supplier', stack: true, sort: 'name' },
            { name: 'Address', stack: false, sort: 'address', size: 250 },
            { name: 'Tel No.', stack: false, sort: 'telephone', size: 150 },
            { name: 'Cell No.', stack: false, sort: 'cellphone', size: 150 },
            { name: 'Email Address', stack: false, sort: 'email', size: 200 },
            { name: '', stack: false, screenreader: 'Action', size: 200 }
        ]
    }
}

const supplierSlice = createSlice({
    name: 'supplier',
    initialState,
    reducers: {
        setSupplierData: (state, action) => {
            state.data = action.payload
        },
        setSupplierItem: (state, action) => {
            state.item = action.payload
        },
        resetSupplierItem: (state) => {
            state.item = {}
        },
        showSupplierManager: (state) => {
            state.manager = true
        },
        resetSupplierManager: (state) => {
            state.manager = false
        },
        setSupplierNotifier: (state, action) => {
            state.notifier = action.payload
        },
        resetSupplier: (state) => {
            state.data = []
            state.item = {}
            state.manager = false
            state.notifier = false
        }
    }
})

const supplierReducer = supplierSlice.reducer

export const {
    setSupplierData,
    setSupplierItem,
    resetSupplierItem,
    setSupplierNotifier,
    showSupplierManager,
    resetSupplierManager,
    resetSupplier
} = supplierSlice.actions

export default supplierReducer
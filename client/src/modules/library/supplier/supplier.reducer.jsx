import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: "supplier",
    data: [],
    item: {},
    library: [],
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
            { name: 'Supplier', stack: false, sort: 'name' },
            { name: 'Address', stack: true, sort: 'address', size: 250 },
            { name: 'Tel No.', stack: true, sort: 'telephone', size: 150 },
            { name: 'Cell No.', stack: true, sort: 'cellphone', size: 150 },
            { name: 'Email Address', stack: true, sort: 'email', size: 200 },
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
        setSupplierLibrary: (state, action) => {
            state.library = action.payload
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
    setSupplierLibrary,
    setSupplierItem,
    resetSupplierItem,
    setSupplierNotifier,
    showSupplierManager,
    resetSupplierManager,
    resetSupplier
} = supplierSlice.actions

export default supplierReducer
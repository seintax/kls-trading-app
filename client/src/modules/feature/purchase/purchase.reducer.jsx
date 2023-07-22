import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: "purchase",
    data: [],
    item: {},
    manager: false,
    notifier: false,
    selector: 0,
    perpage: 150,
    display: {
        name: "Purchase",
        text: "A list of all purchases registered in the system.",
        show: true
    },
    header: {
        items: [
            { name: 'Supplier', stack: false, sort: 'supplier_name' },
            { name: 'PO No.', stack: true, sort: 'id', size: 150 },
            { name: 'PO Date', stack: false, sort: 'date', size: 150 },
            { name: 'Branch', stack: true, sort: 'store', size: 180 },
            { name: 'Category', stack: true, sort: 'category', size: 180 },
            { name: 'Status', stack: true, sort: 'status', size: 120 },
            { name: '', stack: false, screenreader: 'Action', size: 100 }
        ]
    }
}

const purchaseSlice = createSlice({
    name: 'purchase',
    initialState,
    reducers: {
        setPurchaseData: (state, action) => {
            state.data = action.payload
        },
        showPurchaseSelector: (state, action) => {
            state.selector = action.payload
        },
        resetPurchaseSelector: (state) => {
            state.selector = 0
        },
        setPurchaseItem: (state, action) => {
            state.item = action.payload
        },
        resetPurchaseItem: (state) => {
            state.item = {}
        },
        showPurchaseManager: (state) => {
            state.manager = true
        },
        resetPurchaseManager: (state) => {
            state.manager = false
        },
        setPurchaseNotifier: (state, action) => {
            state.notifier = action.payload
        },
        resetPurchase: (state) => {
            state.data = []
            state.item = {}
            state.manager = false
            state.notifier = false
        }
    }
})

const purchaseReducer = purchaseSlice.reducer

export const {
    setPurchaseData,
    showPurchaseSelector,
    resetPurchaseSelector,
    setPurchaseItem,
    resetPurchaseItem,
    setPurchaseNotifier,
    showPurchaseManager,
    resetPurchaseManager,
    resetPurchase
} = purchaseSlice.actions

export default purchaseReducer
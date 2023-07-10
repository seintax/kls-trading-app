import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: "purchase",
    data: [],
    item: {},
    manager: false,
    notifier: false,
    perpage: 150,
    display: {
        name: "Purchase",
        text: "A list of all purchases registered in the system.",
        show: true
    },
    header: {
        items: [
            { name: 'PO No.', stack: true, sort: 'id' },
            { name: 'Supplier', stack: false, sort: 'supplier', size: 250 },
            { name: 'Branch', stack: false, sort: 'store', size: 250 },
            { name: '', stack: false, screenreader: 'Action', size: 200 }
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
    setPurchaseItem,
    resetPurchaseItem,
    setPurchaseNotifier,
    showPurchaseManager,
    resetPurchaseManager,
    resetPurchase
} = purchaseSlice.actions

export default purchaseReducer
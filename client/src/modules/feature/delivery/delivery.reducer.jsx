import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: "delivery",
    data: [],
    item: {},
    manager: false,
    notifier: false,
    perpage: 150,
    display: {
        name: "Delivery",
        text: "A list of all deliveries registered in the system.",
        show: true
    },
    header: {
        items: [
            { name: 'Supplier', stack: true, sort: 'supplier_name' },
            { name: 'DR No.', stack: false, sort: 'id', size: 150 },
            { name: 'Reference', stack: false, sort: 'refcode', size: 150 },
            { name: 'DR Date', stack: false, sort: 'date', size: 180 },
            { name: 'Branch', stack: false, sort: 'store', size: 180 },
            { name: '', stack: false, screenreader: 'Action', size: 200 }
        ]
    }
}

const deliverySlice = createSlice({
    name: 'delivery',
    initialState,
    reducers: {
        setDeliveryData: (state, action) => {
            state.data = action.payload
        },
        showDeliverySelector: (state, action) => {
            state.selector = action.payload
        },
        resetDeliverySelector: (state) => {
            state.selector = 0
        },
        setDeliveryItem: (state, action) => {
            state.item = action.payload
        },
        resetDeliveryItem: (state) => {
            state.item = {}
        },
        showDeliveryManager: (state) => {
            state.manager = true
        },
        resetDeliveryManager: (state) => {
            state.manager = false
        },
        setDeliveryNotifier: (state, action) => {
            state.notifier = action.payload
        },
        resetDelivery: (state) => {
            state.data = []
            state.item = {}
            state.manager = false
            state.notifier = false
        }
    }
})

const deliveryReducer = deliverySlice.reducer

export const {
    setDeliveryData,
    showDeliverySelector,
    resetDeliverySelector,
    setDeliveryItem,
    resetDeliveryItem,
    setDeliveryNotifier,
    showDeliveryManager,
    resetDeliveryManager,
    resetDelivery
} = deliverySlice.actions

export default deliveryReducer
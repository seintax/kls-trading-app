import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: "browser",
    data: [],
    cart: [],
    item: {},
    manager: false,
    notifier: false,
    perpage: 150,
    header: {
        items: [
            { name: 'Product Name', stack: false, sort: 'product_name' },
            { name: 'Supplier', stack: true, sort: 'supplier_name', size: 200 },
            { name: 'Stocks', stack: true, sort: 'stocks', size: 120, position: "center" },
            { name: 'Price', stack: true, sort: 'price', size: 120, position: "center" },
            { name: 'Branch', stack: true, sort: 'store', size: 150, position: "center" },
            { name: 'Quantity', stack: false, sort: 'quantity', size: 100, position: "center" },
            { name: '', stack: false, screenreader: 'Action', size: 100 }
        ]
    },
    search: ""
}

const browserSlice = createSlice({
    name: 'browser',
    initialState,
    reducers: {
        setBrowserCart: (state, action) => {
            state.cart = [...state.cart, action.payload]
        },
        removeBrowserCart: (state, action) => {
            state.cart = state.cart.filter(f => f.id !== action.payload.id)
            state.data = state.data?.map(data => {
                if (data.id === action.payload.id)
                    return {
                        ...data,
                        quantity: 0
                    }
                return data
            })
        },
        resetBrowserCart: (state) => {
            state.cart = []
        },
        setBrowserData: (state, action) => {
            state.data = action.payload?.map(data => {
                return { ...data, quantity: 0 }
            })
        },
        updateBrowserData: (state, action) => {
            state.data = state.data?.map(data => {
                if (data.id === action.payload.id)
                    return action.payload
                return data
            })
        },
        setBrowserItem: (state, action) => {
            state.item = action.payload
        },
        resetBrowserItem: (state) => {
            state.item = {}
        },
        showBrowserManager: (state) => {
            state.manager = true
        },
        resetBrowserManager: (state) => {
            state.manager = false
        },
        setBrowserSearch: (state, action) => {
            state.search = action.payload
        },
        resetBrowserSearch: (state) => {
            state.search = ""
        },
        setBrowserNotifier: (state, action) => {
            state.notifier = action.payload
        },
        resetBrowser: (state) => {
            state.data = []
            state.item = {}
            state.manager = false
            state.notifier = false
            state.search = ""
        }
    }
})

const browserReducer = browserSlice.reducer

export const {
    setBrowserCart,
    removeBrowserCart,
    resetBrowserCart,
    setBrowserData,
    updateBrowserData,
    setBrowserItem,
    resetBrowserItem,
    setBrowserNotifier,
    showBrowserManager,
    resetBrowserManager,
    setBrowserSearch,
    resetBrowserSearch,
    resetBrowser
} = browserSlice.actions

export default browserReducer
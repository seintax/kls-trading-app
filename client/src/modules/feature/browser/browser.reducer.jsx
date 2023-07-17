import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: "browser",
    data: [],
    cart: [],
    item: {},
    paid: [],
    less: {},
    settle: {},
    manager: false,
    notifier: false,
    viewcart: false,
    checkout: false,
    payments: false,
    discount: false,
    perpage: 150,
    header: {
        items: [
            { name: 'Product Name', stack: false, sort: 'product_name' },
            { name: 'Stocks', stack: true, sort: 'stocks', size: 120, position: "center" },
            { name: 'Price', stack: true, sort: 'price', size: 120, position: "center" },
            { name: 'Branch', stack: true, sort: 'store', size: 150, position: "center" },
            { name: 'Remaining', stack: true, sort: 'remaining', size: 150, position: "center" },
            { name: 'Quantity', stack: false, sort: 'quantity', size: 100, position: "center" },
            { name: '', stack: false, screenreader: 'Action', size: 100 }
        ]
    },
    draft: localStorage.getItem('draft') ? JSON.parse(localStorage.getItem("draft")) : [],
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
                        quantity: 0,
                        remaining: data.stocks
                    }
                return data
            })
        },
        resetBrowserCart: (state) => {
            state.cart = []
        },
        setBrowserData: (state, action) => {
            state.data = action.payload?.map(data => {
                return { ...data, quantity: 0, remaining: data.stocks }
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
        setBrowserPaid: (state, action) => {
            state.paid = [...state.paid, action.payload]
        },
        removeBrowserPaid: (state, action) => {
            state.paid = state.paid?.filter(f => f.id !== action.payload)
        },
        resetBrowserPaid: (state) => {
            state.paid = []
        },
        setBrowserSettle: (state, action) => {
            state.settle = action.payload
        },
        resetBrowserSettle: (state) => {
            state.settle = {}
        },
        setBrowserLess: (state, action) => {
            state.less = action.payload
        },
        resetBrowserLess: (state) => {
            state.less = {}
        },
        showBrowserViewCart: (state) => {
            state.viewcart = true
        },
        resetBrowserViewCart: (state) => {
            state.viewcart = false
        },
        showBrowserCheckout: (state) => {
            state.checkout = true
        },
        resetBrowserCheckout: (state) => {
            state.checkout = false
        },
        showBrowserPayments: (state) => {
            state.payments = true
        },
        resetBrowserPayments: (state) => {
            state.payments = false
        },
        showBrowserDiscount: (state) => {
            state.discount = true
        },
        resetBrowserDiscount: (state) => {
            state.discount = false
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
        setBrowserDraft: (state, action) => {
            state.draft = [...state.draft, action.payload]
            localStorage.setItem('draft', JSON.stringify(state.draft))
        },
        removeBrowserDraft: (state, action) => {
            state.draft = state.draft?.filter(f => f.id !== action.payload)
            localStorage.setItem('draft', JSON.stringify(state.draft))
        },
        resetBrowser: (state) => {
            state.data = []
            state.item = {}
            state.less = {}
            state.manager = false
            state.notifier = false
            state.viewcart = false
            state.checkout = false
            state.payments = false
            state.discount = false
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
    setBrowserPaid,
    removeBrowserPaid,
    resetBrowserPaid,
    setBrowserSettle,
    resetBrowserSettle,
    setBrowserLess,
    resetBrowserLess,
    setBrowserNotifier,
    showBrowserViewCart,
    resetBrowserViewCart,
    showBrowserCheckout,
    resetBrowserCheckout,
    showBrowserPayments,
    resetBrowserPayments,
    showBrowserDiscount,
    resetBrowserDiscount,
    showBrowserManager,
    resetBrowserManager,
    setBrowserSearch,
    resetBrowserSearch,
    setBrowserDraft,
    removeBrowserDraft,
    resetBrowser
} = browserSlice.actions

export default browserReducer
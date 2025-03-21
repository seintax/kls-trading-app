import { createSlice } from '@reduxjs/toolkit'
import { isEmpty } from "../../../utilities/functions/string.functions"

const initialState = {
    name: "browser",
    data: [],
    cart: [],
    item: {},
    paid: [],
    less: {},
    found: 0,
    settle: {},
    method: "",
    sought: "",
    balance: 0,
    product: {},
    category: "",
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
            { name: 'Stocks', stack: true, sort: 'stocks', size: 120 },
            { name: 'Price', stack: true, sort: 'price', size: 120 },
            { name: 'Remaining', stack: true, sort: 'remaining', size: 150 },
            { name: 'Branch', stack: true, sort: 'store', size: 150 },
            { name: 'Quantity', stack: false, sort: 'quantity', size: 100 },
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
            localStorage.setItem("draft", JSON.stringify(state.cart))
        },
        removeBrowserCart: (state, action) => {
            state.cart = state.cart.filter(f => f.id !== action.payload.id)
            state.data = state.data?.map(data => {
                if (data.id === action.payload.id)
                    return {
                        ...data,
                        quantity: 0,
                        remaining: data.stocks,
                        markdown: 0
                    }
                return data
            })
            if (isEmpty(state.cart.length)) {
                localStorage.removeItem("draft")
                return
            }
            localStorage.setItem("draft", JSON.stringify(state.cart))
            return
        },
        reloadBrowserDraftCart: (state, action) => {
            state.cart = action.payload
        },
        resetBrowserCart: (state) => {
            state.cart = []
            localStorage.removeItem("draft")
        },
        setBrowserSearchCount: (state, action) => {
            state.found = action.payload
        },
        setBrowserCategory: (state, action) => {
            state.category = action.payload
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
        setBrowserProduct: (state, action) => {
            state.product = action.payload
        },
        resetBrowserProduct: (state) => {
            state.product = {}
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
        setBrowserSought: (state, action) => {
            state.sought = action.payload
        },
        resetBrowserSought: (state) => {
            state.sought = ""
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
        setBrowserMethod: (state, action) => {
            state.method = action.payload
        },
        setBrowserBalance: (state, action) => {
            state.balance = action.payload
        },
        resetBrowserTransaction: (state) => {
            state.cart = []
            state.paid = []
            state.less = {}
            state.found = 0
            state.settle = {}
            state.method = ""
            state.balance = 0
            state.manager = false
            state.viewcart = false
            state.checkout = false
            state.payments = false
            state.discount = false
        },
        resetBrowser: (state) => {
            state.data = []
            state.item = {}
            state.less = {}
            state.found = 0
            state.balance = 0
            state.manager = false
            state.notifier = false
            state.viewcart = false
            state.checkout = false
            state.payments = false
            state.discount = false
            state.search = ""
            state.method = ""
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
    setBrowserProduct,
    resetBrowserProduct,
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
    setBrowserSought,
    resetBrowserSought,
    setBrowserDraft,
    removeBrowserDraft,
    setBrowserMethod,
    setBrowserBalance,
    setBrowserCategory,
    setBrowserSearchCount,
    resetBrowserTransaction,
    reloadBrowserDraftCart,
    resetBrowser
} = browserSlice.actions

export default browserReducer
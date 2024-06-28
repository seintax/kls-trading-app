import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: "payment",
    data: [],
    item: {},
    paid: [],
    less: {},
    method: "",
    total: 0,
    balance: 0,
    creditor: {},
    customer: {},
    print: false,
    payor: false,
    manager: false,
    notifier: false,
    payments: false,
    discount: false,
    settlement: false,
    enablewaive: false,
    enablecredit: false,
    header: {
        items: [
            { name: 'Payment Type', stack: false, sort: 'type' },
            { name: 'Mode', stack: true, sort: 'method', size: 150 },
            { name: 'Reference #', stack: true, sort: 'refcode', size: 300 },
            { name: 'Dated', stack: true, sort: 'refdate', size: 150 },
            { name: 'Amount', stack: true, sort: 'amount', size: 190 },
        ]
    }
}

const paymentSlice = createSlice({
    name: 'payment',
    initialState,
    reducers: {
        setPaymentData: (state, action) => {
            state.data = action.payload
        },
        setPaymentItem: (state, action) => {
            state.item = action.payload
        },
        resetPaymentItem: (state) => {
            state.item = {}
        },
        setPaymentCustomer: (state, action) => {
            state.customer = action.payload
        },
        resetPaymentCustomer: (state) => {
            state.customer = {}
        },
        setPaymentPaid: (state, action) => {
            state.paid = [...state.paid, action.payload]
        },
        removePaymentPaid: (state, action) => {
            state.paid = state.paid?.filter(f => f.id !== action.payload)
        },
        resetPaymentPaid: (state) => {
            state.paid = []
        },
        setPaymentLess: (state, action) => {
            state.less = action.payload
        },
        resetPaymentLess: (state) => {
            state.less = {}
        },
        //**NOTE: set creditor reference when module is used for credit settlement */
        setPaymentCreditor: (state, action) => {
            state.creditor = action.payload
        },
        resetPaymentCreditor: (state) => {
            state.creditor = {}
        },
        //**NOTE: set true when module is used for credit settlement */
        setPaymentSettlement: (state, action) => {
            state.settlement = action.payload
        },
        //**NOTE: set true when module is used for credit settlement */
        setPaymentEnableWaive: (state, action) => {
            state.enablewaive = action.payload
        },
        //**NOTE: set true when module is used for regular payment use */
        setPaymentEnableCredit: (state, action) => {
            state.enablecredit = action.payload
        },
        showPaymentDiscount: (state) => {
            state.discount = true
        },
        resetPaymentDiscount: (state) => {
            state.discount = false
        },
        showPaymentPayor: (state) => {
            state.payor = true
        },
        resetPaymentPayor: (state) => {
            state.payor = false
        },
        showPaymentManager: (state) => {
            state.manager = true
        },
        resetPaymentManager: (state) => {
            state.manager = false
        },
        showPaymentPrint: (state) => {
            state.print = true
        },
        resetPaymentPrint: (state) => {
            state.print = false
        },
        setPaymentNotifier: (state, action) => {
            state.notifier = action.payload
        },
        setPaymentMethod: (state, action) => {
            state.method = action.payload
        },
        setPaymentTotal: (state, action) => {
            state.total = action.payload
        },
        setPaymentBalance: (state, action) => {
            state.balance = action.payload
        },
        resetPaymentTransaction: (state) => {
            state.data = []
            state.cart = []
            state.paid = []
            state.less = {}
            state.method = ""
            state.total = 0
            state.balance = 0
            state.customer = {}
            state.payor = false
            state.manager = false
            state.payments = false
            state.discount = false
            state.creditor = {}
            state.settlement = false
            state.enablewaive = false
            state.enablecredit = false
        },
        resetPayment: (state) => {
            state.data = []
            state.item = {}
            state.manager = false
            state.notifier = false
        }
    }
})

const paymentReducer = paymentSlice.reducer

export const {
    setPaymentData,
    setPaymentItem,
    resetPaymentItem,
    setPaymentCustomer,
    resetPaymentCustomer,
    setPaymentPaid,
    removePaymentPaid,
    resetPaymentPaid,
    setPaymentLess,
    resetPaymentLess,
    setPaymentCreditor,
    resetPaymentCreditor,
    setPaymentSettlement,
    setPaymentEnableWaive,
    setPaymentEnableCredit,
    showPaymentDiscount,
    resetPaymentDiscount,
    setPaymentNotifier,
    showPaymentPayor,
    resetPaymentPayor,
    showPaymentManager,
    resetPaymentManager,
    showPaymentPrint,
    resetPaymentPrint,
    setPaymentMethod,
    setPaymentTotal,
    setPaymentBalance,
    resetPaymentTransaction,
    resetPayment
} = paymentSlice.actions

export default paymentReducer
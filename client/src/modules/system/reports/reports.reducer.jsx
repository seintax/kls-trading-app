import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: "reports",
    report: "",
    manager: false,
    notifier: false,
    showalert: false,
    cashier: false,
    showmenu: false,
    showitem: false,
    showledger: false,
    receipt: false,
    transaction: {},
    inventory: {},
    perpage: 150,
    display: {
        name: "Report",
        text: "A list of all reports registered in the system."
    },
    filter: {
        asof: '',
        branch: ''
    }
}

const reportsSlice = createSlice({
    name: 'reports',
    initialState,
    reducers: {
        setReportName: (state, action) => {
            state.report = action.payload
        },
        setReportTransaction: (state, action) => {
            state.transaction = action.payload
        },
        setReportInventory: (state, action) => {
            state.inventory = action.payload
        },
        setReportFilter: (state, action) => {
            state.filter = action.payload
        },
        resetReportName: (state) => {
            state.report = ""
        },
        showReportAlert: (state) => {
            state.alert = true
        },
        resetReportAlert: (state) => {
            state.alert = false
        },
        showReportReceipt: (state) => {
            state.receipt = true
        },
        resetReportReceipt: (state) => {
            state.receipt = false
        },
        showReportCashier: (state) => {
            state.cashier = true
        },
        resetReportCashier: (state) => {
            state.cashier = false
        },
        showReportMenu: (state, action) => {
            state.showmenu = action.payload
        },
        showReportManager: (state) => {
            state.manager = true
        },
        resetReportManager: (state) => {
            state.manager = false
        },
        setReportShowItem: (state, action) => {
            state.showitem = action.payload
        },
        setReportShowLedger: (state, action) => {
            state.showledger = action.payload
        },
        setReportNotifier: (state, action) => {
            state.notifier = action.payload
        },
        resetReport: (state) => {
            state.report = ""
            state.transaction = {}
            state.inventory = {}
            state.manager = false
            state.notifier = false
            state.showmenu = false
            state.showitem = false
            state.showledger = false
            state.receipt = false
        }
    }
})

const reportsReducer = reportsSlice.reducer

export const {
    showReportMenu,
    setReportName,
    resetReportName,
    showReportAlert,
    resetReportAlert,
    showReportReceipt,
    resetReportReceipt,
    showReportCashier,
    resetReportCashier,
    showReportManager,
    resetReportManager,
    setReportNotifier,
    setReportTransaction,
    setReportInventory,
    setReportFilter,
    setReportShowItem,
    setReportShowLedger,
    resetReport
} = reportsSlice.actions

export default reportsReducer
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: "reports",
    report: "",
    manager: false,
    notifier: false,
    cashier: false,
    showmenu: false,
    perpage: 150,
    display: {
        name: "Report",
        text: "A list of all reports registered in the system."
    },
}

const reportsSlice = createSlice({
    name: 'reports',
    initialState,
    reducers: {
        setReportName: (state, action) => {
            state.report = action.payload
        },
        resetReportName: (state) => {
            state.report = ""
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
        setReportNotifier: (state, action) => {
            state.notifier = action.payload
        },
        resetReport: (state) => {
            state.report = ""
            state.manager = false
            state.notifier = false
            state.showmenu = false
        }
    }
})

const reportsReducer = reportsSlice.reducer

export const {
    showReportMenu,
    setReportName,
    resetReportName,
    showReportCashier,
    resetReportCashier,
    showReportManager,
    resetReportManager,
    setReportNotifier,
    resetReport
} = reportsSlice.actions

export default reportsReducer
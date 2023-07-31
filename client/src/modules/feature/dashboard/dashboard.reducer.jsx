import { createSlice } from '@reduxjs/toolkit'
import { sqlDate } from "../../../utilities/functions/datetime.functions"

const initialState = {
    name: "dashboard",
    data: [],
    start: sqlDate(new Date()),
    range: 7,
    store: "",
    branch: "",
    summary: "",
    filters: false,
    manager: false,
    notifier: false,
}

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        setDashboardData: (state, action) => {
            state.data = action.payload
        },
        setDashboardStart: (state, action) => {
            state.start = action.payload
        },
        setDashboardRange: (state, action) => {
            state.range = action.payload
        },
        setDashboardStore: (state, action) => {
            state.store = action.payload
        },
        setDashboardBranch: (state, action) => {
            state.branch = action.payload
        },
        setDashboardSummary: (state, action) => {
            state.summary = action.payload
        },
        resetDashboardSummary: (state) => {
            state.summary = undefined
        },
        showDashboardFilters: (state) => {
            state.filters = true
        },
        resetDashboardFilters: (state) => {
            state.filters = false
        },
        showDashboardManager: (state) => {
            state.manager = true
        },
        resetDashboardManager: (state) => {
            state.manager = false
        },
        setDashboardNotifier: (state, action) => {
            state.notifier = action.payload
        },
        resetDashboard: (state) => {
            state.data = []
            state.start = sqlDate(new Date())
            state.summary = ""
            state.manager = false
            state.notifier = false
        }
    }
})

const dashboardReducer = dashboardSlice.reducer

export const {
    setDashboardData,
    setDashboardStart,
    setDashboardRange,
    setDashboardStore,
    setDashboardBranch,
    setDashboardSummary,
    resetDashboardSummary,
    setDashboardNotifier,
    showDashboardFilters,
    resetDashboardFilters,
    showDashboardManager,
    resetDashboardManager,
    resetDashboard
} = dashboardSlice.actions

export default dashboardReducer
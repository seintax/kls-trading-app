import { createSlice } from '@reduxjs/toolkit'
import { sqlDate } from "../../../utilities/functions/datetime.functions"

const initialState = {
    name: "dashboard",
    data: [],
    week: sqlDate(new Date()),
    summary: "",
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
        setDashboardWeek: (state, action) => {
            state.week = action.payload
        },
        setDashboardSummary: (state, action) => {
            state.summary = action.payload
        },
        resetDashboardSummary: (state) => {
            state.summary = ""
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
            state.week = sqlDate(new Date())
            state.summary = ""
            state.manager = false
            state.notifier = false
        }
    }
})

const dashboardReducer = dashboardSlice.reducer

export const {
    setDashboardData,
    setDashboardWeek,
    setDashboardSummary,
    resetDashboardSummary,
    setDashboardNotifier,
    showDashboardManager,
    resetDashboardManager,
    resetDashboard
} = dashboardSlice.actions

export default dashboardReducer
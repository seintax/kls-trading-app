import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: "reports",
    week1: [],
    week2: [],
    manager: false,
    notifier: false,
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
        setWeeklyReport1: (state, action) => {
            state.week1 = action.payload
        },
        setWeeklyReport2: (state, action) => {
            state.week2 = action.payload
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
            state.week1 = []
            state.week2 = []
            state.manager = false
            state.notifier = false
        }
    }
})

const reportsReducer = reportsSlice.reducer

export const {
    setWeeklyReport1,
    setWeeklyReport2,
    showReportManager,
    resetReportManager,
    setReportNotifier,
    resetReport
} = reportsSlice.actions

export default reportsReducer
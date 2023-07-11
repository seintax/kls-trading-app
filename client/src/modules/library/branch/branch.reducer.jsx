import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: "branch",
    data: [],
    item: {},
    manager: false,
    notifier: false,
    perpage: 150,
    display: {
        name: "Branch",
        text: "A list of all store branches registered in the system.",
        show: true
    },
    header: {
        items: [
            { name: 'Branch Name', stack: true, sort: 'name' },
            { name: 'Code', stack: false, sort: 'code', size: 200 },
            { name: 'Address', stack: false, sort: 'address', size: 250 },
            { name: 'Contact', stack: false, sort: 'contact', size: 150 },
            { name: 'Status', stack: false, sort: 'status', size: 150 },
            { name: '', stack: false, screenreader: 'Action', size: 200 }
        ]
    }
}

const branchSlice = createSlice({
    name: 'branch',
    initialState,
    reducers: {
        setBranchData: (state, action) => {
            state.data = action.payload
        },
        setBranchItem: (state, action) => {
            state.item = action.payload
        },
        resetBranchItem: (state) => {
            state.item = {}
        },
        showBranchManager: (state) => {
            state.manager = true
        },
        resetBranchManager: (state) => {
            state.manager = false
        },
        setBranchNotifier: (state, action) => {
            state.notifier = action.payload
        },
        resetBranch: (state) => {
            state.data = []
            state.item = {}
            state.manager = false
            state.notifier = false
        }
    }
})

const branchReducer = branchSlice.reducer

export const {
    setBranchData,
    setBranchItem,
    resetBranchItem,
    setBranchNotifier,
    showBranchManager,
    resetBranchManager,
    resetBranch
} = branchSlice.actions

export default branchReducer
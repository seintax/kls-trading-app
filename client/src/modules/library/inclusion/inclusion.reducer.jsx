import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: "inclusion",
    data: [],
    item: {},
    manager: false,
    notifier: false,
    perpage: 150,
    display: {
        name: "Inclusion",
        text: "A list of all expenses inclusion registered in the system.",
        show: true
    },
    header: {
        items: [
            { name: 'Account Name', stack: true, sort: 'name' },
            { name: '', stack: false, screenreader: 'Action', size: 200 }
        ]
    }
}

const inclusionSlice = createSlice({
    name: 'inclusion',
    initialState,
    reducers: {
        setInclusionData: (state, action) => {
            state.data = action.payload
        },
        setInclusionItem: (state, action) => {
            state.item = action.payload
        },
        resetInclusionItem: (state) => {
            state.item = {}
        },
        showInclusionManager: (state) => {
            state.manager = true
        },
        resetInclusionManager: (state) => {
            state.manager = false
        },
        setInclusionNotifier: (state, action) => {
            state.notifier = action.payload
        },
        resetInclusion: (state) => {
            state.data = []
            state.item = {}
            state.manager = false
            state.notifier = false
        }
    }
})

const inclusionReducer = inclusionSlice.reducer

export const {
    setInclusionData,
    setInclusionItem,
    resetInclusionItem,
    setInclusionNotifier,
    showInclusionManager,
    resetInclusionManager,
    resetInclusion
} = inclusionSlice.actions

export default inclusionReducer
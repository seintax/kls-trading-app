import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: "option",
    data: [],
    item: {},
    manager: false,
    notifier: false,
    perpage: 150,
    display: {
        name: "Option",
        text: "A list of all options registered in the system.",
        show: true
    },
    header: {
        items: [
            { name: 'Option', stack: false, sort: 'name' },
            { name: 'Status', stack: true, sort: 'status', size: 250 },
            { name: '', stack: false, screenreader: 'Action', size: 200 }
        ]
    }
}

const optionSlice = createSlice({
    name: 'option',
    initialState,
    reducers: {
        setOptionData: (state, action) => {
            state.data = action.payload
        },
        setOptionItem: (state, action) => {
            state.item = action.payload
        },
        resetOptionItem: (state) => {
            state.item = {}
        },
        showOptionManager: (state) => {
            state.manager = true
        },
        resetOptionManager: (state) => {
            state.manager = false
        },
        setOptionNotifier: (state, action) => {
            state.notifier = action.payload
        },
        resetOption: (state) => {
            state.data = []
            state.item = {}
            state.manager = false
            state.notifier = false
        }
    }
})

const optionReducer = optionSlice.reducer

export const {
    setOptionData,
    setOptionItem,
    resetOptionItem,
    setOptionNotifier,
    showOptionManager,
    resetOptionManager,
    resetOption
} = optionSlice.actions

export default optionReducer
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: "dispensing",
    data: [],
    item: {},
    manager: false,
    notifier: false,
    perpage: 150,
    display: {
        name: "Dispensing",
        text: "A list of all dispense record in a transaction."
    },
    header: {
        items: [
            { name: 'Purchased Product', stack: false, sort: 'product_name' },
            { name: 'Price', stack: true, sort: 'price', size: 150 },
            { name: 'Quantity', stack: true, sort: 'dispense', size: 200 },
            { name: 'Total', stack: true, sort: 'total', size: 150 },
            { name: 'Less', stack: true, sort: 'less', size: 150 },
            { name: 'Net', stack: false, sort: 'net', size: 150 },
            { name: 'Return', stack: false, size: 100 },
            { name: '', stack: false, screenreader: 'Action', size: 100 }
        ]
    }
}

const dispensingSlice = createSlice({
    name: 'dispensing',
    initialState,
    reducers: {
        setDispensingData: (state, action) => {
            state.data = action.payload
        },
        updateDispensingData: (state, action) => {
            state.data = state.data?.map(data => {
                if (data.id === action.payload.id)
                    return action.payload
                return data
            })
        },
        setDispensingItem: (state, action) => {
            state.item = action.payload
        },
        resetDispensingItem: (state) => {
            state.item = {}
        },
        showDispensingManager: (state) => {
            state.manager = true
        },
        resetDispensingManager: (state) => {
            state.manager = false
        },
        setDispensingNotifier: (state, action) => {
            state.notifier = action.payload
        },
        resetDispensing: (state) => {
            state.data = []
            state.item = {}
            state.manager = false
            state.notifier = false
        }
    }
})

const dispensingReducer = dispensingSlice.reducer

export const {
    setDispensingData,
    updateDispensingData,
    setDispensingItem,
    resetDispensingItem,
    setDispensingNotifier,
    showDispensingManager,
    resetDispensingManager,
    resetDispensing
} = dispensingSlice.actions

export default dispensingReducer
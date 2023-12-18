import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: "transmit",
    data: [],
    item: {},
    manager: false,
    notifier: false,
    perpage: 150,
    display: {
        name: "Transmit",
        show: false
    },
    header: {
        items: [
            { name: 'ColumnName', stack: true, sort: 'FieldName' },
            { name: 'ColumnName', stack: false, sort: 'FieldName', size: 250 },
            { name: '', stack: false, screenreader: 'Action', size: 200 }
        ]
    },
    injoiner: {
        show: false,
        size: "w-screen lg:w-[800px] min-h-[400px]",
        title: "Stock Transfer Item",
    },
    listing: {
        title: "Stock Transfer Items",
        description: "List of items contained in a single stock transfer",
        layout: {
            showsubtext: true,
            sizes: [
                { size: "w-full" },
                { size: "w-[220px]" },
                { size: "w-[150px]" },
                { size: "w-[150px]" },
                { size: "w-[150px]" },
            ]
        },
    },
}

const transmitSlice = createSlice({
    name: 'transmit',
    initialState,
    reducers: {
        setTransmitData: (state, action) => {
            state.data = action.payload
        },
        setTransmitItem: (state, action) => {
            state.item = action.payload
        },
        resetTransmitItem: (state) => {
            state.item = {}
        },
        showTransmitManager: (state) => {
            state.manager = true
        },
        resetTransmitManager: (state) => {
            state.manager = false
        },
        showTransmitInjoiner: (state) => {
            state.injoiner = {
                ...state.injoiner,
                show: true
            }
        },
        resetTransmitInjoiner: (state) => {
            state.injoiner = {
                ...state.injoiner,
                show: false
            }
        },
        setTransmitNotifier: (state, action) => {
            state.notifier = action.payload
        },
        resetTransmitCache: (state) => {
            state.data = []
            state.item = {}
        },
        resetTransmit: (state) => {
            state.data = []
            state.item = {}
            state.manager = false
            state.notifier = false
        }
    }
})

const transmitReducer = transmitSlice.reducer

export const {
    setTransmitData,
    setTransmitItem,
    resetTransmitItem,
    setTransmitNotifier,
    showTransmitManager,
    resetTransmitManager,
    showTransmitInjoiner,
    resetTransmitInjoiner,
    resetTransmitCache,
    resetTransmit
} = transmitSlice.actions

export default transmitReducer
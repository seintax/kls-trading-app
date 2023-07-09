import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: "variant",
    data: [],
    item: {},
    manager: false,
    notifier: false,
    perpage: 150,
    display: {
        name: "Variant",
        text: "A list of all variants registered in the system."
    },
    header: {
        items: [
            { name: 'Serial No.', stack: true, sort: 'serial' },
            { name: 'Model/Make', stack: false, sort: 'model', size: 250 },
            { name: 'Brand/Specs', stack: false, sort: 'brand', size: 250 },
            { name: '', stack: false, screenreader: 'Action', size: 200 }
        ]
    }
}

const variantSlice = createSlice({
    name: 'variant',
    initialState,
    reducers: {
        setVariantData: (state, action) => {
            state.data = action.payload
        },
        setVariantItem: (state, action) => {
            state.item = action.payload
        },
        resetVariantItem: (state) => {
            state.item = {}
        },
        showVariantManager: (state) => {
            state.manager = true
        },
        resetVariantManager: (state) => {
            state.manager = false
        },
        setVariantNotifier: (state, action) => {
            state.notifier = action.payload
        },
        resetVariant: (state) => {
            state.data = []
            state.item = {}
            state.manager = false
            state.notifier = false
        }
    }
})

const variantReducer = variantSlice.reducer

export const {
    setVariantData,
    setVariantItem,
    resetVariantItem,
    setVariantNotifier,
    showVariantManager,
    resetVariantManager,
    resetVariant
} = variantSlice.actions

export default variantReducer
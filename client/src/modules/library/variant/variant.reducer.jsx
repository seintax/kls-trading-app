import { createSlice } from '@reduxjs/toolkit'
import AppInformation from "../../../utilities/interface/application/aesthetics/app.information"

const initialState = {
    name: "variant",
    data: [],
    item: {},
    manager: false,
    notifier: false,
    perpage: 150,
    display: {
        name: "Variant",
        text: "A list of all variants registered in the system.",
        show: true
    },
    header: {
        items: [
            { name: 'Product Name', stack: false },
            { name: 'Serial No.', stack: true, sort: 'serial' },
            { name: 'Model/Make', stack: true, sort: 'model', size: 250 },
            { name: 'Brand/Specs', stack: true, sort: 'brand', size: 250 },
            { name: <div className="flex gap-2">Alert Level <AppInformation message="Signals critical alert level when item stock is lower that indicated value." /></div>, stack: true, sort: 'alert', size: 250 },
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
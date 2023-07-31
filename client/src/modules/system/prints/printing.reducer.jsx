import { createSlice } from '@reduxjs/toolkit'

const format = {
    branch: "Jally Trading - MAIN",
    address: "Diversion Road National Highway, Banale, Pagadian City",
    service: "Auto and Agri Machine Parts Supply",
    subtext: "Autocare, Heavy Equipment and Trucking Services",
    contact: "Mobile No.: (0966) 483 5853 - (0930) 990 2456",
    customer: {
        name: "George Stubborn",
        address: "Davao City"
    },
    cashier: "Developer",
    transaction: "20230723-00001-000045",
    items: [
        {
            product: "GEARS (5H491-15430/DC70)",
            quantity: 1,
            price: 4200,
            total: 4200,
            less: 100,
        },
        {
            product: "LEVER RANGE SHIFT/CLUTCH SUB (51054-17810/DC70/LEVER)",
            quantity: 1,
            price: 1400,
            total: 1400,
            less: 100,
        },
        {
            product: "BOLT SEMS/FLAGE/SCENE (DC70/01574-50890)",
            quantity: 5,
            price: 85,
            total: 425,
            less: 50,
        },
        {
            product: "BOLT SEMS/FLAGE/SCENE (DC70/01574-50890)",
            quantity: 5,
            price: 85,
            total: 425,
            less: 50,
        }
    ],
    discount: {
        rate: 10,
        amount: 200
    },
    total: 5400,
    cash: 6000,
    change: 600,
    reprint: false,

}

const defaults = {
    branch: "Jally Trading",
    address: "Diversion Road National Highway, Banale, Pagadian City",
    service: "Auto and Agri Machine Parts Supply",
    subtext: "Autocare, Heavy Equipment and Trucking Services",
    contact: "Mobile No.: (0966) 483 5853 - (0930) 990 2456",
}

const initialState = {
    name: "printing",
    data: [],
    item: {},
    print: {},
    manager: false,
    notifier: false,
    defaults: defaults,
    perpage: 150,
}

const printingSlice = createSlice({
    name: 'printing',
    initialState,
    reducers: {
        setPrintingData: (state, action) => {
            state.data = action.payload
        },
        setPrintingItem: (state, action) => {
            state.item = action.payload
        },
        resetPrintingItem: (state) => {
            state.item = {}
        },
        setPrintingPrint: (state, action) => {
            state.print = action.payload
        },
        resetPrintingPrint: (state) => {
            state.print = {}
        },
        showPrintingManager: (state) => {
            state.manager = true
        },
        resetPrintingManager: (state) => {
            state.manager = false
        },
        setPrintingNotifier: (state, action) => {
            state.notifier = action.payload
        },
        resetPrinting: (state) => {
            state.data = []
            state.item = {}
            state.manager = false
            state.notifier = false
        }
    }
})

const printingReducer = printingSlice.reducer

export const {
    setPrintingData,
    setPrintingItem,
    resetPrintingItem,
    setPrintingPrint,
    resetPrintingPrint,
    setPrintingNotifier,
    showPrintingManager,
    resetPrintingManager,
    resetPrinting
} = printingSlice.actions

export default printingReducer
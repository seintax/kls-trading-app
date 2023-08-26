import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: "settings",
    data: [],
    item: {},
    config: {},
    menus: [],
    manager: false,
    notifier: false,
    updater: false,
    perpage: 150,
    display: {
        name: "User Configuration",
        show: true
    },
}

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setSettingsData: (state, action) => {
            state.data = action.payload
        },
        setSettingsItem: (state, action) => {
            state.item = action.payload
        },
        resetSettingsItem: (state) => {
            state.item = {}
        },
        setSettingsConfig: (state, action) => {
            state.config = action.payload
        },
        resetSettingsConfig: (state) => {
            state.config = {}
        },
        showSettingsManager: (state) => {
            state.manager = true
        },
        resetSettingsManager: (state) => {
            state.manager = false
        },
        setSettingsMenus: (state, action) => {
            state.menus = action.payload
        },
        setSettingsNotifier: (state, action) => {
            state.notifier = action.payload
        },
        setSettingsUpdater: (state, action) => {
            state.updater = action.payload
        },
        resetSettings: (state) => {
            state.data = []
            state.item = {}
            state.manager = false
            state.notifier = false
        }
    }
})

const settingsReducer = settingsSlice.reducer

export const {
    setSettingsData,
    setSettingsItem,
    resetSettingsItem,
    setSettingsConfig,
    resetSettingsConfig,
    setSettingsMenus,
    setSettingsNotifier,
    setSettingsUpdater,
    showSettingsManager,
    resetSettingsManager,
    resetSettings
} = settingsSlice.actions

export default settingsReducer
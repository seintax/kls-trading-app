import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: "permission",
    data: [],
    item: {},
    cache: [],
    manager: false,
    notifier: false,
    perpage: 150,
    display: {
        name: "Permission",
        text: "A list of all permissions used in the system.",
        show: true
    },
    header: {
        items: [
            { name: 'Permission Title', stack: true, sort: 'name' },
            { name: 'Menu', stack: false, },
            { name: 'Create', stack: false, },
            { name: 'Read', stack: false, },
            { name: 'Update', stack: false, },
            { name: 'Delete', stack: false, },
            { name: 'Custom', stack: false, },
            { name: '', stack: false, screenreader: 'Action', size: 200 }
        ]
    }
}

const permissionSlice = createSlice({
    name: 'permission',
    initialState,
    reducers: {
        setPermissionCache: (state, action) => {
            state.cache = action.payload
        },
        setPermissionData: (state, action) => {
            state.data = action.payload
        },
        setPermissionItem: (state, action) => {
            state.item = action.payload
        },
        resetPermissionItem: (state) => {
            state.item = {}
        },
        showPermissionManager: (state) => {
            state.manager = true
        },
        resetPermissionManager: (state) => {
            state.manager = false
        },
        setPermissionNotifier: (state, action) => {
            state.notifier = action.payload
        },
        resetPermission: (state) => {
            state.data = []
            state.item = {}
            state.manager = false
            state.notifier = false
        }
    }
})

const permissionReducer = permissionSlice.reducer

export const {
    setPermissionCache,
    setPermissionData,
    setPermissionItem,
    resetPermissionItem,
    setPermissionNotifier,
    showPermissionManager,
    resetPermissionManager,
    resetPermission
} = permissionSlice.actions

export default permissionReducer
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: "roles",
    data: [],
    item: {},
    cache: [],
    access: {},
    manager: false,
    notifier: false,
    permissions: false,
    perpage: 150,
    display: {
        name: "Roles",
        text: "A list of all roles provided for the system.",
        show: true
    },
    header: {
        items: [
            { name: 'Role', stack: false, sort: 'name' },
            { name: 'Defined', stack: true, sort: 'permission', size: 200 },
            { name: '', stack: false, screenreader: 'Action', size: 200 }
        ]
    }
}

const rolesSlice = createSlice({
    name: 'roles',
    initialState,
    reducers: {
        setRolesAccess: (state, action) => {
            state.access = action.payload
        },
        resetRolesAccess: (state) => {
            state.access = {}
        },
        setRolesCache: (state, action) => {
            state.cache = action.payload
        },
        resetRolesCache: (state) => {
            state.cache = []
        },
        setRolesData: (state, action) => {
            state.data = action.payload
        },
        setRolesItem: (state, action) => {
            state.item = action.payload
        },
        resetRolesItem: (state) => {
            state.item = {}
        },
        showRolesManager: (state) => {
            state.manager = true
        },
        resetRolesManager: (state) => {
            state.manager = false
        },
        showRolesPermissions: (state) => {
            state.permissions = true
        },
        resetRolesPermissions: (state) => {
            state.permissions = false
        },
        setRolesNotifier: (state, action) => {
            state.notifier = action.payload
        },
        resetRoles: (state) => {
            state.data = []
            state.item = {}
            state.manager = false
            state.notifier = false
        }
    }
})

const rolesReducer = rolesSlice.reducer

export const {
    setRolesAccess,
    resetRolesAccess,
    setRolesCache,
    resetRolesCache,
    setRolesData,
    setRolesItem,
    resetRolesItem,
    setRolesNotifier,
    showRolesManager,
    resetRolesManager,
    showRolesPermissions,
    resetRolesPermissions,
    resetRoles
} = rolesSlice.actions

export default rolesReducer
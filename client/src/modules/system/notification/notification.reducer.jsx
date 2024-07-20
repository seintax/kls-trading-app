import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: "notification",
    notify: false,
    toasted: false,
}

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        setNotificationNotify: (state, action) => {
            state.notify = action.payload
        },
        setNotificationToasted: (state, action) => {
            state.toasted = action.payload
        },
        resetNotification: (state) => {
            state.notify = false
            state.toasted = false
        }
    }
})

const notificationReducer = notificationSlice.reducer

export const {
    setNotificationNotify,
    resetNotification
} = notificationSlice.actions

export default notificationReducer
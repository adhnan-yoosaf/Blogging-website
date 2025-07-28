import { configureStore } from '@reduxjs/toolkit'
import blogReducer from './blogSlice'
import authReducer from './authSlice'
import userReducer from './userSlice'
import notifReducer from './notificationSlice'
import reportReducer from './reportSlice'
import contactReducer from './contactSlice'

const store = configureStore({
    reducer: {
        auth: authReducer,
        blogs: blogReducer,
        user: userReducer,
        notifications: notifReducer,
        reports: reportReducer,
        contacts: contactReducer
    }
})

export default store;
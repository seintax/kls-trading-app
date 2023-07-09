import { configureStore } from '@reduxjs/toolkit'
import categoryReducer from "../../modules/library/category/category.reducer"
import masterlistReducer from "../../modules/library/masterlist/masterlist.reducer"
import optionReducer from "../../modules/library/option/option.reducer"
import variantReducer from "../../modules/library/variant/variant.reducer"
import accountReducer from "../../modules/system/account/account.reducer"
import { apiSlice } from "./slices/apiSlice"
import authReducer from './slices/authSlice'
import deleteReducer from "./slices/deleteSlice"

const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
        deleteModal: deleteReducer,
        account: accountReducer,
        category: categoryReducer,
        masterlist: masterlistReducer,
        option: optionReducer,
        variant: variantReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true
})

export default store
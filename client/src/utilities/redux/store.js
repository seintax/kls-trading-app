import { configureStore } from '@reduxjs/toolkit'
import receivableReducer from "../../modules/feature/purchase-item/purchase.item.reducer"
import purchaseReducer from "../../modules/feature/purchase/purchase.reducer"
import branchReducer from "../../modules/library/branch/branch.reducer"
import categoryReducer from "../../modules/library/category/category.reducer"
import customerReducer from "../../modules/library/customer/customer.reducer"
import masterlistReducer from "../../modules/library/masterlist/masterlist.reducer"
import optionReducer from "../../modules/library/option/option.reducer"
import supplierReducer from "../../modules/library/supplier/supplier.reducer"
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
        branch: branchReducer,
        category: categoryReducer,
        masterlist: masterlistReducer,
        option: optionReducer,
        variant: variantReducer,
        supplier: supplierReducer,
        customer: customerReducer,
        purchase: purchaseReducer,
        receivable: receivableReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true
})

export default store
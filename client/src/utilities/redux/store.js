import { configureStore } from '@reduxjs/toolkit'
import browserReducer from "../../modules/feature/browser/browser.reducer"
import transactionReducer from "../../modules/feature/cashering/cashering.reducer"
import dispensingReducer from "../../modules/feature/cashering/dispensing.reducer"
// import paymentReducer from "../../modules/feature/cashering/payment.reducer"
import reimburseReducer from "../../modules/feature/cashering/reimburse.reducer"
import returnedReducer from "../../modules/feature/cashering/returned.reducer"
import chequeReducer from "../../modules/feature/cheque/cheque.reducer"
import creditReducer from "../../modules/feature/credit/credit.reducer"
import dashboardReducer from "../../modules/feature/dashboard/dashboard.reducer"
import receiptReducer from "../../modules/feature/delivery-item/delivery.item.reducer"
import deliveryReducer from "../../modules/feature/delivery/delivery.reducer"
import adjustmentReducer from "../../modules/feature/inventory-item/inventory.item.reducer"
import inventoryReducer from "../../modules/feature/inventory/inventory.reducer"
import paymentReducer from "../../modules/feature/payment/payment.reducer"
import priceReducer from "../../modules/feature/price/price.reducer"
import receivableReducer from "../../modules/feature/purchase-item/purchase.item.reducer"
import purchaseReducer from "../../modules/feature/purchase/purchase.reducer"
import transmitReducer from "../../modules/feature/transfer-item/transfer.item.reducer"
import transferReducer from "../../modules/feature/transfer/transfer.reducer"
import branchReducer from "../../modules/library/branch/branch.reducer"
import categoryReducer from "../../modules/library/category/category.reducer"
import customerReducer from "../../modules/library/customer/customer.reducer"
import inclusionReducer from "../../modules/library/inclusion/inclusion.reducer"
import masterlistReducer from "../../modules/library/masterlist/masterlist.reducer"
import optionReducer from "../../modules/library/option/option.reducer"
import supplierReducer from "../../modules/library/supplier/supplier.reducer"
import variantReducer from "../../modules/library/variant/variant.reducer"
import accountReducer from "../../modules/system/account/account.reducer"
import settingsReducer from "../../modules/system/config/config.reducer"
import expensesReducer from "../../modules/system/expenses/expenses.reducer"
import notificationReducer from "../../modules/system/notification/notification.reducer"
import permissionReducer from "../../modules/system/permission/permission.reducer"
import printingReducer from "../../modules/system/prints/printing.reducer"
import reportsReducer from "../../modules/system/reports/reports.reducer"
import rolesReducer from "../../modules/system/roles/roles.reducer"
import { apiSlice } from "./slices/apiSlice"
import authReducer from './slices/authSlice'
import deleteReducer from "./slices/deleteSlice"
import locateReducer from "./slices/locateSlice"
import searchReducer from "./slices/searchSlice"
import utilityReducer from "./slices/utilitySlice"

const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
        search: searchReducer,
        locate: locateReducer,
        utility: utilityReducer,
        deleteModal: deleteReducer,
        account: accountReducer,
        branch: branchReducer,
        category: categoryReducer,
        masterlist: masterlistReducer,
        option: optionReducer,
        variant: variantReducer,
        inclusion: inclusionReducer,
        supplier: supplierReducer,
        customer: customerReducer,
        purchase: purchaseReducer,
        receivable: receivableReducer,
        delivery: deliveryReducer,
        receipt: receiptReducer,
        inventory: inventoryReducer,
        adjustment: adjustmentReducer,
        transfer: transferReducer,
        transmit: transmitReducer,
        browser: browserReducer,
        transaction: transactionReducer,
        dispensing: dispensingReducer,
        returned: returnedReducer,
        credit: creditReducer,
        cheque: chequeReducer,
        reimburse: reimburseReducer,
        payment: paymentReducer,
        expenses: expensesReducer,
        permission: permissionReducer,
        roles: rolesReducer,
        settings: settingsReducer,
        reports: reportsReducer,
        printing: printingReducer,
        dashboard: dashboardReducer,
        price: priceReducer,
        notification: notificationReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }).concat(apiSlice.middleware),
    devTools: true
})

export default store
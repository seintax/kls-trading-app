import React from 'react'
import { Route, Routes } from "react-router-dom"
import AppIndex from "./modules/app/app.index"
import CasheringIndex from "./modules/feature/cashering/cashering.index"
import ChequeIndex from "./modules/feature/cheque/cheque.index"
import CreditIndex from "./modules/feature/credit/credit.index"
import DashboardIndex from "./modules/feature/dashboard/dashboard.index"
import DeliveryIndex from "./modules/feature/delivery/delivery.index"
import AdjustmentIndex from "./modules/feature/inventory-item/inventory.item.index"
import InventoryIndex from "./modules/feature/inventory/inventory.index"
import ReceivingRecords from "./modules/feature/inventory/inventory.receiveing"
import PurchaseIndex from "./modules/feature/purchase/purchase.index"
import TransferIndex from "./modules/feature/transfer/transfer.index"
import BranchIndex from "./modules/library/branch/branch.index"
import CategoryIndex from "./modules/library/category/category.index"
import CustomerIndex from "./modules/library/customer/customer.index"
import InclusionIndex from "./modules/library/inclusion/inclusion.index"
import MasterlistIndex from "./modules/library/masterlist/masterlist.index"
import OptionIndex from "./modules/library/option/option.index"
import SupplierIndex from "./modules/library/supplier/supplier.index"
import VariantIndex from "./modules/library/variant/variant.index"
import AccountIndex from "./modules/system/account/account.index"
import AccountLogin from "./modules/system/account/account.login"
import ExpensesIndex from "./modules/system/expenses/expenses.index"
import PermissionIndex from "./modules/system/permission/permission.index"
import PrintBase from "./modules/system/prints/print.base"
import PrintReceipt from "./modules/system/prints/print.receipt"
import PrintReports from "./modules/system/prints/print.reports"
import ReportsIndex from "./modules/system/reports/reports.index"
import RolesIndex from "./modules/system/roles/roles.index"
import usePrivate from "./utilities/hooks/usePrivate"
import AppEmpty from "./utilities/interface/application/errormgmt/app.empty"
import AppErrorFallback from "./utilities/interface/application/errormgmt/app.fallback"
import AppPageNotFound from "./utilities/interface/application/errormgmt/app.notfound"

const AppRoute = () => {
    const { PrivateRoute } = usePrivate()

    return (
        <Routes>
            <Route path="/" element={<AccountLogin />} />

            <Route path="" element={<PrivateRoute />}>
                <Route element={<AppIndex />}>
                    <Route path="/dashboard" element={<DashboardIndex />} />
                    <Route path="/cashering" element={<CasheringIndex />} />
                    <Route path="/purchase-order" element={<PurchaseIndex />} />
                    <Route path="/delivery" element={<DeliveryIndex />} />
                    <Route path="/inventory" element={<InventoryIndex />} />
                    <Route path="/stock-transfer" element={<TransferIndex />} />
                    <Route path="/receiving" element={<ReceivingRecords />} />
                    <Route path="/stock-adjustment" element={<AdjustmentIndex />} />
                    <Route path="/credits" element={<CreditIndex />} />
                    <Route path="/cheque-monitor" element={<ChequeIndex />} />
                    <Route path="/expenses" element={<ExpensesIndex />} />

                    <Route path="/suppliers" element={<SupplierIndex />} />
                    <Route path="/customers" element={<CustomerIndex />} />
                    <Route path="/categories" element={<CategoryIndex />} />
                    <Route path="/masterlist">
                        <Route index element={<MasterlistIndex />} />
                        <Route path="variant" element={<VariantIndex />} />
                    </Route>
                    <Route path="/options" element={<OptionIndex />} />
                    <Route path="/inclusions" element={<InclusionIndex />} />
                    <Route path="/branches" element={<BranchIndex />} />

                    <Route path="/accounts" element={<AccountIndex />} />
                    <Route path="/reports" element={<ReportsIndex />} />
                    <Route path="/roles" element={<RolesIndex />} />
                    <Route path="/permissions" element={<PermissionIndex />} />
                </Route>
            </Route>

            <Route path="/print" element={<PrintBase />} >
                <Route index element={<AppEmpty />} />

                <Route path="receipt" >
                    <Route index element={<PrintReceipt />} />
                    <Route path=":id" element={<PrintReceipt />} />
                </Route>

                <Route path="reports" >
                    <Route index element={<PrintReports />} />
                    <Route path=":id" element={<PrintReports />} />
                </Route>
            </Route>
            <Route path="/error" element={<AppErrorFallback />} />
            <Route path="*" element={<AppPageNotFound />} />
        </Routes>
    )
}

export default AppRoute
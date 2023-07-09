import React from 'react'
import { Route, Routes } from "react-router-dom"
import DashboardIndex from "./modules/feature/dashboard/dashboard.index"
import DashboardPanel from "./modules/feature/dashboard/dashboard.panel"
import CategoryIndex from "./modules/library/category/category.index"
import MasterlistIndex from "./modules/library/masterlist/masterlist.index"
import OptionIndex from "./modules/library/option/option.index"
import VariantIndex from "./modules/library/variant/variant.index"
import AccountIndex from "./modules/system/account/account.index"
import AccountLogin from "./modules/system/account/account.login"
import usePrivate from "./utilities/hooks/usePrivate"
import AppErrorFallback from "./utilities/interface/application/errormgmt/app.fallback"
import AppPageNotFound from "./utilities/interface/application/errormgmt/app.notfound"

const AppRoute = () => {
    const { PrivateRoute } = usePrivate()

    return (
        <Routes>
            <Route path="/" element={<AccountLogin />} />

            <Route path="" element={<PrivateRoute />}>
                <Route element={<DashboardIndex />}>
                    <Route path="/dashboard" element={<DashboardPanel />} />

                    <Route path="/category" element={<CategoryIndex />} />
                    <Route path="/masterlist">
                        <Route index element={<MasterlistIndex />} />
                        <Route path="variant" element={<VariantIndex />} />
                    </Route>
                    <Route path="/option" element={<OptionIndex />} />
                    <Route path="/users" element={<AccountIndex />} />
                </Route>
            </Route>

            <Route path="/error" element={<AppErrorFallback />} />
            <Route path="*" element={<AppPageNotFound />} />
        </Routes>
    )
}

export default AppRoute
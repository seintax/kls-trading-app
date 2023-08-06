import { apiSlice } from "../../../utilities/redux/slices/apiSlice"
const BASE_URL = import.meta.env.MODE === "development" ?
    import.meta.env.VITE_API_BASE_URL :
    import.meta.env.VITE_API_BASE_URL_PROD
const ENDPOINT_URL = `${BASE_URL}/app/dashboard`

export const dashboardApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        weeklyDashboard: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/weekly`,
                method: 'GET',
                params
            }),
            providesTags: ['dashboard']
        }),
        weeklyGrossSalesDashboard: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/weeklygrosssales`,
                method: 'GET',
                params
            }),
            providesTags: ['dashboard']
        }),
        weeklyCreditSalesDashboard: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/weeklycreditsales`,
                method: 'GET',
                params
            }),
            providesTags: ['dashboard']
        }),
        weeklyRefundsDashboard: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/weeklyrefunds`,
                method: 'GET',
                params
            }),
            providesTags: ['dashboard']
        }),
        weeklyDiscountsDashboard: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/weeklydiscounts`,
                method: 'GET',
                params
            }),
            providesTags: ['dashboard']
        }),
        weeklyNetSalesDashboard: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/weeklynetsales`,
                method: 'GET',
                params
            }),
            providesTags: ['dashboard']
        }),
        weeklyGrossProfitDashboard: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/weeklygrossprofit`,
                method: 'GET',
                params
            }),
            providesTags: ['dashboard']
        }),
        weeklyCollectiblesDashboard: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/weeklycollectibles`,
                method: 'GET',
                params
            }),
            providesTags: ['dashboard']
        }),
        weeklyCreditCollectionDashboard: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/weeklycreditcollection`,
                method: 'GET',
                params
            }),
            providesTags: ['dashboard']
        }),
        collectiblesDashboard: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/collectibles`,
                method: 'GET',
                params
            }),
            providesTags: ['dashboard']
        }),
    })
})

export const {
    useWeeklyDashboardMutation,
    useWeeklyGrossSalesDashboardMutation,
    useWeeklyCreditSalesDashboardMutation,
    useWeeklyRefundsDashboardMutation,
    useWeeklyDiscountsDashboardMutation,
    useWeeklyNetSalesDashboardMutation,
    useWeeklyGrossProfitDashboardMutation,
    useWeeklyCollectiblesDashboardMutation,
    useWeeklyCreditCollectionDashboardMutation,
    useCollectiblesDashboardMutation,
} = dashboardApiSlice
import { apiSlice } from "../../../utilities/redux/slices/apiSlice"
const BASE_URL = import.meta.env.MODE === "development" ?
    import.meta.env.VITE_API_BASE_URL :
    import.meta.env.VITE_API_BASE_URL_PROD
const ENDPOINT_URL = `${BASE_URL}/app/reports`

export const reportsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        weeklyReport: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/weekly`,
                method: 'GET',
                params
            }),
            providesTags: ['reports']
        }),
        weeklyGrossSalesReport: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/weeklygrosssales`,
                method: 'GET',
                params
            }),
            providesTags: ['reports']
        }),
        weeklyRefundsReport: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/weeklyrefunds`,
                method: 'GET',
                params
            }),
            providesTags: ['reports']
        }),
        weeklyDiscountsReport: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/weeklydiscounts`,
                method: 'GET',
                params
            }),
            providesTags: ['reports']
        }),
        weeklyNetSalesReport: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/weeklynetsales`,
                method: 'GET',
                params
            }),
            providesTags: ['reports']
        }),
        weeklyGrossProfitReport: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/weeklygrossprofit`,
                method: 'GET',
                params
            }),
            providesTags: ['reports']
        }),
        weeklyCollectiblesReport: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/weeklycollectibles`,
                method: 'GET',
                params
            }),
            providesTags: ['reports']
        }),
        collectiblesReport: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/collectibles`,
                method: 'GET',
                params
            }),
            providesTags: ['reports']
        }),
    })
})

export const {
    useWeeklyReportMutation,
    useWeeklyGrossSalesReportMutation,
    useWeeklyRefundsReportMutation,
    useWeeklyDiscountsReportMutation,
    useWeeklyNetSalesReportMutation,
    useWeeklyGrossProfitReportMutation,
    useWeeklyCollectiblesReportMutation,
    useCollectiblesReportMutation
} = reportsApiSlice
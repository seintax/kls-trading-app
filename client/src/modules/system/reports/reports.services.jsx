import { apiSlice } from "../../../utilities/redux/slices/apiSlice"
const BASE_URL = import.meta.env.MODE === "development" ?
    import.meta.env.VITE_API_BASE_URL :
    import.meta.env.VITE_API_BASE_URL_PROD
const ENDPOINT_URL = `${BASE_URL}/app/reports`

export const reportsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        salesByItemReport: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/salesbyitem`,
                method: 'GET',
                params
            }),
            providesTags: ['reports']
        }),
        salesByCategoryReport: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/salesbycategory`,
                method: 'GET',
                params
            }),
            providesTags: ['reports']
        }),
        salesByCollectionReport: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/salesbycollection`,
                method: 'GET',
                params
            }),
            providesTags: ['reports']
        }),
        salesSummaryReport: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/salessummary`,
                method: 'GET',
                params
            }),
            providesTags: ['reports']
        }),
        expensesReport: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/expenses`,
                method: 'GET',
                params
            }),
            providesTags: ['reports']
        }),
        expensesSummaryReport: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/expensessummary`,
                method: 'GET',
                params
            }),
            providesTags: ['reports']
        }),
        cashierSummaryReport: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/cashiersummary`,
                method: 'GET',
                params
            }),
            providesTags: ['reports']
        }),
        inventoryValuationReport: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/inventoryvaluation`,
                method: 'GET',
                params
            }),
            providesTags: ['reports']
        }),
    })
})

export const {
    useSalesByItemReportMutation,
    useSalesByCategoryReportMutation,
    useSalesByCollectionReportMutation,
    useSalesSummaryReportMutation,
    useExpensesReportMutation,
    useExpensesSummaryReportMutation,
    useCashierSummaryReportMutation,
    useInventoryValuationReportMutation,
} = reportsApiSlice
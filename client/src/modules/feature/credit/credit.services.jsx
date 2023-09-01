import { apiSlice } from "../../../utilities/redux/slices/apiSlice"
const BASE_URL = import.meta.env.MODE === "development" ?
    import.meta.env.VITE_API_BASE_URL :
    import.meta.env.VITE_API_BASE_URL_PROD
const ENDPOINT_URL = `${BASE_URL}/app/credit`

export const creditApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createCredit: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['credit']
        }),
        updateCredit: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: ['credit', 'credit/id']
        }),
        deleteCredit: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'DELETE',
                body
            }),
            invalidatesTags: ['credit']
        }),
        distinctCredit: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/id`,
                method: 'GET',
                params
            }),
            providesTags: ['credit/id']
        }),
        fetchAllCredit: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}`,
                method: 'GET',
                params
            }),
            providesTags: ['credit']
        }),
        searchCredit: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/search`,
                method: 'GET',
                params
            }),
            providesTags: ['credit']
        }),
        specifyCredit: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/specify`,
                method: 'GET',
                params
            }),
            providesTags: ['credit']
        }),
        byOngoingCredit: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/byongoing`,
                method: 'GET',
                params
            }),
            providesTags: ['credit']
        }),
        byAllOngoingCredit: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/byallongoing`,
                method: 'GET',
                params
            }),
            providesTags: ['credit']
        }),
        byCustomerCredit: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/bycustomer`,
                method: 'GET',
                params
            }),
            providesTags: ['credit']
        }),
        byUnsettledCredit: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/byunsettled`,
                method: 'GET',
                params
            }),
            providesTags: ['credit']
        }),
        byTransactionCredit: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/bytransaction`,
                method: 'GET',
                params
            }),
            providesTags: ['credit']
        }),
        byFirstCredit: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/byfirst`,
                method: 'GET',
                params
            }),
            providesTags: ['credit']
        }),
        sqlSettleCredit: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}/sqlsettlecredit`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['credit']
        }),
    })
})

export const {
    useCreateCreditMutation,
    useUpdateCreditMutation,
    useDeleteCreditMutation,
    useDistinctCreditMutation,
    useFetchAllCreditMutation,
    useSearchCreditMutation,
    useSpecifyCreditMutation,
    useByOngoingCreditMutation,
    useByAllOngoingCreditMutation,
    useByCustomerCreditMutation,
    useByUnsettledCreditMutation,
    useByTransactionCreditMutation,
    useByFirstCreditMutation,
    useSqlSettleCreditMutation,
} = creditApiSlice
import { apiSlice } from "../../../utilities/redux/slices/apiSlice"
const BASE_URL = import.meta.env.MODE === "development" ?
    import.meta.env.VITE_API_BASE_URL :
    import.meta.env.VITE_API_BASE_URL_PROD
const ENDPOINT_URL = `${BASE_URL}/app/statement`

export const statementApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createStatement: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['statement']
        }),
        updateStatement: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: ['statement', 'statement/id']
        }),
        deleteStatement: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'DELETE',
                body
            }),
            invalidatesTags: ['statement']
        }),
        distinctStatement: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/id`,
                method: 'GET',
                params
            }),
            providesTags: ['statement/id']
        }),
        fetchAllStatement: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}`,
                method: 'GET',
                params
            }),
            providesTags: ['statement']
        }),
        searchStatement: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/search`,
                method: 'GET',
                params
            }),
            providesTags: ['statement']
        }),
        specifyStatement: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/specify`,
                method: 'GET',
                params
            }),
            providesTags: ['statement']
        }),
        byFilterStatement: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/byfilter`,
                method: 'GET',
                params
            }),
            providesTags: ['statement']
        }),
        byNoneRangeStatement: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/bynonerange`,
                method: 'GET',
                params
            }),
            providesTags: ['statement']
        }),
    })
})

export const {
    useCreateStatementMutation,
    useUpdateStatementMutation,
    useDeleteStatementMutation,
    useDistinctStatementMutation,
    useFetchAllStatementMutation,
    useSearchStatementMutation,
    useSpecifyStatementMutation,
    useByFilterStatementMutation,
    useByNoneRangeStatementMutation,
} = statementApiSlice
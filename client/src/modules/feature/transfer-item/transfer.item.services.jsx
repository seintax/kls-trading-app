import { apiSlice } from "../../../utilities/redux/slices/apiSlice"
const BASE_URL = import.meta.env.MODE === "development" ?
    import.meta.env.VITE_API_BASE_URL :
    import.meta.env.VITE_API_BASE_URL_PROD
const ENDPOINT_URL = `${BASE_URL}/app/transmit`
const COMPLEX_SQL_URL = `${BASE_URL}/app/complex`

export const transmitApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createTransmit: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['transmit']
        }),
        updateTransmit: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: ['transmit', 'transmit/id']
        }),
        deleteTransmit: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'DELETE',
                body
            }),
            invalidatesTags: ['transmit']
        }),
        distinctTransmit: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/id`,
                method: 'GET',
                params
            }),
            providesTags: ['transmit/id']
        }),
        fetchAllTransmit: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}`,
                method: 'GET',
                params
            }),
            providesTags: ['transmit']
        }),
        searchTransmit: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/search`,
                method: 'GET',
                params
            }),
            providesTags: ['transmit']
        }),
        specifyTransmit: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/specify`,
                method: 'GET',
                params
            }),
            providesTags: ['transmit']
        }),
        byTransferTransmit: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/bytransfer`,
                method: 'GET',
                params
            }),
            providesTags: ['transmit']
        }),
        byInventoryTransmit: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/byinventory`,
                method: 'GET',
                params
            }),
            providesTags: ['transmit']
        }),
        byAuditTransmit: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/byaudit`,
                method: 'GET',
                params
            }),
            providesTags: ['transmit']
        }),
        sqlTransmit: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}/sqltransmit`,
                method: 'POST',
                body
            }),
            providesTags: ['transmit']
        }),
        createTransmitBySqlTransaction: builder.mutation({
            query: (body) => ({
                url: `${COMPLEX_SQL_URL}/sqlcreatetransmit`,
                method: 'POST',
                body
            }),
            providesTags: ['receipt']
        }),
    })
})

export const {
    useCreateTransmitMutation,
    useUpdateTransmitMutation,
    useDeleteTransmitMutation,
    useDistinctTransmitMutation,
    useFetchAllTransmitMutation,
    useSearchTransmitMutation,
    useSpecifyTransmitMutation,
    useByTransferTransmitMutation,
    useByInventoryTransmitMutation,
    useByAuditTransmitMutation,
    useCreateTransmitBySqlTransactionMutation,
    useSqlTransmitMutation,
} = transmitApiSlice
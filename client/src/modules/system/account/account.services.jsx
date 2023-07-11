import { apiSlice } from "../../../utilities/redux/slices/apiSlice"
const ENDPOINT_ROOTURL = '/app'
const ENDPOINT_URL = '/app/account'

export const accountApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createAccount: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['accounts']
        }),
        updateAccount: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: ['accounts', 'accounts/id']
        }),
        deleteAccount: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'DELETE',
                body
            }),
            invalidatesTags: ['accounts']
        }),
        distinctAccount: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/id`,
                method: 'GET',
                params
            }),
            providesTags: ['account/id']
        }),
        fetchAllAccount: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}`,
                method: 'GET',
                params
            }),
            providesTags: ['accounts']
        }),
        searchAccount: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/search`,
                method: 'GET',
                params
            }),
            providesTags: ['accounts']
        }),
        specifyAccount: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/specify`,
                method: 'GET',
                params
            }),
            providesTags: ['accounts']
        }),
        login: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_ROOTURL}/auth`,
                method: 'POST',
                body
            })
        }),
        logout: builder.mutation({
            query: () => ({
                url: `${ENDPOINT_ROOTURL}/logout`,
                method: 'POST',
            })
        })
    })
})

export const {
    useCreateAccountMutation,
    useUpdateAccountMutation,
    useDeleteAccountMutation,
    useDistinctAccountMutation,
    useFetchAllAccountMutation,
    useSearchAccountMutation,
    useSpecifyAccountMutation,
    useLoginMutation,
    useLogoutMutation
} = accountApiSlice
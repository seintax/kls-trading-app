import { apiSlice } from "../../../utilities/redux/slices/apiSlice"
const BASE_URL = import.meta.env.MODE === "development" ?
    import.meta.env.VITE_API_BASE_URL :
    import.meta.env.VITE_API_BASE_URL_PROD
const ENDPOINT_ROOTURL = `${BASE_URL}/app`
const ENDPOINT_URL = `${BASE_URL}/app/account`

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
        hashedUpdateAccount: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}/hashed`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: ['accounts', 'accounts/id']
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
    useHashedUpdateAccountMutation,
    useUpdateAccountMutation,
    useDeleteAccountMutation,
    useDistinctAccountMutation,
    useFetchAllAccountMutation,
    useSearchAccountMutation,
    useSpecifyAccountMutation,
    useLoginMutation,
    useLogoutMutation
} = accountApiSlice
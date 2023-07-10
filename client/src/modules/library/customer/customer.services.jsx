import { apiSlice } from "../../../utilities/redux/slices/apiSlice"
const ENDPOINT_URL = '/app/customer'

export const customerApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createCustomer: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['customer']
        }),
        updateCustomer: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: ['customer', 'customer/id']
        }),
        deleteCustomer: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'DELETE',
                body
            }),
            invalidatesTags: ['customer']
        }),
        distinctCustomer: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/id`,
                method: 'GET',
                params
            }),
            providesTags: ['customer/id']
        }),
        fetchAllCustomer: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}`,
                method: 'GET',
                params
            }),
            providesTags: ['customer']
        }),
        searchCustomer: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/search`,
                method: 'GET',
                params
            }),
            providesTags: ['customer']
        }),
        specifyCustomer: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/specify`,
                method: 'GET',
                params
            }),
            providesTags: ['customer']
        }),
    })
})

export const {
    useCreateCustomerMutation,
    useUpdateCustomerMutation,
    useDeleteCustomerMutation,
    useDistinctCustomerMutation,
    useFetchAllCustomerMutation,
    useSearchCustomerMutation,
    useSpecifyCustomerMutation,
} = customerApiSlice
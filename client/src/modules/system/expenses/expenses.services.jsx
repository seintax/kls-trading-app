import { apiSlice } from "../../../utilities/redux/slices/apiSlice"
const BASE_URL = import.meta.env.MODE === "development" ?
    import.meta.env.VITE_API_BASE_URL :
    import.meta.env.VITE_API_BASE_URL_PROD
const ENDPOINT_URL = `${BASE_URL}/app/expenses`

export const expensesApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createExpenses: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['expenses']
        }),
        updateExpenses: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: ['expenses', 'expenses/id']
        }),
        deleteExpenses: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'DELETE',
                body
            }),
            invalidatesTags: ['expenses']
        }),
        distinctExpenses: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/id`,
                method: 'GET',
                params
            }),
            providesTags: ['expenses/id']
        }),
        fetchAllExpenses: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}`,
                method: 'GET',
                params
            }),
            providesTags: ['expenses']
        }),
        searchExpenses: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/search`,
                method: 'GET',
                params
            }),
            providesTags: ['expenses']
        }),
        specifyExpenses: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/specify`,
                method: 'GET',
                params
            }),
            providesTags: ['expenses']
        }),
        allExpenses: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/allexpenses`,
                method: 'GET',
                params
            }),
            providesTags: ['expenses']
        }),
    })
})

export const {
    useCreateExpensesMutation,
    useUpdateExpensesMutation,
    useDeleteExpensesMutation,
    useDistinctExpensesMutation,
    useFetchAllExpensesMutation,
    useSearchExpensesMutation,
    useSpecifyExpensesMutation,
    useAllExpensesMutation,
} = expensesApiSlice
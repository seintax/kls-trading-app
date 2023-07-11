import { apiSlice } from "../../../utilities/redux/slices/apiSlice"
const BASE_URL = import.meta.env.MODE === "development" ?
    import.meta.env.VITE_API_BASE_URL :
    import.meta.env.VITE_API_BASE_URL_PROD
const ENDPOINT_URL = `${BASE_URL}/app/option`

export const optionApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createOption: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['option']
        }),
        updateOption: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: ['option', 'option/id']
        }),
        deleteOption: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'DELETE',
                body
            }),
            invalidatesTags: ['option']
        }),
        distinctOption: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/id`,
                method: 'GET',
                params
            }),
            providesTags: ['option/id']
        }),
        fetchAllOption: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}`,
                method: 'GET',
                params
            }),
            providesTags: ['option']
        }),
        searchOption: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/search`,
                method: 'GET',
                params
            }),
            providesTags: ['option']
        }),
        specifyOption: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/specify`,
                method: 'GET',
                params
            }),
            providesTags: ['option']
        }),
    })
})

export const {
    useCreateOptionMutation,
    useUpdateOptionMutation,
    useDeleteOptionMutation,
    useDistinctOptionMutation,
    useFetchAllOptionMutation,
    useSearchOptionMutation,
    useSpecifyOptionMutation,
} = optionApiSlice
import { apiSlice } from "../../../utilities/redux/slices/apiSlice"
const ENDPOINT_URL = '/app/masterlist'

export const masterlistApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createMasterlist: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['masterlist']
        }),
        updateMasterlist: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: ['masterlist', 'masterlist/id']
        }),
        deleteMasterlist: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'DELETE',
                body
            }),
            invalidatesTags: ['masterlist']
        }),
        distinctMasterlist: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/id`,
                method: 'GET',
                params
            }),
            providesTags: ['masterlist/id']
        }),
        fetchAllMasterlist: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}`,
                method: 'GET',
                params
            }),
            providesTags: ['masterlist']
        }),
        searchMasterlist: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/search`,
                method: 'GET',
                params
            }),
            providesTags: ['masterlist']
        }),
        specifyMasterlist: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/specify`,
                method: 'GET',
                params
            }),
            providesTags: ['masterlist']
        }),
        byCategoryMasterlist: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/bycategory`,
                method: 'GET',
                params
            }),
            providesTags: ['variant']
        }),
    })
})

export const {
    useCreateMasterlistMutation,
    useUpdateMasterlistMutation,
    useDeleteMasterlistMutation,
    useDistinctMasterlistMutation,
    useFetchAllMasterlistMutation,
    useSearchMasterlistMutation,
    useSpecifyMasterlistMutation,
    useByCategoryMasterlistMutation,
} = masterlistApiSlice
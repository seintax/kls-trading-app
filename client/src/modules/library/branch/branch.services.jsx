import { apiSlice } from "../../../utilities/redux/slices/apiSlice"
const BASE_URL = import.meta.env.MODE === "development" ?
    import.meta.env.VITE_API_BASE_URL :
    import.meta.env.VITE_API_BASE_URL_PROD
const ENDPOINT_URL = `${BASE_URL}/app/branch`

export const branchApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createBranch: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['branch']
        }),
        updateBranch: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: ['branch', 'branch/id']
        }),
        deleteBranch: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'DELETE',
                body
            }),
            invalidatesTags: ['branch']
        }),
        distinctBranch: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/id`,
                method: 'GET',
                params
            }),
            providesTags: ['branch/id']
        }),
        fetchAllBranch: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}`,
                method: 'GET',
                params
            }),
            providesTags: ['branch']
        }),
        searchBranch: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/search`,
                method: 'GET',
                params
            }),
            providesTags: ['branch']
        }),
        specifyBranch: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/specify`,
                method: 'GET',
                params
            }),
            providesTags: ['branch']
        }),
    })
})

export const {
    useCreateBranchMutation,
    useUpdateBranchMutation,
    useDeleteBranchMutation,
    useDistinctBranchMutation,
    useFetchAllBranchMutation,
    useSearchBranchMutation,
    useSpecifyBranchMutation,
} = branchApiSlice
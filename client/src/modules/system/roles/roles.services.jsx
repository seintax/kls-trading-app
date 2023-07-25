import { apiSlice } from "../../../utilities/redux/slices/apiSlice"
const BASE_URL = import.meta.env.MODE === "development" ?
    import.meta.env.VITE_API_BASE_URL :
    import.meta.env.VITE_API_BASE_URL_PROD
const ENDPOINT_URL = `${BASE_URL}/app/roles`

export const rolesApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createRoles: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['roles']
        }),
        updateRoles: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: ['roles', 'roles/id']
        }),
        deleteRoles: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'DELETE',
                body
            }),
            invalidatesTags: ['roles']
        }),
        distinctRoles: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/id`,
                method: 'GET',
                params
            }),
            providesTags: ['roles/id']
        }),
        fetchAllRoles: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}`,
                method: 'GET',
                params
            }),
            providesTags: ['roles']
        }),
        searchRoles: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/search`,
                method: 'GET',
                params
            }),
            providesTags: ['roles']
        }),
        specifyRoles: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/specify`,
                method: 'GET',
                params
            }),
            providesTags: ['roles']
        }),
        byDevRole: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/bydev`,
                method: 'GET',
                params
            }),
            providesTags: ['roles']
        }),
    })
})

export const {
    useCreateRolesMutation,
    useUpdateRolesMutation,
    useDeleteRolesMutation,
    useDistinctRolesMutation,
    useFetchAllRolesMutation,
    useSearchRolesMutation,
    useSpecifyRolesMutation,
    useByDevRoleMutation,
} = rolesApiSlice
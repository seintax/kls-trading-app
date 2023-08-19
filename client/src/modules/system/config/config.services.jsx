import { apiSlice } from "../../../utilities/redux/slices/apiSlice"
const BASE_URL = import.meta.env.MODE === "development" ?
    import.meta.env.VITE_API_BASE_URL :
    import.meta.env.VITE_API_BASE_URL_PROD
const ENDPOINT_URL = `${BASE_URL}/app/config`

export const configApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createConfig: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['config']
        }),
        updateConfig: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: ['config', 'config/id']
        }),
        deleteConfig: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'DELETE',
                body
            }),
            invalidatesTags: ['config']
        }),
        byAccountConfig: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/byaccount`,
                method: 'GET',
                params
            }),
            providesTags: ['config']
        }),
    })
})

export const {
    useCreateConfigMutation,
    useUpdateConfigMutation,
    useDeleteConfigMutation,
    useByAccountConfigMutation,
} = configApiSlice
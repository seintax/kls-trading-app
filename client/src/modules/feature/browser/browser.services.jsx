import { apiSlice } from "../../../utilities/redux/slices/apiSlice"
const BASE_URL = import.meta.env.MODE === "development" ?
    import.meta.env.VITE_API_BASE_URL :
    import.meta.env.VITE_API_BASE_URL_PROD
const ENDPOINT_URL = `${BASE_URL}/app/inventory`

export const browserApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        fetchAllBrowserByBranch: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/branch`,
                method: 'GET',
                params
            }),
            providesTags: ['browser']
        }),
    })
})

export const {
    useFetchAllBrowserByBranchMutation,
} = browserApiSlice
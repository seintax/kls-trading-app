import { apiSlice } from "../../../utilities/redux/slices/apiSlice"
const BASE_URL = import.meta.env.MODE === "development" ?
    import.meta.env.VITE_API_BASE_URL :
    import.meta.env.VITE_API_BASE_URL_PROD
const ENDPOINT_URL = `${BASE_URL}/app/database`

export const databaseApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getFreshData: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}`,
                method: 'GET',
                params
            }),
            providesTags: ['database']
        }),
    })
})

export const {
    useGetFreshDataMutation,
} = databaseApiSlice
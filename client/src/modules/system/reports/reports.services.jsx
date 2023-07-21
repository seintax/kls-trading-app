import { apiSlice } from "../../../utilities/redux/slices/apiSlice"
const BASE_URL = import.meta.env.MODE === "development" ?
    import.meta.env.VITE_API_BASE_URL :
    import.meta.env.VITE_API_BASE_URL_PROD
const ENDPOINT_URL = `${BASE_URL}/app/reports`

export const reportsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        weeklyReport: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/weekly`,
                method: 'GET',
                params
            }),
            providesTags: ['reports']
        }),
    })
})

export const {
    useWeeklyReportMutation
} = reportsApiSlice
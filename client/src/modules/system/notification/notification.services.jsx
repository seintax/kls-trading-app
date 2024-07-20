import { apiSlice } from "../../../utilities/redux/slices/apiSlice"
const BASE_URL = import.meta.env.MODE === "development" ?
    import.meta.env.VITE_API_BASE_URL :
    import.meta.env.VITE_API_BASE_URL_PROD
const ENDPOINT_URL = `${BASE_URL}/app/notification`

export const notificationApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createNotification: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['notification']
        }),
        updateNotification: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: ['notification', 'notification/id']
        }),
        deleteNotification: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'DELETE',
                body
            }),
            invalidatesTags: ['notification']
        }),
        distinctNotification: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/id`,
                method: 'GET',
                params
            }),
            providesTags: ['notification/id']
        }),
        fetchAllNotification: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}`,
                method: 'GET',
                params
            }),
            providesTags: ['notification']
        }),
        searchNotification: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/search`,
                method: 'GET',
                params
            }),
            providesTags: ['notification']
        }),
        specifyNotification: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/specify`,
                method: 'GET',
                params
            }),
            providesTags: ['notification']
        }),
        latestNotification: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}/latest`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['notification']
        }),
    })
})

export const {
    useCreateNotificationMutation,
    useUpdateNotificationMutation,
    useDeleteNotificationMutation,
    useDistinctNotificationMutation,
    useFetchAllNotificationMutation,
    useSearchNotificationMutation,
    useSpecifyNotificationMutation,
    useLatestNotificationMutation,
} = notificationApiSlice
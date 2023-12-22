import { apiSlice } from "../../../utilities/redux/slices/apiSlice"
const BASE_URL = import.meta.env.MODE === "development" ?
    import.meta.env.VITE_API_BASE_URL :
    import.meta.env.VITE_API_BASE_URL_PROD
const ENDPOINT_URL = `${BASE_URL}/app/delivery`

export const deliveryApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createDelivery: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['delivery']
        }),
        updateDelivery: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: ['delivery', 'delivery/id']
        }),
        deleteDelivery: builder.mutation({
            query: (body) => ({
                url: `${ENDPOINT_URL}`,
                method: 'DELETE',
                body
            }),
            invalidatesTags: ['delivery']
        }),
        distinctDelivery: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/id`,
                method: 'GET',
                params
            }),
            providesTags: ['delivery/id']
        }),
        fetchAllDelivery: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}`,
                method: 'GET',
                params
            }),
            providesTags: ['delivery']
        }),
        searchDelivery: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/search`,
                method: 'GET',
                params
            }),
            providesTags: ['delivery']
        }),
        specifyDelivery: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/specify`,
                method: 'GET',
                params
            }),
            providesTags: ['delivery']
        }),
        byDateDelivery: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/bydate`,
                method: 'GET',
                params
            }),
            providesTags: ['delivery']
        }),
    })
})

export const {
    useCreateDeliveryMutation,
    useUpdateDeliveryMutation,
    useDeleteDeliveryMutation,
    useDistinctDeliveryMutation,
    useFetchAllDeliveryMutation,
    useSearchDeliveryMutation,
    useSpecifyDeliveryMutation,
    useByDateDeliveryMutation,
} = deliveryApiSlice
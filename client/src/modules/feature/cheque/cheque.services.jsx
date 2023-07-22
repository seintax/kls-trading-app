import { apiSlice } from "../../../utilities/redux/slices/apiSlice"
const BASE_URL = import.meta.env.MODE === "development" ?
    import.meta.env.VITE_API_BASE_URL :
    import.meta.env.VITE_API_BASE_URL_PROD
const ENDPOINT_URL = `${BASE_URL}/app/payment`

export const chequeApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        byChequePayment: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/bycheque`,
                method: 'GET',
                params
            }),
            providesTags: ['cheque']
        }),
    })
})

export const {
    useByChequePaymentMutation,
} = chequeApiSlice
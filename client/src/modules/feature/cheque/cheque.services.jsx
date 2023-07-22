import { apiSlice } from "../../../utilities/redux/slices/apiSlice"
const BASE_URL = import.meta.env.MODE === "development" ?
    import.meta.env.VITE_API_BASE_URL :
    import.meta.env.VITE_API_BASE_URL_PROD
const ENDPOINT_URL = `${BASE_URL}/app/cheque`

export const chequeApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

    })
})

export const {
    useSqlChequePaymentMutation,
} = chequeApiSlice
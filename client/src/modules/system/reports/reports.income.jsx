import { apiSlice } from "../../../utilities/redux/slices/apiSlice"
const BASE_URL = import.meta.env.MODE === "development" ?
    import.meta.env.VITE_API_BASE_URL :
    import.meta.env.VITE_API_BASE_URL_PROD
const ENDPOINT_URL = `${BASE_URL}/app/income`

export const incomeApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        salesIncome: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/sales`,
                method: 'GET',
                params
            }),
            providesTags: ['income/sales']
        }),
        purchasesIncome: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/purchases`,
                method: 'GET',
                params
            }),
            providesTags: ['income/purchases']
        }),
        goodsInIncome: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/goodsin`,
                method: 'GET',
                params
            }),
            providesTags: ['income/goodsin']
        }),
        goodsOutIncome: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/goodsout`,
                method: 'GET',
                params
            }),
            providesTags: ['income/goodsout']
        }),
        expensesIncome: builder.mutation({
            query: (params) => ({
                url: `${ENDPOINT_URL}/expenses`,
                method: 'GET',
                params
            }),
            providesTags: ['income/expenses']
        }),
    })
})

export const {
    useSalesIncomeMutation,
    usePurchasesIncomeMutation,
    useGoodsInIncomeMutation,
    useGoodsOutIncomeMutation,
    useExpensesIncomeMutation,
} = incomeApiSlice
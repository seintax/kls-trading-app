// import axios from 'axios'
// const BASE_URL = import.meta.env.MODE === "development" ?
//     import.meta.env.VITE_API_BASE_URL :
//     import.meta.env.VITE_API_BASE_URL_PROD

// export const createAccount = async (data) => {
//     const res = await axios.post(`${BASE_URL}/account`, data)
//     return res.data
// }

// export const fetchAccount = async (search = '') => {
//     const opt = { params: { search: search } }
//     const res = await axios.get(`${BASE_URL}/account`, opt)
//     return res.data
// }

// export const updateAccount = async (data) => {
//     const res = await axios.patch(`${BASE_URL}/account`, data)
//     return res.data
// }

// export const deleteAccount = async (id) => {
//     const opt = { data: { id: id } }
//     const res = await axios.delete(`${BASE_URL}/account`, opt)
//     return res.data
// }

// export const fetchAccountById = async (id) => {
//     const opt = { params: { id: id } }
//     const res = await axios.get(`${BASE_URL}/account/id`, opt)
//     return res.data
// }

// export const searchAccount = async (search) => {
//     const opt = { params: { search: search } }
//     const res = await axios.get(`${BASE_URL}/account/search`, opt)
//     return res.data
// }

// export const specifyhAccount = async (filter) => {
//     const opt = { art: JSON.stringify(filter.array) }
//     console.log(opt)
//     const res = await axios.post(`${BASE_URL}/account/specify`, opt)
//     return res.data
// }

// export const userAuth = async (email, pass) => {
//     const opt = { user: email, pass: pass }
//     const res = await axios.post(`${BASE_URL}/auth`, opt)
//     return res.data
// }

// export const userLogout = async () => {
//     const res = await axios.post(`${BASE_URL}/logout`)
//     return res.data
// }

import { apiSlice } from "../../../utilities/redux/slices/apiSlice"
const ENDPOINT_ROOTURL = '/app'
const ENDPOINT_URL = '/app/account'

export const accountApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createAccount: builder.mutation({
            query: (data) => ({
                url: `${ENDPOINT_URL}`,
                method: 'POST',
                body: data
            })
        }),
        updateAccount: builder.mutation({
            query: (data) => ({
                url: `${ENDPOINT_URL}`,
                method: 'PATCH',
                body: data
            })
        }),
        deleteAccount: builder.mutation({
            query: (data) => ({
                url: `${ENDPOINT_URL}`,
                method: 'DELETE',
                body: data
            })
        }),
        fetchAllAccounts: builder.mutation({
            query: (data) => ({
                url: `${ENDPOINT_URL}`,
                method: 'GET',
                params: data
            })
        }),
        distinctAccount: builder.mutation({
            query: (data) => ({
                url: `${ENDPOINT_URL}/id`,
                method: 'GET',
                params: data
            })
        }),
        searchAccounts: builder.mutation({
            query: (data) => ({
                url: `${ENDPOINT_URL}/search`,
                method: 'GET',
                params: data
            })
        }),
        specifyAccounts: builder.mutation({
            query: (data) => ({
                url: `${ENDPOINT_URL}/specify`,
                method: 'GET',
                params: data
            })
        }),
        login: builder.mutation({
            query: (data) => ({
                url: `${ENDPOINT_ROOTURL}/auth`,
                method: 'POST',
                body: data
            })
        }),
        logout: builder.mutation({
            query: () => ({
                url: `${ENDPOINT_ROOTURL}/logout`,
                method: 'POST',
            })
        })
    })
})

export const {
    useCreateAccountMutation,
    useUpdateAccountMutation,
    useDeleteAccountMutation,
    useDistinctAccountMutation,
    useSearchAccountsMutation,
    useSpecifyAccountsMutation,
    useLoginMutation,
    useLogoutMutation
} = accountApiSlice
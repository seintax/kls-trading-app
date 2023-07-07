import axios from 'axios'
const BASE_URL = import.meta.env.MODE === "development" ?
    import.meta.env.VITE_API_BASE_URL :
    import.meta.env.VITE_API_BASE_URL_PROD

export const createCategory = async (data) => {
    const res = await axios.post(`${BASE_URL}/category`, data)
    return res.data
}

export const fetchCategory = async (search = '') => {
    const opt = { params: { search: search } }
    const res = await axios.get(`${BASE_URL}/category`, opt)
    return res.data
}

export const updateCategory = async (data) => {
    const res = await axios.patch(`${BASE_URL}/category`, data)
    return res.data
}

export const deleteCategory = async (id) => {
    const opt = { data: { id: id } }
    const res = await axios.delete(`${BASE_URL}/category`, opt)
    return res.data
}

export const fetchCategoryById = async (id) => {
    const opt = { params: { id: id } }
    const res = await axios.get(`${BASE_URL}/category/id`, opt)
    return res.data
}

export const searchCategory = async (search) => {
    const opt = { params: { search: search } }
    const res = await axios.get(`${BASE_URL}/category/search`, opt)
    return res.data
}

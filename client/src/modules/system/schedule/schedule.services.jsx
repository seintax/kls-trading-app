import axios from 'axios'
const BASE_URL = import.meta.env.MODE === "development" ?
    import.meta.env.VITE_API_BASE_URL :
    import.meta.env.VITE_API_BASE_URL_PROD

export const createSchedule = async (data) => {
    const res = await axios.post(`${BASE_URL}/schedule`, data)
    return res.data
}

export const fetchSchedule = async (search = '') => {
    const opt = { params: { search: search } }
    const res = await axios.get(`${BASE_URL}/schedule`, opt)
    return res.data
}

export const updateSchedule = async (data) => {
    const res = await axios.patch(`${BASE_URL}/schedule`, data)
    return res.data
}

export const deleteSchedule = async (id) => {
    const opt = { data: { id: id } }
    const res = await axios.delete(`${BASE_URL}/schedule`, opt)
    return res.data
}

export const fetchScheduleById = async (id) => {
    const opt = { params: { id: id } }
    const res = await axios.get(`${BASE_URL}/schedule/id`, opt)
    return res.data
}

export const searchSchedule = async (search) => {
    const opt = { params: { search: search } }
    const res = await axios.get(`${BASE_URL}/schedule/search`, opt)
    return res.data
}

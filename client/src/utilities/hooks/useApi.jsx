export default function useApi() {
    function dataErrorHandler(response) {
        let error = "Submission has encountered an error."
        if (response?.error?.code === "ER_DUP_ENTRY") {
            error = "You have entered a duplicate record."
        }
        else {
            console.error(response)
        }
        return error
    }

    async function dataRetrieveHandler(service) {
        const res = await service()
        if (!res.result) return []
        return res.result
    }

    return {
        dataErrorHandler,
        dataRetrieveHandler
    }
}

const axiosAuth = axios.create({
    baseURL: "BASE_API_URL",
    timeout: 5000,
    headers: {
        'Authorization': 'Bearer my-token',
        'Content-Type': 'application/json'
    }
})

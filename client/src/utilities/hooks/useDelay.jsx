
export default function useDelay() {

    async function asyncDelay(delay = 200, callback) {
        await setTimeout(() => {
            if (callback) callback()
        }, [delay])
    }

    return { asyncDelay }
}

import { QueryClient, QueryClientProvider } from "react-query"
import { ReactQueryDevtools } from "react-query/devtools"
import AppRoute from "./Route.jsx"
import ClientProvider from "./utilities/context/client.context"
import NotifyProvider from "./utilities/context/notify.context.jsx"
import UserProvider from "./utilities/context/user.context.jsx"

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
})

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ClientProvider>
                <UserProvider>
                    <NotifyProvider>
                        <div className="h-screen text-black">
                            <AppRoute />
                        </div>
                        {/* <div className="absolute top-0 left-0 z-[50] w-screen h-screen bg-black bg-opacity-[50%] flex items-center justify-center">
                        <div className="w-[500px] h-[350px] bg-gradient-to-r from-[#f5a906] to-[#fa0376] bg-opacity-[90%] text-lg flex items-center justify-center text-center px-10 rounded-[20px] text-white font-bold border border-[5px] border-white">
                            THIS SITE IS CURRENTLY UNDERMAINTENANCE UPTO AN UNDETERMINED DURATION. <br /><br /> MIGRATION IS ON-GOING. <br /> Please wait patiently.
                        </div>
                    </div> */}
                    </NotifyProvider>
                </UserProvider>
            </ClientProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    )
}

export default App

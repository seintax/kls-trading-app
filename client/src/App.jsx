import { QueryClient, QueryClientProvider } from "react-query"
import { ReactQueryDevtools } from "react-query/devtools"
import { Provider } from "react-redux"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AppRoute from "./Route.jsx"
import ClientProvider from "./utilities/context/client.context"
import NotifyProvider from "./utilities/context/notify.context.jsx"
import UserProvider from "./utilities/context/user.context.jsx"
import store from "./utilities/redux/store.js"

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
})

function App() {
    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <ClientProvider>
                    <UserProvider>
                        <NotifyProvider>
                            <div className="h-screen text-black">
                                <AppRoute />
                            </div>
                        </NotifyProvider>
                    </UserProvider>
                </ClientProvider>
                <ReactQueryDevtools initialIsOpen={false} />
                <ToastContainer />
            </QueryClientProvider>
        </Provider>
    )
}

export default App

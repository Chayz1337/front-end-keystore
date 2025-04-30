import type { AppProps } from 'next/app'
import '../src/assets/styles/globals.css'

import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { persistor, store } from '@/src/store/store'
import AuthProvider from '@/src/providers/auth-provider/auth-provider'
import { TypeComponentAuthFields } from '@/src/providers/auth-provider/auth-page.types'



const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps & TypeComponentAuthFields) {
  return(
    <QueryClientProvider client ={queryClient}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
         <AuthProvider Component={{isOnlyUser: Component.isOnlyUser}}>
         <Component {...pageProps} />
         </AuthProvider>
         </PersistGate>
      </Provider>
    </QueryClientProvider>
  )
}

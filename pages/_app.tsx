// src/pages/_app.tsx
import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../src/assets/styles/globals.css'; // << ПРОВЕРЬТЕ ПУТЬ

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { persistor, store } from '@/src/store/store'; // << ПРОВЕРЬТЕ ПУТЬ
import AuthProvider from '@/src/providers/auth-provider/auth-provider'; // << ПРОВЕРЬТЕ ПУТЬ
import { TypeComponentAuthFields } from '@/src/providers/auth-provider/auth-page.types'; // << ПРОВЕРЬТЕ ПУТЬ
import { AdminAuthProvider } from '@/src/components/ui/admin/AdminAuthContext';
import AdminPasswordModal from '@/src/components/ui/modal/AdminCodeModal';

// Провайдеры и компоненты для админ-панели // << ПРОВЕРЬТЕ ЭТОТ ПУТЬ И ИМЯ ФАЙЛА (AdminPasswordModal или AdminCodeModal)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function App({ Component, pageProps }: AppProps & TypeComponentAuthFields) {
  const getLayout = (Component as any).getLayout || ((page: React.ReactElement) => page);

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AuthProvider Component={{ isOnlyUser: Component.isOnlyUser /* , isOnlyAdmin: Component.isOnlyAdmin - можно убрать, если не используется в AuthProvider */ }}>
            <AdminAuthProvider>
              <Head>
                <title>GameShop</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
              </Head>
              <AdminPasswordModal />
              {getLayout(<Component {...pageProps} />)}
            </AdminAuthProvider>
          </AuthProvider>
        </PersistGate>
      </Provider>
    </QueryClientProvider>
  );
}
// src/pages/_app.tsx
import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../src/assets/styles/globals.css'; 

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { persistor, store } from '@/src/store/store';
import AuthProvider from '@/src/providers/auth-provider/auth-provider';
import { TypeComponentAuthFields } from '@/src/providers/auth-provider/auth-page.types';
import { AdminAuthProvider } from '@/src/components/ui/admin/AdminAuthContext';
import AdminPasswordModal from '@/src/components/ui/modal/AdminCodeModal'; // Убедитесь, что имя файла AdminCodeModal или AdminPasswordModal

import { Toaster } from 'react-hot-toast'; // <--- ДОБАВЬТЕ ЭТОТ ИМПОРТ

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
          <AuthProvider Component={{ isOnlyUser: Component.isOnlyUser }}>
            <AdminAuthProvider>
              <Head>
                <title>GameShop</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
              </Head>
              <AdminPasswordModal />
              {getLayout(<Component {...pageProps} />)}
              <Toaster 
                position="top-right"
                reverseOrder={false}
                gutter={8}
                toastOptions={{
                  // Общие стили и длительность для всех уведомлений
                  className: '', // Можно добавить общие классы Tailwind сюда
                  duration: 5000,
                  style: {
                    background: '#333', // Темно-серый фон
                    color: '#fff',      // Белый текст
                    // borderRadius: '8px', // Пример скругления углов
                    // padding: '12px 16px', // Пример внутренних отступов
                  },

                  // Опции для конкретных типов уведомлений
                  success: {
                    duration: 3000,
                    iconTheme: { // Используем iconTheme для стилизации иконки
                      primary: '#10B981', // Цвет иконки (например, Tailwind green-500)
                      secondary: '#fff',   // Цвет фона иконки или второй цвет для двухцветных иконок
                    },
                    // style: { // Можно переопределить общие стили для success
                    //   background: '#059669', // Например, темно-зеленый для успеха
                    // },
                  },
                  error: {
                    duration: 6000, // Увеличим длительность для ошибок
                    iconTheme: {
                      primary: '#EF4444', // Цвет иконки (например, Tailwind red-500)
                      secondary: '#fff',
                    },
                    // style: {
                    //   background: '#DC2626', // Например, темно-красный для ошибок
                    // },
                  },
                  // Для кастомных toast (toast.custom) эти опции не применяются напрямую,
                  // так как вы полностью контролируете их рендеринг.
                  // Но общие duration и style могут быть унаследованы, если не переопределены при вызове toast.custom.
                }}
              />
            </AdminAuthProvider>
          </AuthProvider>
        </PersistGate>
      </Provider>
    </QueryClientProvider>
  );
}
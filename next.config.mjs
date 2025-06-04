// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
  images: {
    remotePatterns: [
      // --- ДОБАВЬ ЭТИ ПРАВИЛА ДЛЯ ХОСТА "minio" ---
      {
        protocol: 'http',
        hostname: 'minio', // <--- Разрешаем хост "minio"
        port: '9000',
        pathname: '/game-images/**', // Для изображений игр
      },
      {
        protocol: 'http',
        hostname: 'minio', // <--- Разрешаем хост "minio"
        port: '9000',
        pathname: '/user-avatars/**', // Для аватаров пользователей (если такой бакет)
      },
      // ---------------------------------------------

      // Твои существующие правила для localhost (можешь оставить, если нужны для каких-то сценариев)
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/game-images/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/user-avatars/**',
      },
      // Правила для GitHub и Google
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/u/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/a/**',
      },
    ],
  },
};

export default nextConfig;
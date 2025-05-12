/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    SERVER_URL: process.env.SERVER_URL,
    APP_URL: process.env.APP_URL,
  },
  images: {
    remotePatterns: [
      // Твое существующее правило для картинок игр
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/game-images/**',
      },
      // ДОБАВЬ ЭТО ПРАВИЛО для аватаров
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/avatar/**', // Разрешаем пути, начинающиеся с /avatar/
      },
    ],
  },
};

export default nextConfig;
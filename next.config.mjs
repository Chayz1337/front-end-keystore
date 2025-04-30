/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
      SERVER_URL: process.env.SERVER_URL,
      APP_URL: process.env.APP_URL,
    },
    images: {
      remotePatterns: [
        {
          protocol: 'http',
          hostname: 'localhost',
          port: '9000',
          pathname: '/game-images/**',
        },
      ],
    },
  };
  
  export default nextConfig;
  
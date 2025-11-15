/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/api\.coingecko\.com\/api\/v3\/.*/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "coins-api-cache",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 24 * 60 * 60, // 1 day
        },
        networkTimeoutSeconds: 3,
      },
    },
  ],
});

module.exports = withPWA({
  turbopack: {},
  experimental: {
    turbo: false,
  },

  reactStrictMode: true,
});

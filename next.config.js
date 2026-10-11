/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Машина сборки тесная по памяти: один воркер вместо пула, иначе
  // параллельные процессы падают с OOM.
  experimental: {
    webpackBuildWorker: false,
    cpus: 1,
  },
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'no-referrer' },
        // Mini App открывается внутри iframe Telegram, поэтому X-Frame-Options
        // не годится (он не умеет перечислять источники) — нужен CSP.
        {
          key: 'Content-Security-Policy',
          value: "frame-ancestors 'self' https://web.telegram.org https://*.telegram.org",
        },
      ],
    },
  ],
}

module.exports = nextConfig

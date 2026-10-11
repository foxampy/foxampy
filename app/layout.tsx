import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  title: 'UNICAP — воронка продаж',
  description: 'Telegram Mini App: статистика бота и воронки UNICAP',
}

// В Next 14 viewport вынесен из metadata в отдельный экспорт.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#00AEEF',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <div className="mx-auto min-h-screen max-w-2xl">{children}</div>

        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
        <Script id="tg-init" strategy="afterInteractive">
          {`if (window.Telegram && window.Telegram.WebApp) {
              window.Telegram.WebApp.ready();
              window.Telegram.WebApp.expand();
              window.Telegram.WebApp.setHeaderColor('#FFFFFF');
            }`}
        </Script>
      </body>
    </html>
  )
}

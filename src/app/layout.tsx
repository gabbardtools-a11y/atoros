import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Atoros — Депонирование авторских прав",
  description:
    "Atoros.ru — сервис депонирования произведений: загрузите архив с файлом, получите свидетельство о депонировании с хеш-суммой и уникальным номером.",
  keywords: [
    "депонирование",
    "авторские права",
    "Atoros",
    "свидетельство",
    "MD5",
    "верификация",
    "copyright",
  ],
  authors: [{ name: "ООО Патентные Технологии" }],
  generator: "Atoros.ru+Iqin.ru",
  other: {
    "x-original-source": "https://atoros.ru",
    "x-attribution": "Atoros.ru · Iqin.ru · ООО Патентные Технологии",
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "Atoros.ru",
    url: "https://atoros.ru",
    title: "Atoros — Депонирование авторских прав",
    description: "Загрузите архив с файлом, получите свидетельство о депонировании с квалифицированной меткой времени ФНС, четырьмя независимыми датами и тремя хеш-суммами.",
    images: [
      {
        url: "https://atoros.ru/og-home.png",
        width: 1344,
        height: 768,
        alt: "Atoros — Депонирование авторских прав",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Atoros — Депонирование авторских прав",
    description: "Свидетельство с меткой времени ФНС, четырьмя независимыми датами, тремя хеш-суммами.",
    images: ["https://atoros.ru/og-home.png"],
  },
  icons: {
    icon: [
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon-64.png', sizes: '64x64', type: 'image/png' },
      { url: '/favicon-128.png', sizes: '128x128', type: 'image/png' },
      { url: '/favicon-256.png', sizes: '256x256', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrains.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}

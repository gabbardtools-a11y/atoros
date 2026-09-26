import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Lora } from "next/font/google";
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

const lora = Lora({
  variable: "--font-atoros-brand",
  subsets: ["latin", "cyrillic"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "Депонирование бесплатно авторских прав, ноу-хау, и любой информации с обеспечением доказательной базы для судов РФ и иностранных юрисдикций, маркетплейсов и других инстанций",
  description:
    "Atoros.ru — бесплатное депонирование авторских прав, ноу-хау и любой информации с обеспечением доказательной базы для судов РФ и иностранных юрисдикций, маркетплейсов и других инстанций. Загрузите архив — мы вычислим хеш-суммы (MD5, SHA-256, ГОСТ Р 34.11-2012), получим квалифицированную метку времени от ФНС и опубликуем свидетельство с проверочным QR-кодом. Подтверждение авторства и владельца задепонированной информации в любой момент бесплатно через онлайн-верификацию.",
  keywords: [
    "депонирование бесплатно",
    "депонирование авторских прав",
    "депонирование ноу-хау",
    "депонирование информации",
    "доказательная база для судов",
    "суды РФ",
    "иностранные юрисдикции",
    "маркетплейсы",
    "авторские права",
    "ноу-хау",
    "свидетельство о депонировании",
    "метка времени ФНС",
    "ГОСТ Р 34.11-2012",
    "хеш-суммы",
    "MD5",
    "SHA-256",
    "QR-код",
    "верификация",
    "онлайн-верификация",
    "защита авторства",
    "подтверждение авторства",
    "доказательство для суда",
    "ФНС",
    "RFC 3161",
    "торрент",
    "BitTorrent",
    "copyright",
    "Atoros",
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
    title: "Депонирование бесплатно авторских прав, ноу-хау, и любой информации с обеспечением доказательной базы для судов",
    description: "Бесплатное депонирование авторских прав, ноу-хау и любой информации. Метка времени ФНС, хеш-суммы (MD5, SHA-256, ГОСТ), QR-код. Доказательная база для судов.",
    images: [
      {
        url: "https://atoros.ru/og-home.png",
        width: 1344,
        height: 768,
        alt: "Atoros — депонирование авторских прав и ноу-хау бесплатно",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Депонирование бесплатно авторских прав, ноу-хау, и любой информации — Atoros.ru",
    description: "Бесплатное депонирование с меткой времени ФНС, хеш-суммами и QR-кодом. Доказательная база для судов.",
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
      { url: '/favicon-512.png', sizes: '512x512', type: 'image/png' },
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
        className={`${inter.variable} ${jetbrains.variable} ${lora.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}

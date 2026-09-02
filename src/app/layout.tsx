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

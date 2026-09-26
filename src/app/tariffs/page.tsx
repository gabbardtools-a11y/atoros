import { Header } from '@/components/site-header';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { SiteFooter } from '@/components/site-footer';

export const metadata = {
  title: 'Тарифы — Atoros',
  description: 'Стоимость депонирования авторских прав. Бесплатный тариф 10 МБ, платные тарифы для бизнеса. Метка времени ФНС включена во все тарифы.',
  openGraph: {
    title: 'Тарифы Atoros — бесплатно навсегда',
    description: 'Бесплатный тариф 10 МБ. Стандарт 490 ₽/мес. Бизнес 2 490 ₽/мес. Метка ФНС во всех тарифах.',
    type: 'website',
    locale: 'ru_RU',
    url: 'https://atoros.ru/tariffs',
    images: [{
      url: 'https://atoros.ru/og-tariffs.png',
      width: 1344,
      height: 768,
      alt: 'Тарифы Atoros',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Тарифы Atoros — бесплатно навсегда',
    description: 'Бесплатный тариф 10 МБ. Метка ФНС во всех тарифах.',
    images: ['https://atoros.ru/og-tariffs.png'],
  },
};

export default async function Page() {
  const session = await getServerSession(authOptions);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header session={session} />
      <main className="flex-1 max-w-[800px] w-full mx-auto px-6 py-16">
        <h1 className="text-3xl font-semibold text-foreground mb-4">Тарифы</h1>
        <p className="text-muted-foreground mb-8">Выберите подходящий вариант. Все тарифы включают тройную фиксацию даты, шифрование AES-256 и хеш-суммы.</p>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 rounded-lg border-2 border-primary bg-primary/5">
            <div className="text-sm font-bold text-primary mb-1">Бесплатный</div>
            <div className="text-3xl font-bold text-foreground mb-3">0 ₽</div>
            <ul className="space-y-2 text-sm text-muted-foreground mb-6">
              <li>✓ До 10 МБ на один архив</li>
              <li>✓ До 3 файлов</li>
              <li>✓ AES-256 шифрование</li>
              <li>✓ MD5 + SHA-256 хеш-суммы</li>
              <li>✓ Яндекс.Диск + Google Drive</li>
              <li>✓ Свидетельство с QR-кодом</li>
              <li>✓ Публикация в реестре</li>
            </ul>
            <a href="/auth/register" className="block text-center rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition">Начать бесплатно</a>
          </div>
          <div className="p-6 rounded-lg border border-border bg-card">
            <div className="text-sm font-bold text-foreground mb-1">Стандарт</div>
            <div className="text-3xl font-bold text-foreground mb-3">490 ₽<span className="text-sm font-normal text-muted-foreground">/мес</span></div>
            <ul className="space-y-2 text-sm text-muted-foreground mb-6">
              <li>✓ До 100 МБ на один архив</li>
              <li>✓ До 20 файлов</li>
              <li>✓ Всё из бесплатного</li>
              <li>✓ Безлимит свидетельств</li>
              <li>✓ Приоритетная загрузка</li>
              <li>✓ PDF-свидетельство</li>
              <li>✓ Email-поддержка</li>
            </ul>
            <a href="/auth/register" className="block text-center rounded-md border border-border px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition">Выбрать</a>
          </div>
          <div className="p-6 rounded-lg border border-border bg-card">
            <div className="text-sm font-bold text-foreground mb-1">Бизнес</div>
            <div className="text-3xl font-bold text-foreground mb-3">2 490 ₽<span className="text-sm font-normal text-muted-foreground">/мес</span></div>
            <ul className="space-y-2 text-sm text-muted-foreground mb-6">
              <li>✓ До 1 ГБ на один архив</li>
              <li>✓ Безлимит файлов</li>
              <li>✓ Всё из Стандарта</li>
              <li>✓ Командный доступ</li>
              <li>✓ API для интеграции</li>
              <li>✓ Бумажное свидетельство</li>
              <li>✓ Юрист-консультант</li>
            </ul>
            <a href="/auth/register" className="block text-center rounded-md border border-border px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition">Выбрать</a>
          </div>
        </div>

        <div className="p-6 rounded-lg border border-primary/20 bg-primary/5">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Все тарифы</strong> включают тройную фиксацию даты (Яндекс.Диск, Google Drive, atoros.ru), шифрование AES-256, хеш-суммы MD5 и SHA-256, и публикацию свидетельства в открытом реестре. Бесплатный тариф — навсегда, без скрытых платежей.
          </p>
        </div>
      </main>
    <SiteFooter />
    </div>
  );
}

import { Header } from '@/components/site-header';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { SiteFooter } from '@/components/site-footer';

export const metadata = { title: 'Пользовательское соглашение — Atoros', description: 'Пользовательское соглашение сервиса Atoros.ru. Условия использования, права и обязанности сторон.' };

export default async function Page() {
  const session = await getServerSession(authOptions);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header session={session} />
      <main className="flex-1 max-w-[800px] w-full mx-auto px-6 py-16">
        <h1 className="text-3xl font-semibold text-foreground mb-8">Пользовательское соглашение</h1>
        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p><strong className="text-foreground">1. Общие положения.</strong> Используя сервис Atoros.ru, вы соглашаетесь с настоящим пользовательским соглашением. Сервис предоставляет услугу депонирования цифровых файлов с фиксацией даты создания.</p>
          <p><strong className="text-foreground">2. Услуга.</strong> Atoros создаёт зашифрованный архив из загруженных файлов, вычисляет хеш-суммы MD5 и SHA-256, загружает копии на Яндекс.Диск и Google Drive, публикует свидетельство в реестре.</p>
          <p><strong className="text-foreground">3. Права пользователя.</strong> Пользователь сохраняет все авторские права на депонируемые материалы. Atoros не получает прав на контент пользователя. Архив шифруется — содержимое недоступно без пароля.</p>
          <p><strong className="text-foreground">4. Ответственность.</strong> Atoros не несёт ответственности за содержание депонируемых файлов. Пользователь гарантирует, что загружаемые материалы не нарушают права третьих лиц.</p>
          <p><strong className="text-foreground">5. Тарифы.</strong> Бесплатный тариф — до 10 МБ, навсегда. Платные тарифы — согласно публикуемым ценам. Оплата производится ежемесячно.</p>
          <p><strong className="text-foreground">6. Изменение условий.</strong> Atoros вправе изменять условия соглашения с уведомлением пользователей по email не менее чем за 14 дней.</p>
        </div>
      </main>
    <SiteFooter />
    </div>
  );
}

import { Header } from '@/components/site-header';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { SiteFooter } from '@/components/site-footer';

export const metadata = { title: 'Защита контента на маркетплейсах — Atoros', description: 'Защита карточек товаров, фото и описаний на Ozon, Wildberries, Яндекс.Маркет. Депонирование контента для продавцов маркетплейсов.' };

export default async function Page() {
  const session = await getServerSession(authOptions);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header session={session} />
      <main className="flex-1 max-w-[800px] w-full mx-auto px-6 py-16">
        <h1 className="text-3xl font-semibold text-foreground mb-4">Защита контента на маркетплейсах</h1>
        <p className="text-base text-muted-foreground leading-relaxed mb-6">Защита карточек товаров, фото и описаний на Ozon, Wildberries, Яндекс.Маркет. Депонирование контента для продавцов маркетплейсов.</p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          Atoros объединяет депонирование, публикацию и защиту контента в одной системе. Четверная фиксация даты (Яндекс.Диск, Google Drive, atoros.ru), шифрование AES-256, хеш-суммы MD5, SHA-256 и ГОСТ Р 34.11-2012, квалифицированная метка времени ФНС — каждый элемент можно проверить независимо.
        </p>
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-lg border border-border bg-card">
            <div className="text-sm font-semibold text-foreground mb-1">Шаг 1</div>
            <p className="text-xs text-muted-foreground">Загрузите файлы через личный кабинет</p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-card">
            <div className="text-sm font-semibold text-foreground mb-1">Шаг 2</div>
            <p className="text-xs text-muted-foreground">Сервис создаёт архив, шифрует, вычисляет хеши, загружает в облака</p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-card">
            <div className="text-sm font-semibold text-foreground mb-1">Шаг 3</div>
            <p className="text-xs text-muted-foreground">Получаете свидетельство с уникальным номером</p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-card">
            <div className="text-sm font-semibold text-foreground mb-1">Шаг 4</div>
            <p className="text-xs text-muted-foreground">Свидетельство публикуется в открытом реестре</p>
          </div>
        </div>
        <a href="/auth/register" className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition">Попробовать бесплатно</a>
      </main>
    <SiteFooter />
    </div>
  );
}

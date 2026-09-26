import { Header } from '@/components/site-header';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { SiteFooter } from '@/components/site-footer';

export const metadata = { title: 'Депонирование дизайна — Atoros', description: 'Депонирование дизайна, инфографики, логотипов, макетов. Защита прав дизайнеров.' };

export default async function Page() {
  const session = await getServerSession(authOptions);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header session={session} />
      <main className="flex-1 max-w-[800px] w-full mx-auto px-6 py-16">
        <h1 className="text-3xl font-semibold text-foreground mb-4">Дизайн и инфографика</h1>
        <p className="text-base text-muted-foreground leading-relaxed mb-6">Дизайн воруют чаще, чем тексты. Логотип, который вы нарисовали для клиента, может оказаться на вывеске без оплаты. Инфографику копируют целиком, не меняя ни пикселя. Макет сайта могут передать другому разработчику. Депонирование PSD/AI-файлов с слоями — лучшее доказательство, что оригинал был у вас.</p>
        <div className="p-5 rounded-lg border border-border bg-card mb-6">
          <div className="text-sm font-semibold text-foreground mb-2">Что можно депонировать</div>
          <p className="text-sm text-muted-foreground leading-relaxed">Что депонировать: PSD, AI, Sketch, Figma-экспорты, SVG, PNG с слоями, макеты в PDF.</p>
        </div>
        <div className="p-5 rounded-lg border border-primary/20 bg-primary/5 mb-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Как это работает:</strong> вы загружаете файлы → сервис создаёт архив с AES-256 шифрованием → вычисляет хеш-суммы → загружает копии на Яндекс.Диск и Google Drive → публикует свидетельство в реестре. Три независимые даты, неизменный файл, публичная проверка.
          </p>
        </div>
        <a href="/auth/register" className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition">Задепонировать дизайн</a>
      </main>
    <SiteFooter />
    </div>
  );
}

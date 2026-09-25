import { Header } from '@/components/site-header';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { SiteFooter } from '@/components/site-footer';

export const metadata = { title: 'Отзывы — Atoros', description: 'Отзывы пользователей сервиса Atoros. Реальные истории депонирования и защиты авторских прав.' };

export default async function Page() {
  const session = await getServerSession(authOptions);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header session={session} />
      <main className="flex-1 max-w-[800px] w-full mx-auto px-6 py-16">
        <h1 className="text-3xl font-semibold text-foreground mb-8">Отзывы</h1>
        <div className="space-y-4">
          <div className="p-5 rounded-lg border border-border bg-card">
            <div className="text-sm font-semibold text-foreground mb-1">Анна, графический дизайнер</div>
            <p className="text-sm text-muted-foreground">Задепонировала логотип до показа клиенту. Когда клиент отказался платить, а логотип появился на вывеске — отправила номер свидетельства и ссылки на облака. Заплатил на следующий день.</p>
          </div>
          <div className="p-5 rounded-lg border border-border bg-card">
            <div className="text-sm font-semibold text-foreground mb-1">Дмитрий, разработчик</div>
            <p className="text-sm text-muted-foreground">Депонирую каждую версию репозитория. Когда бывший партнёр запустил сервис на нашем коде — свидетельство с датой и хеш-суммой закрыло все вопросы.</p>
          </div>
          <div className="p-5 rounded-lg border border-border bg-card">
            <div className="text-sm font-semibold text-foreground mb-1">Марина, фотограф</div>
            <p className="text-sm text-muted-foreground">RAW-файлы с EXIF + тройная дата — этого достаточно, чтобы сток удалил украденные фотографии по одному обращению.</p>
          </div>
          <div className="p-5 rounded-lg border border-border bg-card">
            <div className="text-sm font-semibold text-foreground mb-1">Игорь, писатель</div>
            <p className="text-sm text-muted-foreground">Каждую главу депонирую до отправки редактору. Привычка, которая однажды спасёт — уверен на 100%.</p>
          </div>
        </div>
      </main>
    <SiteFooter />
    </div>
  );
}

import { Header } from '@/components/site-header';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { SiteFooter } from '@/components/site-footer';

export const metadata = { title: 'Договоры и NDA — Atoros', description: 'Шаблоны договоров: NDA, коммерческая тайна, передача прав на ИС. Депонирование договоров и соглашений.' };

export default async function Page() {
  const session = await getServerSession(authOptions);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header session={session} />
      <main className="flex-1 max-w-[800px] w-full mx-auto px-6 py-16">
        <h1 className="text-3xl font-semibold text-foreground mb-4">Договоры и NDA</h1>
        <p className="text-base text-muted-foreground leading-relaxed mb-6">
          Договор на бумаге — это хорошо. Но подписанный договор с подтверждённой датой — это надёжно. Atoros депонирует договоры, NDA и соглашения о передаче прав, фиксируя дату подписания тремя независимыми источниками.
        </p>
        <div className="space-y-4 mb-6">
          <div className="p-5 rounded-lg border border-border bg-card">
            <div className="text-sm font-semibold text-foreground mb-1">NDA с сотрудниками и подрядчиками</div>
            <p className="text-sm text-muted-foreground">Депонируйте подписанный NDA до начала работы. Если сотрудник уйдёт и унесёт ноу-хау — у вас есть договор с датой, подтверждённой Яндекс.Диском, Google Drive и atoros.ru.</p>
          </div>
          <div className="p-5 rounded-lg border border-border bg-card">
            <div className="text-sm font-semibold text-foreground mb-1">Договор о передаче прав на ИС</div>
            <p className="text-sm text-muted-foreground">Фрилансер сделал дизайн, код или текст — передал права компании. Депонируйте договор, чтобы потом не доказывать, когда именно произошла передача.</p>
          </div>
          <div className="p-5 rounded-lg border border-border bg-card">
            <div className="text-sm font-semibold text-foreground mb-1">Коммерческая тайна</div>
            <p className="text-sm text-muted-foreground">Положение о коммерческой тайне, списки клиентов, методики работы — депонируйте, чтобы зафиксировать, что именно составляло вашу тайну на определённую дату.</p>
          </div>
        </div>
        <a href="/auth/register" className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition">Депонировать договор</a>
      </main>
    <SiteFooter />
    </div>
  );
}

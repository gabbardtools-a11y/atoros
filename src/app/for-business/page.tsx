import { Header } from '@/components/site-header';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { SiteFooter } from '@/components/site-footer';

export const metadata = { title: 'Для бизнеса — Atoros', description: 'Защита контента компании: описания товаров, маркетинговые материалы, бренд-контент, ноу-хау.' };

export default async function Page() {
  const session = await getServerSession(authOptions);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header session={session} />
      <main className="flex-1 max-w-[800px] w-full mx-auto px-6 py-16">
        <h1 className="text-3xl font-semibold text-foreground mb-4">Для бизнеса</h1>
        <p className="text-base text-muted-foreground leading-relaxed mb-6">
          Защита контента компании: описания товаров, маркетинговые материалы, бренд-контент, ноу-хау. Atoros фиксирует дату создания ваших работ одновременно в трёх независимых хранилищах — Яндекс.Диске, Google Drive и нашем сервере. Архив шифруется AES-256, вычисляются хеш-суммы MD5 и SHA-256. Любой может проверить ваше свидетельство без регистрации.
        </p>
        <div className="grid gap-4 mb-6">
          <div className="p-4 rounded-lg border border-border bg-card">
            <div className="text-sm font-semibold text-foreground mb-1">Проблема</div>
            <p className="text-sm text-muted-foreground">Контент копируют, используют без разрешения, выдают за свой. Без подтверждённой даты создания доказать авторство сложно.</p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-card">
            <div className="text-sm font-semibold text-foreground mb-1">Решение</div>
            <p className="text-sm text-muted-foreground">Депонирование фиксирует дату, подтверждённую тремя независимыми источниками. Архив нельзя изменить — хеш-сумма это доказывает.</p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-card">
            <div className="text-sm font-semibold text-foreground mb-1">Результат</div>
            <p className="text-sm text-muted-foreground">Свидетельство с уникальным номером, публичная ссылка в реестре, ссылки на облачные копии. Достаточно для досудебного урегулирования или суда.</p>
          </div>
        </div>
        <a href="/auth/register" className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition">Начать бесплатно</a>
      </main>
    <SiteFooter />
    </div>
  );
}

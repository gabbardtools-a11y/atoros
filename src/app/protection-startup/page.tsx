import { Header } from '@/components/site-header';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { SiteFooter } from '@/components/site-footer';

export const metadata = { title: 'Защита стартапа — Atoros', description: 'Защита интеллектуальной собственности стартапа: код, идея, продукт. Депонирование для привлечения инвестиций и защиты от копирования.' };

export default async function Page() {
  const session = await getServerSession(authOptions);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header session={session} />
      <main className="flex-1 max-w-[800px] w-full mx-auto px-6 py-16">
        <h1 className="text-3xl font-semibold text-foreground mb-4">Защита стартапа</h1>
        <p className="text-base text-muted-foreground leading-relaxed mb-6">
          Стартап без защиты — это приглашение для копирования. Инвесторы хотят видеть, что интеллектуальная собственность защищена. Конкуренты не дремлют. Бывшие партнёры могут заявить права на код. Atoros помогает зафиксировать каждую версию вашего продукта — от первого прототипа до релиза.
        </p>
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-lg border border-border bg-card">
            <div className="text-sm font-semibold text-foreground mb-1">Для инвесторов</div>
            <p className="text-xs text-muted-foreground">Покажите инвестору цепочку свидетельств — от идеи до MVP. Каждый этап с датой и хеш-суммой. Это повышает оценку стартапа.</p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-card">
            <div className="text-sm font-semibold text-foreground mb-1">Для сооснователей</div>
            <p className="text-xs text-muted-foreground">Каждый коммит, каждая версия кода депонирована отдельно. Спор о том, кто что написал, решается за 5 минут.</p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-card">
            <div className="text-sm font-semibold text-foreground mb-1">Для бухгалтерии</div>
            <p className="text-xs text-muted-foreground">Депонированный код — это нематериальный актив. Примите разработку к бухучёту, увеличьте стоимость компании.</p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-card">
            <div className="text-sm font-semibold text-foreground mb-1">От подрядчиков</div>
            <p className="text-xs text-muted-foreground">Подрядчик сделал код, а потом использовал его же в другом проекте? Свидетельство с датой — и подрядчик вернёт деньги.</p>
          </div>
        </div>
        <div className="p-5 rounded-lg border border-primary/20 bg-primary/5 mb-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Совет:</strong> депонируйте каждую значимую версию продукта. Первая версия — свидетельство № 2026-001. MVP — № 2026-014. Pre-seed раунд — № 2026-028. Инвестор видит живую историю развития продукта с подтверждёнными датами.
          </p>
        </div>
        <a href="/auth/register" className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition">Защитить стартап</a>
      </main>
    <SiteFooter />
    </div>
  );
}

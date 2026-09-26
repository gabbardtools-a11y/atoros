import { Header } from '@/components/site-header';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { SiteFooter } from '@/components/site-footer';

export const metadata = { title: 'Консультация юриста — Atoros', description: 'Консультация юриста по авторским правам. Патентные поверенные Туленинов Н.Н. и Беркутова Н.Н. помогут защитить вашу интеллектуальную собственность.' };

export default async function Page() {
  const session = await getServerSession(authOptions);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header session={session} />
      <main className="flex-1 max-w-[800px] w-full mx-auto px-6 py-16">
        <h1 className="text-3xl font-semibold text-foreground mb-4">Консультация юриста</h1>
        <p className="text-base text-muted-foreground leading-relaxed mb-6">
          Депонирование — это инструмент. Но иногда нужен специалист, который подскажет, как им правильно воспользоваться. Наши патентные поверенные помогут разобраться в ситуации и составить план защиты.
        </p>
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="p-5 rounded-lg border border-border bg-card">
            <div className="text-sm font-semibold text-foreground mb-1">Туленинов Н.Н.</div>
            <p className="text-xs text-muted-foreground">Патентный поверенный № 1416</p>
            <p className="text-xs text-muted-foreground mt-2">info@atoros.ru<br/>+7 (985) 938-38-72<br/>WhatsApp / Telegram</p>
          </div>
          <div className="p-5 rounded-lg border border-border bg-card">
            <div className="text-sm font-semibold text-foreground mb-1">Беркутова Н.Н.</div>
            <p className="text-xs text-muted-foreground">Патентный поверенный № 957</p>
            <p className="text-xs text-muted-foreground mt-2">n.berkutova@mail.ru<br/>+7 (916) 496-49-29</p>
          </div>
        </div>
        <div className="p-5 rounded-lg border border-primary/20 bg-primary/5 mb-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Когда нужна консультация:</strong> спор об авторстве, подготовка иска, проверка договора, оценка рисков, стратегия защиты, международная защита, вопросы по ноу-хау и коммерческой тайне.
          </p>
        </div>
        <a href="mailto:info@atoros.ru" className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition">Написать юристу</a>
      </main>
    <SiteFooter />
    </div>
  );
}

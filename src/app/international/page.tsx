import { Header } from '@/components/site-header';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { SiteFooter } from '@/components/site-footer';

export const metadata = { title: 'Международная защита — Atoros', description: 'Международная защита авторских прав: Бернская конвенция, 181 страна. Как свидетельство Atoros работает за рубежом.' };

export default async function Page() {
  const session = await getServerSession(authOptions);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header session={session} />
      <main className="flex-1 max-w-[800px] w-full mx-auto px-6 py-16">
        <h1 className="text-3xl font-semibold text-foreground mb-4">Международная защита</h1>
        <p className="text-base text-muted-foreground leading-relaxed mb-6">
          Авторские права в России возникают автоматически — регистрация не нужна. А за рубежом? Россия — участник Бернской конвенции об охране литературных и художественных произведений. Это значит, что произведения российских авторов защищаются в 181 стране мира автоматически.
        </p>
        <div className="space-y-4 mb-6">
          <div className="p-5 rounded-lg border border-border bg-card">
            <div className="text-sm font-semibold text-foreground mb-2">Бернская конвенция</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Россия присоединилась к Бернской конвенции в 1995 году. Произведение, созданное российским автором, защищается в 181 стране на тех же условиях, что и произведения местных авторов. Не нужна отдельная регистрация в каждой стране.
            </p>
          </div>
          <div className="p-5 rounded-lg border border-border bg-card">
            <div className="text-sm font-semibold text-foreground mb-2">Как Atoros помогает за рубежом</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Свидетельство о депонировании с тремя независимыми датами (ФНС, Яндекс, Google, atoros.ru) и хеш-суммами — это доказательство, которое работает в любой стране. Google, YouTube, Facebook, Instagram принимают свидетельства о депонировании для блокировки пиратского контента без суда.
            </p>
          </div>
          <div className="p-5 rounded-lg border border-border bg-card">
            <div className="text-sm font-semibold text-foreground mb-2">Яндекс и Google как международные свидетели</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Дата загрузки на Яндекс.Диск подтверждена серверами Яндекса. Дата загрузки на Google Drive — серверами Google. Это две глобальные корпорации с дата-центрами по всему миру. Их внутренние логи — независимое подтверждение даты, которое признаётся в любой юрисдикции.
            </p>
          </div>
        </div>
        <a href="/auth/register" className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition">Защитить произведение</a>
      </main>
    <SiteFooter />
    </div>
  );
}

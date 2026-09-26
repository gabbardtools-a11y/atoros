import { Header } from '@/components/site-header';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { SiteFooter } from '@/components/site-footer';

export const metadata = { title: 'Блокировка пиратского контента — Atoros', description: 'Блокировка пиратского контента без суда: Google, Яндекс, YouTube, соцсети, маркетплейсы. Как свидетельство помогает удалить украденный контент.' };

export default async function Page() {
  const session = await getServerSession(authOptions);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header session={session} />
      <main className="flex-1 max-w-[800px] w-full mx-auto px-6 py-16">
        <h1 className="text-3xl font-semibold text-foreground mb-4">Блокировка пиратского контента</h1>
        <p className="text-base text-muted-foreground leading-relaxed mb-6">
          Нашли свой контент на чужом ресурсе? Не нужно сразу идти в суд. Google, Яндекс, YouTube, Facebook, Instagram, ВКонтакте, маркетплейсы — все они принимают свидетельства о депонировании как доказательство прав и блокируют пиратский контент без судебного решения.
        </p>
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-lg border border-border bg-card">
            <div className="text-sm font-semibold text-foreground mb-1">Google</div>
            <p className="text-xs text-muted-foreground">Подайте жалобу через Google DMCA. Приложите номер свидетельства и ссылки на облачные копии. Контент блокируют за 24-48 часов.</p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-card">
            <div className="text-sm font-semibold text-foreground mb-1">Яндекс</div>
            <p className="text-xs text-muted-foreground">Жалоба через Яндекс.Вебмастер или форму нарушения прав. Свидетельство с тремя датами — железобетонное доказательство.</p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-card">
            <div className="text-sm font-semibold text-foreground mb-1">YouTube</div>
            <p className="text-xs text-muted-foreground">Страйк через Copyright Takedown. Свидетельство + хеш-сумма + дата загрузки на Яндекс/Google — достаточно для удаления видео.</p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-card">
            <div className="text-sm font-semibold text-foreground mb-1">Маркетплейсы</div>
            <p className="text-xs text-muted-foreground">Ozon, Wildberries — жалоба на копирование карточки товара. Депонированные фото и описания с датой — основание для блокировки дубликата.</p>
          </div>
        </div>
        <div className="p-5 rounded-lg border border-primary/20 bg-primary/5 mb-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Важно:</strong> блокировка без суда работает для очевидных случаев копирования. Если спор сложный — может потребоваться суд. Но в 80% случаев достаточно свидетельства и правильно составленной претензии.
          </p>
        </div>
        <a href="/auth/register" className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition">Депонировать контент</a>
      </main>
    <SiteFooter />
    </div>
  );
}

import { Header } from '@/components/site-header';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { SiteFooter } from '@/components/site-footer';

export const metadata = { title: 'Защита бизнеса — Atoros', description: 'Защита интеллектуальной собственности бизнеса: контент, бренд-материалы, маркетинговые материалы, ноу-хау. Депонирование для компаний.' };

export default async function Page() {
  const session = await getServerSession(authOptions);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header session={session} />
      <main className="flex-1 max-w-[800px] w-full mx-auto px-6 py-16">
        <h1 className="text-3xl font-semibold text-foreground mb-4">Защита бизнеса</h1>
        <p className="text-base text-muted-foreground leading-relaxed mb-6">
          Компании теряют миллионы из-за украденного контента. Конкурент скопировал описания товаров — вы теряете позиции в поиске. Бывший сотрудник унёс базу — вы теряете клиентов. Подрядчик использовал ваш код в другом проекте — вы теряете конкурентное преимущество. Atoros помогает зафиксировать, что именно и когда было у вас на руках.
        </p>
        <div className="space-y-4 mb-6">
          <div className="p-5 rounded-lg border border-border bg-card">
            <div className="text-sm font-semibold text-foreground mb-2">Что защищать бизнесу</div>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Описания товаров и услуг для маркетплейсов и сайта</li>
              <li>• Маркетинговые материалы: презентации, лендинги, рекламные тексты</li>
              <li>• Исходный код продуктов и внутренних систем</li>
              <li>• Базы данных и клиентские списки</li>
              <li>• Ноу-хау: технические решения, методики, процессы</li>
              <li>• Дизайн: логотипы, интерфейсы, фирменный стиль</li>
              <li>• Обучающие материалы и методики</li>
            </ul>
          </div>
          <div className="p-5 rounded-lg border border-border bg-card">
            <div className="text-sm font-semibold text-foreground mb-2">Как это работает для бизнеса</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Депонируйте контент до публикации — на сайте, на маркетплейсе, в рекламе. Если конкурент скопирует — у вас есть свидетельство с датой, подтверждённой Яндекс.Диском, Google Drive и atoros.ru. Три независимых источника + хеш-сумма MD5/SHA-256. Этого достаточно для досудебной претензии или иска.
            </p>
          </div>
          <div className="p-5 rounded-lg border border-border bg-card">
            <div className="text-sm font-semibold text-foreground mb-2">Стоимость</div>
            <p className="text-sm text-muted-foreground">Бесплатный тариф — до 10 МБ, навсегда. Тариф «Бизнес» — 2 490₽/мес: до 1 ГБ, командный доступ, API, бумажное свидетельство, юрист-консультант.</p>
          </div>
        </div>
        <a href="/auth/register" className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition">Защитить бизнес</a>
      </main>
    <SiteFooter />
    </div>
  );
}

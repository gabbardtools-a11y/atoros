import { Header } from '@/components/site-header';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { SiteFooter } from '@/components/site-footer';

export const metadata = { title: 'Контакты — Atoros', description: 'Связаться с командой Atoros. Email, телефон, мессенджеры. ООО Патентные Технологии.' };

export default async function Page() {
  const session = await getServerSession(authOptions);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header session={session} />
      <main className="flex-1 max-w-[800px] w-full mx-auto px-6 py-16">
        <h1 className="text-3xl font-semibold text-foreground mb-8">Контакты</h1>
        <div className="space-y-4">
          <div className="p-5 rounded-lg border border-border bg-card">
            <div className="text-sm font-semibold text-foreground mb-1">Email</div>
            <a href="mailto:info@atoros.ru" className="text-primary hover:underline">info@atoros.ru</a>
          </div>
          <div className="p-5 rounded-lg border border-border bg-card">
            <div className="text-sm font-semibold text-foreground mb-1">Телефон</div>
            <a href="tel:+74953691314" className="text-primary hover:underline">+7 (495) 369-13-14</a>
          </div>
          <div className="p-5 rounded-lg border border-border bg-card">
            <div className="text-sm font-semibold text-foreground mb-1">WhatsApp / Telegram</div>
            <a href="tel:+79859383872" className="text-primary hover:underline">+7 (985) 938-38-72</a>
          </div>
          <div className="p-5 rounded-lg border border-border bg-card">
            <div className="text-sm font-semibold text-foreground mb-1">Организация</div>
            <p className="text-sm text-muted-foreground">ООО «Патентные Технологии»<br/>ИНН 7716687757 · ОГРН 1117746321296</p>
          </div>
          <div className="p-5 rounded-lg border border-border bg-card">
            <div className="text-sm font-semibold text-foreground mb-1">Патентные поверенные</div>
            <p className="text-sm text-muted-foreground">Туленинов Н.Н. (№ 1416)<br/>Беркутова Н.Н. (№ 957)</p>
          </div>
        </div>
      </main>
    <SiteFooter />
    </div>
  );
}

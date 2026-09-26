import { Header } from '@/components/site-header';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { SiteFooter } from '@/components/site-footer';

export const metadata = { title: 'Что не является объектом авторских прав — Atoros', description: 'Что нельзя депонировать: законы, госдокументы, фольклор, новости, идеи. Объекты, не защищаемые авторским правом.' };

export default async function Page() {
  const session = await getServerSession(authOptions);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header session={session} />
      <main className="flex-1 max-w-[800px] w-full mx-auto px-6 py-16">
        <h1 className="text-3xl font-semibold text-foreground mb-4">Что не защищается авторским правом</h1>
        <p className="text-base text-muted-foreground leading-relaxed mb-6">
          Депонирование защищает материальную форму произведения — файл, текст, изображение, код. Но есть вещи, которые авторским правом не охраняются в принципе. Вот их список.
        </p>
        <div className="space-y-4 mb-6">
          <div className="p-5 rounded-lg border border-border bg-card">
            <div className="text-sm font-semibold text-foreground mb-1">Идеи, концепции, методы</div>
            <p className="text-sm text-muted-foreground">Идею приложения нельзя депонировать — можно только код. Идею книги — можно только текст. Идею фильма — можно только сценарий. Авторское право защищает форму, а не содержание.</p>
          </div>
          <div className="p-5 rounded-lg border border-border bg-card">
            <div className="text-sm font-semibold text-foreground mb-1">Законы и нормативные акты</div>
            <p className="text-sm text-muted-foreground">Официальные документы госорганов: законы, постановления, судебные решения. Их можно использовать свободно.</p>
          </div>
          <div className="p-5 rounded-lg border border-border bg-card">
            <div className="text-sm font-semibold text-foreground mb-1">Государственные символы</div>
            <p className="text-sm text-muted-foreground">Флаги, гербы, ордена, денежные знаки — не охраняются авторским правом.</p>
          </div>
          <div className="p-5 rounded-lg border border-border bg-card">
            <div className="text-sm font-semibold text-foreground mb-1">Фольклор</div>
            <p className="text-sm text-muted-foreground">Произведения народного творчества без конкретного автора — не охраняются.</p>
          </div>
          <div className="p-5 rounded-lg border border-border bg-card">
            <div className="text-sm font-semibold text-foreground mb-1">Новости</div>
            <p className="text-sm text-muted-foreground">Сообщения о событиях и фактах информационного характера — не охраняются. Но статья с авторским анализом события — охраняется.</p>
          </div>
        </div>
        <div className="p-5 rounded-lg border border-primary/20 bg-primary/5 mb-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Правило:</strong> если произведение существует в материальной форме (файл, текст, изображение) и создано конкретным автором — его можно депонировать. Если это идея, закон, символ или народное творчество — нельзя.
          </p>
        </div>
        <a href="/auth/register" className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition">Депонировать произведение</a>
      </main>
    <SiteFooter />
    </div>
  );
}

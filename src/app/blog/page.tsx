import { Header } from '@/components/site-header';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { SiteFooter } from '@/components/site-footer';
import { AlertTriangle, Network } from 'lucide-react';

export const metadata = { title: 'Блог — Atoros', description: 'Блог Atoros: статьи о защите авторских прав, депонировании, ноу-хау и интеллектуальной собственности.' };

export default async function Page() {
  const session = await getServerSession(authOptions);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header session={session} />
      <main className="flex-1 max-w-[800px] w-full mx-auto px-6 py-16">
        <h1 className="text-3xl font-semibold text-foreground mb-8">Блог</h1>
        <p className="text-muted-foreground mb-6">Статьи о защите авторских прав, депонировании и интеллектуальной собственности.</p>
        <div className="space-y-4">
          <a href="/blog/torrent-killer-feature" className="block p-5 rounded-lg border-2 border-primary/30 bg-primary/5 hover:border-primary/50 transition">
            <div className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Network className="h-4 w-4 text-primary" />
              Торрент-сеть для депонирования: killer-feature Atoros
            </div>
            <div className="text-xs text-muted-foreground mt-1">Децентрализованное хранение через BitTorrent: файл survives даже при исчезновении сервиса. Ни у одного конкурента.</div>
          </a>
          <a href="/blog/blockchain-critique-preview" className="block p-5 rounded-lg border-2 border-primary/30 bg-primary/5 hover:border-primary/50 transition">
            <div className="text-sm font-semibold text-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-primary" />
              Почему блокчейн не подходит для защиты авторских прав
            </div>
            <div className="text-xs text-muted-foreground mt-1">Критический разбор: 10 разделов, статьи ГК РФ, ФЗ-63, сравнение с меткой времени ФНС. Полная статья — по ссылке.</div>
          </a>
          <a href="/laws" className="block p-5 rounded-lg border border-border bg-card hover:border-primary/50 transition">
            <div className="text-sm font-semibold text-foreground">Как депонирование работает с точки зрения закона</div>
            <div className="text-xs text-muted-foreground mt-1">ГК РФ ч.4, ст. 1255, 1465, доказательства в суде</div>
          </a>
          <a href="/cases" className="block p-5 rounded-lg border border-border bg-card hover:border-primary/50 transition">
            <div className="text-sm font-semibold text-foreground">8 реальных кейсов: когда депонирование выручило</div>
            <div className="text-xs text-muted-foreground mt-1">Дизайнеры, разработчики, музыканты, фотографы, блогеры</div>
          </a>
          <a href="/services" className="block p-5 rounded-lg border border-border bg-card hover:border-primary/50 transition">
            <div className="text-sm font-semibold text-foreground">Что именно делает Atoros с вашим файлом</div>
            <div className="text-xs text-muted-foreground mt-1">Четверная фиксация даты, AES-256, хеш-суммы, проверка</div>
          </a>
          <a href="/info" className="block p-5 rounded-lg border border-border bg-card hover:border-primary/50 transition">
            <div className="text-sm font-semibold text-foreground">9 вопросов о депонировании — коротко о главном</div>
            <div className="text-xs text-muted-foreground mt-1">Что депонировать, зачем пароль, сколько стоит</div>
          </a>
        </div>
      </main>
    <SiteFooter />
    </div>
  );
}

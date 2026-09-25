import { Header } from '@/components/site-header';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { SiteFooter } from '@/components/site-footer';

export const metadata = { title: 'Защита ноу-хау и секретов производства — Atoros', description: 'Депонирование ноу-хау: защита секретов производства, коммерческой тайны, технических решений.' };

export default async function Page() {
  const session = await getServerSession(authOptions);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header session={session} />
      <main className="flex-1 max-w-[800px] w-full mx-auto px-6 py-16">
        <h1 className="text-3xl font-semibold text-foreground mb-4">Защита ноу-хау и секретов производства</h1>
        <p className="text-base text-muted-foreground leading-relaxed mb-6">Депонирование ноу-хау: защита секретов производства, коммерческой тайны, технических решений.</p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          В России авторское право возникает в момент создания произведения — регистрация не требуется (ст. 1255 ГК РФ). Но при споре нужно доказать, что произведение было у вас раньше, чем у нарушителя. Депонирование решает эту задачу: фиксирует дату, подтверждённую тремя независимыми источниками (Яндекс.Диск, Google Drive, atoros.ru), и неизменный файл с хеш-суммами MD5 и SHA-256.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Свидетельство о депонировании принимается судами как письменное доказательство (ст. 71 ГПК РФ, ст. 75 АПК РФ). Электронный документ приравнивается к письменному. Ссылки на облачные хранилища — дополнительные доказательства, которые суд может проверить самостоятельно.
        </p>
        <div className="p-5 rounded-lg border border-primary/20 bg-primary/5 mb-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Важно:</strong> депонирование — это не регистрация права собственности и не патент. Это фиксация факта: «в такую-то дату у меня был такой-то файл». Этого достаточно для доказательства приоритета.
          </p>
        </div>
        <a href="/auth/register" className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition">Задепонировать</a>
      </main>
    <SiteFooter />
    </div>
  );
}

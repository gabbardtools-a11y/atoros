import { Header } from '@/components/site-header';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { SiteFooter } from '@/components/site-footer';
import { AlertTriangle, ArrowRight } from 'lucide-react';

export const metadata = { title: 'Блокчейн и депонирование — Atoros', description: 'Как блокчейн связан с депонированием. Цифровые отпечатки, хеш-суммы, неизменность данных. Технологии защиты авторских прав.' };

export default async function Page() {
  const session = await getServerSession(authOptions);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header session={session} />
      <main className="flex-1 max-w-[800px] w-full mx-auto px-6 py-16">
        <h1 className="text-3xl font-semibold text-foreground mb-4">Блокчейн и депонирование</h1>
        <p className="text-base text-muted-foreground leading-relaxed mb-6">
          Технология блокчейн и депонирование решают одну задачу — доказать, что определённая информация существовала в конкретный момент времени. Но делают это по-разному.
        </p>
        <div className="space-y-4 mb-6">
          <div className="p-5 rounded-lg border border-border bg-card">
            <div className="text-sm font-semibold text-foreground mb-2">Как работает блокчейн</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Блокчейн — это цепочка блоков, где каждый содержит цифровой слепок предыдущего. Изменить один блок — сломается вся цепочка. Информация хранится одновременно на тысячах компьютеров. Подделать задним числом невозможно — потребовались бы мощности, сопоставимые с энергопотреблением целой страны.
            </p>
          </div>
          <div className="p-5 rounded-lg border border-border bg-card">
            <div className="text-sm font-semibold text-foreground mb-2">Как работает Atoros</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Atoros использует похожий принцип, но вместо блокчейна — четыре независимых источника фиксации: ФНС (квалифицированная метка доверенного времени по ГОСТ Р 34.11-2012), Яндекс.Диск, Google Drive и наш сервер. Каждое фиксирует дату загрузки независимо. Плюс хеш-суммы MD5, SHA-256 и ГОСТ — цифровые отпечатки файла, которые меняются при любом изменении.
            </p>
          </div>
          <div className="p-5 rounded-lg border border-border bg-card">
            <div className="text-sm font-semibold text-foreground mb-2">Сравнение</div>
            <table className="w-full text-xs text-muted-foreground">
              <tr className="border-b border-border"><td className="py-2 font-medium text-foreground">Критерий</td><td className="py-2">Блокчейн</td><td className="py-2">Atoros</td></tr>
              <tr className="border-b border-border"><td className="py-2">Фиксация даты</td><td className="py-2">В блоке</td><td className="py-2">4 источника (ФНС + облака)</td></tr>
              <tr className="border-b border-border"><td className="py-2">Неизменность</td><td className="py-2">Криптография сети</td><td className="py-2">AES-256 + 3 хеша</td></tr>
              <tr className="border-b border-border"><td className="py-2">Проверка</td><td className="py-2">Нужен блокчейн-эксплорер</td><td className="py-2">Скачал — проверил хеш</td></tr>
              <tr className="border-b border-border"><td className="py-2">Юридическая сила</td><td className="py-2">Требует экспертизы</td><td className="py-2">Подпись ФНС по ФЗ-63</td></tr>
              <tr><td className="py-2">Скорость</td><td className="py-2">Минуты-часы</td><td className="py-2">Мгновенно</td></tr>
            </table>
          </div>
        </div>

        {/* Critical note about blockchain drawbacks */}
        <div className="p-5 rounded-lg border-2 border-primary/30 bg-primary/5 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-primary flex-shrink-0" />
            <div className="text-sm font-semibold text-foreground">Однако блокчейн имеет существенные недостатки</div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Для защиты авторских прав блокчейн подходит плохо. Неудаляемость записей превращается в проблему при обнаружении пиратства, анонимность участников делает невозможным преследование нарушителей, комиссии сети делают «бесплатное депонирование» технически невозможным, а юридическая сила блокчейн-записи требует комплексной технической экспертизы — тогда как квалифицированная метка времени ФНС принимается судом в силу закона. Мы разобрали это подробно в отдельной статье.
          </p>
          <a
            href="/blockchain-critique"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition"
          >
            Читать: «Почему блокчейн не подходит для защиты авторских прав»
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <a href="/auth/register" className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition">Попробовать</a>
      </main>
    <SiteFooter />
    </div>
  );
}

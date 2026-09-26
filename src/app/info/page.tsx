import { Header } from '@/components/site-header';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Info, HelpCircle, Upload, Lock, Eye, FileText, Clock, ShieldCheck } from 'lucide-react';
import { SiteFooter } from '@/components/site-footer';

export const metadata = {
  title: 'Инфо — Atoros',
  description: 'Ответы на частые вопросы о депонировании. Как загрузить файл, как работает пароль, как проверить свидетельство.',
};

export default async function InfoPage() {
  const session = await getServerSession(authOptions);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header session={session} />
      <main className="flex-1 max-w-[800px] w-full mx-auto px-6 py-16">

        <div className="mb-12">
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary mb-3">
            <Info className="h-3.5 w-3.5" />
            Частые вопросы
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Коротко о главном
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            Здесь — ответы на вопросы, которые задают чаще всего. Если не нашли свой — напишите на info@atoros.ru, ответим лично.
          </p>
        </div>

        {/* FAQ items */}
        <div className="space-y-6">

          <div className="p-5 rounded-lg border border-border bg-card">
            <div className="flex items-start gap-3 mb-2">
              <Upload className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <h2 className="text-base font-semibold text-foreground">Что можно депонировать?</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed pl-8">
              Любые файлы. Тексты, изображения, исходный код, музыку, видео, чертежи, дизайн-макеты, базы данных, документацию. Если файл можно упаковать в архив — его можно задепонировать. Загрузите до 5 файлов за один раз, каждый до 10 МБ, общий размер до 30 МБ. Сервис сам создаст архив.
            </p>
          </div>

          <div className="p-5 rounded-lg border border-border bg-card">
            <div className="flex items-start gap-3 mb-2">
              <Lock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <h2 className="text-base font-semibold text-foreground">Зачем пароль на архиве?</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed pl-8">
              Архив шифруется по алгоритму AES-256 — это стандарт, который используют банки и спецслужбы. Без пароля файл не открыть. Пароль видите только вы, в личном кабинете. На Яндекс.Диск и Google Drive загружается уже зашифрованный архив — даже если кто-то получит к нему доступ, без пароля содержимое недоступно. Имена файлов внутри тоже зашифрованы.
            </p>
          </div>

          <div className="p-5 rounded-lg border border-border bg-card">
            <div className="flex items-start gap-3 mb-2">
              <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <h2 className="text-base font-semibold text-foreground">Как фиксируется дата?</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed pl-8">
              Дата фиксируется одновременно в трёх местах: на сервере atoros.ru, на Яндекс.Диске и на Google Drive. Все три даты независимы. Яндекс и Google записывают дату загрузки в свои внутренние логи — изменить эти даты невозможно. Если все три источника показывают одну дату — это и есть дата депонирования.
            </p>
          </div>

          <div className="p-5 rounded-lg border border-border bg-card">
            <div className="flex items-start gap-3 mb-2">
              <Eye className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <h2 className="text-base font-semibold text-foreground">Может ли кто-то изменить мой файл?</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed pl-8">
              Нет. Во-первых, архив зашифрован паролем, который знаете только вы. Во-вторых, в свидетельстве указаны хеш-суммы MD5 и SHA-256 — цифровые отпечатки файла. Измените хотя бы один байт — отпечаток полностью меняется. Любой может скачать архив, вычислить хеш и сверить с указанным в свидетельстве. Не совпало — файл подделан.
            </p>
          </div>

          <div className="p-5 rounded-lg border border-border bg-card">
            <div className="flex items-start gap-3 mb-2">
              <FileText className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <h2 className="text-base font-semibold text-foreground">Что такое свидетельство?</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed pl-8">
              Это страница на atoros.ru с уникальным номером (например, 2026-003). На ней указаны: название произведения, имя автора, дата депонирования, хеш-суммы, ссылки на облачные копии, подписи патентных поверенных. Свидетельство доступно по прямой ссылке, его можно распечатать в PDF. Все свидетельства собраны в реестре — каждый может проверить.
            </p>
          </div>

          <div className="p-5 rounded-lg border border-border bg-card">
            <div className="flex items-start gap-3 mb-2">
              <ShieldCheck className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <h2 className="text-base font-semibold text-foreground">Это замена регистрации авторского права?</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed pl-8">
              В России нет государственной регистрации авторского права — оно возникает автоматически при создании произведения. Депонирование — это не регистрация, а фиксация факта: «в такую-то дату у меня был такой-то файл». Этого достаточно, чтобы доказать приоритет в споре. Если нужен юрист для суда — обратитесь к патентному поверенному. Мы можем порекомендовать.
            </p>
          </div>

          <div className="p-5 rounded-lg border border-border bg-card">
            <div className="flex items-start gap-3 mb-2">
              <HelpCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <h2 className="text-base font-semibold text-foreground">Сколько это стоит?</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed pl-8">
              Сейчас сервис работает в тестовом режиме — депонирование бесплатное. Ограничения тестового режима: до 5 файлов, каждый до 10 МБ, общий размер до 30 МБ. Когда перейдём в полноценный режим — тарифы будут опубликованы на этой странице.
            </p>
          </div>

          <div className="p-5 rounded-lg border border-border bg-card">
            <div className="flex items-start gap-3 mb-2">
              <HelpCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <h2 className="text-base font-semibold text-foreground">Что если Яндекс или Google удалят файл?</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed pl-8">
              Файл хранится в трёх местах: сервер atoros.ru, Яндекс.Диск, Google Drive. Даже если одно хранилище исчезнет — два других продолжат работать. Плюс у вас на руках есть пароль от архива и страница свидетельства с хеш-суммами. Сам факт депонирования (номер, дата, хеш) зафиксирован в реестре atoros.ru и не зависит от внешних дисков.
            </p>
          </div>

          <div className="p-5 rounded-lg border border-border bg-card">
            <div className="flex items-start gap-3 mb-2">
              <HelpCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <h2 className="text-base font-semibold text-foreground">Можно ли депонировать обновлённую версию?</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed pl-8">
              Да. Каждая версия депонируется отдельно — со своим номером, датой и хеш-суммой. Это даже полезно: можно показать, как произведение развивалось во времени. Например, первая версия логотипа — свидетельство № 2026-001, финальная версия — № 2026-014. Обе версии с разными датами и разными хешами.
            </p>
          </div>

        </div>

        <div className="mt-12 p-6 rounded-lg border border-primary/20 bg-primary/5">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Остались вопросы? Напишите на <a href="mailto:info@atoros.ru" className="text-primary hover:underline">info@atoros.ru</a> — ответим в течение рабочего дня. Не ботами, живыми людьми.
          </p>
        </div>

      </main>
    <SiteFooter />
    </div>
  );
}

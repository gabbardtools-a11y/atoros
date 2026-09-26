import { Header } from '@/components/site-header';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { SiteFooter } from '@/components/site-footer';
import { AlertTriangle, ArrowRight, FileText } from 'lucide-react';

export const metadata = {
  title: 'Почему блокчейн не подходит для защиты авторских прав — анонс — Atoros',
  description: 'Краткий анонс большой статьи о фундаментальных недостатках блокчейн-депонирования. Полный разбор — по ссылке.',
};

export default async function Page() {
  const session = await getServerSession(authOptions);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header session={session} />
      <main className="flex-1 max-w-[760px] w-full mx-auto px-6 py-16">

        <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary mb-3">
          <AlertTriangle className="h-3.5 w-3.5" />
          Анонс · Блог
        </div>

        <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-4 leading-tight">
          Почему блокчейн не подходит для защиты авторских прав
        </h1>

        <p className="text-sm text-muted-foreground mb-8">
          Краткий анонс большой статьи. Полный разбор (10 разделов, ~3500 слов) —{' '}
          <a href="/blockchain-critique" className="text-primary underline hover:text-primary/80 transition">здесь</a>.
        </p>

        <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed space-y-4">

          <p>
            За последние годы на рынке появилось несколько проектов, обещающих «защиту авторских прав через блокчейн». Идея звучит убедительно: распределённый реестр нельзя подделать, история транзакций хранится навсегда, никакая корпорация не контролирует данные. Кажется, что это именно то, что нужно автору, желающему зафиксировать приоритет.
          </p>

          <p>
            При более внимательном разборе техническая реализация и юридическое наполнение таких проектов оставляют много вопросов. Часть из них касается фундаментальных свойств технологии блокчейн — их нельзя исправить «следующей версией», потому что они являются причиной, по которой блокчейн вообще работает. Другая часть — про то, как эти проекты соотносятся с реальным правоприменением.
          </p>

          <p>
            Мы опубликовали развёрнутый материал, в котором разбираем десять ключевых тем. Среди них:
          </p>

          <ul className="space-y-1.5 pl-4 border-l-2 border-border">
            <li>почему авторское право в России не требует регистрации и что говорит пункт 4 статьи 1259 ГК РФ;</li>
            <li>почему суд принимает нотариально заверенный скриншот Facebook без вопросов, а свидетельство из «никому неизвестного блокчейна» — только после комплексной технической экспертизы;</li>
            <li>почему «нерушимость блокчейна» — миф: атака 51%, хардфорки, уязвимости криптографии, ошибки реализации;</li>
            <li>почему хеш-привязка легко обходится изменением одного бита и почему грамотное депонирование всегда использует несколько хеш-функций;</li>
            <li>почой неудаляемость блокчейна — это не преимущество, а фундаментальный недостаток: пират может загрузить чужое произведение, а удалить его уже нельзя;</li>
            <li>кто реально платит за децентрализацию и почему «бесплатного депонирования в блокчейне» не бывает по определению;</li>
            <li>почему анонимность — питательная среда для пиратства и что общего с историей The Pirate Bay.</li>
          </ul>

          <p>
            И главное — мы предлагаем альтернативу. Вместо блокчейна Atoros использует комбинацию из четырёх независимых механизмов фиксации: квалифицированную метку времени ФНС (RFC 3161, ГОСТ Р 34.11-2012), Яндекс.Диск, Google Drive и собственный сервер. Каждый из этих источников по отдельности сильнее типичной блокчейн-записи, а вместе они образуют систему, которую сложно поставить под сомнение в судебном процессе.
          </p>

          <p>
            Это не реклама нашего сервиса. Это технический и юридический разбор — почему конкретная технология не подходит для конкретной задачи, и что предлагается взамен. Если вы интересовались темой блокчейн-депонирования, материал будет полезен независимо от того, какой сервис вы в итоге выберете.
          </p>

        </div>

        <div className="mt-10 p-6 rounded-lg border-2 border-primary/30 bg-primary/5">
          <div className="flex items-center gap-3 mb-3">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-base font-semibold text-foreground">Читать полный разбор</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            Полная статья: 10 разделов, ~3500 слов, ссылки на ГК РФ, ФЗ-63, Бернскую конвенцию, RFC 3161, ГОСТ Р 34.11-2012. Сравнительная таблица Atoros vs блокчейн-проекты по 10 параметрам.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="/blockchain-critique"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition"
            >
              Открыть статью
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="/blockchain-critique.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition"
            >
              <FileText className="h-4 w-4" />
              Скачать PDF (10 стр.)
            </a>
          </div>
        </div>

        <div className="mt-8 text-xs text-muted-foreground">
          Материал подготовлен редакцией Atoros.ru. Обновлён {new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}.
        </div>

      </main>
      <SiteFooter />
    </div>
  );
}

import { Header } from '@/components/site-header';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { SiteFooter } from '@/components/site-footer';
import { ShieldCheck, Clock, FileSignature, Scale } from 'lucide-react';

export const metadata = {
  title: 'Юридическая сила депонирования — Atoros',
  description: 'Имеет ли свидетельство о депонировании юридическую силу? Как суды относятся к депозитам. ГК РФ, доказательства, метка доверенного времени ФНС.',
  openGraph: {
    title: 'Юридическая сила депонирования',
    description: 'Квалифицированная метка времени ФНС по ГОСТ Р 34.11-2012. Статьи ГК РФ, ФЗ-63, судебная практика.',
    type: 'article',
    locale: 'ru_RU',
    url: 'https://atoros.ru/legal-force',
    images: [{
      url: 'https://atoros.ru/og-legal-force.png',
      width: 1344,
      height: 768,
      alt: 'Юридическая сила депонирования — Atoros',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Юридическая сила депонирования',
    description: 'Квалифицированная метка времени ФНС по ГОСТ Р 34.11-2012.',
    images: ['https://atoros.ru/og-legal-force.png'],
  },
};

export default async function Page() {
  const session = await getServerSession(authOptions);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header session={session} />
      <main className="flex-1 max-w-[800px] w-full mx-auto px-6 py-16">
        <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary mb-3">
          <Scale className="h-3.5 w-3.5" />
          Юридическая сила
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">Юридическая сила депонирования</h1>
        <p className="text-base text-muted-foreground leading-relaxed mb-8">
          Имеет ли свидетельство о депонировании юридическую силу? Как суды относятся к депозитам. ГК РФ, доказательства, метка доверенного времени ФНС.
        </p>

        {/* Четыре источника фиксации */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="h-5 w-5 text-primary flex-shrink-0" />
            <h2 className="text-xl font-semibold text-foreground">Четыре независимых источника фиксации даты</h2>
          </div>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4">
            В России авторское право возникает в момент создания произведения — регистрация не требуется (ст. 1255 ГК РФ). Но при споре нужно доказать, что произведение было у вас раньше, чем у нарушителя. Депонирование решает эту задачу: фиксирует дату, подтверждённую четырьмя независимыми источниками, и неизменный файл с хеш-суммами MD5, SHA-256 и ГОСТ Р 34.11-2012.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 rounded-lg border border-border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-red-600" />
                <span className="text-sm font-semibold text-foreground">ФНС — метка доверенного времени</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Квалифицированная метка времени по ГОСТ Р 34.11-2012, подписанная ФНС. Юридически значимое подтверждение момента депонирования по ФЗ-63.
              </p>
            </div>
            <div className="p-5 rounded-lg border border-border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <FileSignature className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">Atoros.ru — серверная фиксация</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Сервер фиксирует дату, вычисляет хеш-суммы, публикует свидетельство с уникальным номером в открытом реестре.
              </p>
            </div>
            <div className="p-5 rounded-lg border border-border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-semibold text-foreground">Яндекс.Диск</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Яндекс записывает дату загрузки во внутренние логи. Изменить её невозможно. Публичная ссылка публикуется в свидетельстве.
              </p>
            </div>
            <div className="p-5 rounded-lg border border-border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-green-600" />
                <span className="text-sm font-semibold text-foreground">Google Drive</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Google делает то же самое — независимо от Яндекса. Два разных дата-центра, два разных лога.
              </p>
            </div>
          </div>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed mt-4">
            Четыре даты. Четыре независимых источника. Если хотя бы один подтверждает — дата считается установленной. Все четыре вместе — это железобетон.
          </p>
        </div>

        {/* Квалифицированная метка времени ФНС */}
        <div className="mb-12 p-6 rounded-lg border-2 border-primary/30 bg-primary/5">
          <div className="flex items-center gap-3 mb-3">
            <ShieldCheck className="h-6 w-6 text-primary flex-shrink-0" />
            <h2 className="text-xl font-semibold text-foreground">Квалифицированная метка доверенного времени ФНС</h2>
          </div>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4">
            Atoros.ru использует государственную службу меток доверенного времени ФНС (RFC 3161, TSP-сервер uc.nalog.ru) для квалифицированной фиксации момента депонирования (метка хеша по ГОСТ Р 34.11-2012). Подпись ФНС придаёт метке юридическую значимость в соответствии с ФЗ-63 «Об электронной подписи».
          </p>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4">
            Это означает: в момент депонирования наш сервер отправляет хеш вашего архива на TSP-сервер ФНС. ФНС возвращает квалифицированный токен (Time Stamp Token), подписанный сертификатом удостоверяющего центра ФНС. Токен содержит точное время фиксации и не может быть подделан — для этого потребуется скомпрометировать инфраструктуру ФНС.
          </p>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Метка ФНС — это не техническая дата в логах, которую владелец сервера теоретически может изменить. Это подписанный государственным органом юридически значимый факт, который суды обязаны принимать как доказательство.
          </p>
        </div>

        {/* Доказательства в суде */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Scale className="h-5 w-5 text-primary flex-shrink-0" />
            <h2 className="text-xl font-semibold text-foreground">Доказательства в суде</h2>
          </div>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-3">
            Свидетельство о депонировании принимается судами как письменное доказательство (ст. 71 ГПК РФ, ст. 75 АПК РФ). Электронный документ приравнивается к письменному. Ссылки на облачные хранилища — дополнительные доказательства, которые суд может проверить самостоятельно.
          </p>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-3">
            Квалифицированная метка времени ФНС — это отдельное доказательство момента подписания электронного документа. Согласно ст. 5 ФЗ-63, информация в электронной форме, подписанная квалифицированной электронной подписью, признаётся электронным документом, равнозначным документу на бумажном носителе, подписанному собственноручно. Метка ФНС подпадает под этот режим.
          </p>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Любой участник судебного процесса может проверить подлинность метки ФНС: токен можно загрузить в КриптоАРМ ГОСТ, ViPNet CryptoFile или на портал Госуслуг для верификации подписи ФНС. Это исключает ситуацию «свидетельство сфабриковано» — государство подтверждает время.
          </p>
        </div>

        <div className="p-5 rounded-lg border border-primary/20 bg-primary/5 mb-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Важно:</strong> депонирование — это не регистрация права собственности и не патент. Это фиксация факта: «в такую-то дату у меня был такой-то файл». Этого достаточно для доказательства приоритета. Если спор серьёзный — обратитесь к патентному поверенному. Свидетельство — инструмент, а не замена юристу.
          </p>
        </div>

        <a href="/auth/register" className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition">Задепонировать</a>
      </main>
    <SiteFooter />
    </div>
  );
}

import { Header } from '@/components/site-header';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Cloud, Lock, Hash, FileArchive, Eye, Zap, Database, ShieldCheck, Network, Clock } from 'lucide-react';
import { SiteFooter } from '@/components/site-footer';

export const metadata = {
  title: 'Сервисы — Atoros',
  description: 'Как работает Atoros: четверная фиксация даты: ФНС (ГОСТ Р 34.11-2012), Яндекс.Диск, Google Drive и atoros.ru. Архивы с AES-256, хеш-суммы MD5, SHA-256 и ГОСТ.',
  openGraph: {
    title: 'Как работает Atoros с вашим файлом',
    description: 'Четыре независимых источника фиксации даты. AES-256, три хеш-суммы, квалифицированная метка ФНС.',
    type: 'article',
    locale: 'ru_RU',
    url: 'https://atoros.ru/services',
    images: [{
      url: 'https://atoros.ru/og-services.png',
      width: 1344,
      height: 768,
      alt: 'Как работает Atoros — Atoros',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Как работает Atoros с вашим файлом',
    description: 'Четыре независимых источника фиксации даты. Метка ФНС, AES-256, три хеш-суммы.',
    images: ['https://atoros.ru/og-services.png'],
  },
};

export default async function ServicesPage() {
  const session = await getServerSession(authOptions);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header session={session} />
      <main className="flex-1 max-w-[900px] w-full mx-auto px-6 py-16">

        <div className="mb-12">
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary mb-3">
            <Zap className="h-3.5 w-3.5" />
            Как это работает
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Что именно делает Atoros с вашим файлом
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            Никакой магии. Просто несколько простых шагов, каждый из которых можно проверить самостоятельно.
          </p>
        </div>

        {/* Quadruple date fixation + FNS */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Database className="h-5 w-5 text-primary flex-shrink-0" />
            <h2 className="text-xl font-semibold text-foreground">Пять независимых источников фиксации</h2>
          </div>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4">
            Главная фишка Atoros. Когда вы загружаете файлы, система не просто сохраняет их на одном сервере. Она одновременно фиксирует дату в пяти независимых местах:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 rounded-lg border-2 border-primary/30 bg-primary/5">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">ФНС — метка доверенного времени</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Квалифицированная метка времени по ГОСТ Р 34.11-2012, подписанная ФНС России. В силу ФЗ-63 принимается судами без технической экспертизы. Это не «наш сервер» — это подпись государства.
              </p>
            </div>
            <div className="p-5 rounded-lg border border-border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Cloud className="h-4 w-4 text-red-500" />
                <span className="text-sm font-semibold text-foreground">Яндекс.Диск</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Яндекс записывает дату и время загрузки в свои внутренние логи. Изменить эту дату невозможно. Публичная ссылка на файл публикуется в свидетельстве.
              </p>
            </div>
            <div className="p-5 rounded-lg border border-border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Cloud className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-semibold text-foreground">Google Drive</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Google делает то же самое — независимо от Яндекса. Два разных дата-центра, два разных лога, одна и та же дата. Подделать оба одновременно нереально.
              </p>
            </div>
            <div className="p-5 rounded-lg border border-border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Network className="h-4 w-4 text-green-500" />
                <span className="text-sm font-semibold text-foreground">Торрент-сеть (BitTorrent)</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Архив автоматически добавляется в торрент-сеть. Файл хранится децентрализованно — даже если Atoros исчезнет, он останется у пиров. Magnet-ссылка публикуется в свидетельстве.
              </p>
            </div>
            <div className="p-5 rounded-lg border border-border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Database className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">Atoros.ru</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Наш сервер фиксирует дату и время депонирования. Вычисляет хеш-суммы. Создаёт свидетельство с уникальным номером. Публикует его в реестре.
              </p>
            </div>
          </div>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed mt-4">
            Пять источников. Пять независимых подтверждений даты. Подделать все пять одновременно — практически невозможно. Если хотя бы один подтверждает — дата считается установленной.
          </p>
        </div>

        {/* AES-256 */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="h-5 w-5 text-primary flex-shrink-0" />
            <h2 className="text-xl font-semibold text-foreground">Защита архива</h2>
          </div>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-3">
            Все файлы упаковываются в архив 7z с шифрованием AES-256. Это не просто «запароленный zip» — это военный стандарт шифрования. Без пароля открыть архив невозможно, даже если скачать его.
          </p>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-3">
            Пароль генерируется автоматически — 16 случайных символов. Вы видите его в личном кабинете, больше никто. На облачные диски загружается уже зашифрованный архив — даже если кто-то получит доступ к диску, без пароля файл бесполезен.
          </p>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Заголовки архива тоже зашифрованы — нельзя даже увидеть имена файлов внутри, не зная пароля.
          </p>
        </div>

        {/* Hash sums */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Hash className="h-5 w-5 text-primary flex-shrink-0" />
            <h2 className="text-xl font-semibold text-foreground">Хеш-суммы</h2>
          </div>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-3">
            Хеш-сумма — это цифровой отпечаток файла. Измените хотя бы один байт — отпечаток полностью поменяется. Atoros вычисляет две хеш-суммы для каждого архива:
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div className="p-4 rounded-lg border border-border bg-card">
              <div className="text-sm font-mono font-semibold text-primary mb-1">MD5</div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                32 символа. Быстрый, распространённый. Подходит для базовой проверки целостности.
              </p>
            </div>
            <div className="p-4 rounded-lg border border-border bg-card">
              <div className="text-sm font-mono font-semibold text-primary mb-1">SHA-256</div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                64 символа. Криптостойкий. Используется в блокчейне и банковской сфере.
              </p>
            </div>
          </div>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Обе хеш-суммы публикуются в свидетельстве. Любой может скачать архив, вычислить хеш самостоятельно и сверить с указанным. Совпало — файл не менялся с даты депонирования.
          </p>
        </div>

        {/* File immutability */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <FileArchive className="h-5 w-5 text-primary flex-shrink-0" />
            <h2 className="text-xl font-semibold text-foreground">Почему файл нельзя изменить</h2>
          </div>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-3">
            Это ключевое. Когда вы депонируете файл, система:
          </p>
          <ol className="space-y-2 mb-4">
            {[
              'Создаёт 7z архив с паролем — содержимое зафиксировано',
              'Вычисляет MD5 и SHA-256 от архива — отпечаток записан в свидетельстве',
              'Загружает архив на Яндекс.Диск — Яндекс фиксирует дату',
              'Загружает архив на Google Drive — Google фиксирует дату',
              'Публикует свидетельство в реестре — номер и дата видны всем',
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed">
                <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Теперь представьте: кто-то хочет подделать файл. Ему нужно изменить содержимое архива — но тогда хеш-сумма не совпадёт с указанной в свидетельстве. Заменить файл на Яндекс.Диске — но Яндекс не даёт менять дату загрузки. Заменить на Google Drive — то же самое. Подделать свидетельство — но оно опубликовано в открытом реестре с уникальным номером. Все пути закрыты.
          </p>
        </div>

        {/* Verification */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Eye className="h-5 w-5 text-primary flex-shrink-0" />
            <h2 className="text-xl font-semibold text-foreground">Как проверить свидетельство</h2>
          </div>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-3">
            Любой человек может проверить подлинность свидетельства — без регистрации и паролей:
          </p>
          <ul className="space-y-2">
            {[
              'Открыть страницу свидетельства по ссылке или через реестр',
              'Сравнить хеш-сумму в свидетельстве с хеш-суммой скачанного архива',
              'Проверить дату загрузки на Яндекс.Диске по публичной ссылке',
              'Проверить дату загрузки на Google Drive по публичной ссылке',
              'Сверить номер свидетельства в реестре atoros.ru',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed">
                <ShieldCheck className="h-4 w-4 text-green-600 flex-shrink-0 mt-1" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Torrent — killer feature */}
        <div className="mb-12 p-6 rounded-lg border-2 border-primary/30 bg-primary/5">
          <div className="flex items-center gap-3 mb-3">
            <Network className="h-6 w-6 text-primary flex-shrink-0" />
            <h2 className="text-xl font-semibold text-foreground">Торрент-сеть — децентрализованное хранение</h2>
          </div>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-3">
            <strong className="text-foreground">Killer-feature Atoros.</strong> При каждом депонировании архив автоматически добавляется в торрент-сеть через transmission-daemon, работающий на нашем сервере. Это значит:
          </p>
          <ul className="space-y-2 mb-4 text-sm md:text-base text-muted-foreground leading-relaxed">
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>Файл хранится децентрализованно — даже если Atoros исчезнет, он останется у пиров, которые его скачали</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>В свидетельстве публикуется magnet-ссылка и .torrent файл — любой может открыть в qBittorrent и проверить</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>Используется 6 публичных трекеров + DHT + PEX — торрент доступен даже без центрального сервера</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>Архив зашифрован AES-256 — пиры видят файл, но не могут прочитать содержимое без пароля</span>
            </li>
          </ul>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Ни один конкурент в России не предлагает децентрализованное хранение. Это уникальная возможность Atoros — файл survives даже при исчезновении сервиса.
          </p>
        </div>

        <div className="p-6 rounded-lg border border-primary/20 bg-primary/5">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Итог:</strong> Atoros — это не просто «загрузил файл, получил бумажку». Это система из пяти независимых проверок: метка времени ФНС, дата на atoros.ru, дата на Яндексе, дата на Google, торрент-сеть. Каждая проверка работает отдельно. Все вместе — это стена, которую невозможно подделать.
          </p>
        </div>

      </main>
    <SiteFooter />
    </div>
  );
}

import { Header } from '@/components/site-header';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { SiteFooter } from '@/components/site-footer';
import { Network, ArrowRight, FileText, ShieldCheck, Eye, Cloud } from 'lucide-react';

export const metadata = {
  title: 'Торрент-сеть для депонирования — killer-feature Atoros — Блог',
  description: 'Atoros — единственный сервис депонирования в России, который хранит архивы в торрент-сети. Децентрализованное хранение через BitTorrent: файл survives даже при исчезновении сервиса.',
  openGraph: {
    title: 'Торрент-сеть для депонирования — killer-feature Atoros',
    description: 'Atoros — единственный сервис депонирования в России с децентрализованным хранением через BitTorrent.',
    type: 'article',
    locale: 'ru_RU',
    url: 'https://atoros.ru/blog/torrent-killer-feature',
    images: [{
      url: 'https://atoros.ru/og-blockchain-critique.png',
      width: 1344,
      height: 768,
      alt: 'Торрент-сеть для депонирования — Atoros',
    }],
  },
};

export default async function Page() {
  const session = await getServerSession(authOptions);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header session={session} />
      <main className="flex-1 max-w-[760px] w-full mx-auto px-6 py-16">

        <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary mb-3">
          <Network className="h-3.5 w-3.5" />
          Killer-feature · Блог
        </div>

        <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-4 leading-tight">
          Торрент-сеть для депонирования: почему это меняет всё
        </h1>

        <p className="text-sm text-muted-foreground mb-8">
          Atoros — единственный сервис депонирования в России, который хранит архивы в торрент-сети. Децентрализованное хранение через BitTorrent: файл survives даже при исчезновении сервиса.
        </p>

        <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed space-y-4">

          <p>
            Когда мы проектировали Atoros, перед нами стоял простой вопрос: что произойдёт с файлами пользователей, если сервис однажды исчезнет? Большинство конкурентов — Edrid, iReg, n'RIS, profrr — хранят файлы на собственных серверах. Сервер закрылся — файлы потеряны. Свидетельство остаётся, но само произведение — нет.
          </p>

          <p>
            Это фундаментальная слабость централизованной модели депонирования. Можно сколько угодно уверять, что «мы надёжны», но история знает много примеров, когда сервисы закрывались — и данные пользователей уходили вместе с ними. Мы решили эту проблему радикально: добавили торрент-сеть как пятое независимое хранилище.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">Что происходит при депонировании</h2>

          <p>
            Когда вы загружаете файл в Atoros, система делает не один шаг, а пять параллельных:
          </p>

          <ul className="space-y-2 pl-4 border-l-2 border-border">
            <li>упаковывает файлы в архив 7z с шифрованием AES-256</li>
            <li>вычисляет три хеш-суммы: MD5, SHA-256 и ГОСТ Р 34.11-2012</li>
            <li>запрашивает квалифицированную метку времени ФНС по стандарту RFC 3161</li>
            <li>загружает зашифрованный архив на Яндекс.Диск и Google Drive</li>
            <li><strong className="text-foreground">создаёт торрент-файл и добавляет его в раздачу через transmission-daemon</strong></li>
          </ul>

          <p>
            Последний шаг — и есть наша killer-feature. На сервере Atoros работает transmission-daemon 4.1.1, который постоянно раздаёт все депонированные архивы. В свидетельстве публикуется magnet-ссылка и .torrent файл — любой может открыть их в qBittorrent, Transmission или любом другом клиенте и скачать зашифрованный архив.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">Почему торрент — это сильнее блокчейна</h2>

          <p>
            Мы уже подробно разбирали в отдельной статье, почему блокчейн плохо подходит для защиты авторских прав. Если коротко: блокчейн хранит только хеш файла, а не сам файл. Если блокчейн-проект закроется — у вас останется запись о хеше, но не само произведение.
          </p>

          <p>
            Торрент работает иначе. Он хранит <strong className="text-foreground">сам файл</strong>, распределённо, на множестве узлов. Это качественно другой уровень: не «доказательство, что файл существовал», а «файл существует и доступен для скачивания».
          </p>

          <p>
            Сравните:
          </p>

          <ul className="space-y-2 pl-4 border-l-2 border-border">
            <li><strong>Блокчейн:</strong> «В такой-то момент был такой-то хеш». Файл потерян при закрытии проекта.</li>
            <li><strong>Торрент:</strong> «Файл с таким-то хешем существует, раздаётся пирами, доступен для скачивания». Файл остаётся, даже если проект закрылся.</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground pt-4">Как это работает технически</h2>

          <p>
            При депонировании наш сервер:
          </p>

          <ol className="space-y-2 pl-4 border-l-2 border-border list-decimal">
            <li>Создаёт .torrent файл с помощью <code className="text-xs bg-muted px-1 py-0.5 rounded">transmission-create</code> — 6 публичных трекеров, DHT, PEX</li>
            <li>Добавляет торрент в раздачу через <code className="text-xs bg-muted px-1 py-0.5 rounded">transmission-remote --add</code></li>
            <li>Получает btih (info hash) — 40-символьный SHA-1 хеш</li>
            <li>Формирует magnet-ссылку с btih + 6 трекерами</li>
            <li>Сохраняет magnet и btih в базу данных свидетельства</li>
            <li>Публикует magnet-ссылку и кнопку «Скачать .torrent» на странице свидетельства</li>
          </ol>

          <p>
            Сервер Atoros выступает постоянным сидом — он онлайн 24/7 и раздаёт все торренты. Когда посетитель открывает страницу свидетельства, он видит magnet-ссылку. Если он её открывает в qBittorrent — его клиент подключается к нашему серверу и скачивает зашифрованный архив.
          </p>

          <p>
            Если несколько человек скачали архив — они тоже становятся сидами. Файл теперь хранится не только на сервере Atoros, но и у каждого из них. Даже если наш сервер исчезнет, торрент продолжит жить в сети.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">Что видит пользователь в свидетельстве</h2>

          <p>
            На странице свидетельства, рядом с блоком ФНС и облачными ссылками, появился новый блок — <strong className="text-foreground">«Торрент — децентрализованное хранение»</strong> с зелёным акцентом. В нём:
          </p>

          <ul className="space-y-2 pl-4 border-l-2 border-border">
            <li><strong>Info Hash (btih)</strong> — 40-символьный идентификатор торрента</li>
            <li><strong>Дата создания торрента</strong> — когда торрент был добавлен в раздачу</li>
            <li><strong>Кнопка «Magnet-ссылка»</strong> — открывает торрент в установленном клиенте</li>
            <li><strong>Кнопка «Скачать .torrent»</strong> — скачивает .torrent файл через <code className="text-xs bg-muted px-1 py-0.5 rounded">/api/torrent?slug=...</code></li>
          </ul>

          <p>
            Любой участник судебного процесса может проверить существование файла: открыть magnet в qBittorrent, увидеть, что торрент активен и раздаётся, скачать архив, вычислить хеш и сверить с указанным в свидетельстве. Это прозрачность, которой нет ни у одного конкурента.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">Безопасность: пиры видят файл, но не читают его</h2>

          <p>
            Важный момент: архив зашифрован AES-256. Пиры, которые скачивают торрент, получают зашифрованный файл — они видят байты, но не могут прочитать содержимое без пароля. Пароль знает только автор свидетельства (виден в личном кабинете).
          </p>

          <p>
            Это значит, что:
          </p>

          <ul className="space-y-2 pl-4 border-l-2 border-border">
            <li>✅ Пиры помогают раздавать файл — децентрализация работает</li>
            <li>✅ Авторские права защищены — содержимое недоступно без пароля</li>
            <li>✅ Любой может проверить существование файла через btih</li>
            <li>✅ Само произведение остаётся конфиденциальным</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground pt-4">Чем это лучше облачных хранилищ</h2>

          <p>
            У нас есть Яндекс.Диск и Google Drive как облачные копии. Зачем ещё торрент? Разница в модели владения:
          </p>

          <ul className="space-y-2 pl-4 border-l-2 border-border">
            <li><strong>Яндекс.Диск / Google Drive:</strong> файл хранится на серверах корпорации. Корпорация может закрыть аккаунт, изменить условия, потерять данные. Вы зависите от одной организации.</li>
            <li><strong>Торрент:</strong> файл хранится у множества независимых пиров. Никто не может «закрыть» торрент-сеть. Чтобы файл исчез, должны уйти все пиры одновременно.</li>
          </ul>

          <p>
            Это не заменяет облака, а дополняет их. Atoros хранит файл одновременно в пяти местах: сервер, Яндекс, Google, торрент-сеть и (косвенно) в виде метки ФНС. Если одно хранилище выйдет из строя — четыре других продолжат работать.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">Почему никто из конкурентов так не делает</h2>

          <p>
            Причина простая — это технически сложнее, чем просто положить файл на сервер. Нужно:
          </p>

          <ol className="space-y-2 pl-4 border-l-2 border-border list-decimal">
            <li>Установить и поддерживать transmission-daemon на сервере</li>
            <li>Открыть порт 51413 для входящих BitTorrent-соединений</li>
            <li>Создавать .torrent файлы программно для каждого депонирования</li>
            <li>Управлять раздачей (старт, остановка, удаление по решению суда)</li>
            <li>Следить за ресурсами сервера (RAM, диск, сеть)</li>
            <li>Публиковать magnet-ссылки в свидетельствах</li>
          </ol>

          <p>
            Большинство конкурентов предпочитают простую модель: один сервер, одна база, один лог. Это дешевле в разработке, но слабее в плане надёжности. Мы выбрали более сложный путь — потому что цель не «сделать дёшево», а «сделать надёжно».
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">Ресурсы: сколько это стоит серверу</h2>

          <p>
            Transmission-daemon на нашем VPS потребляет <strong className="text-foreground">4.6 MB RAM</strong> в простое и около 50-100 MB при активной раздаче 500 торрентов. Это ничтожные ресурсы по сравнению с Next.js процессами (которые берут 60-200 MB каждый). Диск — 500 торрентов по 10 МБ = 5 GB, плюс метаданные. Вполне укладывается в существующие мощности.
          </p>

          <p>
            Сеть — самый интересный момент. В простое transmission отдаёт ~10 KB/сек (heartbeats к трекерам). При активной раздаче — зависит от количества пиров. Поскольку архивы маленькие (10-100 МБ), даже 10 одновременных скачиваний не нагрузят канал.
          </p>

          <h2 className="text-xl font-semibold text-foreground pt-4">Что дальше</h2>

          <p>
            Текущая реализация — это MVP. В планах:
          </p>

          <ul className="space-y-2 pl-4 border-l-2 border-border">
            <li><strong>WebTorrent на странице свидетельства</strong> — посетитель станет временным sidом просто открыв страницу (lazy load по кнопке «Помочь раздаче»)</li>
            <li><strong>Собственный tracker.atoros.ru</strong> — для надёжности, помимо публичных трекеров</li>
            <li><strong>Статистика раздачи</strong> — количество сидов, пиров, отданный объём — прямо в свидетельстве</li>
            <li><strong>RSS-фид новых свидетельств</strong> — как торрентов, для автоматического мониторинга</li>
          </ul>

          <p>
            Но уже сейчас Atoros — единственный сервис в России, где ваш файл хранится одновременно в пяти независимых местах, включая децентрализованную торрент-сеть. Это и есть killer-feature.
          </p>

        </div>

        {/* CTA */}
        <div className="mt-10 p-6 rounded-lg border-2 border-primary/30 bg-primary/5">
          <div className="flex items-center gap-3 mb-3">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <h2 className="text-base font-semibold text-foreground">Попробуйте депонирование с торрентом</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            Загрузите файл — получите свидетельство с меткой ФНС, пятью независимыми хранилищами (включая торрент-сеть), тремя хеш-суммами и публичной страницей верификации. Бесплатно, мгновенно.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="/auth/register"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition"
            >
              Задепонировать бесплатно
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="/services"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition"
            >
              <FileText className="h-4 w-4" />
              Как это работает
            </a>
          </div>
        </div>

        {/* Related */}
        <div className="mt-8 pt-8 border-t border-border">
          <div className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-4">Читайте также</div>
          <div className="grid md:grid-cols-2 gap-4">
            <a href="/blockchain-critique" className="block p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition">
              <div className="text-sm font-semibold text-foreground mb-1">Почему блокчейн не подходит для защиты авторских прав</div>
              <div className="text-xs text-muted-foreground">Критический разбор: 10 разделов, статьи ГК РФ, ФЗ-63, сравнение с меткой ФНС.</div>
            </a>
            <a href="/legal-force" className="block p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition">
              <div className="text-sm font-semibold text-foreground mb-1">Юридическая сила депонирования</div>
              <div className="text-xs text-muted-foreground">Квалифицированная метка времени ФНС, статьи ГК РФ, ФЗ-63, судебная практика.</div>
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

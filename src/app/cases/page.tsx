import { Header } from '@/components/site-header';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Briefcase, TrendingUp, Users, Code, Palette, Music, FileText } from 'lucide-react';
import { SiteFooter } from '@/components/site-footer';

export const metadata = {
  title: 'Кейсы — Atoros',
  description: 'Реальные ситуации, когда депонирование помогло защитить авторские права. Истории фрилансеров, разработчиков, дизайнеров и музыкантов.',
};

export default async function CasesPage() {
  const session = await getServerSession(authOptions);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header session={session} />
      <main className="flex-1 max-w-[900px] w-full mx-auto px-6 py-16">

        <div className="mb-12">
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary mb-3">
            <Briefcase className="h-3.5 w-3.5" />
            Практика
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Когда депонирование реально выручило
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            Не теория, а конкретные ситуации. Имена изменены, но суть — из реальной практики. Если узнали себя — значит, вы не одни.
          </p>
        </div>

        {/* Case 1 */}
        <div className="mb-10 p-6 rounded-lg border border-border bg-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Palette className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Дизайнер и клиент-неплательщик</h2>
              <span className="text-xs text-muted-foreground">Дизайн · Фриланс</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            Анна делала логотип для кофейни. Договор — на словах. Сдала работу, клиент сказал «не нравится», не заплатил. Через месяц Анна увидела свой логотип на вывеске и в соцсетях кофейни.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            Хорошо, что Анна задепонировала архив с исходниками логотипа за два дня до сдачи. В архиве — PSD-файлы со слоями, эскизы, варианты. Дата загрузки на Яндекс.Диск и Google Drive подтверждена независимо. Клиент получил претензию с номером свидетельства и ссылками на облачные копии. Заплатил на следующий день.
          </p>
          <p className="text-sm text-primary font-medium">
            Чем помогло: дата создания подтверждена тремя источниками, файл нельзя подделать.
          </p>
        </div>

        {/* Case 2 */}
        <div className="mb-10 p-6 rounded-lg border border-border bg-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Code className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Разработчик и бывший партнер</h2>
              <span className="text-xs text-muted-foreground">Программный код · Стартап</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            Два разработчика вместе писали backend для маркетплейса. Поругались, разошлись. Один запустил свой сервис на том же коде, сказал «это я написал».
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            Второй — ещё до ссоры — задепонировал каждую версию репозитория. Свидетельство № 2025-014 содержало архив с git-историей, датами коммитов и полным исходным кодом. Хеш-сумма MD5 совпала с тем, что хранилось на Яндекс.Диске и Google Drive с даты депонирования. Оппонент не смог объяснить, как у него оказался код, идентичный тому, что был задепонирован за полгода до его запуска.
          </p>
          <p className="text-sm text-primary font-medium">
            Чем помогло: зафиксирована не только дата, но и содержимое файла через хеш-сумму.
          </p>
        </div>

        {/* Case 3 */}
        <div className="mb-10 p-6 rounded-lg border border-border bg-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Копипаст контента с сайта</h2>
              <span className="text-xs text-muted-foreground">Тексты · SEO</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            Компания написала уникальные описания товаров для своего интернет-магазина. Через полгода конкурент скопировал все тексты один в один. Причём в поиске Google конкурент стал выше — потому что у него домен старше.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            Компания задепонировала все тексты ещё до публикации на сайте. Свидетельство с датой, опережающей дату появления текстов у конкурента. Отправили претензию с номером свидетельства и ссылками на Яндекс.Диск и Google Drive. Конкурент удалил тексты в течение недели.
          </p>
          <p className="text-sm text-primary font-medium">
            Чем помогло: четверная фиксация даты: ФНС, atoros.ru, Яндекс, Google — каждый источник независим.
          </p>
        </div>

        {/* Case 4 */}
        <div className="mb-10 p-6 rounded-lg border border-border bg-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Music className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Музыкант и чужой канал</h2>
              <span className="text-xs text-muted-foreground">Аудио · YouTube</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            Парень записал трек в домашней студии, выложил на SoundCloud. Через три месяца кто-то загрузил этот же трек на YouTube-канал с миллионом подписчиков и монетизировал.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            Он задепонировал проектный файл (DAW-сессию с дорожками) и финальный микс. Свидетельство подтвердило, что файл существовал за два месяца до публикации на YouTube. После обращения к администрации канала с номером свидетельства и ссылками на облачные копии — видео удалили по страйку.
          </p>
          <p className="text-sm text-primary font-medium">
            Чем помогло: в архиве не только финальный трек, но и исходник — доказательство авторства, а не просто владения файлом.
          </p>
        </div>

        {/* Case 5 */}
        <div className="mb-10 p-6 rounded-lg border border-border bg-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Спор соавторов</h2>
              <span className="text-xs text-muted-foreground">Соавторство · Книга</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            Два автора писали книгу вместе. На этапе публикации возник спор: кто внёс какой вклад. Один утверждал, что написал 80% текста, второй — что половину.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            Они депонировали каждую главу отдельно по мере написания. В свидетельствах видно, кто и когда загружал каждую часть. Свидетельства стали основой для справедливого распределения гонорара — без суда.
          </p>
          <p className="text-sm text-primary font-medium">
            Чем помогло: каждая версия зафиксирована с датой и автором депонирования.
          </p>
        </div>

        {/* Case 6 — from Dzen */}
        <div className="mb-10 p-6 rounded-lg border border-border bg-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Архитектор и украденный проект дома</h2>
              <span className="text-xs text-muted-foreground">Чертежи · Строительство</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            Инженер-проектировщик разработал комплект чертежей для частного дома. Заказчик отказался оплачивать работу, сославшись на «несоответствие требованиям». Через полгода тот же заказчик начал строить дом по этим чертежам — передал их другому подрядчику, который даже не знал, что они чужие.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            Проектировщик вовремя депонировал архив с DWG-файлами, расчётами и пояснительной запиской. Свидетельство с датой, подтверждённой Яндекс.Диском и Google Drive, стало основой для претензии. Заказчик понял, что в суде ему не отбиться — трёх независимых дат не подделаешь. Оплатил работу в полном объёме плюс неустойку.
          </p>
          <p className="text-sm text-primary font-medium">
            Чем помогло: дата создания чертежей подтверждена тремя источниками, файлы неизменны.
          </p>
        </div>

        {/* Case 7 — from Dzen */}
        <div className="mb-10 p-6 rounded-lg border border-border bg-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-teal-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Фотограф и пиратская фотосток</h2>
              <span className="text-xs text-muted-foreground">Фотографии · Коммерция</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            Фотограф снял серию портретов для рекламной кампании. Клиент получил исходники, но не заплатил. Через пару месяцев фотографии появились на стоке — кто-то выложил их на продажу от своего имени.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            У фотографа было свидетельство о депонировании: архив с RAW-файлами, метаданными EXIF (включая дату съёмки и серийный номер камеры). Хеш-сумма архива совпадала с указанной в свидетельстве. Ссылки на Яндекс.Диск и Google Drive подтверждали, что файлы были загружены за три недели до появления на стоке. Сток удалил фотографии по обращению. Клиент заплатил.
          </p>
          <p className="text-sm text-primary font-medium">
            Чем помогло: RAW-файлы с EXIF + хеш-сумма + три независимые даты — комбинация неопровержима.
          </p>
        </div>

        {/* Case 8 — from Dzen */}
        <div className="mb-10 p-6 rounded-lg border border-border bg-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
              <Code className="h-5 w-5 text-indigo-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Блогер и украденная статья</h2>
              <span className="text-xs text-muted-foreground">Текст · Контент-маркетинг</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            Девушка вела блог о путешествиях, писала большие подробные статьи с фотографиями. Один из популярных Telegram-каналов скопировал её статью целиком — выдал за свою, набрал тысячи репостов.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            Она депонировала каждую статью сразу после написания — до публикации. Свидетельство с датой, опережающей публикацию в Telegram, и хеш-сумма текстового файла стали доказательством. После обращения к администрации канала с номером свидетельства и ссылками на облака — статья удалена, опубликовано извинение.
          </p>
          <p className="text-sm text-primary font-medium">
            Чем помогло: привычка депонировать до публикации — дата всегда на вашей стороне.
          </p>
        </div>

        <div className="p-6 rounded-lg border border-primary/20 bg-primary/5">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Заметили закономерность?</strong> Во всех случаях депозит помог не потому, что это магическая бумажка, а потому что давал конкретное доказательство: дату, подтверждённую тремя независимыми источниками, и неизменный файл. Этого достаточно, чтобы решить спор без суда — или выиграть его.
          </p>
        </div>

      </main>
    <SiteFooter />
    </div>
  );
}

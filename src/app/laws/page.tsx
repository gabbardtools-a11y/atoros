import { Header } from '@/components/site-header';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Scale, ShieldCheck, FileText, Gavel, AlertCircle, CheckCircle2 } from 'lucide-react';
import { SiteFooter } from '@/components/site-footer';

export const metadata = {
  title: 'Законы — Atoros',
  description: 'Как работает депонирование с точки зрения закона. Какие права даёт свидетельство, в каких случаях оно помогает доказать авторство.',
};

export default async function LawsPage() {
  const session = await getServerSession(authOptions);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header session={session} />
      <main className="flex-1 max-w-[900px] w-full mx-auto px-6 py-16">

        <div className="mb-12">
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary mb-3">
            <Scale className="h-3.5 w-3.5" />
            Правовая база
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Как депонирование работает с точки зрения закона
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            Если вы создаёте что-то — тексты, дизайн, код, музыку — вам важно понимать, как защитить свои права до того, как их нарушат. Здесь без юридического жаргона, простыми словами.
          </p>
        </div>

        {/* Section 1 */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="h-5 w-5 text-primary flex-shrink-0" />
            <h2 className="text-xl font-semibold text-foreground">Что говорит закон</h2>
          </div>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-3">
            В России авторское право возникает в момент создания произведения. Не нужно никуда регистрироваться, платить пошлины или подавать заявления. Написали рассказ — права ваши. Нарисовали логотип — права ваши. Написали код — права ваши.
          </p>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-3">
            Но вот в чём проблема: когда возникает спор, нужно доказать, что произведение было у вас раньше, чем у того, кто его скопировал. И тут начинаются сложности. Словам не верят — нужны факты. Документы. Даты.
          </p>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Депонирование — это способ зафиксировать факт: «в такую-то дату у меня на руках был вот этот файл с таким-то содержимым». Не больше и не меньше. Но этого часто достаточно, чтобы выиграть спор.
          </p>
        </div>

        {/* Section 2 */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="h-5 w-5 text-primary flex-shrink-0" />
            <h2 className="text-xl font-semibold text-foreground">Почему именно три копии</h2>
          </div>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-3">
            Одна из ключевых вещей в споре об авторстве — дата. Когда именно вы создали файл. Чем больше независимых источников подтверждают эту дату, тем сильнее ваша позиция.
          </p>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-3">
            Atoros загружает ваш архив одновременно в три места:
          </p>
          <div className="grid gap-3 my-5">
            <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card">
              <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-red-500">Я</span>
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">Яндекс.Диск</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Яндекс фиксирует дату загрузки файла на своём сервере. Эту дату нельзя изменить — она записана в логах Яндекса. Ссылка на файл публикуется в свидетельстве.
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-blue-500">G</span>
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">Google Drive</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Google точно так же фиксирует дату загрузки. Независимо от Яндекса. Две крупные корпорации подтверждают одну и ту же дату — это серьёзный аргумент.
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-primary">A</span>
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">Atoros.ru</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Наш сервер тоже фиксирует дату и время депонирования. Плюс мы вычисляем хеш-сумму файла — цифровой отпечаток, который меняется при любом изменении содержимого.
                </div>
              </div>
            </div>
          </div>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Три независимые даты от трёх разных источников. Подделать все три одновременно практически невозможно. Если кто-то заявит «я создал это раньше» — у вас на руках железобетонное подтверждение.
          </p>
        </div>

        {/* Section 3 */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Gavel className="h-5 w-5 text-primary flex-shrink-0" />
            <h2 className="text-xl font-semibold text-foreground">Что говорит суд</h2>
          </div>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-3">
            Российские суды принимают свидетельства о депонировании как доказательство. Это не регистрация авторского права (такой процедуры в РФ нет) — это фиксация факта существования произведения на определённую дату.
          </p>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-3">
            В суде важна не бумажка сама по себе, а то, что за ней стоит: дата, подтверждённая независимым источником, и неизменный файл, целостность которого можно проверить через хеш-сумму.
          </p>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Если оппонент говорит «я написал это первым» — вы показываете свидетельство с датой, подтверждённой Яндексом, Google и atoros.ru. Плюс даёте архив с паролем — суд проверяет хеш, сверяет с указанным в свидетельстве. Совпадает = файл не менялся с даты депонирования.
          </p>
        </div>

        {/* Section 4 */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="h-5 w-5 text-primary flex-shrink-0" />
            <h2 className="text-xl font-semibold text-foreground">Чего депонирование не делает</h2>
          </div>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-3">
            Будем честны. Депонирование — это не патент, не товарный знак и не регистрацию права собственности. Оно не даёт вам монополию на идею. Если два человека независимо придумают похожий дизайн — депонирование поможет только тому, кто задепонировал раньше.
          </p>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-3">
            Депонирование также не защищает от плагиата автоматически. Оно даёт вам инструмент — дату и доказательство. Использовать этот инструмент в суде или переговорах — ваша задача.
          </p>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            И ещё: депонирование фиксирует конкретный файл с конкретным содержимым. Если вы потом доработаете произведение — нужно депонировать новую версию отдельно.
          </p>
        </div>

        {/* Section 5 */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
            <h2 className="text-xl font-semibold text-foreground">Когда депонирование реально помогает</h2>
          </div>
          <ul className="space-y-3">
            {[
              'Фрилансер сделал дизайн для клиента, а тот отказался платить и использовал работу — депонирование доказывает, что файл был у вас раньше.',
              'Бывший сотрудник унёс код проекта и запустил свой сервис — вы можете доказать, когда код был создан.',
              'Конкурент скопировал тексты с вашего сайта — у вас есть зафиксированная дата оригинала.',
              'Музыкант нашёл свой трек на чужом канале — депонирование подтверждает, что файл был у вас раньше публикации.',
              'Спор между соавторами о том, кто что создал и когда — каждая версия может быть задепонирована отдельно.',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-1" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Section 6 — ГК РФ */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Scale className="h-5 w-5 text-primary flex-shrink-0" />
            <h2 className="text-xl font-semibold text-foreground">Нормативная база</h2>
          </div>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-3">
            Депонирование в Atoros опирается на реальные нормы российского законодательства. Вот основные:
          </p>
          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-border bg-card">
              <div className="text-sm font-semibold text-foreground mb-2">Гражданский кодекс РФ, часть 4 — «Авторские и смежные права»</div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                <a href="https://www.consultant.ru/document/cons_doc_LAW_64629/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">consultant.ru/document/cons_doc_LAW_64629</a>
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Глава 70 (ст. 1228–1251): автору результата интеллектуальной деятельности принадлежит право авторства, а в случаях, предусмотренных законом, — другие права. Право авторство неотчуждаемо и непередаваемо. Использование произведения без разрешения правообладателя — нарушение исключительного права (ст. 1229).
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                Ст. 1255: автору произведения принадлежат исключительное право, право авторства, право на имя, право на неприкосновенность произведения. Эти права возникают с момента создания — регистрация не требуется.
              </p>
            </div>
            <div className="p-4 rounded-lg border border-border bg-card">
              <div className="text-sm font-semibold text-foreground mb-2">Ноу-хау (секрет производства) — ст. 1465 ГК РФ</div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                <a href="https://www.consultant.ru/document/cons_doc_LAW_64629/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Глава 75 ГК РФ — «Право на секрет производства (ноу-хау)»</a>
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Ст. 1465: обладателю секрета производства принадлежит исключительное право использовать его любым способом, не нарушающим закон, и запрещать использование третьим лицам. Ноу-хау — это сведения любого характера, которые имеют действительную или потенциальную коммерческую ценность в силу неизвестности их третьим лицам.
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                <strong className="text-foreground">Как Atoros защищает ноу-хау:</strong> депонирование фиксирует дату, когда у вас был документ с описанием секрета производства. Архив шифруется AES-256 — содержимое не видит никто без пароля. Четыре независимые даты (ФНС, ФНС, Яндекс, Google, atoros.ru) подтверждают приоритет. Если конкурент заявит «мы разработали это сами» — у вас есть железобетонное доказательство первенства.
              </p>
            </div>
            <div className="p-4 rounded-lg border border-border bg-card">
              <div className="text-sm font-semibold text-foreground mb-2">Доказательства в суде — ст. 55 ГПК РФ, ст. 71 АПК РФ</div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Свидетельство о депонировании с независимыми датами и хеш-суммами подпадает под письменные доказательства (ст. 71 ГПК). Электронный документ с электронной подписью приравнивается к письменному (ст. 75 АПК). Ссылки на облачные хранилища — дополнительные доказательства, которые суд может проверить самостоятельно.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-lg border border-primary/20 bg-primary/5">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Важно:</strong> эта страница — не юридическая консультация. Если у вас реальный спор, обратитесь к патентному поверенному. Свидетельство о депонировании — инструмент, а не замена юристу.
          </p>
        </div>

      </main>
    <SiteFooter />
    </div>
  );
}

import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { ShieldCheck, FileCheck2, Fingerprint, Upload, ArrowRight, CheckCircle2, FileText } from 'lucide-react';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { Header } from '@/components/site-header';
import { HeroWithControls } from '@/components/hero-with-controls';
import { ComparisonTable } from '@/components/comparison-table';
import { SiteFooter } from '@/components/site-footer';

export const dynamic = 'force-dynamic';

async function getStats() {
  try {
    const total = await db.certificate.count();
    return { total };
  } catch {
    return { total: 0 };
  }
}

export default async function Home() {
  const session = await getServerSession(authOptions);
  const { total } = await getStats();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header session={session} />

      {/* Hero — full-bleed animation background + text overlay */}
      <section className="relative overflow-hidden border-b border-border min-h-[640px]">
        {/* Three.js hero animation — full block background */}
        <HeroWithControls />

        {/* Millimeter grid background (subtle, on top of animation) */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(158,201,242,0.4) 0.5px, transparent 0.5px), linear-gradient(to bottom, rgba(158,201,242,0.4) 0.5px, transparent 0.5px), linear-gradient(to right, rgba(135,187,240,0.8) 1px, transparent 1px), linear-gradient(to bottom, rgba(135,187,240,0.8) 1px, transparent 1px)',
            backgroundSize: '3.78px 3.78px, 3.78px 3.78px, 18.9px 18.9px, 18.9px 18.9px',
          }}
        />

        {/* Text content overlay */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-6 backdrop-blur-sm">
              <ShieldCheck className="h-3.5 w-3.5" />
              Бесплатный тариф навсегда · архивы до 10 МБ · метка времени ФНС
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-foreground mb-6">
              Депонирование <span className="text-foreground font-light">информации</span>
              <br />
              для подтверждения <span className="text-primary font-semibold">авторских прав и ноу-хау</span>
            </h1>

            <p className="text-base md:text-lg mb-8 leading-relaxed max-w-xl text-slate-700 dark:text-white/90">
              Бесплатное депонирование авторских прав, ноу-хау и любой информации с обеспечением
              доказательной базы для судов РФ и иностранных юрисдикций, маркетплейсов и других
              инстанций и организаций. Загрузите архив с произведением — мы вычислим его уникальные
              цифровые отпечатки (хеш-суммы MD5, SHA-256 и ГОСТ Р 34.11-2012) и опубликуем
              свидетельство о депонировании с уникальным номером и квалифицированной меткой времени
              от Федеральной Налоговой Службы (ФНС) и проверочным QR-кодом. Подтверждение авторства
              и владельца задепонированной информации в любой момент бесплатно через
              онлайн-верификацию.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-3 mb-6">
              {session?.user ? (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition"
                >
                  Перейти в кабинет
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/auth/register"
                    className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition"
                  >
                    Начать депонирование
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/auth/login"
                    className="inline-flex items-center gap-2 rounded-md border border-border bg-background/80 backdrop-blur-sm px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted transition"
                  >
                    Войти
                  </Link>
                </>
              )}
            </div>

            {/* Sample certificate button */}
            <div className="mb-10">
              <a
                href="/sample-certificate.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-primary/30 bg-primary/10 backdrop-blur-sm px-5 py-2.5 text-sm font-medium text-primary hover:bg-primary/20 transition"
              >
                <FileText className="h-4 w-4" />
                Посмотреть образец свидетельства
              </a>
            </div>

            <div className="flex flex-wrap items-start gap-x-6 gap-y-2 text-xs text-slate-700 dark:text-white/80">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                Без бумажной почты
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                Мгновенная публикация
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                {total > 0 ? `${total} ${pluralize(total, 'свидетельство', 'свидетельства', 'свидетельств')} уже опубликовано` : 'Первое свидетельство — ваше'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="text-xs font-bold tracking-widest uppercase text-primary mb-2">
              Как это работает
            </div>
            <h2 className="text-3xl font-semibold text-foreground">
              Четыре шага до свидетельства с доказательной базой для судов РФ и иностранных юрисдикций
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: Upload,
                step: '01',
                title: 'Загрузите архив',
                desc: 'Соберите файлы произведения в ZIP-архив до 10 МБ и прикрепите к форме',
              },
              {
                icon: Fingerprint,
                step: '02',
                title: 'Хеш-сумма MD5',
                desc: 'Сервер автоматически вычисляет уникальный цифровой отпечаток файла',
              },
              {
                icon: FileCheck2,
                step: '03',
                title: 'Заполните данные',
                desc: 'Укажите ФИО, название произведения, тип — данные попадут в свидетельство',
              },
              {
                icon: ShieldCheck,
                step: '04',
                title: 'Свидетельство готово',
                desc: 'Получите страницу-свидетельство с уникальным номером, меткой времени ФНС и QR-кодом — готовая доказательная база для судов РФ и иностранных юрисдикций, маркетплейсов и других инстанций',
              },
            ].map((s) => (
              <div key={s.step} className="relative bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition group">
                <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary/20 transition">
                  <s.icon className="h-5 w-5" />
                </div>
                <div className="text-xs font-mono text-muted-foreground mb-2">{s.step}</div>
                <h3 className="text-base font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Tariffs */}
      <section className="py-20 bg-background border-t border-border">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-xs font-bold tracking-widest uppercase text-primary mb-2">Тарифы</div>
            <h2 className="text-3xl font-semibold text-foreground mb-3">Просто и честно</h2>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">Депонирование авторских прав и ноу-хау — бесплатно навсегда. Платите только когда нужно больше.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg border-2 border-primary bg-primary/5">
              <div className="text-sm font-bold text-primary mb-1">Бесплатный</div>
              <div className="text-3xl font-bold text-foreground mb-3">0 ₽</div>
              <ul className="space-y-2 text-xs text-muted-foreground mb-6">
                <li>✓ До 10 МБ на архив</li>
                <li>✓ До 3 файлов</li>
                <li>✓ AES-256 + MD5 + SHA-256 + ГОСТ</li>
                <li>✓ ФНС (метка времени) + Яндекс + Google</li>
                <li>✓ Свидетельство + QR-код</li>
                <li>✓ Реестр свидетельств</li>
              </ul>
              <Link href="/auth/register" className="block text-center rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition">Начать бесплатно</Link>
            </div>
            <div className="p-6 rounded-lg border border-border bg-card">
              <div className="text-sm font-bold text-foreground mb-1">Стандарт</div>
              <div className="text-3xl font-bold text-foreground mb-3">490 ₽<span className="text-sm font-normal text-muted-foreground">/мес</span></div>
              <ul className="space-y-2 text-xs text-muted-foreground mb-6">
                <li>✓ До 100 МБ на архив</li>
                <li>✓ До 20 файлов</li>
                <li>✓ Всё из бесплатного</li>
                <li>✓ Безлимит свидетельств</li>
                <li>✓ PDF-свидетельство</li>
                <li>✓ Email-поддержка</li>
              </ul>
              <Link href="/tariffs" className="block text-center rounded-md border border-border px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition">Подробнее</Link>
            </div>
            <div className="p-6 rounded-lg border border-border bg-card">
              <div className="text-sm font-bold text-foreground mb-1">Бизнес</div>
              <div className="text-3xl font-bold text-foreground mb-3">2 490 ₽<span className="text-sm font-normal text-muted-foreground">/мес</span></div>
              <ul className="space-y-2 text-xs text-muted-foreground mb-6">
                <li>✓ До 1 ГБ на архив</li>
                <li>✓ Безлимит файлов</li>
                <li>✓ Командный доступ</li>
                <li>✓ API для интеграции</li>
                <li>✓ Бумажное свидетельство</li>
                <li>✓ Юрист-консультант</li>
              </ul>
              <Link href="/tariffs" className="block text-center rounded-md border border-border px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition">Подробнее</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison with competitors */}
      <ComparisonTable />

      {/* CTA */}
      <section className="py-20 bg-muted/50 border-t border-border">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold text-foreground mb-4">
            Защитите свои авторские права и ноу-хау прямо сейчас
          </h2>
          <p className="text-muted-foreground mb-8">
            Регистрация займёт меньше минуты. Первое свидетельство — бесплатно.
          </p>
          <Link
            href={session?.user ? '/dashboard' : '/auth/register'}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition"
          >
            {session?.user ? 'В личный кабинет' : 'Создать аккаунт'}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <Footer />
      <SiteFooter />

      {/* JSON-LD WebSite schema with keywords */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Atoros.ru — Депонирование авторских прав и ноу-хау',
            url: 'https://atoros.ru',
            description: 'Бесплатное депонирование авторских прав, ноу-хау и любой информации с обеспечением доказательной базы для судов РФ и иностранных юрисдикций, маркетплейсов и других инстанций. Метка времени ФНС, хеш-суммы (MD5, SHA-256, ГОСТ Р 34.11-2012), QR-код, торрент-сеть.',
            keywords: 'депонирование бесплатно, авторские права, ноу-хау, доказательная база для судов РФ, иностранные юрисдикции, маркетплейсы, метка времени ФНС, хеш-суммы, свидетельство о депонировании, онлайн-верификация',
            publisher: {
              '@type': 'Organization',
              name: 'ООО «Патентные Технологии»',
              identifier: 'ИНН 7716687757',
            },
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'RUB',
              description: 'Бесплатный тариф навсегда — депонирование до 10 МБ',
            },
          }),
        }}
      />
    </div>
  );
}

function pluralize(n: number, one: string, few: string, many: string) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}

function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="font-bold text-foreground">Atoros.ru</span>
          <span>·</span>
          <span>Deposit4Copyright</span>
        </div>
        <div className="flex items-center gap-4">
          <span>ООО «Патентные Технологии»</span>
          <span>·</span>
          <span>ИНН 7716687757</span>
          <span>·</span>
          <span>2025</span>
        </div>
      </div>
    </footer>
  );
}

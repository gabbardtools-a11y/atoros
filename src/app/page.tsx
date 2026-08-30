import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { ShieldCheck, FileCheck2, Fingerprint, Upload, ArrowRight, CheckCircle2 } from 'lucide-react';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { Header } from '@/components/site-header';

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
    <div className="min-h-screen flex flex-col bg-white">
      <Header session={session} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-100">
        {/* Millimeter grid background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-50"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(158,201,242,0.4) 0.5px, transparent 0.5px), linear-gradient(to bottom, rgba(158,201,242,0.4) 0.5px, transparent 0.5px), linear-gradient(to right, rgba(135,187,240,0.8) 1px, transparent 1px), linear-gradient(to bottom, rgba(135,187,240,0.8) 1px, transparent 1px)',
            backgroundSize: '3.78px 3.78px, 3.78px 3.78px, 18.9px 18.9px, 18.9px 18.9px',
          }}
        />

        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 mb-6">
              <ShieldCheck className="h-3.5 w-3.5" />
              Тестовый режим · архивы до 10 МБ · хеш MD5
            </div>

            <h1 className="text-4xl md:text-6xl font-light tracking-tight text-slate-900 mb-6">
              Депонирование <span className="text-blue-600 font-semibold">авторских прав</span>
              <br />
              за 60 секунд
            </h1>

            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Загрузите архив с произведением — мы вычислим его уникальный цифровой отпечаток
              (хеш-сумму MD5) и опубликуем свидетельство о депонировании с уникальным номером.
              Подтверждение авторства в любой момент через онлайн-верификацию.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
              {session?.user ? (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
                >
                  Перейти в кабинет
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/auth/register"
                    className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
                  >
                    Начать депонирование
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/auth/login"
                    className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Войти
                  </Link>
                </>
              )}
            </div>

            <div className="flex items-center justify-center gap-6 text-xs text-slate-500">
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
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="text-xs font-bold tracking-widest uppercase text-blue-600 mb-2">
              Как это работает
            </div>
            <h2 className="text-3xl font-semibold text-slate-900">
              Четыре шага до свидетельства
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
                desc: 'Получите страницу-свидетельство с уникальным номером и QR-кодом верификации',
              },
            ].map((s) => (
              <div key={s.step} className="relative bg-white border border-slate-100 rounded-lg p-6 hover:border-blue-200 transition group">
                <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition">
                  <s.icon className="h-5 w-5" />
                </div>
                <div className="text-xs font-mono text-slate-400 mb-2">{s.step}</div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">{s.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold text-slate-900 mb-4">
            Защитите своё произведение прямо сейчас
          </h2>
          <p className="text-slate-600 mb-8">
            Регистрация займёт меньше минуты. Первое свидетельство — бесплатно.
          </p>
          <Link
            href={session?.user ? '/dashboard' : '/auth/register'}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
          >
            {session?.user ? 'В личный кабинет' : 'Создать аккаунт'}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <Footer />
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
    <footer className="mt-auto border-t border-slate-100 bg-white">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700">Atoros.ru</span>
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

import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';

export async function Header({ session }: { session?: any }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-bold text-lg" style={{ color: '#1D4ED8' }}>
            Atoros<span style={{ color: '#1D4ED8' }}>.</span>ru
          </span>
          <span
            className="text-[9px] font-semibold tracking-wide uppercase hidden sm:inline"
            style={{ color: '#B08A3E', borderLeft: '1px solid rgba(176,138,62,0.35)', paddingLeft: '8px', marginLeft: '2px' }}
          >
            Deposit<span style={{ color: '#1D4ED8', fontWeight: 700 }}>4</span>Copyright
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {session?.user ? (
            <>
              <Link href="/dashboard" className="text-slate-600 hover:text-slate-900 transition">
                Кабинет
              </Link>
              <Link
                href="/api/auth/signout?callbackUrl=/"
                className="text-slate-600 hover:text-slate-900 transition"
              >
                Выйти
              </Link>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-slate-600 hover:text-slate-900 transition">
                Войти
              </Link>
              <Link
                href="/auth/register"
                className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition"
              >
                Регистрация
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

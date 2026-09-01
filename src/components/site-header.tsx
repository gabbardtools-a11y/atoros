import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { ThemeToggle } from '@/components/theme-toggle';

export async function Header({ session }: { session?: any }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-bold text-lg" style={{ color: '#2563EB' }}>
            Atoros<span style={{ color: '#2563EB' }}>.</span>ru
          </span>
          <span
            className="text-[9px] font-semibold tracking-wide uppercase hidden sm:inline"
            style={{ color: '#B08A3E', borderLeft: '1px solid rgba(176,138,62,0.35)', paddingLeft: '8px', marginLeft: '2px' }}
          >
            Deposit<span style={{ color: '#2563EB', fontWeight: 700 }}>4</span>Copyright
          </span>
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          <ThemeToggle />
          {session?.user ? (
            <>
              <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition">
                Кабинет
              </Link>
              <Link
                href="/api/auth/signout?callbackUrl=/"
                className="text-muted-foreground hover:text-foreground transition"
              >
                Выйти
              </Link>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-muted-foreground hover:text-foreground transition">
                Войти
              </Link>
              <Link
                href="/auth/register"
                className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition"
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

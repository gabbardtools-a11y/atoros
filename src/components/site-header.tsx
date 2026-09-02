import Link from 'next/link';
import Image from 'next/image';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { ThemeToggle } from '@/components/theme-toggle';

export async function Header({ session }: { session?: any }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/40 backdrop-blur-md">
      <div className="max-w-[1400px] mx-auto px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo-atoros.png"
            alt="Atoros"
            width={56}
            height={70}
            priority
            className="atoros-logo h-12 w-auto"
          />
          <span className="flex items-baseline gap-2.5">
            <span className="font-bold text-xl" style={{ color: '#60A5FA' }}>
              Atoros<span style={{ color: '#60A5FA', fontWeight: 400 }}>.</span><span style={{ fontWeight: 400 }}>ru</span>
            </span>
            <span
              className="text-[10px] font-semibold tracking-wide uppercase hidden sm:inline"
              style={{ color: '#B08A3E', borderLeft: '1px solid rgba(176,138,62,0.35)', paddingLeft: '10px', marginLeft: '2px' }}
            >
              Deposit<span style={{ color: '#2563EB', fontWeight: 700 }}>4</span>Copyright
            </span>
          </span>
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/registry" className="text-muted-foreground hover:text-foreground transition">
            Реестр свидетельств
          </Link>
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

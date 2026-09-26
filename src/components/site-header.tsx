import Link from 'next/link';
import Image from 'next/image';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { ThemeToggle } from '@/components/theme-toggle';

export async function Header({ session }: { session?: any }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/40 backdrop-blur-md">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Image
            src="/logo-atoros.png"
            alt="Atoros"
            width={56}
            height={70}
            priority
            className="atoros-logo h-7 sm:h-8 w-auto flex-shrink-0"
          />
          <span className="flex items-baseline gap-2 sm:gap-2.5 min-w-0">
            <span
              className="font-bold text-lg sm:text-xl whitespace-nowrap"
              style={{
                fontFamily: 'Constantia, "Lora", var(--font-atoros-brand), serif',
                letterSpacing: '-0.01em',
              }}
            >
              <span style={{ color: '#3b82f6' }}>Atoros</span>
              <span style={{ color: '#2563EB' }}>.ru</span>
            </span>
            <span
              className="text-[10px] font-semibold tracking-wide uppercase hidden md:inline"
              style={{ color: '#B08A3E', borderLeft: '1px solid rgba(176,138,62,0.35)', paddingLeft: '10px', marginLeft: '2px' }}
            >
              Deposit<span style={{ color: '#2563EB', fontWeight: 700 }}>4</span>Copyright
            </span>
          </span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-3 text-sm">
          <Link href="/registry" className="text-muted-foreground hover:text-foreground transition hidden lg:inline">
            Реестр
          </Link>
          <Link href="/laws" className="text-muted-foreground hover:text-foreground transition hidden md:inline">
            Законы
          </Link>
          <Link href="/cases" className="text-muted-foreground hover:text-foreground transition hidden md:inline">
            Кейсы
          </Link>
          <Link href="/services" className="text-muted-foreground hover:text-foreground transition hidden lg:inline">
            Сервисы
          </Link>
          <Link href="/info" className="text-muted-foreground hover:text-foreground transition hidden md:inline">
            Инфо
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
              <Link href="/auth/login" className="font-medium text-blue-700 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition">
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

import Link from 'next/link';
import { db } from '@/lib/db';
import { Header } from '@/components/site-header';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Eye, FileText, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Реестр свидетельств — Atoros',
  description: 'Публичный реестр всех депонированных свидетельств на Atoros.ru по годам',
};

export default async function RegistryPage() {
  const session = await getServerSession(authOptions);

  // Get all years that have published certificates, with counts
  const allCerts = await db.certificate.findMany({
    where: { status: 'published' },
    select: { certYear: true, createdAt: true },
  });

  // Group by year
  const yearMap = new Map<number, number>();
  for (const c of allCerts) {
    yearMap.set(c.certYear, (yearMap.get(c.certYear) ?? 0) + 1);
  }

  // Sort years descending
  const years = Array.from(yearMap.entries()).sort((a, b) => b[0] - a[0]);

  // Always show 2026 and 2027 even if empty
  const currentYear = new Date().getFullYear();
  const allYears = new Set([2026, 2027, currentYear, ...yearMap.keys()]);
  const displayYears = Array.from(allYears).sort((a, b) => b - a);

  const totalCount = allCerts.length;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header session={session} />
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-8 py-10">
        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary mb-2">
            <Eye className="h-3.5 w-3.5" />
            Публичный реестр
          </div>
          <h1 className="text-3xl font-semibold text-foreground mb-2">
            Реестр свидетельств
          </h1>
          <p className="text-sm text-muted-foreground">
            Всего опубликовано: {totalCount} {pluralize(totalCount, 'свидетельство', 'свидетельства', 'свидетельств')}
          </p>
        </div>

        {/* Years grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayYears.map((year) => {
            const count = yearMap.get(year) ?? 0;
            return (
              <Link
                key={year}
                href={`/registry/${year}`}
                className="group relative bg-card border border-border rounded-lg p-8 hover:border-primary/50 transition overflow-hidden"
              >
                {/* Year number — big */}
                <div className="text-5xl font-light text-foreground mb-3 group-hover:text-primary transition">
                  {year}
                </div>

                {/* Count */}
                <div className="text-sm text-muted-foreground mb-6">
                  {count > 0
                    ? `${count} ${pluralize(count, 'свидетельство', 'свидетельства', 'свидетельств')}`
                    : 'Пока нет свидетельств'}
                </div>

                {/* Arrow */}
                <div className="flex items-center gap-2 text-sm font-medium text-primary">
                  Открыть реестр {year}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
                </div>

                {/* Decorative number in background */}
                <div
                  className="absolute -bottom-4 -right-4 text-[120px] font-black opacity-[0.03] pointer-events-none select-none"
                  style={{ color: '#2563EB' }}
                >
                  {year}
                </div>
              </Link>
            );
          })}
        </div>

        {totalCount === 0 && (
          <div className="text-center py-16">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground mb-4">Реестр пуст. Будьте первым!</p>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition"
            >
              Задепонировать произведение
            </Link>
          </div>
        )}
      </main>
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

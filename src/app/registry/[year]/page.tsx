import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import { Header } from '@/components/site-header';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Eye, ArrowLeft, FileText } from 'lucide-react';
import { RegistryYearSearch } from './registry-year-search';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ year: string }> };

export async function generateMetadata({ params }: Props) {
  const { year } = await params;
  return {
    title: `Реестр свидетельств ${year} — Atoros`,
    description: `Публичный реестр свидетельств о депонировании за ${year} год`,
  };
}

export default async function RegistryYearPage({ params }: Props) {
  const { year: yearStr } = await params;
  const year = parseInt(yearStr, 10);

  if (isNaN(year) || year < 2020 || year > 2100) {
    notFound();
  }

  const session = await getServerSession(authOptions);

  const certs = await db.certificate.findMany({
    where: { status: 'published', certYear: year },
    orderBy: { certSeq: 'asc' },
    select: {
      id: true,
      slug: true,
      certNumber: true,
      workTitle: true,
      workType: true,
      archiveSize: true,
      fileCount: true,
      md5Hash: true,
      sha256Hash: true,
      authorFirstName: true,
      authorLastName: true,
      createdAt: true,
    },
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header session={session} />
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-8 py-10">
        {/* Breadcrumb */}
        <Link
          href="/registry"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Реестр свидетельств
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary mb-2">
            <Eye className="h-3.5 w-3.5" />
            Публичный реестр
          </div>
          <h1 className="text-3xl font-semibold text-foreground mb-2">
            Свидетельства {year} года
          </h1>
          <p className="text-sm text-muted-foreground">
            {certs.length > 0
              ? `Опубликовано: ${certs.length} ${pluralize(certs.length, 'свидетельство', 'свидетельства', 'свидетельств')}`
              : 'За этот год пока нет свидетельств'}
          </p>
        </div>

        {certs.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground mb-4">Будьте первым, кто задепонирует произведение в {year} году!</p>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition"
            >
              Задепонировать произведение
            </Link>
          </div>
        ) : (
          <RegistryYearSearch certs={certs} />
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

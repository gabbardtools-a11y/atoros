import Link from 'next/link';
import { db } from '@/lib/db';
import { Header } from '@/components/site-header';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Eye, FileText, Search } from 'lucide-react';
import { RegistrySearch } from './registry-search';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Реестр свидетельств — Atoros',
  description: 'Публичный реестр всех депонированных свидетельств на Atoros.ru',
};

const WORK_TYPE_LABELS: Record<string, string> = {
  text: 'Текст',
  image: 'Изображение',
  audio: 'Аудио',
  video: 'Видео',
  code: 'Код',
  collection: 'Сборник',
  other: 'Другое',
};

export default async function RegistryPage() {
  const session = await getServerSession(authOptions);
  const certs = await db.certificate.findMany({
    where: { status: 'published' },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      slug: true,
      certNumber: true,
      workTitle: true,
      workType: true,
      archiveSize: true,
      fileCount: true,
      md5Hash: true,
      authorFirstName: true,
      authorLastName: true,
      createdAt: true,
    },
    take: 200,
  });

  const totalCount = await db.certificate.count({ where: { status: 'published' } });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header session={session} />
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-8 py-10">
        <div className="mb-8">
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

        {certs.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">Реестр пуст. Будьте первым!</p>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition mt-4"
            >
              Задепонировать произведение
            </Link>
          </div>
        ) : (
          <RegistrySearch certs={certs} />
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

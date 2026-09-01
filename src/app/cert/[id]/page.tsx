import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { CertificateView } from './certificate-view';
import { PrintButtons } from './print-buttons';
import { Eye } from 'lucide-react';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const cert = await db.certificate.findUnique({ where: { id } });
  if (!cert) return { title: 'Свидетельство не найдено — Atoros' };
  return {
    title: `Свидетельство № ${cert.certNumber} — Atoros`,
    description: `Депонирование произведения «${cert.workTitle}». MD5: ${cert.md5Hash.slice(0, 16)}…`,
  };
}

export default async function CertPage({ params }: Props) {
  const { id } = await params;
  const cert = await db.certificate.findUnique({ where: { id } });
  if (!cert || cert.status !== 'published') {
    notFound();
  }
  const author = await db.user.findUnique({ where: { id: cert.authorId } });
  return (
    <main className="min-h-screen bg-slate-50 py-8 print:bg-white print:py-0">
      <div className="max-w-[210mm] mx-auto px-4 print:max-w-none print:px-0">
        {/* Top bar — hidden when printing */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 print:hidden">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Eye className="h-4 w-4" />
            <span>Публичная страница свидетельства</span>
          </div>
          <PrintButtons certId={cert.id} />
        </div>

        <CertificateView cert={cert} authorEmail={author?.email ?? cert.authorEmail} />

        <p className="text-center text-xs text-muted-foreground mt-6 print:hidden">
          Свидетельство № {cert.certNumber} · Atoros.ru — Депонирование авторских прав
        </p>
      </div>
    </main>
  );
}

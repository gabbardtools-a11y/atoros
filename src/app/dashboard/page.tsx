import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { Header } from '@/components/site-header';
import { DashboardClient } from './dashboard-client';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/auth/login?callbackUrl=/dashboard');

  const userId = (session.user as any).id as string;
  const [user, certs] = await Promise.all([
    db.user.findUnique({ where: { id: userId } }),
    db.certificate.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  if (!user) redirect('/auth/login');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header session={session} />
      <DashboardClient user={user} certificates={certs} />
    </div>
  );
}

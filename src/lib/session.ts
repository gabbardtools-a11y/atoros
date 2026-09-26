'use server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export type SessionUser = {
  id: string;
  email: string;
  name?: string | null;
};

export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  return {
    id: (session.user as any).id as string,
    email: session.user.email!,
    name: session.user.name,
  };
}

export async function getCurrentUserWithProfile() {
  const u = await getCurrentUser();
  if (!u) return null;
  const user = await db.user.findUnique({ where: { id: u.id } });
  return user;
}

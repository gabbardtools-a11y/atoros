import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { db } from '@/lib/db';

const schema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(8, 'Пароль не менее 8 символов'),
  firstName: z.string().min(1, 'Имя обязательно'),
  middleName: z.string().optional().nullable(),
  lastName: z.string().min(1, 'Фамилия обязательна'),
  phone: z.string().optional().nullable(),
  country: z.string().default('RU'),
  city: z.string().optional().nullable(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Некорректные данные' },
        { status: 400 }
      );
    }
    const d = parsed.data;
    const email = d.email.toLowerCase().trim();
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: 'Пользователь с таким email уже существует' },
        { status: 409 }
      );
    }
    const passwordHash = await bcrypt.hash(d.password, 10);
    const user = await db.user.create({
      data: {
        email,
        passwordHash,
        firstName: d.firstName.trim(),
        middleName: d.middleName?.trim() || null,
        lastName: d.lastName.trim(),
        phone: d.phone?.trim() || null,
        country: d.country,
        city: d.city?.trim() || null,
      },
      select: { id: true, email: true, firstName: true, lastName: true },
    });
    return NextResponse.json({ ok: true, user });
  } catch (e: any) {
    console.error('[register] error', e);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}

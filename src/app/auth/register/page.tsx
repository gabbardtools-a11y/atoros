'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    lastName: '',
    firstName: '',
    middleName: '',
    phone: '',
    country: 'RU',
    city: '',
  });

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Ошибка регистрации');

      // Auto-sign in
      const sign = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      });
      if (!sign || sign.error) throw new Error('Не удалось войти после регистрации');

      toast({ title: 'Аккаунт создан', description: 'Добро пожаловать в Atoros!' });
      router.push('/dashboard');
      router.refresh();
    } catch (e: any) {
      toast({ title: 'Ошибка', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-2xl">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 mb-6 transition">
          <ArrowLeft className="h-4 w-4" />
          На главную
        </Link>

        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-slate-900">Регистрация</h1>
            <p className="text-sm text-slate-500 mt-1">
              Создайте аккаунт для депонирования произведений
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <Field label="Фамилия*" required value={form.lastName} onChange={(v) => set('lastName', v)} />
              <Field label="Имя*" required value={form.firstName} onChange={(v) => set('firstName', v)} />
              <Field label="Отчество" value={form.middleName} onChange={(v) => set('middleName', v)} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Email*" type="email" required value={form.email} onChange={(v) => set('email', v)} />
              <Field label="Телефон" type="tel" value={form.phone} onChange={(v) => set('phone', v)} placeholder="+7 (___) ___-__-__" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Страна" value={form.country} onChange={(v) => set('country', v)} placeholder="RU" />
              <Field label="Город" value={form.city} onChange={(v) => set('city', v)} placeholder="Москва" />
            </div>
            <Field label="Пароль*" type="password" required value={form.password} onChange={(v) => set('password', v)} placeholder="Минимум 8 символов" />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Создать аккаунт
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center text-sm text-slate-500">
            Уже есть аккаунт?{' '}
            <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
              Войти
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-700 mb-1.5">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
      />
    </div>
  );
}

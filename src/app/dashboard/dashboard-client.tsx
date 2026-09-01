'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import {
  Loader2,
  Upload,
  FileText,
  Download,
  ExternalLink,
  Plus,
  Fingerprint,
  CircleCheck,
} from 'lucide-react';

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName: string | null;
  phone: string | null;
  country: string;
  city: string | null;
};

type Cert = {
  id: string;
  certNumber: string;
  workTitle: string;
  workType: string;
  archiveName: string;
  archiveSize: number;
  md5Hash: string;
  status: string;
  createdAt: Date;
};

const WORK_TYPES = [
  { value: 'text', label: 'Текстовое произведение' },
  { value: 'image', label: 'Изображение / графика' },
  { value: 'audio', label: 'Аудиопроизведение' },
  { value: 'video', label: 'Видеопроизведение' },
  { value: 'code', label: 'Программный код' },
  { value: 'collection', label: 'Сборник' },
  { value: 'other', label: 'Другое' },
];

export function DashboardClient({
  user,
  certificates,
}: {
  user: User;
  certificates: Cert[];
}) {
  const { toast } = useToast();
  const router = useRouter();
  const [showUpload, setShowUpload] = useState(false);

  return (
    <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10">
      {/* Greeting */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Здравствуйте, {user.firstName}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Личный кабинет депонирования · Atoros.ru
          </p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
        >
          <Plus className="h-4 w-4" />
          Задепонировать произведение
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Всего свидетельств"
          value={String(certificates.length)}
          icon={FileText}
        />
        <StatCard
          label="Дата регистрации"
          value={new Date(user.id.length > 10 ? Date.now() : Date.now()).toLocaleDateString('ru-RU')}
          icon={CircleCheck}
        />
        <StatCard
          label="Email"
          value={user.email}
          icon={Fingerprint}
        />
      </div>

      {/* Certificates list */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">Мои свидетельства</h2>
          <span className="text-xs text-muted-foreground">{certificates.length} шт.</span>
        </div>
        {certificates.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <FileText className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground mb-4">У вас пока нет свидетельств</p>
            <button
              onClick={() => setShowUpload(true)}
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
            >
              <Upload className="h-4 w-4" />
              Загрузить первый архив
            </button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {certificates.map((c) => (
              <CertRow key={c.id} cert={c} />
            ))}
          </div>
        )}
      </div>

      {showUpload && (
        <UploadModal
          user={user}
          onClose={() => setShowUpload(false)}
          onCreated={(id) => {
            setShowUpload(false);
            toast({ title: 'Свидетельство создано', description: 'Перенаправляем…' });
            router.push(`/cert/${id}`);
            router.refresh();
          }}
        />
      )}
    </main>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="text-sm font-semibold text-foreground truncate">{value}</div>
    </div>
  );
}

function CertRow({ cert }: { cert: Cert }) {
  return (
    <div className="px-6 py-4 flex flex-wrap items-center gap-4 hover:bg-muted transition">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-xs font-semibold text-blue-600">
            № {cert.certNumber}
          </span>
          <span className="text-[10px] text-muted-foreground/70">
            {new Date(cert.createdAt).toLocaleDateString('ru-RU')}
          </span>
        </div>
        <div className="text-sm font-medium text-foreground truncate">{cert.workTitle}</div>
        <div className="font-mono text-[10px] text-muted-foreground truncate mt-0.5">
          MD5: {cert.md5Hash.slice(0, 32)}…
        </div>
      </div>
      <div className="flex items-center gap-2">
        <a
          href={`/api/download?id=${cert.id}`}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted transition"
          title="Скачать исходный архив"
        >
          <Download className="h-3.5 w-3.5" />
          Архив
        </a>
        <Link
          href={`/cert/${cert.id}`}
          className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-blue-700 transition"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Свидетельство
        </Link>
      </div>
    </div>
  );
}

function UploadModal({
  user,
  onClose,
  onCreated,
}: {
  user: User;
  onClose: () => void;
  onCreated: (id: string) => void;
}) {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [workTitle, setWorkTitle] = useState('');
  const [workType, setWorkType] = useState('text');
  const [description, setDescription] = useState('');
  const [coAuthors, setCoAuthors] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) setFile(f);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      toast({ title: 'Выберите файл', description: 'Прикрепите архив до 10 МБ', variant: 'destructive' });
      return;
    }
    if (!workTitle.trim()) {
      toast({ title: 'Укажите название', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('workTitle', workTitle);
      fd.append('workType', workType);
      fd.append('description', description);
      fd.append('coAuthors', coAuthors);

      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Ошибка загрузки');
      onCreated(data.certificate.id);
    } catch (e: any) {
      toast({ title: 'Ошибка', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h3 className="text-base font-semibold">Новое депонирование</h3>
          <button onClick={onClose} className="text-muted-foreground/70 hover:text-foreground text-xl leading-none">
            ×
          </button>
        </div>

        <form onSubmit={onSubmit} className="px-6 py-5 space-y-5">
          {/* File dropzone */}
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Архив с произведением (до 10 МБ)
            </label>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => document.getElementById('file-input')?.click()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
                dragOver
                  ? 'border-blue-500 bg-blue-50'
                  : file
                  ? 'border-green-400 bg-green-50'
                  : 'border-border hover:border-blue-300 hover:bg-muted'
              }`}
            >
              {file ? (
                <div>
                  <div className="text-sm font-medium text-foreground">{file.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {(file.size / 1024 / 1024).toFixed(2)} МБ
                  </div>
                </div>
              ) : (
                <div>
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground/70 mb-2" />
                  <div className="text-sm text-muted-foreground">
                    Перетащите архив сюда или нажмите для выбора
                  </div>
                  <div className="text-xs text-muted-foreground/70 mt-1">ZIP, RAR, 7Z · до 10 МБ</div>
                </div>
              )}
              <input
                id="file-input"
                type="file"
                className="hidden"
                accept=".zip,.rar,.7z,.tar,.gz"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </div>
          </div>

          {/* Work metadata */}
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Название произведения*
            </label>
            <input
              required
              value={workTitle}
              onChange={(e) => setWorkTitle(e.target.value)}
              placeholder="Например: «Сборник рассказов о Москве»"
              className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Тип произведения</label>
              <select
                value={workType}
                onChange={(e) => setWorkType(e.target.value)}
                className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring"
              >
                {WORK_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Соавторы</label>
              <input
                value={coAuthors}
                onChange={(e) => setCoAuthors(e.target.value)}
                placeholder="Иванов И.И., Петров П.П."
                className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Краткое описание
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="1-3 предложения о содержимом архива"
              rows={3}
              className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring resize-none"
            />
          </div>

          {/* Author info preview */}
          <div className="rounded-md bg-muted border border-border p-3 text-xs text-muted-foreground">
            <div className="font-semibold text-foreground mb-1">Автор свидетельства:</div>
            {user.lastName} {user.firstName} {user.middleName ?? ''} · {user.email}
            {user.city && <> · {user.city}</>}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading || !file}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition disabled:opacity-50 inline-flex items-center gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? 'Депонируем…' : 'Задепонировать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

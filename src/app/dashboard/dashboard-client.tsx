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
  X,
  Copy,
  Eye,
  EyeOff,
  Key,
  Files,
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
  slug: string;
  certNumber: string;
  workTitle: string;
  workType: string;
  archiveName: string;
  archiveSize: number;
  fileCount: number;
  md5Hash: string;
  sha256Hash: string;
  archivePassword: string;
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

const MAX_FILES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_TOTAL = 30 * 1024 * 1024; // 30 MB

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
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition"
        >
          <Plus className="h-4 w-4" />
          Задепонировать произведение
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Всего свидетельств" value={String(certificates.length)} icon={FileText} />
        <StatCard label="Email" value={user.email} icon={Fingerprint} />
        <StatCard label="Файлов задепонировано" value={String(certificates.reduce((s, c) => s + c.fileCount, 0))} icon={Files} />
      </div>

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
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition"
            >
              <Upload className="h-4 w-4" />
              Загрузить первые файлы
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
          onCreated={(slug) => {
            setShowUpload(false);
            toast({ title: 'Свидетельство создано', description: 'Перенаправляем…' });
            router.push(`/cert/${slug}`);
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
  const [showPwd, setShowPwd] = useState(false);
  const { toast } = useToast();

  const copyPwd = () => {
    navigator.clipboard.writeText(cert.archivePassword);
    toast({ title: 'Пароль скопирован', description: 'Пароль архива в буфере обмена' });
  };

  return (
    <div className="px-6 py-4 flex flex-wrap items-start gap-4 hover:bg-muted/50 transition">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-xs font-semibold text-primary">
            № {cert.certNumber}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {new Date(cert.createdAt).toLocaleString('ru-RU')}
          </span>
        </div>
        <div className="text-sm font-medium text-foreground truncate">{cert.workTitle}</div>
        <div className="flex flex-wrap items-center gap-3 mt-1.5">
          <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground font-mono">
            <Files className="h-3 w-3" />
            {cert.fileCount} {cert.fileCount === 1 ? 'файл' : cert.fileCount < 5 ? 'файла' : 'файлов'} · {(cert.archiveSize / 1024 / 1024).toFixed(2)} МБ
          </span>
          <span className="text-[10px] text-muted-foreground font-mono">
            MD5: {cert.md5Hash.slice(0, 16)}…
          </span>
        </div>
        {/* Password block */}
        <div className="mt-2 flex items-center gap-2 px-2.5 py-1.5 rounded bg-muted/60 border border-border">
          <Key className="h-3.5 w-3.5 text-amber-600 flex-shrink-0" />
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Пароль:</span>
          <code className="font-mono text-xs text-foreground">
            {showPwd ? cert.archivePassword : '••••••••••••'}
          </code>
          <button
            onClick={() => setShowPwd(!showPwd)}
            className="ml-1 p-1 rounded hover:bg-muted text-muted-foreground"
            title={showPwd ? 'Скрыть' : 'Показать'}
          >
            {showPwd ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
          </button>
          <button
            onClick={copyPwd}
            className="p-1 rounded hover:bg-muted text-muted-foreground"
            title="Скопировать"
          >
            <Copy className="h-3 w-3" />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <a
          href={`/api/download?slug=${cert.slug}`}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted transition"
          title="Скачать архив (с паролем)"
        >
          <Download className="h-3.5 w-3.5" />
          Архив
        </a>
        <Link
          href={`/cert/${cert.slug}`}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition"
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
  onCreated: (slug: string) => void;
}) {
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [workTitle, setWorkTitle] = useState('');
  const [workType, setWorkType] = useState('text');
  const [description, setDescription] = useState('');
  const [coAuthors, setCoAuthors] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const totalSize = files.reduce((s, f) => s + f.size, 0);

  function addFiles(newFiles: FileList | File[]) {
    const arr = Array.from(newFiles);
    const valid: File[] = [];
    const errors: string[] = [];
    for (const f of arr) {
      if (f.size > MAX_FILE_SIZE) {
        errors.push(`${f.name}: > 10 МБ`);
        continue;
      }
      valid.push(f);
    }
    if (errors.length) {
      toast({ title: 'Некоторые файлы отклонены', description: errors.join('; '), variant: 'destructive' });
    }
    const merged = [...files, ...valid].slice(0, MAX_FILES);
    if (merged.length === MAX_FILES && valid.length + files.length > MAX_FILES) {
      toast({ title: `Максимум ${MAX_FILES} файлов`, variant: 'destructive' });
    }
    setFiles(merged);
  }

  function removeFile(idx: number) {
    setFiles(files.filter((_, i) => i !== idx));
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!files.length) {
      toast({ title: 'Выберите файлы', description: `До ${MAX_FILES} файлов, каждый до 10 МБ`, variant: 'destructive' });
      return;
    }
    if (totalSize > MAX_TOTAL) {
      toast({ title: 'Слишком большой объём', description: `Суммарно ${(totalSize / 1024 / 1024).toFixed(2)} МБ, лимит 30 МБ`, variant: 'destructive' });
      return;
    }
    if (!workTitle.trim()) {
      toast({ title: 'Укажите название', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      for (const f of files) fd.append('files', f);
      fd.append('workTitle', workTitle);
      fd.append('workType', workType);
      fd.append('description', description);
      fd.append('coAuthors', coAuthors);

      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Ошибка загрузки');
      onCreated(data.certificate.slug);
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
        <div className="px-6 py-4 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
          <h3 className="text-base font-semibold text-foreground">Новое депонирование</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-xl leading-none">×</button>
        </div>

        <form onSubmit={onSubmit} className="px-6 py-5 space-y-5">
          {/* Multi-file dropzone */}
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Файлы произведения (до {MAX_FILES} шт., каждый до 10 МБ, суммарно до 30 МБ)
            </label>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => document.getElementById('file-input')?.click()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
                dragOver
                  ? 'border-primary bg-primary/5'
                  : files.length
                  ? 'border-green-500/50 bg-green-500/5'
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'
              }`}
            >
              {files.length === 0 ? (
                <div>
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <div className="text-sm text-foreground">Перетащите файлы сюда или нажмите для выбора</div>
                  <div className="text-xs text-muted-foreground mt-1">Любые файлы · до 5 шт · до 10 МБ каждый</div>
                </div>
              ) : (
                <div>
                  <Files className="h-6 w-6 mx-auto text-green-600 mb-2" />
                  <div className="text-sm font-medium text-foreground">{files.length} файл(ов) готов(ы) к депонированию</div>
                  <div className="text-xs text-muted-foreground mt-1">{(totalSize / 1024 / 1024).toFixed(2)} МБ всего</div>
                </div>
              )}
              <input
                id="file-input"
                type="file"
                multiple
                className="hidden"
                onChange={(e) => e.target.files && addFiles(e.target.files)}
              />
            </div>
            {/* File list */}
            {files.length > 0 && (
              <div className="mt-3 space-y-1.5">
                {files.map((f, idx) => (
                  <div key={idx} className="flex items-center gap-3 px-3 py-2 rounded bg-muted/40 border border-border">
                    <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-foreground truncate">{f.name}</div>
                      <div className="text-[10px] text-muted-foreground">{(f.size / 1024).toFixed(1)} КБ</div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                      className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-3 p-3 rounded bg-amber-500/5 border border-amber-500/20 text-[11px] text-amber-700 dark:text-amber-400">
              <Key className="inline h-3 w-3 mr-1" />
              Сервис автоматически создаст ZIP-архив с паролем (AES-256) и удалит оригинальные файлы.
              Пароль будет доступен только вам в личном кабинете.
            </div>
          </div>

          {/* Work metadata */}
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Название произведения*</label>
            <input
              required
              value={workTitle}
              onChange={(e) => setWorkTitle(e.target.value)}
              placeholder="Например: «Сборник рассказов о Москве»"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Тип произведения</label>
              <select
                value={workType}
                onChange={(e) => setWorkType(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring"
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
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Краткое описание</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="1-3 предложения о содержимом"
              rows={3}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring resize-none"
            />
          </div>

          <div className="rounded-md bg-muted/50 border border-border p-3 text-xs text-muted-foreground">
            <div className="font-semibold text-foreground mb-1">Автор свидетельства:</div>
            {user.lastName} {user.firstName} {user.middleName ?? ''} · {user.email}
            {user.city && <> · {user.city}</>}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading || !files.length}
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50 inline-flex items-center gap-2"
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

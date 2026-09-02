'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Search, ExternalLink, FileText } from 'lucide-react';

type Cert = {
  id: string;
  slug: string;
  certNumber: string;
  workTitle: string;
  workType: string;
  archiveSize: number;
  fileCount: number;
  md5Hash: string;
  authorFirstName: string;
  authorLastName: string;
  createdAt: Date;
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

export function RegistrySearch({ certs }: { certs: Cert[] }) {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filtered = certs.filter((c) => {
    const q = query.toLowerCase().trim();
    if (q) {
      const haystack = `${c.certNumber} ${c.workTitle} ${c.authorFirstName} ${c.authorLastName} ${c.md5Hash}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (typeFilter !== 'all' && c.workType !== typeFilter) return false;
    return true;
  });

  return (
    <>
      {/* Search bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Поиск по номеру, названию, автору или хешу…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-md border border-border bg-card pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-md border border-border bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary"
        >
          <option value="all">Все типы</option>
          <option value="text">Текст</option>
          <option value="image">Изображение</option>
          <option value="audio">Аудио</option>
          <option value="video">Видео</option>
          <option value="code">Код</option>
          <option value="collection">Сборник</option>
          <option value="other">Другое</option>
        </select>
      </div>

      {/* Results count */}
      <div className="text-xs text-muted-foreground mb-4">
        Найдено: {filtered.length} из {certs.length}
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {/* Header row */}
        <div className="hidden md:grid grid-cols-[120px_1fr_180px_100px_80px_60px] gap-4 px-5 py-3 border-b border-border text-[10px] font-bold tracking-wider uppercase text-muted-foreground">
          <div>Номер</div>
          <div>Произведение</div>
          <div>Автор</div>
          <div>Тип</div>
          <div>Размер</div>
          <div></div>
        </div>
        {/* Rows */}
        <div className="divide-y divide-border">
          {filtered.map((c) => (
            <Link
              key={c.id}
              href={`/cert/${c.slug}`}
              className="grid grid-cols-1 md:grid-cols-[120px_1fr_180px_100px_80px_60px] gap-2 md:gap-4 px-5 py-3.5 hover:bg-muted/50 transition items-center group"
            >
              <div className="font-mono text-xs font-semibold text-primary">
                № {c.certNumber}
              </div>
              <div>
                <div className="text-sm font-medium text-foreground truncate">{c.workTitle}</div>
                <div className="font-mono text-[10px] text-muted-foreground mt-0.5">
                  MD5: {c.md5Hash.slice(0, 24)}…
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                {c.authorLastName} {c.authorFirstName?.[0]}.
              </div>
              <div>
                <span className="inline-block rounded px-2 py-0.5 text-[10px] font-medium bg-primary/10 text-primary">
                  {WORK_TYPE_LABELS[c.workType] ?? c.workType}
                </span>
              </div>
              <div className="text-[11px] text-muted-foreground font-mono">
                {(c.archiveSize / 1024 / 1024).toFixed(1)} МБ
              </div>
              <div className="flex justify-end">
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-8 w-8 mx-auto text-muted-foreground/30 mb-2" />
          <p className="text-sm text-muted-foreground">Ничего не найдено</p>
        </div>
      )}
    </>
  );
}

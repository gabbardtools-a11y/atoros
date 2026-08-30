import { db } from '@/lib/db';

type Cert = Awaited<ReturnType<typeof db.certificate.findUnique>> & {};

function formatDate(iso: Date) {
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatDateTime(iso: Date) {
  return new Date(iso).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const WORK_TYPE_LABELS: Record<string, string> = {
  text: 'Текстовое произведение',
  image: 'Изображение / графика',
  audio: 'Аудиопроизведение',
  video: 'Видеопроизведение',
  code: 'Программный код',
  collection: 'Сборник',
  other: 'Другое',
};

export function CertificateView({
  cert,
  authorEmail,
}: {
  cert: Cert;
  authorEmail: string;
}) {
  if (!cert) return null;
  const authorFullName = `${cert.authorLastName} ${cert.authorFirstName}${
    cert.authorMiddleName ? ' ' + cert.authorMiddleName : ''
  }`;

  return (
    <div
      className="relative bg-white shadow-xl border border-slate-200"
      style={{ aspectRatio: '210 / 297', padding: '22mm 22mm 18mm 22mm' }}
    >
      {/* Background millimeter grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(158,201,242,0.5) 0.5px, transparent 0.5px), linear-gradient(to bottom, rgba(158,201,242,0.5) 0.5px, transparent 0.5px), linear-gradient(to right, rgba(135,187,240,0.95) 1px, transparent 1px), linear-gradient(to bottom, rgba(135,187,240,0.95) 1px, transparent 1px)',
          backgroundSize: '3.78px 3.78px, 3.78px 3.78px, 18.9px 18.9px, 18.9px 18.9px',
          backgroundPosition: '8mm 8mm',
          maskImage:
            'linear-gradient(to right, transparent 8mm, black 10mm, black calc(100% - 10mm), transparent calc(100% - 8mm)), linear-gradient(to bottom, transparent 8mm, black 10mm, black calc(100% - 10mm), transparent calc(100% - 8mm))',
          WebkitMaskComposite: 'source-in',
          maskComposite: 'intersect',
        }}
      />

      {/* Outer gold border */}
      <div className="absolute pointer-events-none" style={{ top: '8mm', left: '8mm', right: '8mm', bottom: '8mm', border: '1px solid #B08A3E' }} />
      <div className="absolute pointer-events-none" style={{ top: '10mm', left: '10mm', right: '10mm', bottom: '10mm', border: '0.8px solid #B08A3E' }} />

      {/* Corner ornaments: concentric quarter circles */}
      {[true, true, true, true].map((_, i) => {
        const pos =
          i === 0 ? { top: '8mm', left: '8mm' } :
          i === 1 ? { top: '8mm', right: '8mm', transform: 'scaleX(-1)' } :
          i === 2 ? { bottom: '8mm', left: '8mm', transform: 'scaleY(-1)' } :
          { bottom: '8mm', right: '8mm', transform: 'scale(-1,-1)' };
        return (
          <svg
            key={i}
            className="absolute pointer-events-none"
            style={{ width: '50mm', height: '50mm', ...pos }}
            viewBox="0 0 160 160"
          >
            {Array.from({ length: 30 }).map((_, idx) => {
              const r = 2.5 + idx * 2.5;
              const op = Math.max(0.05, 0.75 * (1 - (idx / 30) ** 0.7) + 0.03);
              const sw = Math.max(0.15, 0.5 - (idx / 30) * 0.4);
              return (
                <circle key={idx} cx="2" cy="2" r={r} fill="none" stroke="#B08A3E" strokeWidth={sw} opacity={op} />
              );
            })}
            <circle cx="2" cy="2" r="1.4" fill="#B08A3E" opacity="0.85" />
          </svg>
        );
      })}

      {/* Content */}
      <div className="relative h-full flex flex-col" style={{ zIndex: 10 }}>
        {/* Top bar */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-2xl tracking-tight" style={{ color: '#1D4ED8' }}>
              Atoros<span style={{ color: '#1D4ED8' }}>.</span>ru
            </span>
            <span className="text-[9px] font-semibold tracking-wide uppercase" style={{ color: '#B08A3E', borderLeft: '1px solid rgba(176,138,62,0.35)', paddingLeft: '8px', marginLeft: '4px' }}>
              Deposit<span style={{ color: '#1D4ED8', fontWeight: 700 }}>4</span>Copyright
            </span>
          </div>
          <div className="text-right">
            <div className="text-[8px] font-semibold tracking-wider uppercase text-slate-500 mb-1">
              Код верификации
            </div>
            <div
              className="inline-block px-2.5 py-1 rounded text-[11px] tracking-wider font-mono"
              style={{ color: '#1D4ED8', background: 'rgba(37,99,235,0.06)', border: '0.5px solid rgba(37,99,235,0.18)' }}
            >
              {cert.certNumber}
            </div>
          </div>
        </div>

        {/* Hero */}
        <div className="text-center mb-5">
          <div className="text-[9px] font-bold tracking-[4px] uppercase mb-2" style={{ color: '#1D4ED8' }}>
            <span className="inline-block w-7 h-px align-middle mr-3" style={{ background: 'rgba(37,99,235,0.35)' }} />
            Патентно-правовая организация ООО «Патентные Технологии» · Atoros.ru
            <span className="inline-block w-7 h-px align-middle ml-3" style={{ background: 'rgba(37,99,235,0.35)' }} />
          </div>
          <h1 className="text-5xl font-light tracking-wide mb-1" style={{ color: '#B08A3E' }}>
            СВИДЕТЕЛЬСТВО
          </h1>
          <div className="text-base text-slate-500 font-light">о депонировании произведения</div>
        </div>

        {/* Certificate number */}
        <div className="text-center mb-6">
          <div className="text-[9px] font-bold tracking-[3px] uppercase text-slate-500 mb-1.5">
            Серия · Номер
          </div>
          <div
            className="font-mono text-2xl tracking-wider"
            style={{
              color: '#1D4ED8',
              textShadow: '0 0 2px rgba(37,99,235,0.25)',
            }}
          >
            № {cert.certNumber}
          </div>
          <div className="w-16 h-px mx-auto mt-2" style={{ background: 'linear-gradient(90deg, transparent, #2563EB, transparent)' }} />
        </div>

        {/* Data section */}
        <div className="flex flex-col gap-3 flex-1">
          {/* Work title */}
          <div className="bg-white p-3.5 border-l-2 border-slate-200 relative" style={{ borderLeftColor: '#B08A3E', border: '0.5px solid rgba(15,23,42,0.1)', boxShadow: '0 1px 2px rgba(15,23,42,0.03)' }}>
            <div className="text-[8px] font-bold tracking-wider uppercase text-slate-500 mb-1">
              Название депонированного произведения
            </div>
            <div className="text-sm font-semibold" style={{ color: '#0B1220' }}>
              «{cert.workTitle}»
            </div>
            {cert.description && (
              <div className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                {cert.description}
              </div>
            )}
          </div>

          {/* Two-column: type + coAuthors */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-3.5 border-l-2" style={{ borderLeftColor: '#2563EB', border: '0.5px solid rgba(15,23,42,0.1)', boxShadow: '0 1px 2px rgba(15,23,42,0.03)' }}>
              <div className="text-[8px] font-bold tracking-wider uppercase text-slate-500 mb-1">
                Тип произведения
              </div>
              <div className="text-xs" style={{ color: '#0B1220' }}>
                <span style={{ color: '#1D4ED8', fontWeight: 600 }}>
                  {WORK_TYPE_LABELS[cert.workType] ?? cert.workType}
                </span>
              </div>
            </div>
            <div className="bg-white p-3.5 border-l-2" style={{ borderLeftColor: '#2563EB', border: '0.5px solid rgba(15,23,42,0.1)', boxShadow: '0 1px 2px rgba(15,23,42,0.03)' }}>
              <div className="text-[8px] font-bold tracking-wider uppercase text-slate-500 mb-1">
                Соавторы
              </div>
              <div className="text-xs" style={{ color: '#0B1220' }}>
                {cert.coAuthors ?? '—'}
              </div>
            </div>
          </div>

          {/* Author + date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-3.5 border-l-2" style={{ borderLeftColor: '#2563EB', border: '0.5px solid rgba(15,23,42,0.1)', boxShadow: '0 1px 2px rgba(15,23,42,0.03)' }}>
              <div className="text-[8px] font-bold tracking-wider uppercase text-slate-500 mb-1">
                Автор произведения
              </div>
              <div className="text-xs" style={{ color: '#0B1220' }}>
                <span style={{ color: '#1D4ED8', fontWeight: 700 }}>{authorFullName}</span>
                <br />
                Гражданство: {cert.authorCountry === 'RU' ? 'Российская Федерация (RU)' : cert.authorCountry}
                {cert.authorCity && <> · {cert.authorCity}</>}
              </div>
            </div>
            <div className="bg-white p-3.5 border-l-2" style={{ borderLeftColor: '#B08A3E', border: '0.5px solid rgba(15,23,42,0.1)', boxShadow: '0 1px 2px rgba(15,23,42,0.03)' }}>
              <div className="text-[8px] font-bold tracking-wider uppercase text-slate-500 mb-1">
                Дата депонирования
              </div>
              <div className="text-xs" style={{ color: '#0B1220' }}>
                <span style={{ color: '#B08A3E', fontWeight: 600 }}>{formatDate(cert.createdAt)}</span>
                <br />
                Архивный файл: <span className="font-mono text-[11px]">{cert.archiveName}</span>
              </div>
            </div>
          </div>

          {/* Depositing organization */}
          <div className="bg-white p-3.5 border-l-2" style={{ borderLeftColor: '#2563EB', border: '0.5px solid rgba(15,23,42,0.1)', boxShadow: '0 1px 2px rgba(15,23,42,0.03)' }}>
            <div className="text-[8px] font-bold tracking-wider uppercase text-slate-500 mb-1">
              Депонирующая организация
            </div>
            <div className="text-xs" style={{ color: '#0B1220' }}>
              <span style={{ color: '#1D4ED8', fontWeight: 700 }}>ООО «Патентные Технологии»</span> — сервис Atoros.ru
              <br />
              <span className="font-mono text-[10px] text-slate-500">
                ИНН 7716687757 · ОГРН 1117746321296
              </span>
              <br />
              <span className="font-mono text-[10px] text-slate-400">
                atoros.ru · info@atoros.ru · +7 (495) 369-13-14
              </span>
            </div>
          </div>

          {/* MD5 hash — prominent block */}
          <div
            className="p-3.5"
            style={{
              background: 'linear-gradient(135deg, rgba(37,99,235,0.04), rgba(37,99,235,0.01))',
              border: '0.5px solid rgba(37,99,235,0.18)',
              borderLeft: '2.5px solid #2563EB',
              borderRadius: '2px',
            }}
          >
            <div className="flex justify-between items-baseline mb-2">
              <div className="text-[10px] font-bold" style={{ color: '#0B1220' }}>
                MD5 <span className="text-[8.5px] font-medium" style={{ color: '#1D4ED8' }}>· RFC 1321 · хеш-сумма архивного файла</span>
              </div>
              <div className="font-mono text-[8px] text-slate-400">/ 01</div>
            </div>
            <div
              className="font-mono text-[10px] leading-relaxed px-2 py-1.5 rounded"
              style={{
                color: '#1D4ED8',
                background: 'rgba(37,99,235,0.05)',
                border: '0.5px solid rgba(37,99,235,0.18)',
                wordBreak: 'break-all',
                letterSpacing: '0.5px',
              }}
            >
              {cert.md5Hash}
            </div>
            <div className="font-mono text-[7px] text-slate-400 mt-1.5">
              <span className="uppercase tracking-wider text-slate-500 mr-1">Программа:</span>
              emn178.github.io/online-tools/md5_checksum.html
            </div>
          </div>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-2 gap-6 mt-4 pt-4 border-t" style={{ borderColor: 'rgba(15,23,42,0.1)' }}>
          <div>
            <div className="text-[8px] font-bold tracking-wider uppercase mb-0.5" style={{ color: '#1D4ED8' }}>
              Оформил · Депонировал
            </div>
            <div className="h-5 border-b border-dashed" style={{ borderColor: 'rgba(15,23,42,0.2)' }} />
            <div className="text-[11px] font-bold mt-1.5" style={{ color: '#0B1220' }}>
              Туленинов Н. Н.
            </div>
            <div className="text-[8.5px] text-slate-500 font-medium">Патентный поверенный № 1416</div>
            <div className="font-mono text-[7.5px] text-slate-400 mt-1">
              info@ptn.su<br />
              +7 (985) 938-38-72 · WhatsApp / Telegram
            </div>
          </div>
          <div>
            <div className="text-[8px] font-bold tracking-wider uppercase mb-0.5" style={{ color: '#1D4ED8' }}>
              Генеральный директор
            </div>
            <div className="h-5 border-b border-dashed" style={{ borderColor: 'rgba(15,23,42,0.2)' }} />
            <div className="text-[11px] font-bold mt-1.5" style={{ color: '#0B1220' }}>
              Беркутова Н. Н.
            </div>
            <div className="text-[8.5px] text-slate-500 font-medium">Патентный поверенный № 957</div>
            <div className="font-mono text-[7.5px] text-slate-400 mt-1">
              n.berkutova@mail.ru<br />
              +7 (916) 496-49-29
            </div>
          </div>
        </div>

        {/* Footer microtext */}
        <div className="font-mono text-[7px] text-slate-400 text-center mt-3 overflow-hidden whitespace-nowrap opacity-70">
          {cert.certNumber} · ООО ПАТЕНТНЫЕ ТЕХНОЛОГИИ · ИНН 7716687757 · ОГРН 1117746321296 · MD5 {cert.md5Hash.slice(0, 16)}… · {formatDateTime(cert.createdAt)} · {cert.certNumber} · ООО ПАТЕНТНЫЕ ТЕХНОЛОГИИ
        </div>
      </div>
    </div>
  );
}

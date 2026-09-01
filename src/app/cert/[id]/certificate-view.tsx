import { db } from '@/lib/db';

type Cert = NonNullable<Awaited<ReturnType<typeof db.certificate.findUnique>>>;

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

// Generate 53 concentric circles for one corner (matches original PDF certificate)
function CornerCircles() {
  const circles = [];
  // Central dot
  circles.push(
    <circle key="dot" cx="2" cy="2" r="1.4" fill="#B08A3E" opacity="0.9" />
  );
  // 52 concentric rings, radii from 2.5 to ~78mm
  const n_rings = 52;
  const max_radius = 78;
  const step = (max_radius - 2.5) / n_rings;
  for (let i = 0; i < n_rings; i++) {
    const r = 2.5 + i * step;
    const t = i / n_rings;
    const opacity = 0.75 * (1 - Math.pow(t, 0.7)) + 0.03;
    const sw = 0.5 - t * 0.4;
    circles.push(
      <circle
        key={i}
        cx="2"
        cy="2"
        r={r.toFixed(2)}
        fill="none"
        stroke="#B08A3E"
        strokeWidth={sw.toFixed(2)}
        opacity={opacity.toFixed(3)}
      />
    );
  }
  return <>{circles}</>;
}

// Round seal SVG (matches original PDF certificate)
function Seal() {
  return (
    <svg
      className="absolute pointer-events-none"
      style={{
        bottom: '58mm',
        right: '22mm',
        width: '38mm',
        height: '38mm',
        zIndex: 5,
        transform: 'rotate(-8deg)',
        opacity: 0.92,
      }}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <path id="seal-circle-top" d="M 100, 100 m -78, 0 a 78,78 0 1,1 156,0" fill="none" />
        <path id="seal-circle-bot" d="M 100, 100 m -78, 0 a 78,78 0 1,0 156,0" fill="none" />
      </defs>
      <circle cx="100" cy="100" r="92" fill="none" stroke="#1D4ED8" strokeWidth="1.2" opacity="0.7" />
      <circle cx="100" cy="100" r="88" fill="none" stroke="#1D4ED8" strokeWidth="0.5" opacity="0.45" />
      <circle cx="100" cy="100" r="62" fill="none" stroke="#1D4ED8" strokeWidth="0.8" opacity="0.6" />
      <circle cx="100" cy="100" r="58" fill="none" stroke="#1D4ED8" strokeWidth="0.4" opacity="0.4" />
      <text fontFamily="Manrope, sans-serif" fontSize="8.5" fontWeight="700" fill="#1D4ED8" letterSpacing="3" opacity="0.85">
        <textPath href="#seal-circle-top" startOffset="50%" textAnchor="middle">
          ООО ПАТЕНТНЫЕ ТЕХНОЛОГИИ
        </textPath>
      </text>
      <text fontFamily="Manrope, sans-serif" fontSize="6.5" fontWeight="600" fill="#1D4ED8" letterSpacing="2" opacity="0.7">
        <textPath href="#seal-circle-bot" startOffset="50%" textAnchor="middle">
          ДЕПОНИРОВАНИЕ · ВЕРИФИКАЦИЯ
        </textPath>
      </text>
      <g transform="translate(100,100)">
        <circle r="24" fill="rgba(37, 99, 235, 0.06)" stroke="#1D4ED8" strokeWidth="1.5" opacity="0.85" />
        <text x="0" y="8" fontFamily="Manrope, sans-serif" fontSize="30" fontWeight="800" fill="#1D4ED8" textAnchor="middle" opacity="0.9">C</text>
        <g fill="#1D4ED8" opacity="0.5">
          <circle cx="0" cy="-34" r="1.4" />
          <circle cx="0" cy="34" r="1.4" />
          <circle cx="-34" cy="0" r="1.4" />
          <circle cx="34" cy="0" r="1.4" />
        </g>
      </g>
      <g fill="#1D4ED8" opacity="0.5">
        <circle cx="22" cy="22" r="1.8" />
        <circle cx="178" cy="22" r="1.8" />
        <circle cx="22" cy="178" r="1.8" />
        <circle cx="178" cy="178" r="1.8" />
      </g>
    </svg>
  );
}

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

  // 4 corners positions
  const cornerStyle = (pos: 'tl' | 'tr' | 'bl' | 'br'): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: 'absolute',
      width: '80mm',
      height: '80mm',
      pointerEvents: 'none',
      zIndex: 3,
    };
    if (pos === 'tl') return { ...base, top: '8mm', left: '8mm' };
    if (pos === 'tr') return { ...base, top: '8mm', right: '8mm', transform: 'scaleX(-1)' };
    if (pos === 'bl') return { ...base, bottom: '8mm', left: '8mm', transform: 'scaleY(-1)' };
    return { ...base, bottom: '8mm', right: '8mm', transform: 'scale(-1, -1)' };
  };

  return (
    <>
      {/* ===== PAGE 1: MAIN CERTIFICATE ===== */}
      <div
        className="relative bg-white shadow-xl border border-slate-200 mb-6"
        style={{ aspectRatio: '210 / 297', padding: '22mm 22mm 18mm 22mm' }}
      >
        {/* Millimeter grid background */}
        <svg
          className="absolute pointer-events-none"
          style={{ top: 0, left: 0, right: 0, bottom: 0, zIndex: 1, opacity: 0.85 }}
          viewBox="0 0 794 1123"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="grid-minor" x="0" y="0" width="3.7795" height="3.7795" patternUnits="userSpaceOnUse">
              <path d="M 3.7795 0 L 0 0 0 3.7795" fill="none" stroke="rgba(158, 201, 242, 0.55)" strokeWidth="0.18" />
            </pattern>
            <pattern id="grid-major" x="0" y="0" width="18.8976" height="18.8976" patternUnits="userSpaceOnUse">
              <rect width="18.8976" height="18.8976" fill="url(#grid-minor)" />
              <path d="M 18.8976 0 L 0 0 0 18.8976" fill="none" stroke="rgba(135, 187, 240, 0.95)" strokeWidth="0.32" />
            </pattern>
            <clipPath id="grid-clip">
              <rect x="37.8" y="37.8" width="718.4" height="1047.4" />
            </clipPath>
          </defs>
          <rect x="37.8" y="37.8" width="718.4" height="1047.4" fill="url(#grid-major)" clipPath="url(#grid-clip)" />
        </svg>

        {/* Outer gold border + inner gold line */}
        <div className="absolute pointer-events-none" style={{ top: '8mm', left: '8mm', right: '8mm', bottom: '8mm', border: '1px solid #B08A3E', zIndex: 2 }} />
        <div className="absolute pointer-events-none" style={{ top: '10mm', left: '10mm', right: '10mm', bottom: '10mm', border: '0.8px solid #B08A3E', zIndex: 2 }} />

        {/* 4 Corner ornaments — concentric circles */}
        <svg style={cornerStyle('tl')} viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
          <CornerCircles />
        </svg>
        <svg style={cornerStyle('tr')} viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
          <CornerCircles />
        </svg>
        <svg style={cornerStyle('bl')} viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
          <CornerCircles />
        </svg>
        <svg style={cornerStyle('br')} viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
          <CornerCircles />
        </svg>

        {/* Round seal (bottom-right area) */}
        <Seal />

        {/* Content */}
        <div className="relative h-full flex flex-col" style={{ zIndex: 10 }}>
          {/* Top bar */}
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-2xl tracking-tight" style={{ color: '#1D4ED8' }}>
                Atoros<span style={{ color: '#1D4ED8' }}>.</span>ru
              </span>
              <span
                className="text-[9px] font-semibold tracking-wide uppercase"
                style={{ color: '#B08A3E', borderLeft: '1px solid rgba(176,138,62,0.35)', paddingLeft: '8px', marginLeft: '4px' }}
              >
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
              style={{ color: '#1D4ED8', textShadow: '0 0 2px rgba(37,99,235,0.25)' }}
            >
              № {cert.certNumber}
            </div>
            <div className="w-16 h-px mx-auto mt-2" style={{ background: 'linear-gradient(90deg, transparent, #2563EB, transparent)' }} />
          </div>

          {/* Data section */}
          <div className="flex flex-col gap-3 flex-1">
            {/* Work title */}
            <div className="bg-white p-3.5 relative" style={{ borderLeft: '2.5px solid #B08A3E', border: '0.5px solid rgba(15,23,42,0.1)', boxShadow: '0 1px 2px rgba(15,23,42,0.03)' }}>
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

            {/* Type + coAuthors */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-3.5" style={{ borderLeft: '2.5px solid #2563EB', border: '0.5px solid rgba(15,23,42,0.1)', boxShadow: '0 1px 2px rgba(15,23,42,0.03)' }}>
                <div className="text-[8px] font-bold tracking-wider uppercase text-slate-500 mb-1">
                  Тип произведения
                </div>
                <div className="text-xs" style={{ color: '#0B1220' }}>
                  <span style={{ color: '#1D4ED8', fontWeight: 600 }}>
                    {WORK_TYPE_LABELS[cert.workType] ?? cert.workType}
                  </span>
                </div>
              </div>
              <div className="bg-white p-3.5" style={{ borderLeft: '2.5px solid #2563EB', border: '0.5px solid rgba(15,23,42,0.1)', boxShadow: '0 1px 2px rgba(15,23,42,0.03)' }}>
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
              <div className="bg-white p-3.5" style={{ borderLeft: '2.5px solid #2563EB', border: '0.5px solid rgba(15,23,42,0.1)', boxShadow: '0 1px 2px rgba(15,23,42,0.03)' }}>
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
              <div className="bg-white p-3.5" style={{ borderLeft: '2.5px solid #B08A3E', border: '0.5px solid rgba(15,23,42,0.1)', boxShadow: '0 1px 2px rgba(15,23,42,0.03)' }}>
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
            <div className="bg-white p-3.5" style={{ borderLeft: '2.5px solid #2563EB', border: '0.5px solid rgba(15,23,42,0.1)', boxShadow: '0 1px 2px rgba(15,23,42,0.03)' }}>
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
                info@atoros.ru<br />
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

      {/* ===== PAGE 2: TECHNICAL VERIFICATION ===== */}
      <div
        className="relative bg-white shadow-xl border border-slate-200"
        style={{ aspectRatio: '210 / 297', padding: '22mm 22mm 18mm 22mm' }}
      >
        {/* Millimeter grid */}
        <svg
          className="absolute pointer-events-none"
          style={{ top: 0, left: 0, right: 0, bottom: 0, zIndex: 1, opacity: 0.85 }}
          viewBox="0 0 794 1123"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="grid-minor2" x="0" y="0" width="3.7795" height="3.7795" patternUnits="userSpaceOnUse">
              <path d="M 3.7795 0 L 0 0 0 3.7795" fill="none" stroke="rgba(158, 201, 242, 0.55)" strokeWidth="0.18" />
            </pattern>
            <pattern id="grid-major2" x="0" y="0" width="18.8976" height="18.8976" patternUnits="userSpaceOnUse">
              <rect width="18.8976" height="18.8976" fill="url(#grid-minor2)" />
              <path d="M 18.8976 0 L 0 0 0 18.8976" fill="none" stroke="rgba(135, 187, 240, 0.95)" strokeWidth="0.32" />
            </pattern>
            <clipPath id="grid-clip-2">
              <rect x="37.8" y="37.8" width="718.4" height="1047.4" />
            </clipPath>
          </defs>
          <rect x="37.8" y="37.8" width="718.4" height="1047.4" fill="url(#grid-major2)" clipPath="url(#grid-clip-2)" />
        </svg>

        {/* Gold borders */}
        <div className="absolute pointer-events-none" style={{ top: '8mm', left: '8mm', right: '8mm', bottom: '8mm', border: '1px solid #B08A3E', zIndex: 2 }} />
        <div className="absolute pointer-events-none" style={{ top: '10mm', left: '10mm', right: '10mm', bottom: '10mm', border: '0.8px solid #B08A3E', zIndex: 2 }} />

        {/* 4 corners on page 2 */}
        <svg style={cornerStyle('tl')} viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
          <CornerCircles />
        </svg>
        <svg style={cornerStyle('tr')} viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
          <CornerCircles />
        </svg>
        <svg style={cornerStyle('bl')} viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
          <CornerCircles />
        </svg>
        <svg style={cornerStyle('br')} viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
          <CornerCircles />
        </svg>

        {/* Content */}
        <div className="relative h-full flex flex-col" style={{ zIndex: 10 }}>
          {/* Top bar */}
          <div className="flex justify-between items-start pb-3 border-b" style={{ borderColor: 'rgba(15,23,42,0.1)', marginBottom: '6mm' }}>
            <div>
              <div className="text-[9px] font-bold tracking-[3.6px] uppercase mb-1" style={{ color: '#1D4ED8' }}>
                Приложение к свидетельству
              </div>
              <div className="font-bold text-lg" style={{ color: '#0B1220' }}>
                Техническая верификация
              </div>
            </div>
            <div className="text-right font-mono text-[10px] text-slate-500">
              <div>Свидетельство</div>
              <div className="text-xs font-medium" style={{ color: '#1D4ED8' }}>
                № {cert.certNumber}
              </div>
              <div className="mt-1 text-slate-400">ID: {cert.certNumber}</div>
            </div>
          </div>

          {/* Description */}
          <div
            className="p-3.5 mb-4 text-[10.5px] leading-relaxed"
            style={{
              background: 'linear-gradient(135deg, rgba(176,138,62,0.05), rgba(37,99,235,0.02))',
              border: '0.5px solid rgba(15,23,42,0.1)',
              borderLeft: '2.5px solid #B08A3E',
              borderRadius: '2px',
              color: '#2E3A52',
            }}
          >
            <strong style={{ color: '#0B1220' }}>Все объекты авторского права</strong> по настоящему свидетельству помещены в архивный файл{' '}
            <strong>«{cert.archiveName}»</strong>, для которого с целью верификации вычислена хеш-сумма (уникальный цифровой отпечаток файла) по алгоритму MD5.
            Содержимое файла не подлежит изменению; изменение файла недоступно автору(ам). В случае изменения содержимого архивного файла автоматически изменятся дата публикации и его хеш-сумма.
          </div>

          {/* Two columns: hash + QR */}
          <div className="grid gap-3 flex-1" style={{ gridTemplateColumns: '1fr 56mm' }}>
            {/* Hash card */}
            <div
              className="p-3.5"
              style={{
                background: 'white',
                border: '0.5px solid rgba(15,23,42,0.1)',
                borderLeft: '2.5px solid #2563EB',
                borderRadius: '2px',
                boxShadow: '0 1px 2px rgba(15,23,42,0.03)',
              }}
            >
              <div className="flex justify-between items-baseline mb-2">
                <div className="text-[11px] font-bold" style={{ color: '#0B1220' }}>
                  MD5 <span className="text-[8.5px] font-medium" style={{ color: '#1D4ED8' }}>· RFC 1321 · хеш-сумма архивного файла</span>
                </div>
                <div className="font-mono text-[8px] text-slate-400">/ 01</div>
              </div>
              <div
                className="font-mono text-[9px] leading-relaxed px-2 py-1.5 rounded"
                style={{
                  color: '#1D4ED8',
                  background: 'rgba(37,99,235,0.05)',
                  border: '0.5px solid rgba(37,99,235,0.18)',
                  wordBreak: 'break-all',
                }}
              >
                {cert.md5Hash}
              </div>
              <div className="font-mono text-[7px] text-slate-400 mt-2">
                <span className="uppercase tracking-wider text-slate-500 mr-1">Веб-интерфейс:</span>
                emn178.github.io/online-tools/md5_checksum.html
              </div>
            </div>

            {/* QR verification panel */}
            <div
              className="p-3 flex flex-col items-center text-center"
              style={{
                background: 'linear-gradient(180deg, rgba(37,99,235,0.06), rgba(37,99,235,0.02))',
                border: '0.5px solid rgba(37,99,235,0.18)',
                borderLeft: '2.5px solid #2563EB',
                borderRadius: '3px',
                boxShadow: '0 2px 8px rgba(37,99,235,0.08)',
              }}
            >
              <div className="text-[8px] font-bold tracking-[2.4px] uppercase mb-3" style={{ color: '#1D4ED8' }}>
                Онлайн-верификация
              </div>
              {/* QR code placeholder — actual QR generated client-side via api/qrcode */}
              <div
                className="mb-3 flex items-center justify-center"
                style={{
                  width: '42mm',
                  height: '42mm',
                  background: 'white',
                  padding: '2mm',
                  borderRadius: '3px',
                  border: '0.5px solid rgba(15,23,42,0.1)',
                  boxShadow: '0 2px 6px rgba(15,23,42,0.08)',
                }}
              >
                <img
                  src={`/api/qrcode?data=${encodeURIComponent(`https://atoros.ru/cert/${cert.id}`)}`}
                  alt="QR код"
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
              <div className="text-[9.5px] mb-2" style={{ color: '#2E3A52' }}>
                Просканируйте QR-код для перехода на страницу верификации свидетельства
              </div>
              <div
                className="font-mono text-[8px] font-medium px-2.5 py-1 rounded w-full"
                style={{
                  color: 'white',
                  background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                  textAlign: 'center',
                }}
              >
                atoros.ru/cert/{cert.id.slice(-8)}
              </div>
            </div>
          </div>

          {/* Download links */}
          <div className="mt-4 pt-3 border-t" style={{ borderColor: 'rgba(15,23,42,0.1)' }}>
            <div className="text-[8px] font-bold tracking-[2.4px] uppercase mb-2" style={{ color: '#1D4ED8' }}>
              Верифицированная копия файла с депонированной информацией
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 bg-white rounded" style={{ border: '0.5px solid rgba(15,23,42,0.1)', boxShadow: '0 1px 2px rgba(15,23,42,0.03)' }}>
                <div className="text-[9px] font-bold mb-1" style={{ color: '#1D4ED8' }}>Скачать архив</div>
                <div className="font-mono text-[7px] text-slate-500 mb-1">{cert.archiveName}</div>
                <a
                  href={`/api/download?id=${cert.id}`}
                  className="text-[8px] font-medium underline"
                  style={{ color: '#1D4ED8' }}
                >
                  Скачать
                </a>
              </div>
              <div className="p-2.5 bg-white rounded" style={{ border: '0.5px solid rgba(15,23,42,0.1)', boxShadow: '0 1px 2px rgba(15,23,42,0.03)' }}>
                <div className="text-[9px] font-bold mb-1" style={{ color: '#1D4ED8' }}>Размер</div>
                <div className="font-mono text-[7px] text-slate-500">{(cert.archiveSize / 1024 / 1024).toFixed(2)} МБ</div>
              </div>
              <div className="p-2.5 bg-white rounded" style={{ border: '0.5px solid rgba(15,23,42,0.1)', boxShadow: '0 1px 2px rgba(15,23,42,0.03)' }}>
                <div className="text-[9px] font-bold mb-1" style={{ color: '#1D4ED8' }}>Опубликовано</div>
                <div className="font-mono text-[7px] text-slate-500">{formatDate(cert.createdAt)}</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 pt-2 border-t flex justify-between items-end text-[8px] text-slate-500" style={{ borderColor: 'rgba(15,23,42,0.1)' }}>
            <div className="font-mono text-[7.5px] text-slate-400">
              <span className="uppercase tracking-wider text-slate-500 text-[7px] block mb-0.5">Дата депонирования</span>
              <span style={{ color: '#1D4ED8', fontWeight: 600 }}>{formatDate(cert.createdAt)}</span>
            </div>
            <div className="text-right">
              <div className="font-bold text-slate-700 text-[9.5px] mb-0.5">ООО «Патентные Технологии»</div>
              <div className="font-mono text-[7px] text-slate-400">
                ИНН 7716687757 · ОГРН 1117746321296<br />
                +7 (495) 369-13-14 · info@atoros.ru
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

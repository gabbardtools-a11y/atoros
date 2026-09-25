import Link from 'next/link';
import { Check, X, Cloud, Lock, Hash, Eye, Network, Clock } from 'lucide-react';

export function ComparisonTable() {
  const features = [
    { name: 'Четверная фиксация даты (ФНС + Яндекс + Google + сервер)', atoros: true, ireg: 'Только сервер', nris: 'Только сервер' },
    { name: 'Квалифицированная метка времени ФНС (RFC 3161, ГОСТ Р 34.11-2012)', atoros: true, ireg: 'CryptoPro (платно)', nris: 'CryptoPro (платно)' },
    { name: 'Шифрование AES-256', atoros: true, ireg: 'Шифрование на сервере', nris: 'ЭЦП КриптоПро' },
    { name: 'Хеш-суммы MD5 + SHA-256 + ГОСТ Р 34.11-2012', atoros: true, ireg: false, nris: false },
    { name: 'Децентрализованное хранение через торрент-сеть', atoros: true, ireg: false, nris: false },
    { name: 'Публичный реестр свидетельств', atoros: true, ireg: 'Закрытый реестр', nris: 'Закрытый реестр' },
    { name: 'Ссылки на облачные копии в свидетельстве', atoros: true, ireg: false, nris: false },
    { name: 'Проверка свидетельства без регистрации', atoros: true, ireg: false, nris: false },
    { name: 'Депонирование ноу-хау (секретов производства)', atoros: true, ireg: true, nris: false },
    { name: 'QR-код для верификации', atoros: true, ireg: false, nris: false },
    { name: 'Magnet-ссылка и .torrent файл в свидетельстве', atoros: true, ireg: false, nris: false },
    { name: 'Тестовый режим — бесплатно', atoros: true, ireg: 'Платно от первого депонирования', nris: 'От 1 490 ₽' },
    { name: 'Время получения свидетельства', atoros: 'Мгновенно', ireg: 'До 15 мин (менеджер)', nris: 'Мгновенно' },
  ];

  return (
    <section className="py-20 bg-muted/30 border-t border-border">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="text-center mb-12">
          <div className="text-xs font-bold tracking-widest uppercase text-primary mb-2">
            Сравнение
          </div>
          <h2 className="text-3xl font-semibold text-foreground mb-3">
            Чем Atoros отличается от других
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Главная разница: Atoros хранит ваш архив одновременно в пяти независимых местах — ФНС, Яндекс.Диск, Google Drive, atoros.ru и торрент-сеть. Конкуренты держат файл только на своём сервере.
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-card">
                <th className="text-left p-4 font-semibold text-foreground">Возможность</th>
                <th className="text-center p-4 font-bold text-primary min-w-[100px]">
                  <div className="text-base">Atoros</div>
                  <div className="text-[10px] font-normal text-muted-foreground">atoros.ru</div>
                </th>
                <th className="text-center p-4 font-medium text-muted-foreground min-w-[100px]">
                  <div className="text-sm">iReg</div>
                  <div className="text-[10px] font-normal">ireg.pro</div>
                </th>
                <th className="text-center p-4 font-medium text-muted-foreground min-w-[100px]">
                  <div className="text-sm">n'RIS</div>
                  <div className="text-[10px] font-normal">nris.ru</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((f, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-card/50' : ''}>
                  <td className="p-4 text-muted-foreground">{f.name}</td>
                  <td className="p-4 text-center">
                    {f.atoros === true ? (
                      <Check className="h-5 w-5 text-green-600 mx-auto" />
                    ) : (
                      <span className="text-xs font-medium text-primary">{f.atoros}</span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    {f.ireg === true ? (
                      <Check className="h-5 w-5 text-green-600 mx-auto" />
                    ) : f.ireg === false ? (
                      <X className="h-4 w-4 text-muted-foreground/40 mx-auto" />
                    ) : (
                      <span className="text-xs text-muted-foreground">{f.ireg}</span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    {f.nris === true ? (
                      <Check className="h-5 w-5 text-green-600 mx-auto" />
                    ) : f.nris === false ? (
                      <X className="h-4 w-4 text-muted-foreground/40 mx-auto" />
                    ) : (
                      <span className="text-xs text-muted-foreground">{f.nris}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Key advantages */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <div className="p-5 rounded-lg border-2 border-primary/30 bg-primary/5">
            <Network className="h-6 w-6 text-primary mb-3" />
            <div className="text-sm font-semibold text-foreground mb-1">Торрент-сеть — Killer Feature</div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Архив автоматически добавляется в торрент-сеть. Файл хранится децентрализованно — даже если Atoros исчезнет, он останется у пиров. Magnet-ссылка и .torrent файл публикуются прямо в свидетельстве. Ни у одного конкурента этого нет.
            </p>
          </div>
          <div className="p-5 rounded-lg border border-primary/20 bg-primary/5">
            <Clock className="h-6 w-6 text-primary mb-3" />
            <div className="text-sm font-semibold text-foreground mb-1">Метка времени ФНС</div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Квалифицированная метка доверенного времени по ГОСТ Р 34.11-2012, подписанная ФНС. Принимается судами в силу ФЗ-63, без технической экспертизы. У конкурентов — только CryptoPro (платно, требует экспертизы).
            </p>
          </div>
          <div className="p-5 rounded-lg border border-primary/20 bg-primary/5">
            <Cloud className="h-6 w-6 text-primary mb-3" />
            <div className="text-sm font-semibold text-foreground mb-1">Пять независимых хранилищ</div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Файл хранится одновременно: сервер Atoros, Яндекс.Диск, Google Drive, торрент-сеть. Дата фиксируется ФНС, Яндексом, Google и atoros.ru независимо. Подделать все пять — практически невозможно.
            </p>
          </div>
        </div>

        <div className="text-center mt-10">
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition"
          >
            Попробовать бесплатно
          </Link>
        </div>
      </div>
    </section>
  );
}

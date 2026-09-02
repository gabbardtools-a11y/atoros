'use client';
import { Printer, FileDown } from 'lucide-react';

export function PrintButtons({ certId }: { certId: string }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex items-center gap-3">
      <a
        href={`/cert/${certId}/pdf`}
        className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium hover:bg-muted transition"
      >
        <FileDown className="h-3.5 w-3.5" />
        Скачать PDF
      </a>
      <button
        type="button"
        onClick={handlePrint}
        className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium hover:bg-muted transition"
      >
        <Printer className="h-3.5 w-3.5" />
        Печать
      </button>
    </div>
  );
}

'use client';
import { Printer, FileCheck2 } from 'lucide-react';

export function PrintButtons({ certId }: { certId: string }) {
  const handlePrint = () => {
    // Add print-only CSS to hide everything except certificate
    const style = document.createElement('style');
    style.id = 'cert-print-style';
    style.textContent = `
      @media print {
        @page { size: A4; margin: 0; }
        body * { visibility: hidden; }
        body main > div > div { visibility: visible; position: absolute; left: 0; top: 0; width: 100%; }
        body main > div > div.print-target, body main > div > div.print-target * { visibility: visible; }
        .print\\:hidden { display: none !important; }
      }
    `;
    if (!document.getElementById('cert-print-style')) {
      document.head.appendChild(style);
    }
    window.print();
  };

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handlePrint}
        className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium hover:bg-muted transition"
      >
        <Printer className="h-3.5 w-3.5" />
        Скачать PDF
      </button>
    </div>
  );
}

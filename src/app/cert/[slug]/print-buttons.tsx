'use client';
import { Printer, Loader2 } from 'lucide-react';
import { useState } from 'react';

export function PrintButtons({ certSlug }: { certSlug: string }) {
  const [loading, setLoading] = useState(false);

  const handlePrint = async () => {
    setLoading(true);
    try {
      // Open the print-mode version in a new window
      const printUrl = `/cert/${certSlug}?print=true`;
      const printWindow = window.open(printUrl, '_blank', 'width=1024,height=720');

      if (!printWindow) {
        alert('Разрешите всплывающие окна для этого сайта, чтобы скачать PDF.');
        setLoading(false);
        return;
      }

      // Wait for the new window to load, then trigger print
      printWindow.addEventListener('load', () => {
        setTimeout(() => {
          printWindow.focus();
          printWindow.print();
        }, 800);
      });
    } catch (e) {
      alert('Не удалось открыть печатную версию. Попробуйте обновить страницу.');
    } finally {
      setTimeout(() => setLoading(false), 1500);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handlePrint}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium hover:bg-muted transition disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Printer className="h-3.5 w-3.5" />}
        Скачать PDF
      </button>
    </div>
  );
}

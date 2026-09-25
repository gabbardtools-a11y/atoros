'use client';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // next-themes requires mount flag to avoid hydration mismatch
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Use resolved theme only after mount to avoid hydration mismatch
  const isDark = mounted && theme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="Переключить тему"
      title="Переключить тему"
      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-foreground transition hover:bg-muted"
    >
      {mounted ? (
        isDark ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )
      ) : (
        // Static placeholder before mount — same on server and client
        <Moon className="h-4 w-4 opacity-0" />
      )}
    </button>
  );
}

'use client';
import { useState } from 'react';
import { HeroAnimation } from './hero-animation';
import { HeroControls, DEFAULT_CONFIG, type HeroConfig } from './hero-controls';

export function HeroWithControls() {
  const [config, setConfig] = useState<HeroConfig>(DEFAULT_CONFIG);

  const handleChange = (next: Partial<HeroConfig>) => {
    setConfig((prev) => ({ ...prev, ...next }));
  };

  return (
    <>
      <HeroAnimation config={config} />
      <HeroControls config={config} onChange={handleChange} />
    </>
  );
}

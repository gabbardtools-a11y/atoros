'use client';
import { useState } from 'react';

export type HeroConfig = {
  shape: 'icosahedron' | 'tetrahedron' | 'octahedron' | 'dodecahedron' | 'box' | 'sphere' | 'torus-knot';
  detail: number;
  speed: number;
  displacement: number;
  wireframe: boolean;
  brightness: number;
  scale: number;
  attractionEnabled: boolean;
  attractionRadius: number;
  attractionStrength: number;
  flashEnabled: boolean;
  flashRadius: number;
  flashIntensity: number;
  flashColor: string;
};

export const DEFAULT_CONFIG: HeroConfig = {
  shape: 'icosahedron',
  detail: 2,
  speed: 0.3,
  displacement: 0.5,
  wireframe: true,
  brightness: 0.5,
  scale: 1.0,
  attractionEnabled: true,
  attractionRadius: 2.0,
  attractionStrength: 0.5,
  flashEnabled: true,
  flashRadius: 0.5,
  flashIntensity: 0.8,
  flashColor: '#F472B6',
};

const SHAPES: { value: HeroConfig['shape']; label: string }[] = [
  { value: 'icosahedron', label: 'Икосаэдр (20 гран.)' },
  { value: 'tetrahedron', label: 'Тетраэдр (4 грани)' },
  { value: 'octahedron', label: 'Октаэдр (8 граней)' },
  { value: 'dodecahedron', label: 'Додекаэдр (12 гран.)' },
  { value: 'box', label: 'Куб' },
  { value: 'sphere', label: 'Сфера' },
  { value: 'torus-knot', label: 'Тор-узел' },
];

const FLASH_PRESETS = ['#ffffff', '#38bdf8', '#fbbf24', '#f472b6', '#a3e635'];

export function HeroControls({
  config,
  onChange,
}: {
  config: HeroConfig;
  onChange: (next: Partial<HeroConfig>) => void;
}) {
  const [collapsed, setCollapsed] = useState(true);

  const set = <K extends keyof HeroConfig>(key: K, value: HeroConfig[K]) =>
    onChange({ [key]: value });

  return (
    <>
      <div
        style={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 50,
          width: 320,
          maxHeight: 'calc(100vh - 32px)',
          overflowY: 'auto',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid #e4e4e7',
          borderRadius: 16,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          color: '#18181b',
          display: collapsed ? 'none' : 'block',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderBottom: '1px solid #e4e4e7',
            position: 'sticky',
            top: 0,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Настройки сцены</h3>
          <button
            onClick={() => setCollapsed(true)}
            aria-label="Свернуть панель"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#71717a',
              cursor: 'pointer',
              padding: 4,
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Shape */}
          <Field label="Форма геометрии">
            <select
              value={config.shape}
              onChange={(e) => set('shape', e.target.value as HeroConfig['shape'])}
              style={selectStyle}
            >
              {SHAPES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </Field>

          {/* Detail */}
          <Field
            label="Детализация"
            value={String(config.detail)}
            hint="0 = острые вершины · 8 = гладкая сфера"
          >
            <input
              type="range"
              min={0}
              max={8}
              step={1}
              value={config.detail}
              onChange={(e) => set('detail', +e.target.value)}
              style={rangeStyle}
            />
          </Field>

          {/* Speed */}
          <Field
            label="Скорость анимации"
            value={`${config.speed.toFixed(2)}×`}
            hint="0.5 = в 2 раза медленнее оригинала"
          >
            <input
              type="range"
              min={0.1}
              max={2}
              step={0.05}
              value={config.speed}
              onChange={(e) => set('speed', +e.target.value)}
              style={rangeStyle}
            />
          </Field>

          {/* Displacement */}
          <Field
            label="Амплитуда деформации"
            value={config.displacement.toFixed(2)}
            hint="0 = нет деформации · 0.28 = оригинал"
          >
            <input
              type="range"
              min={0}
              max={0.6}
              step={0.02}
              value={config.displacement}
              onChange={(e) => set('displacement', +e.target.value)}
              style={rangeStyle}
            />
          </Field>

          {/* Wireframe */}
          <SwitchRow
            label="Каркас (wireframe)"
            checked={config.wireframe}
            onChange={(v) => set('wireframe', v)}
          />

          {/* Brightness */}
          <Field
            label="Общая яркость"
            value={`${Math.round(config.brightness * 100)}%`}
            hint="0 = невидимая · 1 = полная яркость"
          >
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={config.brightness}
              onChange={(e) => set('brightness', +e.target.value)}
              style={rangeStyle}
            />
          </Field>

          {/* Scale */}
          <Field
            label="Общий размер"
            value={config.scale.toFixed(2) + '×'}
            hint="0.5 = меньше · 2 = больше"
          >
            <input
              type="range"
              min={0.3}
              max={2.5}
              step={0.05}
              value={config.scale}
              onChange={(e) => set('scale', +e.target.value)}
              style={rangeStyle}
            />
          </Field>

          {/* Attraction section */}
          <SectionDivider>
            <SwitchRow
              label="Притяжение вершин к курсору"
              labelBold
              checked={config.attractionEnabled}
              onChange={(v) => set('attractionEnabled', v)}
            />
            <div style={{ marginTop: 12 }}>
              <Field
                label="Радиус притяжения"
                value={config.attractionRadius.toFixed(2)}
                hint="1.0 ≈ радиус фигуры · 3.0 = вся фигура реагирует"
                disabled={!config.attractionEnabled}
              >
                <input
                  type="range"
                  min={0.2}
                  max={3}
                  step={0.05}
                  value={config.attractionRadius}
                  disabled={!config.attractionEnabled}
                  onChange={(e) => set('attractionRadius', +e.target.value)}
                  style={{ ...rangeStyle, opacity: config.attractionEnabled ? 1 : 0.4 }}
                />
              </Field>
            </div>
            <div style={{ marginTop: 12 }}>
              <Field
                label="Сила притяжения"
                value={config.attractionStrength.toFixed(2)}
                hint="0 = нет подтягивания · 1 = вершина в точке курсора"
                disabled={!config.attractionEnabled}
              >
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.02}
                  value={config.attractionStrength}
                  disabled={!config.attractionEnabled}
                  onChange={(e) => set('attractionStrength', +e.target.value)}
                  style={{ ...rangeStyle, opacity: config.attractionEnabled ? 1 : 0.4 }}
                />
              </Field>
            </div>
          </SectionDivider>

          {/* Flash section */}
          <SectionDivider>
            <SwitchRow
              label="Вспышка граней при наведении"
              labelBold
              checked={config.flashEnabled}
              onChange={(v) => set('flashEnabled', v)}
            />
            <div style={{ marginTop: 12 }}>
              <Field
                label="Радиус вспышки"
                value={config.flashRadius.toFixed(2)}
                hint="0.25 = 25% экрана · 1.0 = вся видимая фигура"
                disabled={!config.flashEnabled}
              >
                <input
                  type="range"
                  min={0.05}
                  max={1}
                  step={0.01}
                  value={config.flashRadius}
                  disabled={!config.flashEnabled}
                  onChange={(e) => set('flashRadius', +e.target.value)}
                  style={{ ...rangeStyle, opacity: config.flashEnabled ? 1 : 0.4 }}
                />
              </Field>
            </div>
            <div style={{ marginTop: 12 }}>
              <Field
                label="Интенсивность вспышки"
                value={config.flashIntensity.toFixed(2)}
                hint="0 = тусклая · 1 = очень яркая вспышка"
                disabled={!config.flashEnabled}
              >
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.02}
                  value={config.flashIntensity}
                  disabled={!config.flashEnabled}
                  onChange={(e) => set('flashIntensity', +e.target.value)}
                  style={{ ...rangeStyle, opacity: config.flashEnabled ? 1 : 0.4 }}
                />
              </Field>
            </div>
            <div style={{ marginTop: 12 }}>
              <Field label="Цвет вспышки" disabled={!config.flashEnabled}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                  <input
                    type="color"
                    value={config.flashColor}
                    disabled={!config.flashEnabled}
                    onChange={(e) => set('flashColor', e.target.value)}
                    style={{
                      width: 48,
                      height: 32,
                      border: '1px solid #e4e4e7',
                      borderRadius: 6,
                      cursor: 'pointer',
                      background: 'transparent',
                      opacity: config.flashEnabled ? 1 : 0.4,
                    }}
                  />
                  <span style={valueStyle}>{config.flashColor.toUpperCase()}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6, marginTop: 8 }}>
                  {FLASH_PRESETS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => set('flashColor', c)}
                      style={{
                        height: 28,
                        background: c,
                        border: '1px solid #e4e4e7',
                        borderRadius: 6,
                        cursor: 'pointer',
                        opacity: config.flashEnabled ? 1 : 0.4,
                      }}
                    />
                  ))}
                </div>
              </Field>
            </div>
          </SectionDivider>

          {/* Reset */}
          <button
            onClick={() => onChange({ ...DEFAULT_CONFIG })}
            style={{
              width: '100%',
              padding: '8px 12px',
              fontSize: 12,
              fontWeight: 500,
              background: '#f4f4f5',
              color: '#18181b',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
            }}
          >
            Сбросить к значениям по умолчанию
          </button>
        </div>
      </div>

      {/* Expand button when collapsed — «Анима» */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          title="Открыть настройки анимации"
          style={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 50,
            padding: '8px 14px',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(37, 99, 235, 0.3)',
            borderRadius: 10,
            boxShadow: '0 10px 30px -8px rgba(0, 0, 0, 0.2)',
            color: '#2563eb',
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: '0.5px',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(37, 99, 235, 0.08)';
            e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
            e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.3)';
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1m15.5-7.5l-4.24 4.24m-6.02 6.02L2.5 17.5m16.5-1.41l-4.24-4.24M8.46 7.46L4.22 3.22" />
          </svg>
          Анима
        </button>
      )}
    </>
  );
}

const selectStyle: React.CSSProperties = {
  width: '100%',
  height: 36,
  padding: '0 12px',
  background: 'rgba(255, 255, 255, 0.95)',
  color: '#18181b',
  border: '1px solid #e4e4e7',
  borderRadius: 6,
  fontSize: 14,
  cursor: 'pointer',
};

const rangeStyle: React.CSSProperties = {
  width: '100%',
  appearance: 'none',
  WebkitAppearance: 'none',
  height: 4,
  background: '#e4e4e7',
  borderRadius: 2,
  outline: 'none',
  cursor: 'pointer',
};

const valueStyle: React.CSSProperties = {
  fontFamily: 'ui-monospace, monospace',
  fontSize: 12,
  color: '#71717a',
};

function Field({
  label,
  value,
  hint,
  disabled,
  children,
}: {
  label: string;
  value?: string;
  hint?: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label style={{ fontSize: 12, fontWeight: 500, color: '#71717a' }}>{label}</label>
        {value && <span style={valueStyle}>{value}</span>}
      </div>
      {children}
      {hint && (
        <div style={{ fontSize: 10, color: '#71717a', lineHeight: 1.4 }}>{hint}</div>
      )}
    </div>
  );
}

function SwitchRow({
  label,
  labelBold,
  checked,
  onChange,
}: {
  label: string;
  labelBold?: boolean;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 4 }}>
      <label style={{ fontSize: 12, fontWeight: labelBold ? 600 : 500, color: labelBold ? '#18181b' : '#71717a' }}>
        {label}
      </label>
      <label style={{ position: 'relative', width: 40, height: 22, cursor: 'pointer' }}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          style={{ opacity: 0, width: 0, height: 0 }}
        />
        <span
          style={{
            position: 'absolute',
            inset: 0,
            background: checked ? '#2563eb' : '#e4e4e7',
            borderRadius: 22,
            transition: 'background 0.2s',
          }}
        >
          <span
            style={{
              position: 'absolute',
              width: 18,
              height: 18,
              top: 2,
              left: checked ? 20 : 2,
              background: '#fff',
              borderRadius: '50%',
              transition: 'left 0.2s',
            }}
          />
        </span>
      </label>
    </div>
  );
}

function SectionDivider({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ borderTop: '1px solid #e4e4e7', paddingTop: 12, marginTop: 12 }}>
      {children}
    </div>
  );
}

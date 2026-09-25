'use client';

import { Braces, RotateCcw } from 'lucide-react';
import { Button } from '@digikit/ui';
import type { KitComponentEntry, KitControl } from './registry.generated';
import s from './workbench.module.css';

type ControlValue = string | number | boolean;

export interface ControlPanelProps {
  entry: KitComponentEntry;
  values: Record<string, ControlValue>;
  onValueChange(key: string, value: ControlValue): void;
  onReset(): void;
}

function validJson(value: unknown): boolean {
  if (typeof value !== 'string') return true;
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
}

function valueFor(control: KitControl, values: Record<string, ControlValue>): ControlValue {
  return values[control.key] ?? control.defaultValue;
}

function ControlField({ control, values, onValueChange }: Omit<ControlPanelProps, 'entry' | 'onReset'> & { control: KitControl }) {
  const value = valueFor(control, values);
  const id = `kit-control-${control.key}`;
  const update = (next: ControlValue) => onValueChange(control.key, next);

  return (
    <div className={s.controlField}>
      <div className={s.controlLabelRow}>
        <label htmlFor={id}>{control.label}</label>
        <code>{control.key}</code>
      </div>
      {control.description && <p className={s.controlDescription}>{control.description}</p>}
      {control.type === 'boolean' && (
        <label className={s.switchField}>
          <input id={id} type="checkbox" checked={Boolean(value)} onChange={(event) => update(event.target.checked)} />
          <span className={s.switchTrack} aria-hidden="true"><span /></span>
          <span>{value ? 'فعال' : 'غیرفعال'}</span>
        </label>
      )}
      {control.type === 'select' && (
        <select id={id} className={s.controlInput} value={String(value)} onChange={(event) => update(event.target.value)}>
          {control.options?.map((option) => <option value={option} key={option}>{option}</option>)}
        </select>
      )}
      {control.type === 'number' && (
        <div className={s.numberControl}>
          {control.min != null && control.max != null && <input aria-label={`${control.label} با اسلایدر`} type="range" min={control.min} max={control.max} step={control.step || 1} value={Number(value)} onChange={(event) => update(Number(event.target.value))} />}
          <input id={id} className={s.controlInput} type="number" min={control.min} max={control.max} step={control.step || 1} value={Number(value)} onChange={(event) => update(Number(event.target.value))} />
        </div>
      )}
      {control.type === 'color' && <input id={id} className={s.colorInput} type="color" value={String(value)} onChange={(event) => update(event.target.value)} />}
      {control.type === 'text' && <input id={id} className={s.controlInput} type="text" value={String(value)} placeholder={control.placeholder} onChange={(event) => update(event.target.value)} />}
      {control.type === 'json' && (
        <div className={s.jsonControl}>
          <div className={s.jsonHeader}><Braces size={15} /><span>JSON</span><span className={validJson(value) ? s.valid : s.invalid}>{validJson(value) ? 'معتبر' : 'نامعتبر'}</span></div>
          <textarea id={id} className={`${s.controlInput} ${s.jsonInput}`} value={String(value)} placeholder={control.placeholder} spellCheck={false} onChange={(event) => update(event.target.value)} />
        </div>
      )}
    </div>
  );
}

export function ControlPanel({ entry, values, onValueChange, onReset }: ControlPanelProps) {
  return (
    <section className={s.controlPanel} aria-labelledby="kit-controls-title">
      <div className={s.panelHeading}>
        <div>
          <span className={s.eyebrow}>پراپ‌ها و تنظیمات</span>
          <h2 id="kit-controls-title">تنظیمات کامپوننت</h2>
          <p>مقدارها را تغییر دهید تا حالت‌های مختلف کامپوننت را بدون خروج از راهنما ببینید.</p>
        </div>
        <Button size="sm" variant="ghost" startIcon={<RotateCcw size={15} />} onClick={onReset}>بازنشانی</Button>
      </div>
      {entry.controls.length ? (
        <div className={s.controlsGrid}>
          {entry.controls.map((control) => <ControlField key={control.key} control={control} values={values} onValueChange={onValueChange} />)}
        </div>
      ) : (
        <div className={s.noControls}><Braces size={20} /><span>این کامپوننت prop قابل تنظیمی در رجیستری ندارد؛ برای داده‌های اختصاصی، `component.meta.json` اضافه کنید.</span></div>
      )}
    </section>
  );
}

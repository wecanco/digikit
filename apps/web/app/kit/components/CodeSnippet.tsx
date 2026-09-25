'use client';

import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import type { KitComponentEntry } from './registry.generated';
import s from './workbench.module.css';

type ControlValue = string | number | boolean;

interface CodeSnippetProps {
  entry: KitComponentEntry;
  values: Record<string, ControlValue>;
  onCopy(): void;
}

function formatValue(value: ControlValue, type?: string): string {
  if (type === 'json') {
    try {
      return JSON.stringify(JSON.parse(String(value)), null, 2);
    } catch {
      return String(value);
    }
  }
  if (typeof value === 'string') return JSON.stringify(value);
  return String(value);
}

export function createSnippet(entry: KitComponentEntry, values: Record<string, ControlValue>): string {
  const attributes: string[] = [];
  let children: string | null = null;
  for (const control of entry.controls) {
    const value = values[control.key] ?? control.defaultValue;
    if (control.key === 'children') {
      children = String(value);
      continue;
    }
    if (control.key === 'open' && value === false) continue;
    attributes.push(`  ${control.key}={${formatValue(value, control.type)}}`);
  }
  const opening = attributes.length ? `<${entry.exportName}\n${attributes.join('\n')}>` : `<${entry.exportName}>`;
  if (children == null || children === '') return `${entry.importStatement}\n\n${opening.replace(/>$/, ' />')}`;
  return `${entry.importStatement}\n\n${opening}\n  ${children}\n</${entry.exportName}>`;
}

export function CodeSnippet({ entry, values, onCopy }: CodeSnippetProps) {
  const [copied, setCopied] = useState(false);
  const code = createSnippet(entry, values);
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      onCopy();
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className={s.codePanel} aria-labelledby="kit-code-title">
      <div className={s.panelHeading}>
        <div>
          <span className={s.eyebrow}>USAGE</span>
          <h2 id="kit-code-title">کد استفاده</h2>
          <p>همین تنظیمات را در هر پروژه‌ی React یا Next.js استفاده کنید.</p>
        </div>
        <button type="button" className={s.copyButton} onClick={copyCode}>{copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}{copied ? 'کپی شد' : 'کپی کد'}</button>
      </div>
      <pre className={s.codeBlock}><code>{code}</code></pre>
    </section>
  );
}

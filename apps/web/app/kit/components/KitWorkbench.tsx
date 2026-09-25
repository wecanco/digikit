'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, BookOpen, Check, ExternalLink, Moon, Package, Sun } from 'lucide-react';
import { Button, Chip, ToastProvider, useToast } from '@digikit/ui';
import { CodeSnippet, createSnippet } from './CodeSnippet';
import { ComponentPreview } from './ComponentPreview';
import { ComponentSidebar } from './ComponentSidebar';
import { ControlPanel } from './ControlPanel';
import { COMPONENT_REGISTRY, type KitComponentEntry } from './registry.generated';
import s from './workbench.module.css';

type ControlValue = string | number | boolean;
type PreviewMode = 'fluid' | 'mobile' | 'tablet' | 'desktop';
const REPOSITORY_URL = 'https://github.com/wecanco/digikit';

function defaultsFor(entry: KitComponentEntry): Record<string, ControlValue> {
  return Object.fromEntries(entry.controls.map((control) => [control.key, control.defaultValue]));
}

function WorkbenchContent() {
  const toast = useToast();
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState('all');
  const [selectedSlug, setSelectedSlug] = useState(COMPONENT_REGISTRY[0]?.slug || '');
  const [values, setValues] = useState<Record<string, ControlValue>>({});
  const [previewMode, setPreviewMode] = useState<PreviewMode>('fluid');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const groups = useMemo(() => [...new Set(COMPONENT_REGISTRY.map((entry) => entry.group))], []);
  const filteredEntries = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('fa-IR');
    return COMPONENT_REGISTRY.filter((entry) => {
      if (group !== 'all' && entry.group !== group) return false;
      if (!normalized) return true;
      return [entry.label, entry.exportName, entry.group, entry.description, ...entry.tags].join(' ').toLocaleLowerCase('fa-IR').includes(normalized);
    });
  }, [group, query]);
  const selectedEntry = useMemo(() => COMPONENT_REGISTRY.find((entry) => entry.slug === selectedSlug) || filteredEntries[0] || COMPONENT_REGISTRY[0], [filteredEntries, selectedSlug]);

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get('component');
    if (fromUrl && COMPONENT_REGISTRY.some((entry) => entry.slug === fromUrl)) setSelectedSlug(fromUrl);
  }, []);

  useEffect(() => {
    if (!filteredEntries.length) return;
    if (!filteredEntries.some((entry) => entry.slug === selectedSlug)) setSelectedSlug(filteredEntries[0].slug);
  }, [filteredEntries, selectedSlug]);

  useEffect(() => {
    if (selectedEntry) setValues(defaultsFor(selectedEntry));
  }, [selectedEntry?.slug]);

  const notify = useCallback((message: string, tone: 'success' | 'error' | 'info' = 'info') => {
    toast.show(message, tone);
  }, [toast]);

  const selectEntry = (entry: KitComponentEntry) => {
    setSelectedSlug(entry.slug);
    const url = new URL(window.location.href);
    url.searchParams.set('component', entry.slug);
    window.history.replaceState({}, '', url);
  };

  const updateValue = (key: string, value: ControlValue) => setValues((current) => ({ ...current, [key]: value }));
  const resetValues = () => selectedEntry && setValues(defaultsFor(selectedEntry));
  const copySnippet = async () => {
    if (!selectedEntry) return;
    try {
      await navigator.clipboard.writeText(createSnippet(selectedEntry, values));
      notify('کد استفاده کپی شد', 'success');
    } catch {
      notify('کپی کد در این محیط در دسترس نیست', 'error');
    }
  };

  if (!selectedEntry) return null;

  return (
    <div className={s.page} data-theme={theme}>
      <header className={s.topbar}>
        <div className={s.topbarInner}>
          <a className={s.brand} href="/" aria-label="بازگشت به دیجی‌کیت"><span className={s.brandMark}>د</span><span><strong>دیجی‌کیت</strong><small>راهنمای UI Kit</small></span></a>
          <div className={s.topbarActions}>
            <a className={s.topbarLink} href="/kit/showcase"><BookOpen size={16} aria-hidden="true" /> ویترین کامل</a>
            <button type="button" className={s.iconAction} onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label={theme === 'light' ? 'فعال کردن حالت تاریک' : 'فعال کردن حالت روشن'}>{theme === 'light' ? <Moon size={17} aria-hidden="true" /> : <Sun size={17} aria-hidden="true" />}</button>
            <a className={s.homeAction} href="/"><ExternalLink size={15} aria-hidden="true" /> سایت نمونه</a>
          </div>
        </div>
      </header>

      <section className={s.hero}>
        <div className={s.heroCopy}>
          <span className={s.eyebrow}>@DIGIKIT/UI · راهنمای تعاملی</span>
          <h1>راهنمای تعاملی سیستم طراحی دیجی‌کیت</h1>
          <p>تمام کامپوننت‌ها، propها و حالت‌های تعاملی کیت را در یک فضای قابل جستجو ببینید، تغییر دهید و کد آماده‌ی استفاده تحویل بگیرید.</p>
          <div className={s.heroActions}><Chip tone="success"><Check size={14} aria-hidden="true" /> {COMPONENT_REGISTRY.length.toLocaleString('fa-IR')} کامپوننت ثبت‌شده</Chip><span className={s.heroMeta}>React 19 · TypeScript strict · RTL</span></div>
        </div>
        <div className={s.heroStats} aria-label="آمار کیت"><div><Package size={18} aria-hidden="true" /><strong>{COMPONENT_REGISTRY.length.toLocaleString('fa-IR')}</strong><span>کامپوننت</span></div><div><BookOpen size={18} aria-hidden="true" /><strong>{groups.length.toLocaleString('fa-IR')}</strong><span>گروه</span></div><div><Check size={18} aria-hidden="true" /><strong>۱۰۰٪</strong><span>قابل جستجو</span></div></div>
      </section>

      <div className={s.workbenchShell}>
        <main className={s.main}>
          <div className={s.breadcrumb}><a href="/">خانه</a><ArrowLeft size={14} aria-hidden="true" /><span>راهنمای کامپوننت‌ها</span><ArrowLeft size={14} aria-hidden="true" /><strong>{selectedEntry.label}</strong></div>
          <section className={s.componentHeader}>
            <div><div className={s.componentTitleLine}><h2>{selectedEntry.label}</h2><code>{selectedEntry.exportName}</code></div><p>{selectedEntry.description}</p><div className={s.tagRow}>{selectedEntry.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div>
            <div className={s.componentActions}><Button size="sm" variant="outline" onClick={copySnippet}>کپی کد</Button><a className={s.sourceLink} href={`${REPOSITORY_URL}/blob/main/${selectedEntry.source}`} target="_blank" rel="noreferrer">مشاهده‌ی سورس <ExternalLink size={14} aria-hidden="true" /></a></div>
          </section>

          <section className={s.previewPanel} aria-labelledby="kit-preview-title">
            <div className={s.panelToolbar}><div><span className={s.eyebrow}>پیش‌نمایش زنده</span><h2 id="kit-preview-title">پیش‌نمایش زنده</h2></div><div className={s.previewModes} role="group" aria-label="اندازه پیش‌نمایش">{(['fluid', 'mobile', 'tablet', 'desktop'] as PreviewMode[]).map((mode) => <button type="button" key={mode} className={previewMode === mode ? s.modeActive : s.modeButton} onClick={() => setPreviewMode(mode)}>{mode === 'fluid' ? 'سیال' : mode === 'mobile' ? 'موبایل' : mode === 'tablet' ? 'تبلت' : 'دسکتاپ'}</button>)}</div></div>
            <div className={s.previewStage}><div className={`${s.previewFrame} ${s[`preview${previewMode[0].toUpperCase()}${previewMode.slice(1)}`]}`}><ComponentPreview entry={selectedEntry} values={values} onValueChange={updateValue} onNotify={notify} /></div></div>
          </section>

          <ControlPanel entry={selectedEntry} values={values} onValueChange={updateValue} onReset={resetValues} />
          <CodeSnippet entry={selectedEntry} values={values} onCopy={() => notify('کد استفاده کپی شد', 'success')} />
        </main>
        <ComponentSidebar entries={filteredEntries} groups={groups} selectedSlug={selectedEntry.slug} search={query} group={group} onSearch={setQuery} onGroupChange={setGroup} onSelect={selectEntry} />
      </div>

      <footer className={s.footer}><span>دیجی‌کیت · سیستم طراحی فارسی برای محصولات و سرویس‌های RTL</span><a href="/kit/showcase">مشاهده‌ی ویترین ترکیبی <ArrowLeft size={14} aria-hidden="true" /></a></footer>
    </div>
  );
}

export function KitWorkbench() {
  return <ToastProvider><WorkbenchContent /></ToastProvider>;
}

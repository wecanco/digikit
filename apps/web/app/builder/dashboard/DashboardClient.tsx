'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, CheckCircle2, ChevronLeft, Copy, Download, FileJson, FileUp, Moon, PackageOpen, Plus, RotateCcw, Search, Sparkles, Sun, Trash2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BUILDER_TEMPLATES, type BuilderTemplate } from '../builder-templates';
import { cloneDocument } from '../builder-utils';
import { downloadText } from '../builder-export';
import { ConfirmDialog } from '../ConfirmDialog';
import {
  createBlankStoredPage,
  createBundle,
  createInitialStorageState,
  createStoredPage,
  createWorkspaceBundle,
  getBuilderPreferences,
  getTimestamp,
  getStorageKey,
  getBuilderStorageSnapshot,
  hasUnsavedBuilderChanges,
  isBuilderStorageCorrupt,
  loadBuilderState,
  makePageId,
  MAX_BUILDER_IMPORT_BYTES,
  mergeImportedBundle,
  readImportedBundle,
  readImportedDocument,
  readImportedWorkspace,
  saveBuilderState,
  saveBuilderStateSafely,
  setBuilderPreference,
} from '../builder-storage';
import type { BuilderStorageState, BuilderTheme, StoredPage } from '../builder.types';
import s from './dashboard.module.css';

type PageFilter = 'all' | 'draft' | 'published';
type PageSort = 'updated' | 'name' | 'created';
interface ConfirmationRequest {
  title: string;
  description: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm(): void;
}

function slugify(value: string): string {
  const latin = value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return latin || `page-${Date.now().toString(36)}`;
}

function uniqueSlug(value: string, pages: StoredPage[]): string {
  const base = slugify(value);
  if (!pages.some((page) => page.slug === base)) return base;
  let index = 2;
  while (pages.some((page) => page.slug === `${base}-${index}`)) index += 1;
  return `${base}-${index}`;
}

function makeStoredPage(document: StoredPage['document'], title: string, slug: string, id = document.id): StoredPage {
  const nextDocument = { ...document, id, title, slug, updatedAt: getTimestamp() };
  return { id, title, slug, document: nextDocument, updatedAt: nextDocument.updatedAt, status: 'draft', version: 1, versions: [], inheritMasterLayout: true };
}

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'تاریخ نامشخص' : new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

function pageNodeCount(page: StoredPage): number {
  return Math.max(0, Object.keys(page.document.nodes).length - 1);
}

function statusLabel(status: StoredPage['status']): string {
  return status === 'published' ? 'منتشرشده' : 'پیش‌نویس';
}

function TemplateCard({ template, onCreate }: { template: BuilderTemplate; onCreate(template: BuilderTemplate): void }) {
  return <button type="button" className={s.templateCard} onClick={() => onCreate(template)}><span className={s.templateIcon}>{template.icon}</span><span><strong>{template.title}</strong><small>{template.description}</small></span><Plus size={16} /></button>;
}

export function DashboardClient() {
  const router = useRouter();
  const importInput = useRef<HTMLInputElement>(null);
  const noticeTimer = useRef<number | null>(null);
  const saveTimer = useRef<number | null>(null);
  const latestState = useRef<BuilderStorageState | null>(null);
  const skipSaveFor = useRef<BuilderStorageState | null>(null);
  const savedSnapshot = useRef<string | null>(null);
  const conflictRef = useRef(false);
  const [state, setState] = useState<BuilderStorageState | null>(null);
  const [hasConflict, setHasConflict] = useState(false);
  const [storageCorrupted, setStorageCorrupted] = useState(false);
  const [theme, setTheme] = useState<BuilderTheme>('light');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<PageFilter>('all');
  const [sortBy, setSortBy] = useState<PageSort>('updated');
  const [notice, setNotice] = useState('');
  const [hydrated, setHydrated] = useState(false);
  const [confirmation, setConfirmation] = useState<ConfirmationRequest | null>(null);

  const pages = state?.pages || [];
  const filteredPages = useMemo(() => pages.filter((page) => {
    const matchesFilter = filter === 'all' || page.status === filter;
    const haystack = `${page.title} ${page.slug}`.toLocaleLowerCase('fa-IR');
    return matchesFilter && (!query.trim() || haystack.includes(query.trim().toLocaleLowerCase('fa-IR')));
  }).sort((left, right) => {
    if (sortBy === 'name') return left.title.localeCompare(right.title, 'fa');
    if (sortBy === 'created') return new Date(right.document.createdAt).getTime() - new Date(left.document.createdAt).getTime();
    return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
  }), [filter, pages, query, sortBy]);

  const showNotice = useCallback((message: string) => {
    setNotice(message);
    if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(''), 2600);
  }, []);

  const requestConfirmation = useCallback((request: ConfirmationRequest) => setConfirmation(request), []);
  const cancelConfirmation = useCallback(() => setConfirmation(null), []);

  useEffect(() => {
    const corrupted = isBuilderStorageCorrupt();
    const stored = loadBuilderState();
    savedSnapshot.current = getBuilderStorageSnapshot();
    if (corrupted) {
      conflictRef.current = true;
      setHasConflict(true);
      setStorageCorrupted(true);
    }
    const preferences = getBuilderPreferences();
    skipSaveFor.current = stored;
    setState(stored);
    setTheme(preferences.theme || 'light');
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || !state) return;
    latestState.current = state;
    if (skipSaveFor.current === state) {
      skipSaveFor.current = null;
      return;
    }
    skipSaveFor.current = null;
    if (conflictRef.current) return;
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      if (!latestState.current) return;
      const result = saveBuilderStateSafely(latestState.current, savedSnapshot.current);
      if (result === 'saved') savedSnapshot.current = getBuilderStorageSnapshot();
      if (result === 'conflict') {
        conflictRef.current = true;
        setHasConflict(true);
      }
      if (result === 'error') showNotice('ذخیره‌سازی انجام نشد؛ از workspace خروجی بگیر');
    }, 250);
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, [hydrated, showNotice, state]);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (!hydrated || event.key !== getStorageKey() || !event.newValue || event.newValue === savedSnapshot.current) return;
      if (conflictRef.current || (latestState.current && hasUnsavedBuilderChanges(latestState.current, savedSnapshot.current))) {
        conflictRef.current = true;
        setHasConflict(true);
        return;
      }
      const next = loadBuilderState({ respectPreferences: false });
      savedSnapshot.current = event.newValue;
      skipSaveFor.current = next;
      latestState.current = next;
      setState(next);
      setBuilderPreference('activePageId', next.activePageId);
      showNotice('workspace از تب دیگری به‌روزرسانی شد');
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [hydrated, showNotice]);

  useEffect(() => {
    const flushState = () => {
      if (latestState.current && hasUnsavedBuilderChanges(latestState.current, savedSnapshot.current) && !conflictRef.current && saveBuilderStateSafely(latestState.current, savedSnapshot.current) === 'saved') savedSnapshot.current = getBuilderStorageSnapshot();
    };
    const warnAboutUnsavedChanges = (event: BeforeUnloadEvent) => {
      if (!latestState.current || !hasUnsavedBuilderChanges(latestState.current, savedSnapshot.current)) return;
      flushState();
      if (!hasUnsavedBuilderChanges(latestState.current, savedSnapshot.current)) return;
      event.preventDefault();
    };
    window.addEventListener('beforeunload', warnAboutUnsavedChanges);
    window.addEventListener('pagehide', flushState);
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
      window.removeEventListener('beforeunload', warnAboutUnsavedChanges);
      window.removeEventListener('pagehide', flushState);
    };
  }, []);

  const reloadOtherTab = useCallback(() => {
    requestConfirmation({
      title: 'دریافت تغییرات تب دیگر؟',
      description: 'تغییرات ذخیره‌نشده این تب کنار گذاشته می‌شود. ابتدا می‌توانی پشتیبان workspace بگیری.',
      confirmLabel: 'دریافت تغییرات',
      danger: false,
      onConfirm: () => {
        if (isBuilderStorageCorrupt()) {
          showNotice('دادهٔ مرورگر هنوز نامعتبر است؛ ابتدا از آن نسخه بگیر و سپس بازنشانی کن');
          return;
        }
        const next = loadBuilderState({ respectPreferences: false });
        savedSnapshot.current = getBuilderStorageSnapshot();
        skipSaveFor.current = next;
        latestState.current = next;
        conflictRef.current = false;
        setHasConflict(false);
        setState(next);
        showNotice('آخرین تغییرات تب دیگر دریافت شد');
      },
    });
  }, [requestConfirmation, showNotice]);

  const downloadCorruptStorage = useCallback(() => {
    const raw = getBuilderStorageSnapshot();
    if (raw) downloadText('digikit-builder-recovery.txt', raw, 'text/plain;charset=utf-8');
  }, []);

  useEffect(() => () => {
    if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
  }, []);

  const updateState = useCallback((updater: (current: BuilderStorageState) => BuilderStorageState) => {
    setState((current) => current ? updater(current) : current);
  }, []);

  const openPage = useCallback((pageId: string) => {
    setBuilderPreference('activePageId', pageId);
    router.push(`/builder?page=${encodeURIComponent(pageId)}`);
  }, [router]);

  const createBlankPage = useCallback(() => {
    const title = window.prompt('نام صفحه خالی را وارد کنید', 'صفحه‌ی جدید')?.trim();
    if (!title) return;
    const page = createBlankStoredPage(title, uniqueSlug(title, pages));
    updateState((current) => ({ ...current, activePageId: page.id, pages: [...current.pages, page] }));
    setBuilderPreference('activePageId', page.id);
    showNotice('صفحه خالی ساخته شد');
  }, [pages, showNotice, updateState]);

  const createTemplatePage = useCallback((template: BuilderTemplate) => {
    const title = window.prompt('نام صفحه را وارد کنید', template.title)?.trim();
    if (!title) return;
    const slug = uniqueSlug(title, pages);
    const page = makeStoredPage(template.create(title, slug), title, slug);
    updateState((current) => ({ ...current, activePageId: page.id, pages: [...current.pages, page] }));
    setBuilderPreference('activePageId', page.id);
    showNotice(`قالب «${template.title}» ساخته شد`);
  }, [pages, showNotice, updateState]);

  const duplicatePage = useCallback((page: StoredPage) => {
    const title = `${page.title} - کپی`;
    const slug = uniqueSlug(`${page.slug}-copy`, pages);
    const id = makePageId();
    const document = cloneDocument(page.document, title, slug, id);
    const clone = makeStoredPage(document, title, slug, id);
    updateState((current) => ({ ...current, activePageId: clone.id, pages: [...current.pages, clone] }));
    setBuilderPreference('activePageId', clone.id);
    showNotice('صفحه کپی شد');
  }, [pages, showNotice, updateState]);

  const deletePage = useCallback((page: StoredPage) => {
    if (pages.length < 2) {
      showNotice('حداقل یک صفحه باید باقی بماند');
      return;
    }
    requestConfirmation({
      title: 'حذف صفحه؟',
      description: `صفحه «${page.title}» و تمام componentهای آن حذف می‌شود. این عملیات قابل بازگشت نیست.`,
      confirmLabel: 'حذف صفحه',
      onConfirm: () => {
        updateState((current) => {
          const nextPages = current.pages.filter((item) => item.id !== page.id);
          const nextActivePageId = current.activePageId === page.id ? nextPages[0].id : current.activePageId;
          return { ...current, activePageId: nextActivePageId, pages: nextPages };
        });
        showNotice('صفحه حذف شد');
      },
    });
  }, [pages.length, requestConfirmation, showNotice, updateState]);

  const resetWorkspace = useCallback(() => {
    requestConfirmation({
      title: 'بازنشانی workspace؟',
      description: 'تمام صفحه‌ها، تصاویر، بلوک‌ها و تاریخچه حذف و workspace از ابتدا ساخته می‌شود.',
      confirmLabel: 'بازنشانی workspace',
      onConfirm: () => {
        if (storageCorrupted && !isBuilderStorageCorrupt()) {
          reloadOtherTab();
          return;
        }
        const initial = createInitialStorageState();
        if (!saveBuilderState(initial)) {
          showNotice('بازنشانی ممکن نشد؛ فضای ذخیره‌سازی مرورگر را بررسی کن');
          return;
        }
        savedSnapshot.current = getBuilderStorageSnapshot();
        skipSaveFor.current = initial;
        latestState.current = initial;
        conflictRef.current = false;
        setHasConflict(false);
        setStorageCorrupted(false);
        setState(initial);
        setBuilderPreference('activePageId', initial.activePageId);
        showNotice('workspace از نو ساخته شد');
      },
    });
  }, [reloadOtherTab, requestConfirmation, showNotice, storageCorrupted]);

  const exportPage = useCallback((page: StoredPage) => {
    if (!state) return;
    const bundle = createBundle(page.document, state.assets, state.blocks);
    downloadText(`${page.slug}.digikit.json`, JSON.stringify(bundle, null, 2), 'application/json;charset=utf-8');
    showNotice('بسته صفحه دانلود شد');
  }, [showNotice, state]);

  const exportWorkspace = useCallback(() => {
    if (!state) return;
    const bundle = createWorkspaceBundle(state);
    downloadText('digikit-builder-workspace.json', JSON.stringify(bundle, null, 2), 'application/json;charset=utf-8');
    showNotice('پشتیبان کامل workspace دانلود شد');
  }, [showNotice, state]);

  const importWorkspace = useCallback(async (file: File) => {
    try {
      if (file.size > MAX_BUILDER_IMPORT_BYTES) {
        showNotice('فایل import نباید بزرگ‌تر از ۱۵ مگابایت باشد');
        return;
      }
      const parsed: unknown = JSON.parse(await file.text());
      const workspace = readImportedWorkspace(parsed);
      if (workspace) {
        requestConfirmation({
          title: 'جایگزینی workspace؟',
          description: 'workspace فعلی با داده‌های فایل واردشده جایگزین می‌شود. این عملیات قابل بازگشت نیست.',
          confirmLabel: 'جایگزینی workspace',
          onConfirm: () => {
            savedSnapshot.current = getBuilderStorageSnapshot();
            conflictRef.current = false;
            setHasConflict(false);
            setStorageCorrupted(false);
            setState(workspace);
            setBuilderPreference('activePageId', workspace.activePageId);
            showNotice('workspace وارد شد');
          },
        });
        return;
      }

      const bundle = readImportedBundle(parsed);
      const mergedBundle = bundle && state ? mergeImportedBundle(bundle, state.assets, state.blocks) : bundle;
      const document = mergedBundle?.page || readImportedDocument(parsed);
      if (!document) throw new Error('invalid import');
      const title = `${document.title} - واردشده`;
      const slug = uniqueSlug(`${document.slug}-imported`, pages);
      const id = makePageId();
      const importedPage = makeStoredPage(cloneDocument(document, title, slug, id), title, slug, id);
      updateState((current) => ({
        ...current,
        activePageId: importedPage.id,
        pages: [...current.pages, importedPage],
        assets: mergedBundle ? [...current.assets, ...mergedBundle.assets] : current.assets,
        blocks: mergedBundle ? [...current.blocks, ...mergedBundle.blocks] : current.blocks,
      }));
      setBuilderPreference('activePageId', importedPage.id);
      showNotice('صفحه وارد شد');
    } catch {
      showNotice('فایل JSON معتبر نیست');
    }
  }, [pages, requestConfirmation, showNotice, state, updateState]);

  const toggleTheme = useCallback(() => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    setBuilderPreference('theme', nextTheme);
  }, [theme]);

  if (!hydrated || !state) {
    return <div className={s.loading}><Sparkles size={23} /><span>در حال آماده‌سازی داشبورد…</span></div>;
  }

  const publishedCount = pages.filter((page) => page.status === 'published').length;

  return (
    <div className={s.dashboard} data-theme={theme}>
      <header className={s.topbar}>
        <div className={s.brandBlock}><a href="/" className={s.brand}><span className={s.brandMark}>د</span><span><strong>دیجی‌کیت</strong><small>LOCAL PAGE BUILDER</small></span></a><ChevronLeft size={17} className={s.divider} /><div className={s.titleBlock}><span>داشبورد صفحات</span><small>بدون API · ذخیره در همین مرورگر</small></div></div>
        <div className={s.topbarActions}><button type="button" className={s.iconButton} onClick={toggleTheme} aria-label="تغییر پوسته">{theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}</button><a href="/builder?layout=master" className={s.secondaryButton}><Sparkles size={15} />طراحی layout master</a><a href="/builder" className={s.primaryButton}><Plus size={16} />ورود به صفحه‌ساز</a></div>
      </header>

      {hasConflict && <div className={s.conflictBanner} role="alert"><span>{storageCorrupted ? 'دادهٔ ذخیره‌شده نامعتبر است؛ تا زمان بازیابی یا بازنشانی، تغییرات جدید ذخیره نمی‌شوند.' : 'تغییرات این تب هنوز ذخیره نشده‌اند؛ تب دیگری workspace را تغییر داده است.'}</span><div>{storageCorrupted ? <><button type="button" onClick={downloadCorruptStorage}><Download size={14} />دانلود دادهٔ آسیب‌دیده</button><button type="button" onClick={resetWorkspace}><RotateCcw size={14} />بازنشانی با تأیید</button></> : <><button type="button" onClick={exportWorkspace}><Download size={14} />پشتیبان تغییرات من</button><button type="button" onClick={reloadOtherTab}><RotateCcw size={14} />دریافت تغییرات جدید</button></>}</div></div>}

      <main className={s.main}>
        <section className={s.hero}>
          <div><span className={s.eyebrow}>PAGE WORKSPACE</span><h1>صفحه‌هایت را یک‌جا مدیریت کن.</h1><p>صفحه بساز، از قالب شروع کن، نسخه پشتیبان بگیر و بدون اتصال به سرور خروجی آماده داشته باش.</p></div>
          <div className={s.heroActions}><button type="button" className={s.primaryButton} onClick={createBlankPage}><Plus size={16} />صفحه خالی</button><button type="button" className={s.secondaryButton} onClick={exportWorkspace}><Download size={15} />پشتیبان workspace</button></div>
        </section>

        <section className={s.statsGrid} aria-label="آمار workspace"><div className={s.statCard}><span className={s.statIcon}>▦</span><span><strong>{pages.length.toLocaleString('fa-IR')}</strong><small>کل صفحات</small></span></div><div className={s.statCard}><span className={s.statIcon}>✓</span><span><strong>{publishedCount.toLocaleString('fa-IR')}</strong><small>منتشرشده محلی</small></span></div><div className={s.statCard}><span className={s.statIcon}>▧</span><span><strong>{state.assets.length.toLocaleString('fa-IR')}</strong><small>تصویر محلی</small></span></div><div className={s.statCard}><span className={s.statIcon}>◈</span><span><strong>{state.blocks.length.toLocaleString('fa-IR')}</strong><small>بلوک reusable</small></span></div></section>

        <section className={s.workspaceSection}>
          <div className={s.sectionHeading}><div><span className={s.eyebrow}>YOUR PAGES</span><h2>صفحه‌های ذخیره‌شده</h2></div><div className={s.headingActions}><button type="button" className={s.secondaryButton} onClick={() => importInput.current?.click()}><FileUp size={15} />ورود JSON</button><button type="button" className={s.secondaryButton} onClick={exportWorkspace}><PackageOpen size={15} />خروجی workspace</button><button type="button" className={s.dangerButton} onClick={resetWorkspace}><RotateCcw size={15} />بازنشانی</button></div></div>
          <div className={s.filters}><label className={s.search}><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="جستجو بر اساس نام یا slug…" aria-label="جستجوی صفحات" />{query && <button type="button" onClick={() => setQuery('')} aria-label="پاک کردن جستجو"><X size={14} /></button>}</label><div className={s.filterTabs} role="group" aria-label="فیلتر وضعیت"><button type="button" className={filter === 'all' ? s.filterActive : s.filterButton} onClick={() => setFilter('all')}>همه ({pages.length.toLocaleString('fa-IR')})</button><button type="button" className={filter === 'draft' ? s.filterActive : s.filterButton} onClick={() => setFilter('draft')}>پیش‌نویس ({(pages.length - publishedCount).toLocaleString('fa-IR')})</button><button type="button" className={filter === 'published' ? s.filterActive : s.filterButton} onClick={() => setFilter('published')}>منتشرشده ({publishedCount.toLocaleString('fa-IR')})</button></div><label className={s.sortControl}><span>مرتب‌سازی</span><select value={sortBy} onChange={(event) => setSortBy(event.target.value as PageSort)} aria-label="مرتب‌سازی صفحات"><option value="updated">آخرین تغییر</option><option value="name">نام صفحه</option><option value="created">تاریخ ساخت</option></select></label></div>
          {filteredPages.length ? <div className={s.pageGrid}>{filteredPages.map((page) => <article className={page.id === state.activePageId ? `${s.pageCard} ${s.pageCardActive}` : s.pageCard} key={page.id}><div className={s.pageCardTop}><div className={s.pagePreview}><span>د</span><small>{page.slug}</small></div><span className={page.status === 'published' ? s.statusPublished : s.statusDraft}><span />{statusLabel(page.status)}</span></div><div className={s.pageCardBody}><h3>{page.title}</h3><p>آخرین تغییر: {formatDate(page.updatedAt)}</p><div className={s.pageMeta}><span>{pageNodeCount(page).toLocaleString('fa-IR')} component</span><span>نسخه {page.version.toLocaleString('fa-IR')}</span></div></div><div className={s.pageCardActions}><button type="button" className={s.openButton} onClick={() => openPage(page.id)}><ArrowUpRight size={15} />باز کردن</button><button type="button" onClick={() => duplicatePage(page)} aria-label={`کپی ${page.title}`} title="کپی صفحه"><Copy size={15} /></button><button type="button" onClick={() => exportPage(page)} aria-label={`خروجی ${page.title}`} title="خروجی صفحه"><FileJson size={15} /></button><button type="button" onClick={() => deletePage(page)} aria-label={`حذف ${page.title}`} title="حذف صفحه"><Trash2 size={15} /></button></div></article>)}</div> : <div className={s.empty}><Search size={24} /><strong>صفحه‌ای با این فیلتر پیدا نشد</strong><span>فیلتر یا عبارت جستجو را تغییر بده.</span></div>}
        </section>

        <section className={s.templatesSection}><div className={s.sectionHeading}><div><span className={s.eyebrow}>STARTER TEMPLATES</span><h2>شروع سریع با قالب</h2></div><Sparkles size={18} className={s.mutedIcon} /></div><div className={s.templateGrid}>{BUILDER_TEMPLATES.map((template) => <TemplateCard key={template.id} template={template} onCreate={createTemplatePage} />)}</div></section>

        <section className={s.localNote}><div className={s.noteIcon}><CheckCircle2 size={18} /></div><div><strong>داده‌ها فقط روی همین دستگاه ذخیره می‌شوند.</strong><p>این نسخه هیچ API، backend یا sync بین مرورگرها ندارد. برای انتقال یا جلوگیری از از دست رفتن داده، از خروجی workspace پشتیبان بگیر.</p></div></section>
      </main>

      <input ref={importInput} type="file" accept="application/json,.json" className={s.hiddenInput} onChange={(event) => { const file = event.target.files?.[0]; if (file) void importWorkspace(file); event.currentTarget.value = ''; }} />
      {confirmation && <ConfirmDialog open title={confirmation.title} description={confirmation.description} confirmLabel={confirmation.confirmLabel} danger={confirmation.danger} onCancel={cancelConfirmation} onConfirm={() => { const action = confirmation.onConfirm; setConfirmation(null); action(); }} />}
      {notice && <div className={s.notice} role="status" aria-live="polite"><CheckCircle2 size={15} />{notice}</div>}
    </div>
  );
}

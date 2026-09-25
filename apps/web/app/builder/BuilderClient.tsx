'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { Product } from '@digikit/ui';
import {
  Check,
  CheckCircle2,
  ChevronLeft,
  Clipboard,
  ClipboardPaste,
  Copy,
  Download,
  FileJson,
  FileUp,
  Layers3,
  LayoutDashboard,
  Monitor,
  Moon,
  MoreHorizontal,
  MoveDown,
  MoveUp,
  PanelLeft,
  PanelRight,
  PackageOpen,
  Play,
  Printer,
  Plus,
  Redo2,
  RotateCcw,
  Search,
  Smartphone,
  Sparkles,
  Tablet,
  Trash2,
  Undo2,
  X,
} from 'lucide-react';
import { BUILDER_DEFINITION_MAP, BUILDER_DEFINITIONS, getBuilderDefinition, getBuilderProps } from './builder-registry';
import { BUILDER_TEMPLATES, type BuilderTemplate } from './builder-templates';
import { resolveBuilderProducts, serializeBuilderProducts } from './builder-products';
import { BuilderCanvas, readBuilderDragPayload, setBuilderDragData, type BuilderDragPayload } from './BuilderCanvas';
import { ConfirmDialog } from './ConfirmDialog';
import { generateHtmlCode, generateReactCode, downloadText } from './builder-export';
import {
  createStoredPage,
  createInitialStorageState,
  createBundle,
  createWorkspaceBundle,
  getStorageKey,
  getBuilderStorageSnapshot,
  hasUnsavedBuilderChanges,
  isBuilderStorageCorrupt,
  getBuilderPreferences,
  getTimestamp,
  loadBuilderState,
  makeAssetId,
  makePageId,
  MAX_BUILDER_ASSET_BYTES,
  MAX_BUILDER_IMPORT_BYTES,
  mergeImportedBundle,
  readImportedDocument,
  readImportedBundle,
  readImportedWorkspace,
  saveBuilderState,
  saveBuilderStateSafely,
  setBuilderPreference,
} from './builder-storage';
import type { BuilderAsset, BuilderBlock, BuilderDocument, BuilderDropTarget, BuilderField, BuilderNode, BuilderProps, BuilderStorageState, BuilderStyle, BuilderTheme, BuilderValue, BuilderViewport, StoredPage } from './builder.types';
import { addNode, cloneDocument, duplicateNode, extractBlock, findParentSlot, getNodeLabel, insertBlock, moveNode, removeNode, updateNodeProps, updateNodeStyles } from './builder-utils';
import { getBuilderSlotLabel, getBuilderSlotNames } from './builder-slots';
import s from './builder.module.css';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error' | 'conflict';
type HistoryStack = { past: BuilderDocument[]; future: BuilderDocument[] };
const MASTER_HISTORY_KEY = '__master__';
interface BuilderContextMenuState { nodeId: string; x: number; y: number }
interface BuilderSlotSelection { parentId: string; slotName: string }
interface ConfirmationRequest {
  title: string;
  description: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm(): void;
}

const CATEGORY_LABELS: Record<string, string> = {
  layout: 'چیدمان',
  content: 'محتوا',
  commerce: 'تجارت و محصول',
  decorative: 'تزئینی',
};

const CATEGORY_ORDER = ['layout', 'content', 'commerce', 'decorative'];

function slugify(value: string): string {
  const latin = value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return latin || `page-${Date.now().toString(36)}`;
}

function uniqueSlug(value: string, pages: StoredPage[], excludedId?: string): string {
  const base = slugify(value);
  if (!pages.some((page) => page.id !== excludedId && page.slug === base)) return base;
  let suffix = 2;
  while (pages.some((page) => page.id !== excludedId && page.slug === `${base}-${suffix}`)) suffix += 1;
  return `${base}-${suffix}`;
}

function withDocumentUpdate(page: StoredPage, document: BuilderDocument, patch: Partial<Pick<StoredPage, 'title' | 'slug'>> = {}): StoredPage {
  const nextVersion = page.version + 1;
  const snapshot = { id: `version-${Date.now().toString(36)}-${nextVersion}`, version: page.version, document: page.document, createdAt: getTimestamp() };
  const lastSnapshot = page.versions.at(-1);
  const shouldSnapshot = !lastSnapshot || Date.now() - new Date(lastSnapshot.createdAt).getTime() > 60_000;
  const versions = shouldSnapshot ? [...page.versions, snapshot].slice(-20) : page.versions;
  return { ...page, ...patch, title: document.title, slug: document.slug, document, updatedAt: document.updatedAt, status: 'draft', publishedAt: undefined, version: nextVersion, versions };
}

function parseQueryPageId(): string | null {
  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search).get('page');
}

function parseQueryMasterMode(): boolean {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).get('layout') === 'master';
}

function updatePageUrl(pageId: string, master = false): void {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  url.searchParams.set('page', pageId);
  if (master) url.searchParams.set('layout', 'master');
  else url.searchParams.delete('layout');
  window.history.replaceState({}, '', url);
}

function countAssetReferences(value: BuilderValue | BuilderProps, asset: BuilderAsset): number {
  if (typeof value === 'string') return Number(value === `asset:${asset.id}` || value === asset.src);
  if (Array.isArray(value)) return value.reduce<number>((count, item) => count + countAssetReferences(item, asset), 0);
  if (value && typeof value === 'object') return Object.values(value).reduce<number>((count, item) => count + countAssetReferences(item, asset), 0);
  return 0;
}

function LayerDropZone({ target, active, onDrop, onDropTargetChange }: { target: BuilderDropTarget; active: boolean; onDrop(target: BuilderDropTarget, payload: BuilderDragPayload): void; onDropTargetChange(target: BuilderDropTarget | null): void }) {
  return <div
    className={active ? `${s.layerSlotDrop} ${s.layerSlotDropActive}` : s.layerSlotDrop}
    onDragOver={(event) => {
      if (!readBuilderDragPayload(event)) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = event.dataTransfer.effectAllowed === 'copy' ? 'copy' : 'move';
      onDropTargetChange(target);
    }}
    onDragLeave={() => onDropTargetChange(null)}
    onDrop={(event) => {
      event.preventDefault();
      event.stopPropagation();
      const payload = readBuilderDragPayload(event);
      if (payload) onDrop(target, payload);
      onDropTargetChange(null);
    }}
    aria-label="محل جابجایی component در لایه‌ها"
  >{active ? 'اینجا رها کن' : ''}</div>;
}

function LayerTree({ document, nodeId, selectedId, selectedSlot, depth, dropTarget, onSelect, onSelectSlot, onContextMenu, onDrop, onDropTargetChange, onDragStart, onDragEnd }: { document: BuilderDocument; nodeId: string; selectedId: string; selectedSlot: BuilderSlotSelection | null; depth: number; dropTarget: BuilderDropTarget | null; onSelect(nodeId: string): void; onSelectSlot(parentId: string, slotName: string): void; onContextMenu(nodeId: string, clientX: number, clientY: number): void; onDrop(target: BuilderDropTarget, payload: BuilderDragPayload): void; onDropTargetChange(target: BuilderDropTarget | null): void; onDragStart(payload: BuilderDragPayload): void; onDragEnd(): void }) {
  const node = document.nodes[nodeId];
  if (!node) return null;
  const definition = getBuilderDefinition(node.type);
  const slotNames = definition.canHaveChildren ? getBuilderSlotNames(node) : [];
  const isRoot = node.id === document.rootId;
  return (
    <div>
      <button type="button" draggable={!isRoot} className={selectedId === nodeId ? s.layerActive : s.layerItem} style={{ paddingInlineStart: 12 + depth * 14 }} onDragStart={(event) => { event.stopPropagation(); const payload = { kind: 'node' as const, nodeId }; setBuilderDragData(event, payload); onDragStart(payload); }} onDragEnd={onDragEnd} onClick={() => onSelect(nodeId)} onContextMenu={(event) => { event.preventDefault(); event.stopPropagation(); onContextMenu(nodeId, event.clientX, event.clientY); }}>
        <span className={s.layerIcon}>{definition.icon}</span>
        <span className={s.layerName}>{getNodeLabel(document, nodeId, definition.label)}</span>
        {slotNames.length > 0 && <span className={s.layerCount}>{slotNames.reduce((count, slotName) => count + (node.slots[slotName] || []).length, 0).toLocaleString('fa-IR')}</span>}
      </button>
      {slotNames.map((slotName) => {
        const children = node.slots[slotName] || [];
        const isGrid = node.type === 'builder/grid';
        return <div key={slotName} className={isGrid ? s.layerSlot : undefined}>
          {isGrid && <button type="button" className={selectedSlot?.parentId === node.id && selectedSlot.slotName === slotName ? s.layerSlotButtonActive : s.layerSlotButton} style={{ paddingInlineStart: 26 + depth * 14 }} onClick={() => onSelectSlot(node.id, slotName)}><span className={s.layerIcon} aria-hidden="true">▥</span><span>{getBuilderSlotLabel(slotName)}</span><small>{children.length.toLocaleString('fa-IR')}</small></button>}
          {children.flatMap((childId, index) => [
            <LayerDropZone key={`${slotName}-before-${childId}`} target={{ parentId: node.id, slotName, index }} active={dropTarget?.parentId === node.id && dropTarget.slotName === slotName && dropTarget.index === index} onDrop={onDrop} onDropTargetChange={onDropTargetChange} />,
            <LayerTree key={childId} document={document} nodeId={childId} selectedId={selectedId} selectedSlot={selectedSlot} depth={depth + (isGrid ? 2 : 1)} dropTarget={dropTarget} onSelect={onSelect} onSelectSlot={onSelectSlot} onContextMenu={onContextMenu} onDrop={onDrop} onDropTargetChange={onDropTargetChange} onDragStart={onDragStart} onDragEnd={onDragEnd} />,
          ])}
          <LayerDropZone target={{ parentId: node.id, slotName, index: children.length }} active={dropTarget?.parentId === node.id && dropTarget.slotName === slotName && dropTarget.index === children.length} onDrop={onDrop} onDropTargetChange={onDropTargetChange} />
        </div>;
      })}
    </div>
  );
}

function ContextMenuAction({ icon, label, onClick, disabled = false, danger = false }: { icon: ReactNode; label: string; onClick(): void; disabled?: boolean; danger?: boolean }) {
  return <button type="button" role="menuitem" className={danger ? `${s.contextMenuItem} ${s.contextMenuItemDanger}` : s.contextMenuItem} onClick={onClick} disabled={disabled}><span className={s.contextMenuItemIcon}>{icon}</span><span>{label}</span></button>;
}

function BuilderContextMenu({ node, document, x, y, hasClipboard, onOpenInspector, onOpenLibrary, onMove, onDuplicate, onCopy, onPaste, onSaveBlock, onDelete }: { node: BuilderNode; document: BuilderDocument; x: number; y: number; hasClipboard: boolean; onOpenInspector(): void; onOpenLibrary(): void; onMove(direction: -1 | 1): void; onDuplicate(): void; onCopy(): void; onPaste(): void; onSaveBlock(): void; onDelete(): void }) {
  const isRoot = node.id === document.rootId;
  const parent = isRoot ? null : findParentSlot(document, node.id);
  const siblings = parent ? document.nodes[parent.parentId]?.slots[parent.slotName] || [] : [];
  const definition = getBuilderDefinition(node.type);
  const label = getNodeLabel(document, node.id, definition.label);
  return (
    <div className={s.contextMenu} data-builder-context-menu role="menu" aria-label={`گزینه‌های ${label}`} style={{ left: x, top: y }} onPointerDown={(event) => event.stopPropagation()} onContextMenu={(event) => event.preventDefault()}>
      <div className={s.contextMenuHeader}><span className={s.contextMenuEyebrow}>ACTIONS</span><strong>{label}</strong></div>
      <ContextMenuAction icon={<PanelRight size={14} />} label={isRoot ? 'تنظیمات صفحه' : 'باز کردن تنظیمات'} onClick={onOpenInspector} />
      {isRoot ? <ContextMenuAction icon={<Plus size={14} />} label="افزودن component" onClick={onOpenLibrary} /> : <>
        <ContextMenuAction icon={<MoveUp size={14} />} label="انتقال به بالا" onClick={() => onMove(-1)} disabled={!parent || parent.index === 0} />
        <ContextMenuAction icon={<MoveDown size={14} />} label="انتقال به پایین" onClick={() => onMove(1)} disabled={!parent || parent.index === siblings.length - 1} />
        <div className={s.contextMenuDivider} />
        <ContextMenuAction icon={<Copy size={14} />} label="ساخت duplicate" onClick={onDuplicate} />
        <ContextMenuAction icon={<Clipboard size={14} />} label="کپی برای paste" onClick={onCopy} />
        <ContextMenuAction icon={<ClipboardPaste size={14} />} label="paste در کنار آیتم" onClick={onPaste} disabled={!hasClipboard} />
        <ContextMenuAction icon={<Layers3 size={14} />} label="ذخیره به‌عنوان بلوک reusable" onClick={onSaveBlock} />
        <div className={s.contextMenuDivider} />
        <ContextMenuAction icon={<Trash2 size={14} />} label="حذف component" onClick={onDelete} danger />
      </>}
    </div>
  );
}

function FieldEditor({ field, value, onChange }: { field: BuilderField; value: unknown; onChange(value: string | number): void }) {
  const stringValue = typeof value === 'string' ? value : '';
  const numberValue = typeof value === 'number' ? value : 0;
  if (field.type === 'textarea') {
    return <textarea className={s.fieldControl} value={stringValue} placeholder={field.placeholder} rows={4} onChange={(event) => onChange(event.target.value)} />;
  }
  if (field.type === 'select') {
    return <select className={s.fieldControl} value={stringValue} onChange={(event) => onChange(event.target.value)}>{field.options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>;
  }
  if (field.type === 'color') {
    return <div className={s.colorControl}><input type="color" value={stringValue || '#ffffff'} onChange={(event) => onChange(event.target.value)} /><input className={s.fieldControl} value={stringValue} onChange={(event) => onChange(event.target.value)} /></div>;
  }
  if (field.type === 'number') {
    return <input className={s.fieldControl} type="number" value={numberValue} min={field.min} max={field.max} step={field.step} onChange={(event) => onChange(Number(event.target.value))} />;
  }
  return <input className={s.fieldControl} type={field.type === 'url' ? 'url' : 'text'} value={stringValue} placeholder={field.placeholder} onChange={(event) => onChange(event.target.value)} />;
}

function StyleEditor({ node, viewport, onChange }: { node: BuilderNode; viewport: BuilderViewport; onChange(patch: Partial<BuilderStyle>): void }) {
  const styles = node.styles?.[viewport] || {};
  const styleFields: BuilderField[] = [
    { key: 'display', label: 'نمایش', type: 'select', options: [{ label: 'نمایش', value: 'block' }, { label: 'مخفی', value: 'none' }] },
    { key: 'maxWidth', label: 'حداکثر عرض', type: 'number', min: 0, max: 1800, step: 8 },
    { key: 'marginTop', label: 'فاصله بالا', type: 'number', min: 0, max: 240, step: 4 },
    { key: 'marginBottom', label: 'فاصله پایین', type: 'number', min: 0, max: 240, step: 4 },
    { key: 'paddingBlock', label: 'فاصله عمودی', type: 'number', min: 0, max: 240, step: 4 },
    { key: 'background', label: 'پس‌زمینه wrapper', type: 'color' },
  ];
  return <div className={s.styleInspector}><div className={s.styleInspectorTitle}><span>استایل responsive</span><small>{viewport === 'desktop' ? 'دسکتاپ' : viewport === 'tablet' ? 'تبلت' : 'موبایل'}</small></div>{styleFields.map((field) => <label className={s.field} key={field.key}><span>{field.label}</span><FieldEditor field={field} value={styles[field.key as keyof BuilderStyle]} onChange={(value) => onChange({ [field.key]: value })} /></label>)}</div>;
}

function ProductItemsEditor({ node, assets, onChange, onDelete }: { node: BuilderNode; assets: BuilderAsset[]; onChange(products: Product[]): void; onDelete(product: Product): void }) {
  const products = resolveBuilderProducts(node.props.items);
  const changeProduct = (id: number, patch: Partial<Product>) => {
    onChange(products.map((product) => product.id === id ? { ...product, ...patch } : product));
  };
  return (
    <details className={s.productEditor}>
      <summary>محصولات گرید <span>{products.length.toLocaleString('fa-IR')} مورد</span></summary>
      <div className={s.productEditorBody}>
        <p>این فهرست فقط در همین مرورگر نگهداری می‌شود و همراه خروجی HTML و React قرار می‌گیرد.</p>
        {products.map((product, index) => (
          <div className={s.productEditorItem} key={product.id}>
            <div className={s.productEditorItemTitle}><strong>{product.title || `محصول ${index + 1}`}</strong><button type="button" aria-label={`حذف ${product.title}`} onClick={() => onDelete(product)}><Trash2 size={13} /></button></div>
            <label className={s.field}><span>نام محصول</span><input className={s.fieldControl} value={product.title} onChange={(event) => changeProduct(product.id, { title: event.target.value })} /></label>
            <label className={s.field}><span>برند</span><input className={s.fieldControl} value={product.brand || ''} onChange={(event) => changeProduct(product.id, { brand: event.target.value })} /></label>
            <div className={s.productEditorPair}>
              <label className={s.field}><span>قیمت (تومان)</span><input className={s.fieldControl} type="number" min="0" value={product.price} onChange={(event) => changeProduct(product.id, { price: Math.max(0, Number(event.target.value) || 0) })} /></label>
              <label className={s.field}><span>قیمت قبل</span><input className={s.fieldControl} type="number" min="0" value={product.oldPrice || 0} onChange={(event) => changeProduct(product.id, { oldPrice: Math.max(0, Number(event.target.value) || 0) })} /></label>
            </div>
            <label className={s.field}><span>مسیر محصول</span><input className={s.fieldControl} dir="ltr" value={product.href || ''} onChange={(event) => changeProduct(product.id, { href: event.target.value })} /></label>
            <label className={s.field}><span>آدرس تصویر یا ph:شناسه</span><input className={s.fieldControl} dir="ltr" value={product.image} onChange={(event) => changeProduct(product.id, { image: event.target.value })} /></label>
            {assets.length > 0 && <label className={s.field}><span>یا انتخاب از تصاویر محلی</span><select className={s.fieldControl} value={product.image.startsWith('asset:') ? product.image.slice(6) : ''} onChange={(event) => { if (event.target.value) changeProduct(product.id, { image: `asset:${event.target.value}` }); }}><option value="">انتخاب تصویر</option>{assets.map((asset) => <option value={asset.id} key={asset.id}>{asset.name}</option>)}</select></label>}
            <div className={s.productEditorMove}><button type="button" disabled={index === 0} onClick={() => { const next = [...products]; [next[index - 1], next[index]] = [next[index], next[index - 1]]; onChange(next); }} aria-label={`انتقال ${product.title} به بالا`}><MoveUp size={13} /></button><button type="button" disabled={index === products.length - 1} onClick={() => { const next = [...products]; [next[index], next[index + 1]] = [next[index + 1], next[index]]; onChange(next); }} aria-label={`انتقال ${product.title} به پایین`}><MoveDown size={13} /></button></div>
          </div>
        ))}
        <button type="button" className={s.productEditorAdd} onClick={() => {
          const id = Math.max(0, ...products.map((product) => product.id)) + 1;
          onChange([...products, { id, title: 'محصول جدید', brand: '', cat: 'builder', price: 0, oldPrice: null, discount: 0, rating: 0, ratingCount: 0, image: `ph:${id}`, href: '#' }]);
        }}><Plus size={14} />افزودن محصول</button>
      </div>
    </details>
  );
}

function MasterLayoutInspector({ document, onChange }: { document: BuilderDocument; onChange(patch: { title?: string; slug?: string; description?: string }): void }) {
  return <div className={s.masterInspectorBody}>
    <div className={s.masterInspectorIntro}><Layers3 size={17} /><strong>تنظیمات layout master</strong><span>ناوبری، جایگاه محتوای صفحه و پاورقی را از همین سند مدیریت کن.</span></div>
    <label className={s.field}><span>عنوان layout</span><input className={s.fieldControl} value={document.title} onChange={(event) => onChange({ title: event.target.value })} /></label>
    <label className={s.field}><span>slug</span><input className={s.fieldControl} dir="ltr" value={document.slug} onChange={(event) => onChange({ slug: event.target.value.replace(/[^a-z0-9-]/g, '-').toLowerCase() })} /></label>
    <label className={s.field}><span>توضیح</span><textarea className={s.fieldControl} rows={3} value={document.description || ''} onChange={(event) => onChange({ description: event.target.value })} /></label>
  </div>;
}

function saveStatusLabel(status: SaveStatus): string {
  if (status === 'saving') return 'در حال ذخیره';
  if (status === 'saved') return 'ذخیره شد';
  if (status === 'error') return 'خطا در ذخیره';
  if (status === 'conflict') return 'تعارض بین تب‌ها';
  return 'آماده';
}

function PageList({ pages, activePageId, isMasterLayout, onSelect, onCreate, onDuplicate, onDelete, onOpenMaster, onClose }: { pages: StoredPage[]; activePageId: string; isMasterLayout: boolean; onSelect(pageId: string): void; onCreate(): void; onDuplicate(): void; onDelete(): void; onOpenMaster(): void; onClose(): void }) {
  return (
    <section className={s.pageListSection}>
      <div className={s.panelHeadingCompact}><div><span className={s.panelEyebrow}>LOCAL PAGES</span><h2>صفحه‌ها</h2></div><div className={s.panelHeadingActions}><button type="button" className={s.squareButton} onClick={onCreate} aria-label="ساخت صفحه جدید"><Plus size={17} /></button><button type="button" className={s.squareButton} onClick={onOpenMaster} aria-label="طراحی layout master" title="طراحی layout master"><Layers3 size={16} /></button><button type="button" className={s.panelCloseButton} onClick={onClose} aria-label="بستن کتابخانه"><X size={15} /></button></div></div>
      <div className={s.pageList}>
        {pages.map((page) => <button type="button" key={page.id} className={page.id === activePageId ? s.pageItemActive : s.pageItem} onClick={() => onSelect(page.id)}><span className={s.pageItemText}><strong>{page.title}</strong><small>/{page.slug} · {page.status === 'published' ? 'منتشرشده' : 'پیش‌نویس'}</small></span>{page.id === activePageId && <Check size={15} aria-hidden="true" />}</button>)}
      </div>
      <div className={s.pageActions}><button type="button" onClick={onOpenMaster}>{isMasterLayout ? <RotateCcw size={14} /> : <Layers3 size={14} />}{isMasterLayout ? 'بازگشت به صفحه' : 'layout master'}</button><button type="button" onClick={onDuplicate} disabled={isMasterLayout}><Copy size={14} />کپی صفحه</button><button type="button" onClick={onDelete} disabled={pages.length < 2 || isMasterLayout}><Trash2 size={14} />حذف</button></div>
    </section>
  );
}

function ComponentLibrary({ query, category, isMasterLayout, onQueryChange, onCategoryChange, onAdd, onDragStart }: { query: string; category: string; isMasterLayout: boolean; onQueryChange(value: string): void; onCategoryChange(value: string): void; onAdd(type: string): void; onDragStart(payload: BuilderDragPayload): void }) {
  const filteredDefinitions = useMemo(() => BUILDER_DEFINITIONS.filter((definition) => definition.type !== 'builder/root' && (isMasterLayout || definition.type !== 'builder/page-slot')).filter((definition) => category === 'all' || definition.category === category).filter((definition) => {
    const haystack = `${definition.label} ${definition.description} ${CATEGORY_LABELS[definition.category]}`.toLocaleLowerCase('fa-IR');
    return !query.trim() || haystack.includes(query.trim().toLocaleLowerCase('fa-IR'));
  }), [category, isMasterLayout, query]);
  return (
    <section className={s.librarySection}>
      <div className={s.panelHeadingCompact}><div><span className={s.panelEyebrow}>COMPONENT LIBRARY</span><h2>المان‌ها</h2></div><Sparkles size={17} className={s.panelHeadingIcon} /></div>
      <label className={s.builderSearch}><Search size={15} /><input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="جستجوی component…" aria-label="جستجوی component" />{query && <button type="button" onClick={() => onQueryChange('')} aria-label="پاک کردن جستجو"><X size={14} /></button>}</label>
      <div className={s.categoryTabs}><button type="button" className={category === 'all' ? s.categoryActive : s.categoryButton} onClick={() => onCategoryChange('all')}>همه</button>{CATEGORY_ORDER.map((item) => <button type="button" className={category === item ? s.categoryActive : s.categoryButton} key={item} onClick={() => onCategoryChange(item)}>{CATEGORY_LABELS[item]}</button>)}</div>
      <div className={s.libraryList}>
        {filteredDefinitions.map((definition) => <button type="button" draggable onDragStart={(event) => { setBuilderDragData(event, { kind: 'component', type: definition.type }); onDragStart({ kind: 'component', type: definition.type }); }} onClick={() => onAdd(definition.type)} className={s.libraryItem} key={definition.type}><span className={s.libraryIcon}>{definition.icon}</span><span><strong>{definition.label}</strong><small>{definition.description}</small></span><Plus size={15} /></button>)}
        {!filteredDefinitions.length && <div className={s.emptyState}><Search size={20} /><strong>چیزی پیدا نشد</strong><span>عبارت دیگری را امتحان کن.</span></div>}
      </div>
    </section>
  );
}

function TemplateLibrary({ onCreate }: { onCreate(template: BuilderTemplate): void }) {
  return <section className={s.templateSection}><div className={s.panelHeadingCompact}><div><span className={s.panelEyebrow}>STARTER TEMPLATES</span><h2>قالب‌های آماده</h2></div><Sparkles size={17} className={s.panelHeadingIcon} /></div><div className={s.templateList}>{BUILDER_TEMPLATES.map((template) => <button type="button" className={s.templateItem} key={template.id} onClick={() => onCreate(template)}><span className={s.templateIcon}>{template.icon}</span><span><strong>{template.title}</strong><small>{template.description}</small></span><Plus size={15} /></button>)}</div></section>;
}

function BlockLibrary({ blocks, onAdd, onDelete }: { blocks: BuilderBlock[]; onAdd(block: BuilderBlock): void; onDelete(block: BuilderBlock): void }) {
  return <section className={s.templateSection}><div className={s.panelHeadingCompact}><div><span className={s.panelEyebrow}>SAVED BLOCKS</span><h2>بلوک‌های من</h2></div><Layers3 size={17} className={s.panelHeadingIcon} /></div>{blocks.length ? <div className={s.templateList}>{blocks.map((block) => <div className={s.savedBlock} key={block.id}><button type="button" className={s.savedBlockMain} onClick={() => onAdd(block)}><span className={s.templateIcon}>▦</span><span><strong>{block.title}</strong><small>بلوک reusable محلی</small></span><Plus size={15} /></button><button type="button" className={s.savedBlockDelete} onClick={() => onDelete(block)} aria-label={`حذف ${block.title}`}><Trash2 size={13} /></button></div>)}</div> : <div className={s.noBlocks}>از inspector یک node را انتخاب و به‌عنوان بلوک ذخیره کن.</div>}</section>;
}

function AssetLibrary({ assets, usage, onDelete, onUpload }: { assets: BuilderAsset[]; usage: Record<string, number>; onDelete(asset: BuilderAsset): void; onUpload(file: File): void }) {
  return <section className={s.assetLibrary}><details open={assets.length > 0}><summary className={s.assetSummary}><span><span className={s.panelEyebrow}>LOCAL ASSETS</span><strong>تصاویر محلی</strong></span><span className={s.assetSummaryCount}>{assets.length.toLocaleString('fa-IR')}</span></summary><div className={s.assetLibraryBody}><label className={s.uploadAssetButton}><FileUp size={14} />افزودن تصویر<input type="file" accept="image/*" onChange={(event) => { const file = event.target.files?.[0]; if (file) onUpload(file); event.currentTarget.value = ''; }} /></label>{assets.length ? <div className={s.assetList}>{assets.map((asset) => <div className={s.assetItem} key={asset.id}><img className={s.assetThumb} src={asset.src} alt="" /><span className={s.assetMeta}><strong>{asset.name}</strong><small>{usage[asset.id] ? `${usage[asset.id].toLocaleString('fa-IR')} استفاده` : 'استفاده نشده'}</small></span><button type="button" className={s.assetDelete} onClick={() => onDelete(asset)} disabled={Boolean(usage[asset.id])} aria-label={`حذف ${asset.name}`} title={usage[asset.id] ? 'این تصویر در صفحه استفاده شده است' : 'حذف تصویر'}><Trash2 size={13} /></button></div>)}</div> : <div className={s.assetEmpty}>تصویری ذخیره نشده است.</div>}</div></details></section>;
}

export function BuilderClient() {
  const [pages, setPages] = useState<StoredPage[]>([]);
  const [assets, setAssets] = useState<BuilderAsset[]>([]);
  const [blocks, setBlocks] = useState<BuilderBlock[]>([]);
  const [masterLayout, setMasterLayout] = useState<BuilderDocument | null>(null);
  const [activePageId, setActivePageId] = useState('');
  const [editingMasterLayout, setEditingMasterLayout] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [viewport, setViewport] = useState<BuilderViewport>('desktop');
  const [theme, setTheme] = useState<BuilderTheme>('light');
  const [mode, setMode] = useState<'editor' | 'preview'>('editor');
  const [dropTarget, setDropTarget] = useState<BuilderDropTarget | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<BuilderSlotSelection | null>(null);
  const [history, setHistory] = useState<Record<string, HistoryStack>>({});
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [hasConflict, setHasConflict] = useState(false);
  const [storageCorrupted, setStorageCorrupted] = useState(false);
  const [notice, setNotice] = useState('');
  const [hydrated, setHydrated] = useState(false);
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [clipboardBlock, setClipboardBlock] = useState<BuilderBlock | null>(null);
  const [contextMenu, setContextMenu] = useState<BuilderContextMenuState | null>(null);
  const [confirmation, setConfirmation] = useState<ConfirmationRequest | null>(null);
  const importInput = useRef<HTMLInputElement>(null);
  const noticeTimer = useRef<number | null>(null);
  const latestState = useRef<BuilderStorageState | null>(null);
  const skipSaveFor = useRef<BuilderStorageState | null>(null);
  const savedSnapshot = useRef<string | null>(null);
  const conflictRef = useRef(false);

  const storedActivePage = useMemo(() => pages.find((page) => page.id === activePageId) || null, [activePageId, pages]);
  const activePage = useMemo(() => editingMasterLayout && masterLayout && storedActivePage ? { ...storedActivePage, title: masterLayout.title, slug: masterLayout.slug, document: masterLayout, updatedAt: masterLayout.updatedAt, versions: [] } : storedActivePage, [editingMasterLayout, masterLayout, storedActivePage]);
  const activeDocument = editingMasterLayout ? masterLayout : activePage?.document || null;
  const shouldUseMasterLayout = !editingMasterLayout && activePage?.inheritMasterLayout !== false && Boolean(masterLayout);
  const selectedNode = activeDocument?.nodes[selectedId] || null;
  const selectedDefinition = selectedNode ? getBuilderDefinition(selectedNode.type) : null;
  const contextNode = contextMenu && activeDocument?.nodes[contextMenu.nodeId] ? activeDocument.nodes[contextMenu.nodeId] : null;
  const historyKey = editingMasterLayout ? MASTER_HISTORY_KEY : activePageId;
  const canUndo = Boolean(historyKey && history[historyKey]?.past.length);
  const canRedo = Boolean(historyKey && history[historyKey]?.future.length);
  const assetUsage = useMemo(() => {
    const usage: Record<string, number> = {};
    for (const asset of assets) {
      const pageUses = pages.reduce((count, page) => count + [page.document, ...page.versions.map((version) => version.document)].reduce((uses, document) => uses + Object.values(document.nodes).reduce((total, node) => total + countAssetReferences(node.props, asset), 0), 0), 0);
      const blockUses = blocks.reduce((count, block) => count + Object.values(block.nodes).reduce((uses, node) => uses + countAssetReferences(node.props, asset), 0), 0);
      const masterUses = masterLayout ? Object.values(masterLayout.nodes).reduce((count, node) => count + countAssetReferences(node.props, asset), 0) : 0;
      usage[asset.id] = pageUses + blockUses + masterUses;
    }
    return usage;
  }, [assets, blocks, masterLayout, pages]);

  const showNotice = useCallback((message: string) => {
    setNotice(message);
    if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(''), 2400);
  }, []);

  const requestConfirmation = useCallback((request: ConfirmationRequest) => {
    setContextMenu(null);
    setConfirmation(request);
  }, []);

  const cancelConfirmation = useCallback(() => setConfirmation(null), []);

  useEffect(() => {
    const corrupted = isBuilderStorageCorrupt();
    const stored = loadBuilderState();
    savedSnapshot.current = getBuilderStorageSnapshot();
    if (corrupted) {
      conflictRef.current = true;
      setHasConflict(true);
      setStorageCorrupted(true);
      setSaveStatus('error');
    }
    const requestedPage = parseQueryPageId();
    const requestedMaster = parseQueryMasterMode();
    const preferences = getBuilderPreferences();
    const preferredPageId = requestedPage && stored.pages.some((page) => page.id === requestedPage) ? requestedPage : preferences.activePageId && stored.pages.some((page) => page.id === preferences.activePageId) ? preferences.activePageId : stored.activePageId;
    skipSaveFor.current = { ...stored, activePageId: preferredPageId };
    setPages(stored.pages);
    setAssets(stored.assets);
    setBlocks(stored.blocks);
    setMasterLayout(stored.masterLayout);
    setActivePageId(preferredPageId);
    setEditingMasterLayout(requestedMaster && Boolean(stored.masterLayout));
    setViewport(preferences.viewport || 'desktop');
    setTheme(preferences.theme || 'light');
    setSelectedId(requestedMaster && stored.masterLayout ? stored.masterLayout.rootId : stored.pages.find((page) => page.id === preferredPageId)?.document.rootId || '');
    setSelectedSlot(null);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || !activePageId) return;
    setBuilderPreference('activePageId', activePageId);
    updatePageUrl(activePageId, editingMasterLayout);
  }, [activePageId, editingMasterLayout, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    latestState.current = { schemaVersion: 3, activePageId, pages, assets, blocks, masterLayout };
    const incoming = skipSaveFor.current;
    skipSaveFor.current = null;
    if (incoming?.activePageId === activePageId && incoming.pages === pages && incoming.assets === assets && incoming.blocks === blocks) {
      return;
    }
    if (conflictRef.current) return;
    const timer = window.setTimeout(() => {
      const state: BuilderStorageState = { schemaVersion: 3, activePageId, pages, assets, blocks, masterLayout };
      const result = saveBuilderStateSafely(state, savedSnapshot.current);
      if (result === 'saved') savedSnapshot.current = getBuilderStorageSnapshot();
      if (result === 'conflict') {
        conflictRef.current = true;
        setHasConflict(true);
      }
      setSaveStatus(result);
      if (result === 'error') showNotice('ذخیره‌سازی انجام نشد؛ از workspace خروجی بگیر');
    }, 350);
    return () => window.clearTimeout(timer);
  }, [activePageId, assets, blocks, hydrated, masterLayout, pages, showNotice]);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (!hydrated || event.key !== getStorageKey() || !event.newValue || event.newValue === savedSnapshot.current) return;
      if (conflictRef.current || (latestState.current && hasUnsavedBuilderChanges(latestState.current, savedSnapshot.current))) {
        conflictRef.current = true;
        setHasConflict(true);
        setSaveStatus('conflict');
        return;
      }
      const next = loadBuilderState({ respectPreferences: false });
      const keptPageId = next.pages.some((page) => page.id === activePageId) ? activePageId : next.activePageId;
      const keptPage = next.pages.find((page) => page.id === keptPageId);
      const synced = { ...next, activePageId: keptPageId };
      savedSnapshot.current = event.newValue;
      skipSaveFor.current = synced;
      latestState.current = synced;
      setPages(next.pages);
      setAssets(next.assets);
      setBlocks(next.blocks);
      setMasterLayout(next.masterLayout);
      setActivePageId(keptPageId);
      setSelectedId((current) => editingMasterLayout && next.masterLayout?.nodes[current] ? current : editingMasterLayout ? next.masterLayout?.rootId || '' : keptPage?.document.nodes[current] ? current : keptPage?.document.rootId || '');
      setSelectedSlot(null);
      setHistory({});
      setSaveStatus('saved');
      showNotice('workspace از تب دیگری به‌روزرسانی شد');
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [activePageId, editingMasterLayout, hydrated, showNotice]);

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
      window.removeEventListener('beforeunload', warnAboutUnsavedChanges);
      window.removeEventListener('pagehide', flushState);
    };
  }, []);

  const reloadOtherTab = useCallback(() => {
    requestConfirmation({
      title: 'دریافت تغییرات تب دیگر؟',
      description: 'تغییرات ذخیره‌نشده این تب کنار گذاشته می‌شود. اگر لازم است ابتدا از تغییرات فعلی پشتیبان بگیر.',
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
        setPages(next.pages);
        setAssets(next.assets);
        setBlocks(next.blocks);
        setMasterLayout(next.masterLayout);
        setActivePageId(next.activePageId);
        setSelectedId(editingMasterLayout && next.masterLayout ? next.masterLayout.rootId : next.pages.find((page) => page.id === next.activePageId)?.document.rootId || '');
        setSelectedSlot(null);
        setHistory({});
        setSaveStatus('saved');
        showNotice('آخرین تغییرات تب دیگر دریافت شد');
      },
    });
  }, [editingMasterLayout, requestConfirmation, showNotice]);

  const downloadCorruptStorage = useCallback(() => {
    const raw = getBuilderStorageSnapshot();
    if (raw) downloadText('digikit-builder-recovery.txt', raw, 'text/plain;charset=utf-8');
  }, []);

  const resetCorruptStorage = useCallback(() => {
    requestConfirmation({
      title: 'بازنشانی workspace؟',
      description: 'دادهٔ نامعتبر حذف می‌شود و workspace از ابتدا ساخته خواهد شد. اگر لازم است ابتدا دادهٔ آسیب‌دیده را دانلود کن.',
      confirmLabel: 'بازنشانی workspace',
      onConfirm: () => {
        if (!isBuilderStorageCorrupt()) {
          reloadOtherTab();
          return;
        }
        const next = createInitialStorageState();
        if (!saveBuilderState(next)) {
          showNotice('بازنشانی ممکن نشد؛ فضای ذخیره‌سازی مرورگر را بررسی کن');
          return;
        }
        savedSnapshot.current = getBuilderStorageSnapshot();
        skipSaveFor.current = next;
        latestState.current = next;
        conflictRef.current = false;
        setHasConflict(false);
        setStorageCorrupted(false);
        setPages(next.pages);
        setAssets([]);
        setBlocks([]);
        setMasterLayout(next.masterLayout);
        setActivePageId(next.activePageId);
        setSelectedId(next.masterLayout && editingMasterLayout ? next.masterLayout.rootId : next.pages[0].document.rootId);
        setSelectedSlot(null);
        setHistory({});
        setSaveStatus('saved');
        showNotice('workspace محلی بازنشانی شد');
      },
    });
  }, [editingMasterLayout, reloadOtherTab, requestConfirmation, showNotice]);

  useEffect(() => {
    if (activeDocument && !activeDocument.nodes[selectedId]) setSelectedId(activeDocument.rootId);
  }, [activeDocument, selectedId]);

  useEffect(() => () => {
    if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
  }, []);

  const commitDocument = useCallback((nextDocument: BuilderDocument, nextSelectedId?: string) => {
    const currentDocument = editingMasterLayout ? masterLayout : activePage?.document || null;
    if (!currentDocument) return;
    if (nextDocument === currentDocument) return;
    setHistory((current) => {
      const currentHistory = current[historyKey] || { past: [], future: [] };
      return { ...current, [historyKey]: { past: [...currentHistory.past, currentDocument].slice(-40), future: [] } };
    });
    if (editingMasterLayout) setMasterLayout(nextDocument);
    else if (activePage) setPages((current) => current.map((page) => page.id === activePage.id ? withDocumentUpdate(page, nextDocument) : page));
    if (nextSelectedId) setSelectedId(nextSelectedId);
    setSaveStatus('saving');
  }, [activePage, editingMasterLayout, historyKey, masterLayout]);

  const updatePageMeta = useCallback((patch: Partial<Pick<StoredPage, 'title' | 'slug'>> & { description?: string }) => {
    const normalizedPatch = {
      ...patch,
      ...(patch.slug === undefined ? {} : { slug: patch.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-') }),
    };
    if (editingMasterLayout && masterLayout) {
      const nextDocument = { ...masterLayout, ...normalizedPatch, description: patch.description ?? masterLayout.description, updatedAt: getTimestamp() };
      setMasterLayout(nextDocument);
      setSaveStatus('saving');
      return;
    }
    if (!activePage) return;
    if (normalizedPatch.slug && pages.some((page) => page.id !== activePage.id && page.slug === normalizedPatch.slug)) {
      showNotice('این slug قبلاً برای صفحه‌ی دیگری استفاده شده است');
      return;
    }
    if ((normalizedPatch.title === undefined || normalizedPatch.title === activePage.title) && (normalizedPatch.slug === undefined || normalizedPatch.slug === activePage.slug) && (patch.description === undefined || patch.description === activePage.document.description)) return;
    const nextDocument = { ...activePage.document, ...normalizedPatch, description: patch.description ?? activePage.document.description, updatedAt: getTimestamp() };
    setPages((current) => current.map((page) => page.id === activePage.id ? withDocumentUpdate(page, nextDocument, normalizedPatch) : page));
    setSaveStatus('saving');
  }, [activePage, editingMasterLayout, masterLayout, pages, showNotice]);

  const selectPage = useCallback((pageId: string) => {
    const page = pages.find((item) => item.id === pageId);
    if (!page) return;
    setActivePageId(pageId);
    setEditingMasterLayout(false);
    setContextMenu(null);
    setSelectedId(page.document.rootId);
    setSelectedSlot(null);
    setMode('editor');
    setDropTarget(null);
    setLeftPanelOpen(false);
    setRightPanelOpen(false);
  }, [pages]);

  const openMasterLayout = useCallback(() => {
    if (!masterLayout) return;
    setEditingMasterLayout(true);
    setContextMenu(null);
    setSelectedId(masterLayout.rootId);
    setSelectedSlot(null);
    setMode('editor');
    setDropTarget(null);
    setLeftPanelOpen(false);
    setRightPanelOpen(false);
  }, [masterLayout]);

  const closeMasterLayout = useCallback(() => {
    if (!storedActivePage) return;
    setEditingMasterLayout(false);
    setSelectedId(storedActivePage.document.rootId);
    setSelectedSlot(null);
    setMode('editor');
    setDropTarget(null);
  }, [storedActivePage]);

  const toggleMasterInheritance = useCallback(() => {
    if (!activePage) return;
    setPages((current) => current.map((page) => page.id === activePage.id ? { ...page, inheritMasterLayout: page.inheritMasterLayout === false } : page));
    showNotice(activePage.inheritMasterLayout === false ? 'layout master برای صفحه فعال شد' : 'layout master برای صفحه غیرفعال شد');
  }, [activePage, showNotice]);

  const selectNode = useCallback((nodeId: string) => {
    setContextMenu(null);
    setSelectedId(nodeId);
    setSelectedSlot(null);
    setRightPanelOpen(true);
  }, []);

  const selectSlot = useCallback((parentId: string, slotName: string) => {
    const parent = activeDocument?.nodes[parentId];
    if (!parent || !getBuilderSlotNames(parent).includes(slotName)) return;
    setContextMenu(null);
    setSelectedId(parentId);
    setSelectedSlot({ parentId, slotName });
    setRightPanelOpen(true);
  }, [activeDocument]);

  const openContextMenu = useCallback((nodeId: string, clientX: number, clientY: number) => {
    if (!activeDocument?.nodes[nodeId]) return;
    const menuWidth = 248;
    const menuHeight = nodeId === activeDocument.rootId ? 170 : 360;
    setSelectedId(nodeId);
    setContextMenu({ nodeId, x: Math.min(Math.max(clientX, 8), Math.max(8, window.innerWidth - menuWidth)), y: Math.min(Math.max(clientY, 8), Math.max(8, window.innerHeight - menuHeight)) });
  }, [activeDocument]);

  const createPage = useCallback(() => {
    const title = window.prompt('نام صفحه را وارد کنید', 'صفحه‌ی جدید')?.trim();
    if (!title) return;
    const page = createStoredPage(title, uniqueSlug(title, pages));
    setPages((current) => [...current, page]);
    setActivePageId(page.id);
    setSelectedId(page.document.rootId);
    setSaveStatus('saving');
  }, [pages]);

  const duplicatePage = useCallback(() => {
    if (!activePage) return;
    const id = makePageId();
    const title = `${activePage.title} - کپی`;
    const document = cloneDocument(activePage.document, title, uniqueSlug(`${activePage.slug}-copy`, pages), id);
    const page: StoredPage = { id, title, slug: document.slug, document, updatedAt: document.updatedAt, status: 'draft', version: 1, versions: [], inheritMasterLayout: activePage.inheritMasterLayout !== false };
    setPages((current) => [...current, page]);
    setActivePageId(id);
    setSelectedId(document.rootId);
    showNotice('صفحه کپی شد');
  }, [activePage, pages, showNotice]);

  const deletePage = useCallback(() => {
    if (!activePage || pages.length < 2) return;
    requestConfirmation({
      title: 'حذف صفحه؟',
      description: `صفحه «${activePage.title}» و تمام componentهای آن حذف می‌شود. این عملیات قابل بازگشت نیست.`,
      confirmLabel: 'حذف صفحه',
      onConfirm: () => {
        const nextPages = pages.filter((page) => page.id !== activePage.id);
        const nextPage = nextPages[0];
        setPages(nextPages);
        setActivePageId(nextPage.id);
        setSelectedId(nextPage.document.rootId);
        setSelectedSlot(null);
        showNotice('صفحه حذف شد');
      },
    });
  }, [activePage, pages, requestConfirmation, showNotice]);

  const targetForAdd = useCallback((nodeId = selectedId): { parentId: string; slotName: string; index?: number } | null => {
    if (!activeDocument) return null;
    const selected = activeDocument.nodes[nodeId];
    if (selected && getBuilderDefinition(selected.type).canHaveChildren) {
      const slotNames = getBuilderSlotNames(selected);
      const preferredSlot = selected.type === 'builder/grid' && selectedSlot?.parentId === selected.id && slotNames.includes(selectedSlot.slotName)
        ? selectedSlot.slotName
        : selected.type === 'builder/grid'
          ? slotNames.reduce((best, slotName) => (selected.slots[slotName] || []).length < (selected.slots[best] || []).length ? slotName : best, slotNames[0])
          : 'children';
      return { parentId: selected.id, slotName: preferredSlot };
    }
    const parent = nodeId ? findParentSlot(activeDocument, nodeId) : null;
    if (parent) return { parentId: parent.parentId, slotName: parent.slotName, index: parent.index + 1 };
    return { parentId: activeDocument.rootId, slotName: 'children' };
  }, [activeDocument, selectedId, selectedSlot]);

  const addComponent = useCallback((type: string, target?: BuilderDropTarget) => {
    if (!activeDocument) return;
    if (type === 'builder/page-slot' && !editingMasterLayout) {
      showNotice('جایگاه محتوای صفحه فقط در layout master قابل استفاده است');
      return;
    }
    const definition = BUILDER_DEFINITION_MAP.get(type);
    if (!definition) return;
    const fallback = targetForAdd();
    const destination = target || (fallback ? { ...fallback, index: fallback.index ?? (activeDocument.nodes[fallback.parentId].slots[fallback.slotName] || []).length } : null);
    if (!destination) return;
    const result = addNode(activeDocument, type, getBuilderProps(definition), destination.parentId, destination.slotName, destination.index);
    if (result.nodeId) commitDocument(result.document, result.nodeId);
  }, [activeDocument, commitDocument, editingMasterLayout, showNotice, targetForAdd]);

  const createTemplatePage = useCallback((template: BuilderTemplate) => {
    const title = window.prompt('نام صفحه را وارد کنید', template.title)?.trim();
    if (!title) return;
    const document = template.create(title, uniqueSlug(title, pages));
    const page: StoredPage = { id: document.id, title, slug: document.slug, document, updatedAt: document.updatedAt, status: 'draft', version: 1, versions: [], inheritMasterLayout: true };
    setPages((current) => [...current, page]);
    setActivePageId(page.id);
    setSelectedId(document.rootId);
    showNotice(`قالب «${template.title}» ساخته شد`);
  }, [pages, showNotice]);

  const addSavedBlock = useCallback((block: BuilderBlock) => {
    if (!activeDocument) return;
    const destination = targetForAdd();
    if (!destination) return;
    const result = insertBlock(activeDocument, block, destination.parentId, destination.slotName, destination.index);
    if (result.nodeId) commitDocument(result.document, result.nodeId);
  }, [activeDocument, commitDocument, targetForAdd]);

  const saveSelectedBlock = useCallback((nodeId = selectedId) => {
    const node = activeDocument?.nodes[nodeId];
    if (!activeDocument || !node || node.id === activeDocument.rootId) return;
    const title = window.prompt('نام بلوک reusable را وارد کنید', getNodeLabel(activeDocument, node.id, 'بلوک جدید'))?.trim();
    if (!title) return;
    const block = extractBlock(activeDocument, node.id, title);
    if (!block) return;
    setBlocks((current) => [...current.filter((item) => item.title !== title), block]);
    showNotice('بلوک ذخیره شد');
  }, [activeDocument, selectedId, showNotice]);

  const deleteSavedBlock = useCallback((block: BuilderBlock) => {
    requestConfirmation({
      title: 'حذف بلوک reusable؟',
      description: `بلوک «${block.title}» از کتابخانه محلی حذف می‌شود. componentهای استفاده‌شده در صفحه‌ها تغییر نمی‌کنند.`,
      confirmLabel: 'حذف بلوک',
      onConfirm: () => setBlocks((current) => current.filter((item) => item.id !== block.id)),
    });
  }, [requestConfirmation]);

  const copySelected = useCallback((nodeId = selectedId) => {
    const node = activeDocument?.nodes[nodeId];
    if (!activeDocument || !node || node.id === activeDocument.rootId) return;
    const block = extractBlock(activeDocument, node.id, getNodeLabel(activeDocument, node.id, 'بلوک کپی‌شده'));
    if (!block) return;
    setClipboardBlock(block);
    showNotice('component برای paste آماده شد');
  }, [activeDocument, selectedId, showNotice]);

  const pasteClipboard = useCallback((nodeId = selectedId) => {
    if (!activeDocument || !clipboardBlock) return;
    const destination = targetForAdd(nodeId);
    if (!destination) return;
    const result = insertBlock(activeDocument, clipboardBlock, destination.parentId, destination.slotName, destination.index);
    if (result.nodeId) {
      commitDocument(result.document, result.nodeId);
      showNotice('component paste شد');
    }
  }, [activeDocument, clipboardBlock, commitDocument, selectedId, showNotice, targetForAdd]);

  const uploadAsset = useCallback((file: File) => {
    if (!activeDocument || !file.type.startsWith('image/')) {
      showNotice('فقط فایل تصویری قابل افزودن است');
      return;
    }
    if (file.size > MAX_BUILDER_ASSET_BYTES) {
      showNotice('حجم تصویر باید کمتر از ۲ مگابایت باشد');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') return;
      const asset: BuilderAsset = { id: makeAssetId(), name: file.name, mimeType: file.type, src: reader.result, createdAt: getTimestamp() };
      setAssets((current) => [...current, asset]);
      if (selectedNode?.type === 'builder/image') commitDocument(updateNodeProps(activeDocument, selectedNode.id, { src: `asset:${asset.id}` }));
      showNotice('تصویر در فضای محلی ذخیره شد');
    };
    reader.readAsDataURL(file);
  }, [activeDocument, commitDocument, selectedNode, showNotice]);

  const deleteAsset = useCallback((asset: BuilderAsset) => {
    if (assetUsage[asset.id]) {
      showNotice('این تصویر در یک صفحه یا بلوک استفاده شده است');
      return;
    }
    requestConfirmation({
      title: 'حذف تصویر محلی؟',
      description: `تصویر «${asset.name}» از فضای ذخیره‌سازی این مرورگر حذف می‌شود.`,
      confirmLabel: 'حذف تصویر',
      onConfirm: () => {
        setAssets((current) => current.filter((item) => item.id !== asset.id));
        showNotice('تصویر حذف شد');
      },
    });
  }, [assetUsage, requestConfirmation, showNotice]);

  const deleteProduct = useCallback((product: Product) => {
    if (!activeDocument || !selectedNode || selectedNode.type !== 'builder/product-grid') return;
    requestConfirmation({
      title: 'حذف محصول از گرید؟',
      description: `محصول «${product.title || 'بدون نام'}» از فهرست همین component حذف می‌شود.`,
      confirmLabel: 'حذف محصول',
      onConfirm: () => {
        const products = resolveBuilderProducts(selectedNode.props.items).filter((item) => item.id !== product.id);
        commitDocument(updateNodeProps(activeDocument, selectedNode.id, { items: serializeBuilderProducts(products) }));
      },
    });
  }, [activeDocument, commitDocument, requestConfirmation, selectedNode]);

  const handleDrop = useCallback((target: BuilderDropTarget, payload: BuilderDragPayload) => {
    if (!activeDocument) return;
    if (payload.kind === 'component') addComponent(payload.type, target);
    else commitDocument(moveNode(activeDocument, payload.nodeId, target.parentId, target.slotName, target.index), payload.nodeId);
  }, [activeDocument, addComponent, commitDocument]);

  const handleFieldChange = useCallback((key: string, value: string | number) => {
    if (!activeDocument || !selectedNode) return;
    commitDocument(updateNodeProps(activeDocument, selectedNode.id, { [key]: value }));
  }, [activeDocument, commitDocument, selectedNode]);

  const handleStyleChange = useCallback((patch: Partial<BuilderStyle>) => {
    if (!activeDocument || !selectedNode) return;
    commitDocument(updateNodeStyles(activeDocument, selectedNode.id, viewport, patch));
  }, [activeDocument, commitDocument, selectedNode, viewport]);

  const deleteSelected = useCallback((nodeId = selectedId) => {
    const node = activeDocument?.nodes[nodeId];
    if (!activeDocument || !node || node.id === activeDocument.rootId) return;
    const parent = findParentSlot(activeDocument, node.id);
    const definition = getBuilderDefinition(node.type);
    requestConfirmation({
      title: 'حذف component؟',
      description: `«${getNodeLabel(activeDocument, node.id, definition.label)}» و تمام componentهای داخل آن حذف می‌شود.`,
      confirmLabel: 'حذف component',
      onConfirm: () => {
        commitDocument(removeNode(activeDocument, node.id), parent?.parentId || activeDocument.rootId);
        setSelectedSlot(null);
      },
    });
  }, [activeDocument, commitDocument, requestConfirmation, selectedId]);

  const duplicateSelected = useCallback((nodeId = selectedId) => {
    const node = activeDocument?.nodes[nodeId];
    if (!activeDocument || !node || node.id === activeDocument.rootId) return;
    const result = duplicateNode(activeDocument, node.id);
    if (result.nodeId) commitDocument(result.document, result.nodeId);
  }, [activeDocument, commitDocument, selectedId]);

  const moveSelected = useCallback((direction: -1 | 1, nodeId = selectedId) => {
    const node = activeDocument?.nodes[nodeId];
    if (!activeDocument || !node) return;
    const parent = findParentSlot(activeDocument, node.id);
    if (!parent) return;
    const nextIndex = parent.index + direction;
    const siblings = activeDocument.nodes[parent.parentId]?.slots[parent.slotName] || [];
    if (nextIndex < 0 || nextIndex >= siblings.length) return;
    commitDocument(moveNode(activeDocument, node.id, parent.parentId, parent.slotName, direction === 1 ? nextIndex + 1 : nextIndex), node.id);
  }, [activeDocument, commitDocument, selectedId]);

  const undo = useCallback(() => {
    const currentDocument = editingMasterLayout ? masterLayout : activePage?.document || null;
    if (!currentDocument) return;
    const currentHistory = history[historyKey];
    const previous = currentHistory?.past.at(-1);
    if (!previous) return;
    setHistory((current) => ({ ...current, [historyKey]: { past: currentHistory.past.slice(0, -1), future: [currentDocument, ...currentHistory.future].slice(0, 40) } }));
    if (editingMasterLayout) setMasterLayout(previous);
    else if (activePage) setPages((current) => current.map((page) => page.id === activePage.id ? withDocumentUpdate(page, previous) : page));
    setSelectedId((current) => previous.nodes[current] ? current : previous.rootId);
  }, [activePage, editingMasterLayout, history, historyKey, masterLayout]);

  const redo = useCallback(() => {
    const currentDocument = editingMasterLayout ? masterLayout : activePage?.document || null;
    if (!currentDocument) return;
    const currentHistory = history[historyKey];
    const next = currentHistory?.future[0];
    if (!next) return;
    setHistory((current) => ({ ...current, [historyKey]: { past: [...currentHistory.past, currentDocument].slice(-40), future: currentHistory.future.slice(1) } }));
    if (editingMasterLayout) setMasterLayout(next);
    else if (activePage) setPages((current) => current.map((page) => page.id === activePage.id ? withDocumentUpdate(page, next) : page));
    setSelectedId((current) => next.nodes[current] ? current : next.rootId);
  }, [activePage, editingMasterLayout, history, historyKey, masterLayout]);

  useEffect(() => {
    if (!contextMenu) return;
    const closeContextMenu = () => setContextMenu(null);
    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Element && event.target.closest('[data-builder-context-menu]')) return;
      closeContextMenu();
    };
    const handleContextKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeContextMenu();
    };
    document.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('resize', closeContextMenu);
    window.addEventListener('scroll', closeContextMenu, true);
    window.addEventListener('keydown', handleContextKey);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('resize', closeContextMenu);
      window.removeEventListener('scroll', closeContextMenu, true);
      window.removeEventListener('keydown', handleContextKey);
    };
  }, [contextMenu]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isEditing = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.tagName === 'SELECT' || target?.isContentEditable;
      if (isEditing) return;
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'z') {
        event.preventDefault();
        if (event.shiftKey) redo();
        else undo();
      } else if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'y') {
        event.preventDefault();
        redo();
      } else if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'd') {
        event.preventDefault();
        duplicateSelected();
      } else if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'c' && selectedNode && activeDocument && selectedNode.id !== activeDocument.rootId) {
        event.preventDefault();
        copySelected();
      } else if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'v' && clipboardBlock) {
        event.preventDefault();
        pasteClipboard();
      } else if (event.key === 'Escape') {
        setLeftPanelOpen(false);
        setRightPanelOpen(false);
        setContextMenu(null);
      } else if (event.key === 'Delete' || event.key === 'Backspace') {
        event.preventDefault();
        deleteSelected();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeDocument, clipboardBlock, copySelected, deleteSelected, duplicateSelected, pasteClipboard, redo, selectedNode, undo]);

  const exportJson = useCallback(() => {
    if (!activeDocument || !activePage) return;
    downloadText(`${editingMasterLayout ? 'master-layout' : activePage.slug}.json`, JSON.stringify(activeDocument, null, 2), 'application/json;charset=utf-8');
    showNotice(editingMasterLayout ? 'JSON layout master دانلود شد' : 'JSON صفحه دانلود شد');
  }, [activeDocument, activePage, editingMasterLayout, showNotice]);

  const exportBundle = useCallback(() => {
    if (!activeDocument || !activePage) return;
    const bundle = createBundle(activeDocument, assets, blocks);
    downloadText(`${editingMasterLayout ? 'master-layout' : activePage.slug}.digikit.json`, JSON.stringify(bundle, null, 2), 'application/json;charset=utf-8');
    showNotice(editingMasterLayout ? 'بسته‌ی layout master دانلود شد' : 'بسته‌ی کامل صفحه دانلود شد');
  }, [activeDocument, activePage, assets, blocks, editingMasterLayout, showNotice]);

  const exportWorkspace = useCallback(() => {
    const state: BuilderStorageState = { schemaVersion: 3, activePageId, pages, assets, blocks, masterLayout };
    downloadText('digikit-builder-workspace.json', JSON.stringify(createWorkspaceBundle(state), null, 2), 'application/json;charset=utf-8');
    showNotice('پشتیبان کامل workspace دانلود شد');
  }, [activePageId, assets, blocks, masterLayout, pages, showNotice]);

  const exportReact = useCallback(() => {
    if (!activeDocument || !activePage) return;
    downloadText(`${editingMasterLayout ? 'master-layout' : activePage.slug}.tsx`, generateReactCode(activeDocument, assets, shouldUseMasterLayout ? masterLayout : null), 'text/plain;charset=utf-8');
    showNotice('خروجی React دانلود شد');
  }, [activeDocument, activePage, assets, editingMasterLayout, masterLayout, shouldUseMasterLayout, showNotice]);

  const togglePublish = useCallback(() => {
    if (!activePage) return;
    const updatedAt = getTimestamp();
    if (activePage.status === 'published') {
      setPages((current) => current.map((page) => page.id === activePage.id ? { ...page, status: 'draft', publishedAt: undefined, updatedAt } : page));
      setSaveStatus('saving');
      showNotice('انتشار محلی لغو شد');
      return;
    }
    setPages((current) => current.map((page) => page.id === activePage.id ? { ...page, status: 'published', publishedAt: updatedAt, updatedAt } : page));
    setSaveStatus('saving');
    showNotice('نسخه‌ی محلی صفحه منتشر شد');
  }, [activePage, showNotice]);

  const restoreVersion = useCallback((versionId: string) => {
    if (!activePage) return;
    const version = activePage.versions.find((item) => item.id === versionId);
    if (!version) return;
    commitDocument({ ...version.document, updatedAt: getTimestamp() });
    showNotice(`نسخه ${version.version.toLocaleString('fa-IR')} بازیابی شد`);
  }, [activePage, commitDocument, showNotice]);

  const clearVersions = useCallback(() => {
    if (!activePage) return;
    requestConfirmation({
      title: 'پاک کردن تاریخچه نسخه‌ها؟',
      description: `تمام نسخه‌های قبلی صفحه «${activePage.title}» حذف می‌شود و قابل بازیابی نیست.`,
      confirmLabel: 'پاک کردن تاریخچه',
      onConfirm: () => {
        setPages((current) => current.map((page) => page.id === activePage.id ? { ...page, versions: [] } : page));
        showNotice('تاریخچه صفحه پاک شد');
      },
    });
  }, [activePage, requestConfirmation, showNotice]);

  const printPage = useCallback(() => {
    setMode('preview');
    window.setTimeout(() => window.print(), 120);
  }, []);

  const exportHtml = useCallback(() => {
    if (!activeDocument || !activePage) return;
    downloadText(`${editingMasterLayout ? 'master-layout' : activePage.slug}.html`, generateHtmlCode(activeDocument, assets, shouldUseMasterLayout ? masterLayout : null), 'text/html;charset=utf-8');
    showNotice('خروجی HTML دانلود شد');
  }, [activeDocument, activePage, assets, editingMasterLayout, masterLayout, shouldUseMasterLayout, showNotice]);

  const importJson = useCallback(async (file: File) => {
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
            setPages(workspace.pages);
            setAssets(workspace.assets);
            setBlocks(workspace.blocks);
            setMasterLayout(workspace.masterLayout);
            setActivePageId(workspace.activePageId);
            setSelectedId(editingMasterLayout && workspace.masterLayout ? workspace.masterLayout.rootId : workspace.pages.find((page) => page.id === workspace.activePageId)?.document.rootId || '');
            setHistory({});
            setBuilderPreference('activePageId', workspace.activePageId);
            showNotice('workspace وارد شد');
          },
        });
        return;
      }
      const bundle = readImportedBundle(parsed);
      const mergedBundle = bundle ? mergeImportedBundle(bundle, assets, blocks) : null;
      const imported = mergedBundle?.page || readImportedDocument(parsed);
      if (!imported) throw new Error('invalid document');
      const id = makePageId();
      const title = `${imported.title} - واردشده`;
      const slug = uniqueSlug(`${imported.slug}-imported`, pages);
      const document = cloneDocument(imported, title, slug, id);
      const page: StoredPage = { id, title: document.title, slug: document.slug, document, updatedAt: document.updatedAt, status: 'draft', version: 1, versions: [], inheritMasterLayout: true };
      setPages((current) => [...current, page]);
      if (mergedBundle) {
        setAssets((current) => [...current, ...mergedBundle.assets]);
        setBlocks((current) => [...current, ...mergedBundle.blocks]);
      }
      setActivePageId(id);
      setSelectedId(document.rootId);
      showNotice('صفحه وارد شد');
    } catch {
      showNotice('فایل JSON معتبر نیست');
    }
  }, [assets, blocks, editingMasterLayout, pages, requestConfirmation, showNotice]);

  const setViewportValue = (value: BuilderViewport) => {
    setViewport(value);
    setBuilderPreference('viewport', value);
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    setBuilderPreference('theme', nextTheme);
  };

  if (!hydrated || !activePage || !activeDocument) {
    return <div className={s.builderLoading}><Sparkles size={22} /><span>در حال آماده‌سازی صفحه‌ساز…</span></div>;
  }

  return (
    <div className={s.builderPage} data-theme={theme} data-mode={mode} data-layout-master={editingMasterLayout ? 'true' : 'false'}>
      <header className={s.builderTopbar}>
        <div className={s.brandBlock}>
          <a href="/" className={s.builderBrand}><span className={s.builderBrandMark}>د</span><span><strong>دیجی‌کیت</strong><small>Page Builder</small></span></a>
          <ChevronLeft size={16} className={s.topbarDivider} />
          <div className={s.pageTitleWrap}><input value={activeDocument.title} onChange={(event) => updatePageMeta({ title: event.target.value })} aria-label={editingMasterLayout ? 'نام layout master' : 'نام صفحه'} /><small>{editingMasterLayout ? 'layout master' : `/${activePage.slug || 'بدون slug'}`}</small></div>
        </div>
        <div className={s.topbarCenter}><button type="button" className={s.toolbarButton} onClick={undo} disabled={!canUndo} aria-label="واگرد"><Undo2 size={17} /></button><button type="button" className={s.toolbarButton} onClick={redo} disabled={!canRedo} aria-label="انجام دوباره"><Redo2 size={17} /></button><span className={s.saveState} role="status" aria-live="polite"><span className={saveStatus === 'error' || saveStatus === 'conflict' ? s.saveDotError : saveStatus === 'saving' ? s.saveDotSaving : s.saveDot} />{saveStatusLabel(saveStatus)}</span></div>
        <div className={s.topbarActions}><a href="/builder/dashboard" className={s.toolbarButton} aria-label="داشبورد صفحات"><LayoutDashboard size={16} /><span>داشبورد</span></a><button type="button" className={s.mobilePanelButton} onClick={() => { setRightPanelOpen(false); setLeftPanelOpen(true); }} aria-label="باز کردن پنل componentها"><PanelLeft size={17} /></button><button type="button" className={s.mobilePanelButton} onClick={() => { setLeftPanelOpen(false); setRightPanelOpen(true); }} aria-label="باز کردن inspector"><PanelRight size={17} /></button><button type="button" className={s.toolbarButton} onClick={toggleTheme} aria-label="تغییر پوسته">{theme === 'light' ? <Moon size={17} /> : <Sparkles size={17} />}</button><button type="button" className={s.toolbarButton} onClick={() => setMode(mode === 'editor' ? 'preview' : 'editor')} aria-label={mode === 'editor' ? 'پیش‌نمایش صفحه' : 'بازگشت به ادیتور'}>{mode === 'editor' ? <Play size={17} /> : <RotateCcw size={17} />}</button>{!editingMasterLayout && <button type="button" className={s.publishButton} onClick={togglePublish} aria-label={activePage.status === 'published' ? 'لغو انتشار محلی' : 'انتشار محلی'}>{activePage.status === 'published' ? <RotateCcw size={15} /> : <CheckCircle2 size={15} />}<span>{activePage.status === 'published' ? 'لغو انتشار' : 'انتشار محلی'}</span></button>}<button type="button" className={s.primaryTopbarButton} onClick={exportBundle} aria-label="خروجی بسته صفحه"><PackageOpen size={15} /><span>بسته</span></button></div>
      </header>

      {hasConflict && <div className={s.conflictBanner} role="alert"><span>{storageCorrupted ? 'دادهٔ ذخیره‌شده نامعتبر است؛ تا زمان بازیابی یا بازنشانی، تغییرات جدید ذخیره نمی‌شوند.' : 'تغییرات این تب هنوز ذخیره نشده‌اند؛ تب دیگری workspace را تغییر داده است.'}</span><div>{storageCorrupted ? <><button type="button" onClick={downloadCorruptStorage}><Download size={14} />دانلود دادهٔ آسیب‌دیده</button><button type="button" onClick={resetCorruptStorage}><RotateCcw size={14} />بازنشانی با تأیید</button></> : <><button type="button" onClick={exportWorkspace}><Download size={14} />پشتیبان تغییرات من</button><button type="button" onClick={reloadOtherTab}><RotateCcw size={14} />دریافت تغییرات جدید</button></>}</div></div>}

      {editingMasterLayout ? <div className={s.masterLayoutBanner} role="status"><span><Layers3 size={15} />در حال طراحی layout master؛ این پوسته در صفحه‌های دارای ارث‌بری نمایش داده می‌شود.</span><button type="button" onClick={closeMasterLayout}>بازگشت به صفحه</button></div> : shouldUseMasterLayout ? <div className={s.masterLayoutBanner} role="status"><span><Layers3 size={15} />در حال ویرایش صفحه؛ layout master به‌صورت کم‌رنگ نمایش داده شده است.</span><button type="button" onClick={openMasterLayout}>ویرایش layout master</button><button type="button" onClick={toggleMasterInheritance}>غیرفعال کردن ارث‌بری</button></div> : <div className={s.masterLayoutBanner} role="status"><span><Layers3 size={15} />این صفحه بدون layout master نمایش داده می‌شود.</span><button type="button" onClick={toggleMasterInheritance}>فعال کردن ارث‌بری</button><button type="button" onClick={openMasterLayout}>ویرایش layout master</button></div>}

      {contextMenu && contextNode && <BuilderContextMenu node={contextNode} document={activeDocument} x={contextMenu.x} y={contextMenu.y} hasClipboard={Boolean(clipboardBlock)} onOpenInspector={() => { setContextMenu(null); setLeftPanelOpen(false); setRightPanelOpen(true); }} onOpenLibrary={() => { setContextMenu(null); setRightPanelOpen(false); setLeftPanelOpen(true); }} onMove={(direction) => { moveSelected(direction, contextNode.id); setContextMenu(null); }} onDuplicate={() => { duplicateSelected(contextNode.id); setContextMenu(null); }} onCopy={() => { copySelected(contextNode.id); setContextMenu(null); }} onPaste={() => { pasteClipboard(contextNode.id); setContextMenu(null); }} onSaveBlock={() => { saveSelectedBlock(contextNode.id); setContextMenu(null); }} onDelete={() => { deleteSelected(contextNode.id); setContextMenu(null); }} />}

      {mode === 'preview' ? (
        <main className={s.fullPreview}><div className={s.previewNotice}><span><Play size={15} />حالت پیش‌نمایش</span><button type="button" onClick={() => setMode('editor')}>بازگشت به ویرایش</button></div><div className={s.previewViewport}><BuilderCanvas masterDocument={shouldUseMasterLayout ? masterLayout : null} document={activeDocument} assets={assets} mode="preview" viewport={viewport} selectedId={selectedId} selectedSlot={null} dropTarget={null} onSelect={setSelectedId} onSelectSlot={() => undefined} onContextMenu={() => undefined} onDrop={() => undefined} onDropTargetChange={() => undefined} onDragStart={() => undefined} onDragEnd={() => undefined} /></div></main>
      ) : (
        <div className={s.builderWorkspace}>
          {(leftPanelOpen || rightPanelOpen) && <button type="button" className={s.panelBackdrop} aria-label="بستن پنل" onClick={() => { setLeftPanelOpen(false); setRightPanelOpen(false); }} />}
          <aside className={leftPanelOpen ? `${s.leftPanel} ${s.leftPanelOpen}` : s.leftPanel} aria-label="کتابخانه و مدیریت صفحات">
            <PageList pages={pages} activePageId={activePageId} isMasterLayout={editingMasterLayout} onSelect={selectPage} onCreate={createPage} onDuplicate={duplicatePage} onDelete={deletePage} onOpenMaster={editingMasterLayout ? closeMasterLayout : openMasterLayout} onClose={() => setLeftPanelOpen(false)} />
            <ComponentLibrary query={query} category={category} isMasterLayout={editingMasterLayout} onQueryChange={setQuery} onCategoryChange={setCategory} onAdd={(type) => { addComponent(type); setLeftPanelOpen(false); }} onDragStart={() => undefined} />
            <TemplateLibrary onCreate={(template) => { createTemplatePage(template); setLeftPanelOpen(false); }} />
            <BlockLibrary blocks={blocks} onAdd={(block) => { addSavedBlock(block); setLeftPanelOpen(false); }} onDelete={deleteSavedBlock} />
            <AssetLibrary assets={assets} usage={assetUsage} onDelete={deleteAsset} onUpload={uploadAsset} />
            <div className={s.leftFooter}><button type="button" onClick={() => importInput.current?.click()}><FileUp size={14} />ورود JSON</button><button type="button" onClick={exportWorkspace}><PackageOpen size={14} />پشتیبان workspace</button><a href="/kit"><PanelLeft size={14} />راهنمای componentها</a></div>
          </aside>

          <main className={s.canvasPanel}>
            <div className={s.canvasToolbar}><div className={s.canvasToolbarTitle}><Layers3 size={17} /><strong>بوم صفحه</strong><span>{Object.keys(activeDocument.nodes).length.toLocaleString('fa-IR')} node · نسخه {activePage.version.toLocaleString('fa-IR')}</span></div><div className={s.viewportButtons} role="group" aria-label="اندازه پیش‌نمایش"><button type="button" className={viewport === 'desktop' ? s.viewportActive : s.viewportButton} onClick={() => setViewportValue('desktop')}><Monitor size={15} />دسکتاپ</button><button type="button" className={viewport === 'tablet' ? s.viewportActive : s.viewportButton} onClick={() => setViewportValue('tablet')}><Tablet size={15} />تبلت</button><button type="button" className={viewport === 'mobile' ? s.viewportActive : s.viewportButton} onClick={() => setViewportValue('mobile')}><Smartphone size={15} />موبایل</button></div><div className={s.canvasToolbarActions}><button type="button" onClick={exportJson}><FileJson size={15} />JSON</button><button type="button" onClick={exportReact}><FileJson size={15} />TSX</button><button type="button" onClick={exportHtml}><Download size={15} />HTML</button><button type="button" onClick={printPage}><Printer size={15} />PDF</button></div></div>
            <div className={s.canvasScroll}><div className={`${s.canvasFrame} ${s[`canvasFrame${viewport[0].toUpperCase()}${viewport.slice(1)}`]}`}><div className={s.canvasFrameHeader}><span /> <small>{viewport === 'desktop' ? '1280px' : viewport === 'tablet' ? '768px' : '390px'}</small><MoreHorizontal size={15} /></div><BuilderCanvas masterDocument={shouldUseMasterLayout ? masterLayout : null} document={activeDocument} assets={assets} mode="editor" viewport={viewport} selectedId={selectedId} selectedSlot={selectedSlot} dropTarget={dropTarget} onSelect={selectNode} onSelectSlot={selectSlot} onContextMenu={openContextMenu} onDrop={handleDrop} onDropTargetChange={setDropTarget} onDragStart={() => undefined} onDragEnd={() => setDropTarget(null)} /></div></div>
          </main>

          <aside className={rightPanelOpen ? `${s.rightPanel} ${s.rightPanelOpen}` : s.rightPanel} aria-label="لایه‌ها و تنظیمات component">
            <section className={s.layersSection}><div className={s.panelHeadingCompact}><div><span className={s.panelEyebrow}>OUTLINE</span><h2>لایه‌ها</h2></div><div className={s.panelHeadingActions}><PanelRight size={17} className={s.panelHeadingIcon} /><button type="button" className={s.panelCloseButton} onClick={() => setRightPanelOpen(false)} aria-label="بستن inspector"><X size={15} /></button></div></div><div className={s.layersTree}><LayerTree document={activeDocument} nodeId={activeDocument.rootId} selectedId={selectedId} selectedSlot={selectedSlot} depth={0} dropTarget={dropTarget} onSelect={selectNode} onSelectSlot={selectSlot} onContextMenu={openContextMenu} onDrop={handleDrop} onDropTargetChange={setDropTarget} onDragStart={() => undefined} onDragEnd={() => setDropTarget(null)} /></div></section>
            <section className={s.inspectorSection}><div className={s.inspectorHeading}><div><span className={s.panelEyebrow}>INSPECTOR</span><h2>{selectedDefinition?.label || 'تنظیمات صفحه'}</h2></div>{selectedNode && selectedNode.id !== activeDocument.rootId && <div className={s.nodeActions}><button type="button" onClick={() => moveSelected(-1)} aria-label="انتقال به بالا"><MoveUp size={14} /></button><button type="button" onClick={() => moveSelected(1)} aria-label="انتقال به پایین"><MoveDown size={14} /></button><button type="button" onClick={() => duplicateSelected()} aria-label="کپی component"><Copy size={14} /></button><button type="button" onClick={() => copySelected()} aria-label="کپی برای paste"><Clipboard size={14} /></button><button type="button" onClick={() => pasteClipboard()} disabled={!clipboardBlock} aria-label="paste component"><ClipboardPaste size={14} /></button><button type="button" onClick={() => saveSelectedBlock()} aria-label="ذخیره بلوک"><Layers3 size={14} /></button><button type="button" onClick={() => deleteSelected()} aria-label="حذف component"><Trash2 size={14} /></button></div>}</div>{selectedNode && selectedDefinition ? <div className={s.inspectorBody}>{selectedNode.id === activeDocument.rootId ? <div className={s.rootHint}><Sparkles size={18} /><strong>صفحه‌ی اصلی</strong><span>برای افزودن component، از پنل componentها روی یک مورد کلیک کن یا آن را روی بوم بکش.</span><label className={s.field}><span>عنوان صفحه</span><input className={s.fieldControl} value={activePage.title} onChange={(event) => updatePageMeta({ title: event.target.value })} onBlur={() => { if (!activePage.title.trim()) updatePageMeta({ title: 'صفحه‌ی بدون عنوان' }); }} /></label><label className={s.field}><span>slug</span><input className={s.fieldControl} dir="ltr" value={activePage.slug} onChange={(event) => updatePageMeta({ slug: event.target.value.replace(/[^a-z0-9-]/g, '-').toLowerCase() })} onBlur={() => { if (!activePage.slug) updatePageMeta({ slug: uniqueSlug(activePage.title, pages, activePage.id) }); }} /></label><label className={s.field}><span>توضیح صفحه</span><textarea className={s.fieldControl} rows={3} value={activeDocument.description || ''} onChange={(event) => updatePageMeta({ description: event.target.value })} placeholder="برای معرفی صفحه در خروجی HTML…" /></label>{activePage.versions.length > 0 && <div className={s.versionList}><strong>نسخه‌های قبلی</strong>{activePage.versions.slice().reverse().slice(0, 8).map((version) => { const date = new Date(version.createdAt); return <button type="button" key={version.id} onClick={() => restoreVersion(version.id)}><span>بازیابی نسخه {version.version.toLocaleString('fa-IR')}</span><small>{Number.isNaN(date.getTime()) ? 'تاریخ نامشخص' : date.toLocaleString('fa-IR')}</small></button>; })}</div>}</div> : <>{selectedDefinition.fields.map((field) => <label className={s.field} key={field.key}><span>{field.label}</span><FieldEditor field={field} value={selectedNode.props[field.key]} onChange={(value) => handleFieldChange(field.key, value)} />{field.description && <small>{field.description}</small>}</label>)}{selectedNode.type === 'builder/image' && <div className={s.assetPicker}><span className={s.assetPickerTitle}>دارایی محلی</span>{assets.length > 0 && <select className={s.fieldControl} value={typeof selectedNode.props.src === 'string' && selectedNode.props.src.startsWith('asset:') ? selectedNode.props.src.slice(6) : ''} onChange={(event) => { const asset = assets.find((item) => item.id === event.target.value); if (asset) handleFieldChange('src', `asset:${asset.id}`); }}><option value="">انتخاب تصویر ذخیره‌شده</option>{assets.map((asset) => <option value={asset.id} key={asset.id}>{asset.name}</option>)}</select>}<label className={s.uploadAssetButton}><FileUp size={14} />افزودن تصویر<input type="file" accept="image/*" onChange={(event) => { const file = event.target.files?.[0]; if (file) uploadAsset(file); event.currentTarget.value = ''; }} /></label></div>}{!selectedDefinition.fields.length && <div className={s.noFields}>این component تنظیمات قابل ویرایش ندارد.</div>}<StyleEditor node={selectedNode} viewport={viewport} onChange={handleStyleChange} /></>}</div> : <div className={s.noFields}>یک component را انتخاب کن.</div>}</section>
            {editingMasterLayout && selectedNode?.id === activeDocument.rootId && <section className={s.masterInspectorPanel}><MasterLayoutInspector document={activeDocument} onChange={updatePageMeta} /></section>}
            {selectedNode?.type === 'builder/product-grid' && <section className={s.productEditorPanel}><ProductItemsEditor node={selectedNode} assets={assets} onChange={(products) => commitDocument(updateNodeProps(activeDocument, selectedNode.id, { items: serializeBuilderProducts(products) }))} onDelete={deleteProduct} /></section>}
            {selectedNode?.id === activeDocument.rootId && activePage.versions.length > 0 && <button type="button" className={s.clearVersions} onClick={clearVersions}><Trash2 size={13} />پاک کردن تاریخچه نسخه‌ها</button>}
          </aside>
        </div>
      )}

      <input ref={importInput} type="file" accept="application/json,.json" className={s.hiddenInput} onChange={(event) => { const file = event.target.files?.[0]; if (file) void importJson(file); event.currentTarget.value = ''; }} />
      {confirmation && <ConfirmDialog open title={confirmation.title} description={confirmation.description} confirmLabel={confirmation.confirmLabel} danger={confirmation.danger} onCancel={cancelConfirmation} onConfirm={() => { const action = confirmation.onConfirm; setConfirmation(null); action(); }} />}
      {notice && <div className={s.notice} role="status" aria-live="polite"><Check size={15} />{notice}</div>}
    </div>
  );
}

import type { BuilderAsset, BuilderBlock, BuilderBundle, BuilderDocument, BuilderNode, BuilderPageVersion, BuilderProps, BuilderStorageState, BuilderTheme, BuilderValue, BuilderViewport, BuilderWorkspaceBundle, StoredPage } from './builder.types';
import { normalizeBuilderDocument, normalizeBuilderNodes, normalizeGridNode } from './builder-slots';

const STORAGE_KEY = 'digikit:builder:state:v1';
const CURRENT_STORAGE_VERSION = 3;
const ACTIVE_PAGE_COOKIE = 'digikit_builder_active_page';
const VIEWPORT_COOKIE = 'digikit_builder_viewport';
const THEME_COOKIE = 'digikit_builder_theme';
export const MAX_BUILDER_IMPORT_BYTES = 15 * 1024 * 1024;
export const MAX_BUILDER_ASSET_BYTES = 2 * 1024 * 1024;

function makeId(prefix: string): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return `${prefix}-${crypto.randomUUID()}`;
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

function now(): string {
  return new Date().toISOString();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isBuilderValue(value: unknown, depth = 0): value is BuilderValue {
  if (depth > 20) return false;
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return true;
  if (typeof value === 'number') return Number.isFinite(value);
  if (Array.isArray(value)) return value.every((item) => isBuilderValue(item, depth + 1));
  if (!isRecord(value)) return false;
  return Object.values(value).every((item) => isBuilderValue(item, depth + 1));
}

function isBuilderStyle(value: unknown): boolean {
  if (!isRecord(value)) return false;
  if (value.display !== undefined && value.display !== 'block' && value.display !== 'none') return false;
  for (const key of ['maxWidth', 'marginTop', 'marginBottom', 'paddingBlock']) {
    if (value[key] !== undefined && (typeof value[key] !== 'number' || !Number.isFinite(value[key]))) return false;
  }
  return value.background === undefined || typeof value.background === 'string';
}

function isBuilderNode(value: unknown): value is BuilderNode {
  if (!isRecord(value) || typeof value.id !== 'string' || typeof value.type !== 'string') return false;
  if (!isRecord(value.props) || !Object.values(value.props).every((prop) => isBuilderValue(prop))) return false;
  if (!isRecord(value.slots) || !Object.values(value.slots).every((slot) => Array.isArray(slot) && slot.every((id) => typeof id === 'string'))) return false;
  return value.styles === undefined || (isRecord(value.styles) && Object.values(value.styles).every(isBuilderStyle));
}

function isValidNodeGraph(nodes: Record<string, BuilderNode>, rootId: string): boolean {
  if (!isBuilderNode(nodes[rootId])) return false;
  if (Object.values(nodes).some((node) => Object.values(node.slots).flat().some((childId) => !isBuilderNode(nodes[childId])))) return false;
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const referenced = new Set<string>();
  const walk = (nodeId: string): boolean => {
    if (visiting.has(nodeId)) return false;
    if (visited.has(nodeId)) return true;
    const node = nodes[nodeId];
    if (!node) return false;
    visiting.add(nodeId);
    const valid = Object.values(node.slots).flat().every((childId) => {
      if (referenced.has(childId)) return false;
      referenced.add(childId);
      return walk(childId);
    });
    visiting.delete(nodeId);
    if (valid) visited.add(nodeId);
    return valid;
  };
  return walk(rootId) && visited.size === Object.keys(nodes).length;
}

function isBuilderDocument(value: unknown): value is BuilderDocument {
  if (!isRecord(value) || value.schemaVersion !== 1 || typeof value.id !== 'string' || typeof value.title !== 'string' || typeof value.slug !== 'string' || typeof value.rootId !== 'string') return false;
  if (value.description !== undefined && typeof value.description !== 'string') return false;
  if (!isRecord(value.nodes)) return false;
  const rawNodes = value.nodes;
  if (!isBuilderNode(rawNodes[value.rootId])) return false;
  if (!Object.entries(rawNodes).every(([id, node]) => isBuilderNode(node) && node.id === id)) return false;
  const nodes = rawNodes as Record<string, BuilderNode>;
  if (nodes[value.rootId].type !== 'builder/root') return false;
  return isValidNodeGraph(nodes, value.rootId);
}

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const prefix = `${name}=`;
  const item = document.cookie.split('; ').find((entry) => entry.startsWith(prefix));
  if (!item) return null;
  try {
    return decodeURIComponent(item.slice(prefix.length));
  } catch {
    return null;
  }
}

function writeCookie(name: string, value: string): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=31536000; samesite=lax`;
}

export function getBuilderPreferences(): { activePageId: string | null; viewport: BuilderViewport | null; theme: BuilderTheme | null } {
  const viewport = readCookie(VIEWPORT_COOKIE);
  const theme = readCookie(THEME_COOKIE);
  return {
    activePageId: readCookie(ACTIVE_PAGE_COOKIE),
    viewport: viewport === 'desktop' || viewport === 'tablet' || viewport === 'mobile' ? viewport : null,
    theme: theme === 'light' || theme === 'dark' ? theme : null,
  };
}

export function setBuilderPreference(key: 'activePageId' | 'viewport' | 'theme', value: string): void {
  const cookieName = key === 'activePageId' ? ACTIVE_PAGE_COOKIE : key === 'viewport' ? VIEWPORT_COOKIE : THEME_COOKIE;
  writeCookie(cookieName, value);
}

export function createNode(type: string, props: BuilderProps = {}, slots: Record<string, string[]> = {}): BuilderNode {
  return normalizeGridNode({ id: makeId('node'), type, props, slots });
}

export function createInitialDocument(title = 'صفحه‌ی اصلی', slug = 'home'): BuilderDocument {
  const root = createNode('builder/root', {}, { children: [] });
  const hero = createNode('builder/hero', {
    eyebrow: 'فروشگاه فارسی دیجی‌کیت',
    title: 'صفحه‌ات را با چند حرکت بساز',
    description: 'ماژول‌ها و کامپوننت‌های RTL را انتخاب کن، کنار هم بچین و خروجی آماده بگیر.',
    actionLabel: 'مشاهده محصولات',
    href: '/products',
    tone: 'primary',
  });
  const section = createNode('builder/section', { background: '#ffffff', padding: 32, maxWidth: 1200 }, { children: [] });
  const heading = createNode('builder/section-header', { title: 'پیشنهادهای منتخب', seeAllHref: '/products' });
  const products = createNode('builder/product-grid', { variant: 'grid', columns: 4 });
  root.slots.children.push(hero.id, section.id);
  section.slots.children.push(heading.id, products.id);

  const timestamp = now();
  return {
    schemaVersion: 1,
    id: makeId('page'),
    title,
    slug,
    description: 'صفحه‌ی محلی ساخته‌شده با صفحه‌ساز دیجی‌کیت.',
    rootId: root.id,
    nodes: Object.fromEntries([root, hero, section, heading, products].map((node) => [node.id, node])),
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function createEmptyDocument(title = 'صفحه‌ی خالی', slug = 'empty-page'): BuilderDocument {
  const root = createNode('builder/root', {}, { children: [] });
  const timestamp = now();
  return {
    schemaVersion: 1,
    id: makeId('page'),
    title,
    slug,
    description: 'صفحه‌ی محلی ساخته‌شده با صفحه‌ساز دیجی‌کیت.',
    rootId: root.id,
    nodes: { [root.id]: root },
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function createInitialMasterLayoutDocument(): BuilderDocument {
  const root = createNode('builder/root', {}, { children: [] });
  const navigation = createNode('builder/navigation');
  const pageSlot = createNode('builder/page-slot');
  const footer = createNode('builder/footer', { brand: 'نام برند', description: 'پاورقی layout master را از همین‌جا تنظیم کن.', anchor: 'contact' });
  root.slots.children.push(navigation.id, pageSlot.id, footer.id);
  const timestamp = now();
  return {
    schemaVersion: 1,
    id: makeId('layout'),
    title: 'layout master',
    slug: 'master-layout',
    description: 'پوسته‌ی مشترک صفحه‌ها در صفحه‌ساز دیجی‌کیت.',
    rootId: root.id,
    nodes: Object.fromEntries([root, navigation, pageSlot, footer].map((node) => [node.id, node])),
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function createStoredPage(title = 'صفحه‌ی جدید', slug = 'new-page'): StoredPage {
  const document = createInitialDocument(title, slug);
  return { id: document.id, title, slug, document, updatedAt: document.updatedAt, status: 'draft', version: 1, versions: [], inheritMasterLayout: true };
}

export function createBlankStoredPage(title = 'صفحه‌ی خالی', slug = 'empty-page'): StoredPage {
  const document = createEmptyDocument(title, slug);
  return { id: document.id, title, slug, document, updatedAt: document.updatedAt, status: 'draft', version: 1, versions: [], inheritMasterLayout: true };
}

export function createInitialStorageState(): BuilderStorageState {
  const page = createStoredPage('صفحه‌ی اصلی', 'home');
  return { schemaVersion: CURRENT_STORAGE_VERSION, activePageId: page.id, pages: [page], assets: [], blocks: [], masterLayout: createInitialMasterLayoutDocument() };
}

function migratePage(value: unknown): StoredPage | null {
  if (!isRecord(value) || typeof value.id !== 'string' || typeof value.title !== 'string' || typeof value.slug !== 'string' || !isBuilderDocument(value.document)) return null;
  const document = normalizeBuilderDocument(value.document);
  return {
    id: value.id,
    title: value.title,
    slug: value.slug,
    document,
    updatedAt: typeof value.updatedAt === 'string' ? value.updatedAt : document.updatedAt,
    status: value.status === 'published' ? 'published' : 'draft',
    publishedAt: typeof value.publishedAt === 'string' ? value.publishedAt : undefined,
    version: typeof value.version === 'number' && value.version > 0 ? value.version : 1,
    versions: Array.isArray(value.versions) ? value.versions.filter((version): version is BuilderPageVersion => isRecord(version) && typeof version.id === 'string' && typeof version.version === 'number' && typeof version.createdAt === 'string' && isBuilderDocument(version.document)).map((version) => ({ ...version, document: normalizeBuilderDocument(version.document) })).slice(-20) : [],
    inheritMasterLayout: value.inheritMasterLayout !== false,
  };
}

function migrateAsset(value: unknown): BuilderAsset | null {
  if (!isRecord(value) || typeof value.id !== 'string' || typeof value.name !== 'string' || typeof value.mimeType !== 'string' || typeof value.src !== 'string') return null;
  return { id: value.id, name: value.name, mimeType: value.mimeType, src: value.src, createdAt: typeof value.createdAt === 'string' ? value.createdAt : now() };
}

function migrateAssets(value: unknown): BuilderAsset[] {
  if (!Array.isArray(value)) return [];
  const ids = new Set<string>();
  return value.map(migrateAsset).filter((asset): asset is BuilderAsset => {
    if (!asset || ids.has(asset.id)) return false;
    ids.add(asset.id);
    return true;
  });
}

function migrateBlock(value: unknown): BuilderBlock | null {
  if (!isRecord(value) || typeof value.id !== 'string' || typeof value.title !== 'string' || typeof value.rootId !== 'string' || !isRecord(value.nodes)) return null;
  const nodes = Object.entries(value.nodes);
  if (!nodes.every(([id, node]) => isBuilderNode(node) && node.id === id) || !isBuilderNode(value.nodes[value.rootId])) return null;
  const typedNodes = normalizeBuilderNodes(value.nodes as Record<string, BuilderNode>);
  if (!isValidNodeGraph(typedNodes, value.rootId)) return null;
  return { id: value.id, title: value.title, rootId: value.rootId, nodes: typedNodes, createdAt: typeof value.createdAt === 'string' ? value.createdAt : now() };
}

function migrateBlocks(value: unknown): BuilderBlock[] {
  if (!Array.isArray(value)) return [];
  const ids = new Set<string>();
  return value.map(migrateBlock).filter((block): block is BuilderBlock => {
    if (!block || ids.has(block.id)) return false;
    ids.add(block.id);
    return true;
  });
}

function hasMissingAssetReference(value: unknown, assetIds: Set<string>): boolean {
  if (typeof value === 'string') return value.startsWith('asset:') && !assetIds.has(value.slice(6));
  if (Array.isArray(value)) return value.some((item) => hasMissingAssetReference(item, assetIds));
  if (isRecord(value)) return Object.values(value).some((item) => hasMissingAssetReference(item, assetIds));
  return false;
}

function hasMissingAssetReferences(document: BuilderDocument, assets: BuilderAsset[], blocks: BuilderBlock[]): boolean {
  const assetIds = new Set(assets.map((asset) => asset.id));
  const documents = [document, ...blocks.map((block) => ({ nodes: block.nodes }))];
  return documents.some((item) => Object.values(item.nodes).some((node) => hasMissingAssetReference(node.props, assetIds)));
}

function migrateState(value: unknown): BuilderStorageState | null {
  if (!isRecord(value) || !Array.isArray(value.pages)) return null;
  const pageIds = new Set<string>();
  const pageSlugs = new Set<string>();
  const pages = value.pages.map(migratePage).filter((page): page is StoredPage => {
    if (!page || pageIds.has(page.id)) return false;
    pageIds.add(page.id);
    const baseSlug = page.slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '') || `page-${page.id.slice(-8)}`;
    let slug = baseSlug;
    let suffix = 2;
    while (pageSlugs.has(slug)) slug = `${baseSlug}-${suffix++}`;
    pageSlugs.add(slug);
    if (slug !== page.slug || page.document.id !== page.id || page.document.title !== page.title || page.document.slug !== slug) {
      page.slug = slug;
      page.document = { ...page.document, id: page.id, title: page.title, slug };
    }
    return true;
  });
  if (!pages.length) return null;
  const requestedPageId = typeof value.activePageId === 'string' ? value.activePageId : null;
  const activePageId = requestedPageId && pages.some((page) => page.id === requestedPageId) ? requestedPageId : pages[0].id;
  const assets = migrateAssets(value.assets);
  const blocks = migrateBlocks(value.blocks);
  const masterLayout = isBuilderDocument(value.masterLayout) ? normalizeBuilderDocument(value.masterLayout) : createInitialMasterLayoutDocument();
  return { schemaVersion: CURRENT_STORAGE_VERSION, activePageId, pages, assets, blocks, masterLayout };
}

export function loadBuilderState(options: { respectPreferences?: boolean } = {}): BuilderStorageState {
  if (typeof window === 'undefined') return createInitialStorageState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = createInitialStorageState();
      saveBuilderState(initial);
      return initial;
    }
    const parsed: unknown = JSON.parse(raw);
    const migrated = migrateState(parsed);
    if (!migrated) return createInitialStorageState();
    const preferredPage = options.respectPreferences === false ? null : getBuilderPreferences().activePageId;
    const requestedPage = preferredPage || migrated.activePageId;
    const activePageId = requestedPage && migrated.pages.some((page) => page.id === requestedPage) ? requestedPage : migrated.pages[0].id;
    return { ...migrated, activePageId };
  } catch {
    return createInitialStorageState();
  }
}

export function saveBuilderState(state: BuilderStorageState): boolean {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function getBuilderStorageSnapshot(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function isBuilderStorageCorrupt(): boolean {
  const raw = getBuilderStorageSnapshot();
  if (!raw) return false;
  try {
    return !migrateState(JSON.parse(raw));
  } catch {
    return true;
  }
}

function storageContent(value: string | null): string | null {
  if (!value) return null;
  try {
    const state = migrateState(JSON.parse(value));
    return state ? JSON.stringify([state.pages, state.assets, state.blocks, state.masterLayout]) : null;
  } catch {
    return null;
  }
}

export function hasUnsavedBuilderChanges(state: BuilderStorageState, snapshot: string | null): boolean {
  return JSON.stringify([state.pages, state.assets, state.blocks, state.masterLayout]) !== storageContent(snapshot);
}

export function saveBuilderStateSafely(state: BuilderStorageState, expected: string | null): 'saved' | 'conflict' | 'error' {
  if (typeof window === 'undefined') return 'error';
  try {
    const current = window.localStorage.getItem(STORAGE_KEY);
    if (current !== expected && storageContent(current) !== storageContent(expected)) return 'conflict';
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return 'saved';
  } catch {
    return 'error';
  }
}

export function readImportedDocument(value: unknown): BuilderDocument | null {
  return isBuilderDocument(value) ? normalizeBuilderDocument(value) : null;
}

export function createBundle(page: BuilderDocument, assets: BuilderAsset[], blocks: BuilderBlock[]): BuilderBundle {
  return { format: 'digikit-builder-bundle', formatVersion: 1, exportedAt: now(), page, assets, blocks };
}

export function readImportedBundle(value: unknown): BuilderBundle | null {
  if (!isRecord(value) || value.format !== 'digikit-builder-bundle' || value.formatVersion !== 1 || !isBuilderDocument(value.page)) return null;
  const assets = migrateAssets(value.assets);
  const blocks = migrateBlocks(value.blocks);
  if (hasMissingAssetReferences(value.page, assets, blocks)) return null;
  return { format: 'digikit-builder-bundle', formatVersion: 1, exportedAt: typeof value.exportedAt === 'string' ? value.exportedAt : now(), page: normalizeBuilderDocument(value.page), assets, blocks: blocks.map((block) => ({ ...block, nodes: normalizeBuilderNodes(block.nodes) })) };
}

export function createWorkspaceBundle(state: BuilderStorageState): BuilderWorkspaceBundle {
  return { format: 'digikit-builder-workspace', formatVersion: 1, exportedAt: now(), state };
}

export function readImportedWorkspace(value: unknown): BuilderStorageState | null {
  if (!isRecord(value) || value.format !== 'digikit-builder-workspace' || value.formatVersion !== 1) return null;
  return migrateState(value.state);
}

export function makePageId(): string {
  return makeId('page');
}

export function makeAssetId(): string {
  return makeId('asset');
}

export function makeBlockId(): string {
  return makeId('block');
}

export function getTimestamp(): string {
  return now();
}

export function getStorageKey(): string {
  return STORAGE_KEY;
}

function remapBuilderValue(value: BuilderValue, assetIds: Map<string, string>): BuilderValue {
  if (typeof value === 'string' && value.startsWith('asset:')) {
    const nextId = assetIds.get(value.slice(6));
    return nextId ? `asset:${nextId}` : value;
  }
  if (Array.isArray(value)) return value.map((item) => remapBuilderValue(item, assetIds));
  if (isRecord(value)) return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, remapBuilderValue(item, assetIds)]));
  return value;
}

function remapDocumentAssets(document: BuilderDocument, assetIds: Map<string, string>): BuilderDocument {
  return {
    ...document,
    nodes: Object.fromEntries(Object.values(document.nodes).map((node) => [node.id, { ...node, props: remapBuilderValue(node.props, assetIds) as BuilderProps }])),
  };
}

function remapBlockAssets(block: BuilderBlock, assetIds: Map<string, string>, id: string): BuilderBlock {
  return {
    ...block,
    id,
    nodes: Object.fromEntries(Object.values(block.nodes).map((node) => [node.id, { ...node, props: remapBuilderValue(node.props, assetIds) as BuilderProps }])),
  };
}

export function mergeImportedBundle(bundle: BuilderBundle, existingAssets: BuilderAsset[], existingBlocks: BuilderBlock[]): BuilderBundle {
  const existingAssetById = new Map(existingAssets.map((asset) => [asset.id, asset]));
  const assetIds = new Map<string, string>();
  const assets: BuilderAsset[] = [];
  for (const asset of bundle.assets) {
    const current = existingAssetById.get(asset.id);
    if (current && current.src === asset.src && current.mimeType === asset.mimeType) {
      assetIds.set(asset.id, current.id);
      continue;
    }
    const id = current ? makeAssetId() : asset.id;
    assetIds.set(asset.id, id);
    assets.push({ ...asset, id });
  }

  const existingBlockIds = new Set(existingBlocks.map((block) => block.id));
  const blocks = bundle.blocks.map((block) => {
    let id = block.id;
    if (existingBlockIds.has(id)) id = makeBlockId();
    existingBlockIds.add(id);
    return remapBlockAssets(block, assetIds, id);
  });

  return {
    ...bundle,
    page: remapDocumentAssets(bundle.page, assetIds),
    assets,
    blocks,
  };
}

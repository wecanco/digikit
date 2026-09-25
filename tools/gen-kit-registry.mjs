import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getFallbackControls, getFallbackGroup, getFallbackLabel } from './kit-registry.defaults.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const COMPONENTS_DIR = resolve(ROOT, 'packages/ui/src/components');
const OUTPUT = resolve(ROOT, 'apps/web/app/kit/components/registry.generated.ts');

const toSlug = (name) => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
const componentExportNames = (source) => {
  const names = new Set();
  for (const match of source.matchAll(/export\s+(?:function|const|class)\s+([A-Z][A-Za-z0-9_]*)/g)) names.add(match[1]);
  for (const match of source.matchAll(/export\s*\{([^}]+)\}/g)) {
    for (const part of match[1].split(',')) {
      const name = part.trim().split(/\s+as\s+/).pop();
      if (/^[A-Z][A-Za-z0-9_]*$/.test(name || '')) names.add(name);
    }
  }
  return [...names].sort((a, b) => a.localeCompare(b));
};
const readMeta = (folder) => {
  const file = resolve(COMPONENTS_DIR, folder, 'component.meta.json');
  if (!existsSync(file)) return {};
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch {
    console.warn(`⚠ metadata نامعتبر نادیده گرفته شد: ${folder}/component.meta.json`);
    return {};
  }
};
const normalizeControl = (control) => ({
  ...control,
  options: control.options?.map(String),
});
const componentMeta = (meta, exportName) => {
  const scoped = meta.components?.[exportName] || {};
  return { ...meta, ...scoped };
};

const folders = readdirSync(COMPONENTS_DIR, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && existsSync(resolve(COMPONENTS_DIR, entry.name, 'index.tsx')))
  .map((entry) => entry.name)
  .sort((a, b) => a.localeCompare(b));

const entries = [];
for (const folder of folders) {
  const sourceFile = resolve(COMPONENTS_DIR, folder, 'index.tsx');
  const sourceText = readFileSync(sourceFile, 'utf8');
  const exports = componentExportNames(sourceText);
  const renderableExports = exports.length ? exports : [folder];
  const folderMeta = readMeta(folder);
  const hasDemo = existsSync(resolve(COMPONENTS_DIR, folder, 'demo.tsx'));

  for (const exportName of renderableExports) {
    const meta = componentMeta(folderMeta, exportName);
    const label = meta.label || (renderableExports.length === 1 && folderMeta.label) || getFallbackLabel(exportName);
    const group = meta.group || (renderableExports.length === 1 && folderMeta.group) || getFallbackGroup(exportName);
    const controls = (meta.controls || getFallbackControls(exportName)).map(normalizeControl);
    entries.push({
      slug: toSlug(exportName),
      exportName,
      folder,
      label,
      group,
      description: meta.description || `کامپوننت ${label} برای ساخت تجربه‌های RTL دیجی‌کیت.`,
      tags: meta.tags || [exportName, group, 'RTL', 'React'],
      source: `packages/ui/src/components/${folder}/index.tsx`,
      importStatement: `import { ${exportName} } from '@digikit/ui';`,
      controls,
      defaultProps: meta.defaultProps || {},
      hasCustomDemo: hasDemo,
      renderable: exports.includes(exportName),
    });
  }
}

const uniqueExports = [...new Set(entries.filter((entry) => entry.renderable).map((entry) => entry.exportName))].sort((a, b) => a.localeCompare(b));
const importBlock = uniqueExports.length
  ? `import { ${uniqueExports.join(', ')} } from '@digikit/ui';`
  : '';
const mapBlock = uniqueExports.length
  ? `export const COMPONENT_MAP: Record<string, ComponentType<any>> = {\n${uniqueExports.map((name) => `  ${name},`).join('\n')}\n};`
  : 'export const COMPONENT_MAP: Record<string, ComponentType<any>> = {};';

const demoFolders = [...new Set(entries.filter((entry) => entry.hasCustomDemo).map((entry) => entry.folder))];
const demoImportBlock = demoFolders.length
  ? demoFolders.map((folder) => `import ${folder}Demo from '../../../../../packages/ui/src/components/${folder}/demo';`).join('\n')
  : '';
const demoMapBlock = demoFolders.length
  ? `export const CUSTOM_DEMO_MAP: Record<string, ComponentType<any>> = {\n${entries.filter((entry) => entry.hasCustomDemo).map((entry) => `  ${entry.exportName}: ${entry.folder}Demo,`).join('\n')}\n};`
  : 'export const CUSTOM_DEMO_MAP: Record<string, ComponentType<any>> = {};';

const output = `import type { ComponentType } from 'react';
${importBlock}
${demoImportBlock}

export type KitControlType = 'text' | 'number' | 'boolean' | 'select' | 'json' | 'color';
export type KitControlValue = string | number | boolean;

export interface KitControl {
  key: string;
  label: string;
  type: KitControlType;
  defaultValue: KitControlValue;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  description?: string;
  placeholder?: string;
}

export interface KitComponentEntry {
  slug: string;
  exportName: string;
  folder: string;
  label: string;
  group: string;
  description: string;
  tags: string[];
  source: string;
  importStatement: string;
  controls: KitControl[];
  defaultProps: Record<string, unknown>;
  hasCustomDemo: boolean;
  renderable: boolean;
}

export const COMPONENT_REGISTRY: KitComponentEntry[] = ${JSON.stringify(entries, null, 2)};

${mapBlock}

${demoMapBlock}
`;

writeFileSync(OUTPUT, output, 'utf8');
console.log(`✓ ${entries.length} component entries → ${OUTPUT}`);
console.log(`✓ ${uniqueExports.length} renderable exports mapped`);

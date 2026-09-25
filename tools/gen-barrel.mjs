// بازتولید بارل packages/ui/src/index.ts از روی پوشه‌های کامپوننت
// اجرا:  node tools/gen-barrel.mjs
// هر کامپوننت: src/components/<Name>/index.tsx — خروجی‌های نامدار استخراج و صادر می‌شوند.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = resolve(ROOT, 'packages/ui/src');
const COMP = resolve(SRC, 'components');

const VALUE_RE = [/export function (\w+)/g, /export const (\w+)\s*[:=]/g, /export class (\w+)/g];
const TYPE_RE = [/export type (\w+)/g, /export interface (\w+)/g];
const LIST_RE = /export \{ ([^}]+) \}/g;

const folders = readdirSync(COMP, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

const lines = [];
const warnings = [];

lines.push('/* ─── بارل @digikit/ui — به‌صورت خودکار از tools/gen-barrel.mjs ساخته می‌شود؛ دستی ویرایش نکنید ─── */');
lines.push('');
lines.push("export * from './types';");
lines.push("export { fmt, toFa, faNum, toFaDecimal } from './utils/format';");
lines.push("export { productHref } from './utils/links';");
lines.push("export { DIGIKIT_STORAGE_EVENTS, DIGIKIT_STORAGE_KEYS } from './utils/storage';");
lines.push("export * from './hooks/useCart';");
lines.push("export * from './hooks/useAddresses';");
lines.push("export * from './hooks/useFavs';");
lines.push("export * from './hooks/useOrders';");
lines.push("export * from './hooks/useUser';");

for (const name of folders) {
  const entry = resolve(COMP, name, 'index.tsx');
  let src;
  try {
    src = readFileSync(entry, 'utf8');
  } catch {
    warnings.push(`پوشه بدون index.tsx: ${name}`);
    continue;
  }
  const values = new Set();
  const types = new Set();
  for (const re of VALUE_RE) {
    for (const m of src.matchAll(re)) values.add(m[1]);
  }
  for (const m of src.matchAll(LIST_RE)) {
    for (const part of m[1].split(',')) {
      const id = part.trim().split(/\s+as\s+/).pop()?.trim();
      if (id) values.add(id);
    }
  }
  for (const re of TYPE_RE) {
    for (const m of src.matchAll(re)) types.add(m[1]);
  }
  if (/export default/.test(src)) warnings.push(`${name}: export default دارد (قرارداد: فقط خروجی نامدار)`);
  if (!values.size && !types.size) {
    warnings.push(`${name}: خروجی نامداری پیدا نشد`);
    continue;
  }
  const valueList = [...values].sort();
  const typeList = [...types].sort();
  if (valueList.length) lines.push(`export { ${valueList.join(', ')} } from './components/${name}';`);
  if (typeList.length) lines.push(`export type { ${typeList.join(', ')} } from './components/${name}';`);
}

const barrel = lines.join('\n') + '\n';
writeFileSync(resolve(SRC, 'index.ts'), barrel, 'utf8');
console.log(barrel);
if (warnings.length) {
  console.warn('⚠ هشدارها:');
  for (const w of warnings) console.warn(' -', w);
}
console.log(`✓ ${folders.length} پوشه کامپوننت → src/index.ts`);

import { strToU8, zipSync } from 'fflate';
import { generateHtmlCode } from './builder-export';
import type { BuilderStorageState } from './builder.types';

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

export function createStaticSiteArchive(state: BuilderStorageState): Uint8Array {
  const publishedPages = state.pages.filter((page) => page.status === 'published');
  if (!publishedPages.length) throw new Error('برای خروجی سایت، ابتدا یک صفحه را به‌صورت محلی منتشر کنید.');

  const files: Record<string, Uint8Array> = {};
  const slugs = new Set<string>();

  for (const page of publishedPages) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(page.slug) || slugs.has(page.slug)) {
      throw new Error('نشانی صفحه‌های منتشرشده باید یکتا و شامل حروف لاتین کوچک، عدد یا خط تیره باشد.');
    }
    slugs.add(page.slug);
    files[`${page.slug}/index.html`] = strToU8(generateHtmlCode(page.document, state.assets, page.inheritMasterLayout !== false ? state.masterLayout : null));
  }

  files['index.html'] = files['home/index.html'] || strToU8(`<!doctype html>
<html lang="fa" dir="rtl">
  <head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>صفحه‌ها</title></head>
  <body><main><h1>صفحه‌ها</h1><ul>${publishedPages.map((page) => `<li><a href="./${page.slug}/">${escapeHtml(page.title)}</a></li>`).join('')}</ul></main></body>
</html>`);

  return zipSync(files, { level: 6 });
}

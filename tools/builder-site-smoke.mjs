import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { chromium } from 'playwright';

const { strFromU8, unzipSync } = createRequire(new URL('../apps/web/package.json', import.meta.url))('fflate');
const base = process.env.DIGIKIT_BUILDER_URL || 'http://localhost:4301';
const browser = await chromium.launch(process.env.DIGIKIT_CHROME_PATH ? { executablePath: process.env.DIGIKIT_CHROME_PATH } : { channel: 'chrome' });
const context = await browser.newContext({ acceptDownloads: true });
const errors = [];

async function downloadSite(dashboard) {
  const [download] = await Promise.all([
    dashboard.waitForEvent('download'),
    dashboard.getByRole('button', { name: 'دانلود سایت استاتیک' }).click(),
  ]);
  return unzipSync(new Uint8Array(await readFile(await download.path())));
}

try {
  const editor = await context.newPage();
  const dashboard = await context.newPage();
  editor.on('pageerror', (error) => errors.push(error.message));
  dashboard.on('pageerror', (error) => errors.push(error.message));
  await editor.goto(`${base}/builder`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await dashboard.goto(`${base}/builder/dashboard`, { waitUntil: 'domcontentloaded', timeout: 60000 });

  const exportButton = dashboard.getByRole('button', { name: 'دانلود سایت استاتیک' });
  assert.equal(await exportButton.isDisabled(), true);
  await editor.getByRole('button', { name: 'انتشار محلی' }).click();
  const homeFiles = await downloadSite(dashboard);
  assert.deepEqual(Object.keys(homeFiles).sort(), ['home/index.html', 'index.html']);
  assert.match(strFromU8(homeFiles['index.html']), /صفحه‌ی اصلی/);
  assert.match(strFromU8(homeFiles['home/index.html']), /digikit-layout-grid/);

  await editor.getByRole('textbox', { name: 'slug' }).fill('catalog');
  await editor.getByRole('textbox', { name: 'نام صفحه' }).fill('فهرست <محصول>');
  await editor.getByRole('button', { name: 'انتشار محلی' }).click();
  await dashboard.getByRole('heading', { name: 'فهرست <محصول>' }).waitFor();
  const catalogFiles = await downloadSite(dashboard);
  assert.deepEqual(Object.keys(catalogFiles).sort(), ['catalog/index.html', 'index.html']);
  assert.match(strFromU8(catalogFiles['index.html']), /href="\.\/catalog\/">فهرست &lt;محصول&gt;<\/a>/);
  assert.match(strFromU8(catalogFiles['catalog/index.html']), /digikit-layout-grid/);

  dashboard.once('dialog', (dialog) => dialog.accept('صفحه پیش‌نویس'));
  await dashboard.getByRole('button', { name: 'صفحه خالی' }).click();
  await dashboard.getByRole('heading', { name: 'صفحه پیش‌نویس' }).waitFor();
  const publishedFiles = await downloadSite(dashboard);
  assert.deepEqual(Object.keys(publishedFiles).sort(), ['catalog/index.html', 'index.html']);
  assert.deepEqual(errors, []);
  console.log('✓ صفحه اصلی، فهرست صفحات، حذف پیش‌نویس و ZIP معتبر');
} finally {
  await browser.close();
}

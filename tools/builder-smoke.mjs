import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import ts from 'typescript';

const base = process.env.DIGIKIT_BUILDER_URL || 'http://localhost:4301';
const storageKey = 'digikit:builder:state:v1';
const browser = await chromium.launch(process.env.DIGIKIT_CHROME_PATH ? { executablePath: process.env.DIGIKIT_CHROME_PATH } : { channel: 'chrome' });
const context = await browser.newContext({ acceptDownloads: true, viewport: { width: 1440, height: 900 } });
const errors = [];

async function confirmDialog(page, label) {
  const dialog = page.getByRole('dialog');
  await dialog.waitFor();
  await dialog.getByRole('button', { name: label, exact: true }).click();
  await dialog.waitFor({ state: 'detached' });
}

try {
  const editor = await context.newPage();
  const dashboard = await context.newPage();
  editor.on('pageerror', (error) => errors.push(error.message));
  dashboard.on('pageerror', (error) => errors.push(error.message));
  await editor.goto(`${base}/builder`);
  await dashboard.goto(`${base}/builder/dashboard`);
  const titleInput = editor.getByRole('textbox', { name: 'نام صفحه' });
  await titleInput.fill('صفحه آزمایشی');
  await editor.waitForFunction((key) => JSON.parse(localStorage.getItem(key)).pages[0].title === 'صفحه آزمایشی', storageKey);
  await dashboard.getByRole('heading', { name: 'صفحه آزمایشی' }).waitFor();
  assert.equal(await editor.getByRole('alert').filter({ hasText: 'تغییرات این تب هنوز ذخیره نشده‌اند' }).count(), 0);
  console.log('✓ ویرایش و همگام‌سازی بین دو تب');

  await editor.locator('[data-builder-type="builder/hero"]').first().click();
  await editor.getByRole('combobox', { name: 'رنگ' }).selectOption('cream');
  const [htmlDownload] = await Promise.all([editor.waitForEvent('download'), editor.getByRole('button', { name: 'HTML', exact: true }).click()]);
  const html = await readFile(await htmlDownload.path(), 'utf8');
  assert.match(html, /digikit-hero-cream/);
  assert.match(html, /digikit-layout-grid/);
  assert.match(html, /max-width:\s*640px/);
  const [tsxDownload] = await Promise.all([editor.waitForEvent('download'), editor.getByRole('button', { name: 'TSX', exact: true }).click()]);
  const tsx = await readFile(await tsxDownload.path(), 'utf8');
  assert.match(tsx, /HeroBanner/);
  assert.match(tsx, /digikit-layout-grid/);
  console.log('✓ خروجی مستقل HTML و خروجی TSX');

  const heroNode = editor.locator('[data-builder-type="builder/hero"]').first();
  await heroNode.click({ button: 'right' });
  await editor.getByRole('menu', { name: /گزینه‌های/ }).waitFor();
  assert.equal(await editor.getByRole('menuitem', { name: 'ساخت duplicate' }).count(), 1);
  await editor.getByRole('menuitem', { name: 'ساخت duplicate' }).click();
  await editor.waitForFunction(() => document.querySelectorAll('[data-builder-type="builder/hero"]').length >= 2);
  const heroesBeforeDelete = await editor.locator('[data-builder-type="builder/hero"]').count();
  await editor.locator('[data-builder-type="builder/hero"]').first().click({ button: 'right' });
  await editor.getByRole('menuitem', { name: 'حذف component' }).click();
  await confirmDialog(editor, 'حذف component');
  await editor.waitForFunction((count) => document.querySelectorAll('[data-builder-type="builder/hero"]').length === count - 1, heroesBeforeDelete);
  await editor.getByRole('button', { name: /دکمه نویگیشن/ }).first().click();
  await editor.locator('[data-builder-type="builder/navigation-button"]').waitFor();
  await editor.locator('[data-builder-type="builder/navigation-button"]').first().click({ button: 'right' });
  await editor.getByRole('menuitem', { name: 'باز کردن تنظیمات' }).click();
  await editor.getByRole('heading', { name: 'دکمه نویگیشن' }).waitFor();
  await editor.getByRole('combobox', { name: 'نماد' }).selectOption('search');
  await editor.getByRole('combobox', { name: 'گونه' }).selectOption('solid');
  const [navigationHtmlDownload] = await Promise.all([editor.waitForEvent('download'), editor.getByRole('button', { name: 'HTML', exact: true }).click()]);
  const navigationHtml = await readFile(await navigationHtmlDownload.path(), 'utf8');
  assert.match(navigationHtml, /digikit-navigation-button/);
  assert.match(navigationHtml, /aria-label="باز کردن منو"/);
  const [navigationTsxDownload] = await Promise.all([editor.waitForEvent('download'), editor.getByRole('button', { name: 'TSX', exact: true }).click()]);
  const navigationTsx = await readFile(await navigationTsxDownload.path(), 'utf8');
  assert.match(navigationTsx, /digikit-navigation-button-solid/);
  await editor.keyboard.press('Escape');
  assert.equal(await editor.getByRole('menu').count(), 0);
  console.log('✓ منوی راست‌کلیک، دکمه نویگیشن و خروجی آن');

  await editor.getByRole('button', { name: 'گرید محتوا', exact: true }).click();
  const contentGrid = editor.locator('[data-builder-type="builder/grid"]').last();
  await contentGrid.waitFor();
  await contentGrid.click();
  const columnsInput = editor.getByText('تعداد ستون', { exact: true }).locator('..').locator('input[type="number"]');
  await columnsInput.fill('2');
  await columnsInput.press('Tab');
  assert.equal(await contentGrid.locator('[data-builder-slot="column-0"]').count(), 1);
  assert.equal(await contentGrid.locator('[data-builder-slot="column-1"]').count(), 1);
  assert.equal(await editor.getByRole('button', { name: /ستون ۱/ }).count() > 0, true);
  assert.equal(await editor.getByRole('button', { name: /ستون ۲/ }).count() > 0, true);
  await editor.getByRole('button', { name: 'متن', exact: true }).click();
  const textNode = editor.locator('[data-builder-type="builder/text"]').last();
  const textNodeId = await textNode.getAttribute('data-builder-node');
  const gridNodeId = await contentGrid.getAttribute('data-builder-node');
  const textLayer = editor.locator('[class*="layerItem"]').filter({ hasText: 'متن' }).last();
  const secondColumn = editor.locator('[class*="layerSlot"]').filter({ hasText: 'ستون ۲' }).last().locator('[class*="layerSlotDrop"]').last();
  await textLayer.dragTo(secondColumn);
  await editor.waitForFunction(({ key, gridId, childId }) => {
    const state = JSON.parse(localStorage.getItem(key));
    const grid = Object.values(state.pages).flatMap((page) => Object.values(page.document.nodes)).find((node) => node.id === gridId);
    return Boolean(grid?.slots?.['column-1']?.includes(childId));
  }, { key: storageKey, gridId: gridNodeId, childId: textNodeId });
  assert.ok(textNodeId && gridNodeId);
  console.log('✓ گرید چندستونه و نمایش ستون‌ها در outline');

  await contentGrid.click({ button: 'right' });
  await editor.getByRole('menuitem', { name: 'حذف component' }).click();
  await editor.getByRole('dialog').waitFor();
  await editor.keyboard.press('Escape');
  assert.equal(await editor.getByRole('dialog').count(), 0);
  console.log('✓ تأیید accessible برای حذف و لغو با Escape');

  await editor.getByRole('button', { name: 'طراحی layout master', exact: true }).first().click();
  await editor.getByText('در حال طراحی layout master', { exact: false }).waitFor();
  assert.equal(await editor.locator('[data-builder-type="builder/page-slot"]').count(), 1);
  await editor.getByRole('button', { name: 'بازگشت به صفحه', exact: true }).first().click();
  await editor.getByText('layout master به‌صورت کم‌رنگ', { exact: false }).waitFor();
  assert.ok(await editor.locator('[data-builder-master-slot="true"]').count() >= 1);
  await editor.getByRole('button', { name: 'غیرفعال کردن ارث‌بری', exact: true }).click();
  assert.equal(await editor.locator('[data-builder-master-slot="true"]').count(), 0);
  await editor.getByRole('button', { name: 'فعال کردن ارث‌بری', exact: true }).click();
  assert.ok(await editor.locator('[data-builder-master-slot="true"]').count() >= 1);
  console.log('✓ طراحی layout master، ارث‌بری صفحه و نمایش کم‌رنگ');

  await editor.getByRole('textbox', { name: 'نام صفحه' }).fill('تغییرات ذخیره‌نشده من');
  await editor.waitForFunction(() => document.querySelector('input[aria-label="نام صفحه"]')?.value === 'تغییرات ذخیره‌نشده من');
  await dashboard.evaluate((key) => {
    const state = JSON.parse(localStorage.getItem(key));
    state.pages[0].title = 'تغییر هم‌زمان تب دیگر';
    state.pages[0].document.title = state.pages[0].title;
    localStorage.setItem(key, JSON.stringify(state));
  }, storageKey);
  await editor.getByRole('alert').getByText('تغییرات این تب هنوز ذخیره نشده‌اند', { exact: false }).waitFor();
  await editor.waitForTimeout(500);
  assert.equal(await editor.evaluate((key) => JSON.parse(localStorage.getItem(key)).pages[0].title, storageKey), 'تغییر هم‌زمان تب دیگر');
  const [backupDownload] = await Promise.all([editor.waitForEvent('download'), editor.getByRole('button', { name: 'پشتیبان تغییرات من' }).click()]);
  const backup = JSON.parse(await readFile(await backupDownload.path(), 'utf8'));
  assert.equal(backup.state.pages[0].title, 'تغییرات ذخیره‌نشده من');
  await editor.getByRole('button', { name: 'دریافت تغییرات جدید' }).click();
  await confirmDialog(editor, 'دریافت تغییرات');
  await editor.getByRole('textbox', { name: 'نام صفحه' }).waitFor();
  assert.equal(await editor.getByRole('textbox', { name: 'نام صفحه' }).inputValue(), 'تغییر هم‌زمان تب دیگر');
  assert.equal(await editor.getByRole('alert').filter({ hasText: 'تغییرات این تب هنوز ذخیره نشده‌اند' }).count(), 0);
  console.log('✓ تعارض بدون بازنویسی داده و پشتیبان قبل از بازیابی');

  await editor.setViewportSize({ width: 390, height: 844 });
  await editor.keyboard.press('Escape');
  await editor.getByRole('button', { name: 'باز کردن پنل componentها' }).click();
  await editor.getByRole('button', { name: 'بستن کتابخانه' }).click();
  const viewport = await editor.evaluate(() => ({ document: document.documentElement.scrollWidth, window: window.innerWidth }));
  assert.ok(viewport.document <= viewport.window + 1, `horizontal overflow: ${JSON.stringify(viewport)}`);
  assert.deepEqual(errors, []);
  console.log('✓ پنل موبایل، نبود overflow و خطای مرورگر');

  await editor.setViewportSize({ width: 1440, height: 900 });
  await editor.getByRole('button', { name: 'باز کردن پنل componentها' }).click();
  editor.once('dialog', (dialog) => dialog.accept('خدمات آزمایشی'));
  await editor.getByRole('button', { name: /معرفی خدمات.*ناوبری/ }).click();
  await editor.locator('[data-builder-type="builder/faq"]').waitFor();
  const [serviceDownload] = await Promise.all([editor.waitForEvent('download'), editor.getByRole('button', { name: 'HTML', exact: true }).click()]);
  const serviceHtml = await readFile(await serviceDownload.path(), 'utf8');
  assert.match(serviceHtml, /digikit-navigation/);
  assert.match(serviceHtml, /id="services"/);
  assert.match(serviceHtml, /id="contact"/);
  assert.match(serviceHtml, /<details class="digikit-faq">/);
  const preview = await context.newPage();
  await preview.setViewportSize({ width: 390, height: 844 });
  await preview.setContent(serviceHtml);
  const mobileColumns = await preview.locator('.digikit-layout-grid').evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(' ').length);
  assert.equal(mobileColumns, 1);
  const [serviceTsxDownload] = await Promise.all([editor.waitForEvent('download'), editor.getByRole('button', { name: 'TSX', exact: true }).click()]);
  const serviceTsx = await readFile(await serviceTsxDownload.path(), 'utf8');
  assert.match(serviceTsx, /<details className="digikit-faq">/);
  const result = ts.transpileModule(serviceTsx, { fileName: 'service.tsx', reportDiagnostics: true, compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext } });
  assert.deepEqual(result.diagnostics?.filter((entry) => entry.category === ts.DiagnosticCategory.Error) || [], []);
  console.log('✓ قالب خدمات، لینک داخلی، FAQ، گرید موبایل و TSX معتبر');

  const recoveryContext = await browser.newContext({ acceptDownloads: true });
  await recoveryContext.addInitScript((key) => localStorage.setItem(key, '{"damaged":true}'), storageKey);
  const recoveryPage = await recoveryContext.newPage();
  recoveryPage.on('pageerror', (error) => errors.push(error.message));
  await recoveryPage.goto(`${base}/builder/dashboard`);
  await recoveryPage.getByRole('alert').getByText('دادهٔ ذخیره‌شده نامعتبر است', { exact: false }).waitFor();
  await recoveryPage.waitForTimeout(450);
  assert.equal(await recoveryPage.evaluate((key) => localStorage.getItem(key), storageKey), '{"damaged":true}');
  const [recoveryDownload] = await Promise.all([recoveryPage.waitForEvent('download'), recoveryPage.getByRole('button', { name: 'دانلود دادهٔ آسیب‌دیده' }).click()]);
  assert.equal(await readFile(await recoveryDownload.path(), 'utf8'), '{"damaged":true}');
  await recoveryPage.getByRole('button', { name: 'بازنشانی با تأیید' }).click();
  await confirmDialog(recoveryPage, 'بازنشانی workspace');
  await recoveryPage.waitForFunction((key) => JSON.parse(localStorage.getItem(key))?.schemaVersion === 3, storageKey);
  assert.deepEqual(errors, []);
  await recoveryContext.close();
  console.log('✓ تشخیص دادهٔ خراب، پشتیبان خام و بازنشانی آگاهانه');
} finally {
  await browser.close();
}

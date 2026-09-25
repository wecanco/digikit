import type { BuilderAsset, BuilderDocument, BuilderNode, BuilderResponsiveStyles, BuilderStyle, BuilderValue } from './builder.types';
import { resolveBuilderProducts, safeBuilderHref } from './builder-products';
import { getBuilderSlotNames } from './builder-slots';

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function jsxString(value: string): string {
  return JSON.stringify(value);
}

function jsxNumber(value: number): string {
  return Number.isFinite(value) ? String(value) : '0';
}

function valueAsString(value: BuilderValue | undefined, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function valueAsNumber(value: BuilderValue | undefined, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function optionValue(value: BuilderValue | undefined, options: string[], fallback: string): string {
  return typeof value === 'string' && options.includes(value) ? value : fallback;
}

function navigationButtonSymbol(value: string): string {
  return ({ menu: '☰', close: '×', back: '‹', more: '⋯', search: '⌕' } as Record<string, string>)[value] || '☰';
}

function safeAnchor(value: BuilderValue | undefined): string {
  return valueAsString(value).replace(/[^a-zA-Z0-9_-]/g, '');
}

function assetSource(value: BuilderValue | undefined, assets: BuilderAsset[]): string {
  const source = valueAsString(value);
  if (!source.startsWith('asset:')) return source;
  return assets.find((asset) => asset.id === source.slice(6))?.src || '';
}

function safeImageSource(value: BuilderValue | undefined, assets: BuilderAsset[]): string {
  const source = assetSource(value, assets).trim();
  if (/^data:image\//i.test(source)) return source;
  if (/^https?:\/\//i.test(source) || /^\/(?!\/)/.test(source) || /^\.{1,2}\//.test(source)) return source;
  return '';
}

function exportProducts(node: BuilderNode, assets: BuilderAsset[]) {
  return resolveBuilderProducts(node.props.items).map((product) => ({
    ...product,
    href: safeBuilderHref(product.href || '', '#'),
    image: product.image.startsWith('ph:') ? product.image : safeImageSource(product.image, assets) || `ph:${product.id}`,
  }));
}

function childrenOf(document: BuilderDocument, node: BuilderNode): BuilderNode[] {
  return (node.slots.children || []).map((childId) => document.nodes[childId]).filter(Boolean);
}

function slotChildrenOf(document: BuilderDocument, node: BuilderNode, slotName: string): BuilderNode[] {
  return (node.slots[slotName] || []).map((childId) => document.nodes[childId]).filter(Boolean);
}

function nodeClassName(node: BuilderNode): string {
  return `digikit-node-${node.id.replace(/[^a-zA-Z0-9_-]/g, '-')}`;
}

function safeCssValue(value: string): string {
  return value.replace(/[<>;{}]/g, '').replace(/[\r\n]/g, ' ');
}

function styleDeclarations(style: BuilderStyle | undefined): string {
  if (!style) return '';
  const declarations: string[] = [];
  if (style.display) declarations.push(`display:${style.display}`);
  if (typeof style.maxWidth === 'number') declarations.push(`max-width:${style.maxWidth}px`);
  if (typeof style.marginTop === 'number') declarations.push(`margin-top:${style.marginTop}px`);
  if (typeof style.marginBottom === 'number') declarations.push(`margin-bottom:${style.marginBottom}px`);
  if (typeof style.paddingBlock === 'number') declarations.push(`padding-block:${style.paddingBlock}px`);
  if (typeof style.background === 'string' && style.background.trim()) declarations.push(`background:${safeCssValue(style.background)}`);
  return declarations.join(';');
}

function hasResponsiveStyles(styles: BuilderResponsiveStyles | undefined): boolean {
  return Boolean(styles && Object.values(styles).some((style) => Boolean(style && styleDeclarations(style))));
}

function responsiveCssForNode(node: BuilderNode): string {
  if (!hasResponsiveStyles(node.styles)) return '';
  const className = `.${nodeClassName(node)}`;
  const rules: string[] = [];
  const desktop = styleDeclarations(node.styles?.desktop);
  const tablet = styleDeclarations(node.styles?.tablet);
  const mobile = styleDeclarations(node.styles?.mobile);
  if (desktop) rules.push(`${className}{${desktop}}`);
  if (tablet) rules.push(`@media (max-width:1024px){${className}{${tablet}}}`);
  if (mobile) rules.push(`@media (max-width:640px){${className}{${mobile}}}`);
  return rules.join('');
}

function responsiveCss(document: BuilderDocument): string {
  return Object.values(document.nodes).map(responsiveCssForNode).filter(Boolean).join('');
}

function jsxChildren(document: BuilderDocument, node: BuilderNode, depth: number, assets: BuilderAsset[]): string {
  return childrenOf(document, node).map((child) => renderReactNode(document, child, depth, assets)).join('\n');
}

function jsxSlotChildren(document: BuilderDocument, node: BuilderNode, slotName: string, depth: number, assets: BuilderAsset[]): string {
  return slotChildrenOf(document, node, slotName).map((child) => renderReactNode(document, child, depth, assets)).join('\n');
}

function renderReactNodeContent(document: BuilderDocument, node: BuilderNode, depth: number, assets: BuilderAsset[]): string {
  const indent = '  '.repeat(depth);
  const props = node.props;
  const children = jsxChildren(document, node, depth + 1, assets);
  switch (node.type) {
    case 'builder/root':
      return `${indent}<main dir="rtl" style={{ maxWidth: 1280, margin: '0 auto' }}>\n${children}\n${indent}</main>`;
    case 'builder/navigation':
      return `${indent}<nav aria-label="ناوبری صفحه" className="digikit-navigation"><strong>{${jsxString(valueAsString(props.brand, 'نام برند'))}}</strong><div>${(['first', 'second', 'third'] as const).filter((item) => valueAsString(props[`${item}Label`])).map((item) => `<a href=${jsxString(safeBuilderHref(valueAsString(props[`${item}Href`]), '#'))}>{${jsxString(valueAsString(props[`${item}Label`]))}}</a>`).join('')}</div></nav>`;
    case 'builder/navigation-button': {
      const variant = optionValue(props.variant, ['outline', 'solid', 'ghost'], 'outline');
      const label = valueAsString(props.label, 'منو');
      return `${indent}<a href=${jsxString(safeBuilderHref(valueAsString(props.href), '#'))} aria-label=${jsxString(valueAsString(props.ariaLabel, label || 'دکمه نویگیشن'))} className="digikit-navigation-button digikit-navigation-button-${variant}"><span aria-hidden="true">${navigationButtonSymbol(optionValue(props.icon, ['menu', 'close', 'back', 'more', 'search'], 'menu'))}</span>${label ? `<span>{${jsxString(label)}}</span>` : ''}</a>`;
    }
    case 'builder/page-slot':
      return `${indent}<div className="digikit-page-slot" aria-label="جایگاه محتوای صفحه" />`;
    case 'builder/section':
      return `${indent}<section${safeAnchor(props.anchor) ? ` id=${jsxString(safeAnchor(props.anchor))}` : ''} style={{ background: ${jsxString(safeCssValue(valueAsString(props.background, '#ffffff')))}, paddingBlock: ${jsxNumber(valueAsNumber(props.padding, 32))}, maxWidth: ${jsxNumber(valueAsNumber(props.maxWidth, 1200))}, marginInline: 'auto', width: '100%' }}>\n${children}\n${indent}</section>`;
    case 'builder/grid': {
      const columns = Math.max(1, Math.min(4, Math.round(valueAsNumber(props.columns, 2))));
      return `${indent}<div className="digikit-layout-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(${columns}, minmax(0, 1fr))', gap: ${jsxNumber(valueAsNumber(props.gap, 16)) }}>\n${getBuilderSlotNames(node).map((slotName) => `${indent}  <div className="digikit-layout-column" data-builder-slot="${slotName}">\n${jsxSlotChildren(document, node, slotName, depth + 2, assets)}\n${indent}  </div>`).join('\n')}\n${indent}</div>`;
    }
    case 'builder/card':
      return `${indent}<Card variant=${jsxString(valueAsString(props.variant, 'elevated'))} padding=${jsxString(valueAsString(props.padding, 'md'))}>\n${children}\n${indent}</Card>`;
    case 'builder/heading': {
      const level = ['h1', 'h2', 'h3'].includes(valueAsString(props.level)) ? valueAsString(props.level) : 'h2';
      return `${indent}<${level} style={{ textAlign: ${jsxString(valueAsString(props.align, 'right'))} }}>{${jsxString(valueAsString(props.text, 'عنوان بخش'))}}</${level}>`;
    }
    case 'builder/text':
      return `${indent}<p style={{ textAlign: ${jsxString(valueAsString(props.align, 'right'))}, lineHeight: 1.9, whiteSpace: 'pre-wrap' }}>{${jsxString(valueAsString(props.text))}}</p>`;
    case 'builder/feature':
      return `${indent}<article className="digikit-feature"><small>{${jsxString(valueAsString(props.eyebrow))}}</small><h3>{${jsxString(valueAsString(props.title))}}</h3><p>{${jsxString(valueAsString(props.description))}}</p></article>`;
    case 'builder/faq':
      return `${indent}<details className="digikit-faq"><summary>{${jsxString(valueAsString(props.question))}}</summary><p>{${jsxString(valueAsString(props.answer))}}</p></details>`;
    case 'builder/button':
      return `${indent}<a href=${jsxString(safeBuilderHref(valueAsString(props.href), '#'))} className="digikit-button digikit-button-${optionValue(props.variant, ['primary', 'secondary', 'outline', 'ghost', 'danger'], 'primary')} digikit-button-${optionValue(props.size, ['sm', 'md', 'lg'], 'md')}">{${jsxString(valueAsString(props.label, 'دکمه'))}}</a>`;
    case 'builder/hero':
      return `${indent}<HeroBanner eyebrow=${jsxString(valueAsString(props.eyebrow))} title=${jsxString(valueAsString(props.title, 'عنوان بنر'))} description=${jsxString(valueAsString(props.description))} actionLabel=${jsxString(valueAsString(props.actionLabel))} href=${jsxString(safeBuilderHref(valueAsString(props.href), '/products'))} tone=${jsxString(valueAsString(props.tone, 'primary'))} />`;
    case 'builder/section-header':
      return `${indent}<SectionHeader title=${jsxString(valueAsString(props.title, 'عنوان بخش'))} seeAllHref=${jsxString(safeBuilderHref(valueAsString(props.seeAllHref), '/products'))} />`;
    case 'builder/product-grid':
      return `${indent}<ProductGrid products={${JSON.stringify(exportProducts(node, assets))}} variant=${jsxString(valueAsString(props.variant, 'grid'))} columns={${jsxNumber(valueAsNumber(props.columns, 4))}} />`;
    case 'builder/image':
      return `${indent}<img src=${jsxString(safeImageSource(props.src, assets))} alt=${jsxString(valueAsString(props.alt, 'تصویر'))} style={{ display: 'block', width: '100%', borderRadius: ${jsxNumber(valueAsNumber(props.radius, 16))} }} />`;
    case 'builder/alert':
      return `${indent}<Alert tone=${jsxString(valueAsString(props.tone, 'info'))} title=${jsxString(valueAsString(props.title))}>{${jsxString(valueAsString(props.text))}}</Alert>`;
    case 'builder/price':
      return `${indent}<Price price={${jsxNumber(valueAsNumber(props.price))}} oldPrice={${jsxNumber(valueAsNumber(props.oldPrice))}} size=${jsxString(valueAsString(props.size, 'md'))} />`;
    case 'builder/divider':
      return `${indent}<Divider />`;
    case 'builder/footer':
      return `${indent}<footer${safeAnchor(props.anchor) ? ` id=${jsxString(safeAnchor(props.anchor))}` : ''} className="digikit-footer"><strong>{${jsxString(valueAsString(props.brand))}}</strong><p>{${jsxString(valueAsString(props.description))}}</p></footer>`;
    case 'builder/spacer':
      return `${indent}<div aria-hidden="true" style={{ height: ${jsxNumber(valueAsNumber(props.height, 24))} }} />`;
    default:
      return `${indent}<div />`;
  }
}

function renderReactNode(document: BuilderDocument, node: BuilderNode, depth: number, assets: BuilderAsset[]): string {
  const content = renderReactNodeContent(document, node, depth, assets);
  if (!hasResponsiveStyles(node.styles)) return content;
  const indent = '  '.repeat(depth);
  return `${indent}<div className="${nodeClassName(node)}">\n${content}\n${indent}</div>`;
}

export function composeBuilderDocuments(masterLayout: BuilderDocument, page: BuilderDocument): BuilderDocument {
  const prefix = `page-${page.id.replace(/[^a-zA-Z0-9_-]/g, '-')}-`;
  const pageIdMap = new Map<string, string>();
  Object.keys(page.nodes).forEach((nodeId) => pageIdMap.set(nodeId, `${prefix}${nodeId}`));
  const pageNodes = Object.values(page.nodes).map((node) => ({
    ...node,
    id: pageIdMap.get(node.id) as string,
    slots: Object.fromEntries(Object.entries(node.slots).map(([slotName, childIds]) => [slotName, childIds.map((childId) => pageIdMap.get(childId) || childId)])),
  }));
  const pageRoot = page.nodes[page.rootId];
  const pageChildren = pageRoot?.slots.children?.map((childId) => pageIdMap.get(childId)).filter((childId): childId is string => Boolean(childId)) || [];
  const masterNodes = Object.values(masterLayout.nodes).map((node) => {
    if (node.type !== 'builder/page-slot') return node;
    return {
      ...node,
      type: 'builder/section',
      props: { background: 'transparent', padding: 0, maxWidth: 1800, ...node.props },
      slots: { children: pageChildren },
    };
  });
  const hasPageSlot = masterNodes.some((node) => node.type === 'builder/section' && masterLayout.nodes[node.id]?.type === 'builder/page-slot');
  const nodes = Object.fromEntries([...masterNodes, ...pageNodes].map((node) => [node.id, node]));
  if (!hasPageSlot) {
    const root = nodes[masterLayout.rootId];
    if (root) nodes[root.id] = { ...root, slots: { ...root.slots, children: [...(root.slots.children || []), ...pageChildren] } };
  }
  return { ...masterLayout, id: page.id, title: page.title, slug: page.slug, description: page.description, nodes };
}

export function generateReactCode(document: BuilderDocument, assets: BuilderAsset[] = [], masterLayout?: BuilderDocument | null): string {
  const outputDocument = masterLayout ? composeBuilderDocuments(masterLayout, document) : document;
  const root = outputDocument.nodes[outputDocument.rootId];
  const body = root ? renderReactNode(outputDocument, root, 2, assets) : '    <main dir="rtl" />';
  const functionName = (outputDocument.title.replace(/[^a-zA-Z0-9]+/g, '') || 'GeneratedPage').replace(/^[^a-zA-Z]+/, '') || 'GeneratedPage';
  const styles = `${EXPORT_BUTTON_STYLES}${EXPORT_LAYOUT_STYLES}${responsiveCss(outputDocument)}`;
  return `import { Alert, Card, Divider, HeroBanner, Price, ProductGrid, SectionHeader } from '@digikit/ui';

const BUILDER_STYLES = ${JSON.stringify(styles)};

export default function ${functionName}() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: BUILDER_STYLES }} />
${body}
    </>
  );
}
`;
}

function renderStaticHtmlContent(document: BuilderDocument, node: BuilderNode, assets: BuilderAsset[]): string {
  const children = childrenOf(document, node).map((child) => renderStaticHtml(document, child, assets)).join('');
  const props = node.props;
  switch (node.type) {
    case 'builder/root':
      return `<main class="digikit-page">${children}</main>`;
    case 'builder/navigation':
      return `<nav class="digikit-navigation" aria-label="ناوبری صفحه"><strong>${escapeHtml(valueAsString(props.brand, 'نام برند'))}</strong><div>${(['first', 'second', 'third'] as const).filter((item) => valueAsString(props[`${item}Label`])).map((item) => `<a href="${escapeHtml(safeBuilderHref(valueAsString(props[`${item}Href`]), '#'))}">${escapeHtml(valueAsString(props[`${item}Label`]))}</a>`).join('')}</div></nav>`;
    case 'builder/navigation-button': {
      const variant = optionValue(props.variant, ['outline', 'solid', 'ghost'], 'outline');
      const label = valueAsString(props.label, 'منو');
      return `<a href="${escapeHtml(safeBuilderHref(valueAsString(props.href), '#'))}" aria-label="${escapeHtml(valueAsString(props.ariaLabel, label || 'دکمه نویگیشن'))}" class="digikit-navigation-button digikit-navigation-button-${variant}"><span aria-hidden="true">${navigationButtonSymbol(optionValue(props.icon, ['menu', 'close', 'back', 'more', 'search'], 'menu'))}</span>${label ? `<span>${escapeHtml(label)}</span>` : ''}</a>`;
    }
    case 'builder/page-slot':
      return '<div class="digikit-page-slot" aria-label="جایگاه محتوای صفحه"></div>';
    case 'builder/section':
      return `<section${safeAnchor(props.anchor) ? ` id="${safeAnchor(props.anchor)}"` : ''} style="background:${escapeHtml(safeCssValue(valueAsString(props.background, '#ffffff')))};padding-block:${valueAsNumber(props.padding, 32)}px;max-width:${valueAsNumber(props.maxWidth, 1200)}px;margin-inline:auto;width:100%">${children}</section>`;
    case 'builder/grid':
      return `<div class="digikit-layout-grid" style="display:grid;grid-template-columns:repeat(${Math.max(1, Math.min(4, Math.round(valueAsNumber(props.columns, 2))))},minmax(0,1fr));gap:${valueAsNumber(props.gap, 16)}px">${getBuilderSlotNames(node).map((slotName) => `<div class="digikit-layout-column" data-builder-slot="${slotName}">${slotChildrenOf(document, node, slotName).map((child) => renderStaticHtml(document, child, assets)).join('')}</div>`).join('')}</div>`;
    case 'builder/card':
      return `<section class="digikit-card digikit-card-${optionValue(props.variant, ['elevated', 'outlined', 'flat', 'ghost'], 'elevated')} digikit-card-${optionValue(props.padding, ['none', 'sm', 'md', 'lg'], 'md')}">${children}</section>`;
    case 'builder/heading': {
      const level = ['h1', 'h2', 'h3'].includes(valueAsString(props.level)) ? valueAsString(props.level) : 'h2';
      return `<${level} style="text-align:${escapeHtml(valueAsString(props.align, 'right'))}">${escapeHtml(valueAsString(props.text, 'عنوان بخش'))}</${level}>`;
    }
    case 'builder/text':
      return `<p style="text-align:${escapeHtml(valueAsString(props.align, 'right'))};line-height:1.9;white-space:pre-wrap">${escapeHtml(valueAsString(props.text))}</p>`;
    case 'builder/feature':
      return `<article class="digikit-feature"><small>${escapeHtml(valueAsString(props.eyebrow))}</small><h3>${escapeHtml(valueAsString(props.title))}</h3><p>${escapeHtml(valueAsString(props.description))}</p></article>`;
    case 'builder/faq':
      return `<details class="digikit-faq"><summary>${escapeHtml(valueAsString(props.question))}</summary><p>${escapeHtml(valueAsString(props.answer))}</p></details>`;
    case 'builder/button':
      return `<a class="digikit-button digikit-button-${optionValue(props.variant, ['primary', 'secondary', 'outline', 'ghost', 'danger'], 'primary')} digikit-button-${optionValue(props.size, ['sm', 'md', 'lg'], 'md')}" href="${escapeHtml(safeBuilderHref(valueAsString(props.href), '#'))}">${escapeHtml(valueAsString(props.label, 'دکمه'))}</a>`;
    case 'builder/hero':
      return `<section class="digikit-hero digikit-hero-${optionValue(props.tone, ['primary', 'dark', 'success', 'cream'], 'primary')}"><small>${escapeHtml(valueAsString(props.eyebrow))}</small><h2>${escapeHtml(valueAsString(props.title, 'عنوان بنر'))}</h2><p>${escapeHtml(valueAsString(props.description))}</p><a class="digikit-button digikit-button-hero" href="${escapeHtml(safeBuilderHref(valueAsString(props.href), '#'))}">${escapeHtml(valueAsString(props.actionLabel, 'شروع کن'))}</a></section>`;
    case 'builder/section-header':
      return `<div class="digikit-section-header"><h2>${escapeHtml(valueAsString(props.title, 'عنوان بخش'))}</h2><a href="${escapeHtml(safeBuilderHref(valueAsString(props.seeAllHref), '#'))}">مشاهده همه</a></div>`;
    case 'builder/product-grid':
      return `<div class="digikit-product-grid${valueAsString(props.variant) === 'bareGrid' ? ' digikit-product-grid-bare' : ''}" style="--product-columns:${valueAsNumber(props.columns, 4)}">${exportProducts(node, assets).map((product) => `<article class="digikit-product-card"><a href="${escapeHtml(product.href || '#')}" aria-label="${escapeHtml(product.title)}">${product.image.startsWith('ph:') ? `<span class="digikit-product-image">${escapeHtml(product.brand || product.title.slice(0, 1))}</span>` : `<img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.title)}" loading="lazy" />`}</a>${product.discount > 0 ? `<span class="digikit-product-discount">${product.discount.toLocaleString('fa-IR')}٪</span>` : ''}<a class="digikit-product-title" href="${escapeHtml(product.href || '#')}">${escapeHtml(product.title)}</a><div class="digikit-product-price">${product.oldPrice ? `<del>${product.oldPrice.toLocaleString('fa-IR')}</del>` : ''}<strong>${product.price.toLocaleString('fa-IR')} تومان</strong></div></article>`).join('')}</div>`;
    case 'builder/image':
      return `<img src="${escapeHtml(safeImageSource(props.src, assets))}" alt="${escapeHtml(valueAsString(props.alt, 'تصویر'))}" style="display:block;width:100%;border-radius:${valueAsNumber(props.radius, 16)}px" />`;
    case 'builder/alert':
      return `<div class="digikit-alert digikit-alert-${optionValue(props.tone, ['info', 'success', 'warning', 'danger'], 'info')}"><strong>${escapeHtml(valueAsString(props.title))}</strong><span>${escapeHtml(valueAsString(props.text))}</span></div>`;
    case 'builder/price':
      return `<span class="digikit-price digikit-price-${optionValue(props.size, ['sm', 'md', 'lg'], 'md')}">${valueAsNumber(props.oldPrice) > valueAsNumber(props.price) ? `<del>${valueAsNumber(props.oldPrice).toLocaleString('fa-IR')} تومان</del>` : ''}<strong>${valueAsNumber(props.price).toLocaleString('fa-IR')} تومان</strong></span>`;
    case 'builder/divider':
      return '<hr />';
    case 'builder/footer':
      return `<footer${safeAnchor(props.anchor) ? ` id="${safeAnchor(props.anchor)}"` : ''} class="digikit-footer"><strong>${escapeHtml(valueAsString(props.brand))}</strong><p>${escapeHtml(valueAsString(props.description))}</p></footer>`;
    case 'builder/spacer':
      return `<div style="height:${valueAsNumber(props.height, 24)}px"></div>`;
    default:
      return children;
  }
}

function renderStaticHtml(document: BuilderDocument, node: BuilderNode, assets: BuilderAsset[]): string {
  const content = renderStaticHtmlContent(document, node, assets);
  return hasResponsiveStyles(node.styles) ? `<div class="${nodeClassName(node)}">${content}</div>` : content;
}

const EXPORT_BUTTON_STYLES = `
  .digikit-button { display:inline-flex; align-items:center; justify-content:center; padding:10px 18px; border:1px solid transparent; border-radius:10px; background:#ef394e; color:#fff; text-decoration:none; }
  .digikit-button-sm { padding:7px 12px; font-size:12px; } .digikit-button-lg { padding:14px 24px; font-size:17px; }
  .digikit-button-secondary { background:#e5e9ee; color:#25384e; } .digikit-button-outline { background:transparent; color:#ef394e; border-color:#ef394e; }
  .digikit-button-ghost { background:transparent; color:#25384e; } .digikit-button-danger { background:#b42331; }
  .digikit-button-hero { background:#fff; color:#25384e; }
  .digikit-button:focus-visible { outline:2px solid currentColor; outline-offset:3px; }
`;

const EXPORT_LAYOUT_STYLES = `
  .digikit-navigation { display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:16px; padding:20px 24px; background:#fff; }
  .digikit-navigation > div { display:flex; flex-wrap:wrap; gap:16px; } .digikit-navigation a { color:inherit; text-decoration:none; }
  .digikit-navigation-button { display:inline-flex; align-items:center; justify-content:center; gap:8px; min-height:40px; padding:0 14px; border:1px solid #d5dce6; border-radius:10px; color:#25384e; text-decoration:none; font-size:13px; font-weight:800; }
  .digikit-navigation-button > span:first-child { font-size:20px; line-height:1; } .digikit-navigation-button-solid { border-color:#25384e; background:#25384e; color:#fff; }
  .digikit-navigation-button-ghost { border-color:transparent; background:transparent; } .digikit-navigation-button:focus-visible { outline:2px solid currentColor; outline-offset:3px; }
  .digikit-page-slot { min-height:180px; border:1px dashed #9aa8ba; border-radius:16px; background:#f7f9fc; }
  .digikit-layout-column { min-width:0; display:grid; align-content:start; gap:12px; }
  .digikit-layout-grid { min-width:0; }
  .digikit-feature { display:grid; gap:10px; padding:24px; border:1px solid #e2e6ec; border-radius:16px; background:#fff; }
  .digikit-feature h3, .digikit-feature p { margin:0; } .digikit-feature p { line-height:1.8; white-space:pre-wrap; }
  .digikit-faq { padding:20px; border:1px solid #e2e6ec; border-radius:12px; background:#fff; }
  .digikit-faq summary { cursor:pointer; font-weight:700; } .digikit-faq p { line-height:1.9; white-space:pre-wrap; }
  .digikit-footer { padding:32px 24px; background:#25384e; color:#fff; } .digikit-footer p { margin-bottom:0; line-height:1.8; white-space:pre-wrap; }
`;

export function generateHtmlCode(document: BuilderDocument, assets: BuilderAsset[] = [], masterLayout?: BuilderDocument | null): string {
  const outputDocument = masterLayout ? composeBuilderDocuments(masterLayout, document) : document;
  const root = outputDocument.nodes[outputDocument.rootId];
  const body = root ? renderStaticHtml(outputDocument, root, assets) : '<main class="digikit-page"></main>';
  const description = valueAsString(outputDocument.description).trim();
  const descriptionMeta = description ? `\n    <meta name="description" content="${escapeHtml(description)}" />` : '';
  return `<!doctype html>
<html lang="fa" dir="rtl">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(outputDocument.title)}</title>${descriptionMeta}
    <style>
      :root { font-family: Arial, sans-serif; color: #202124; background: #f7f8fa; }
      *, *::before, *::after { box-sizing: border-box; }
      body { margin: 0; padding: 24px; }
      .digikit-page { max-width: 1280px; margin: 0 auto; }
      ${EXPORT_LAYOUT_STYLES}
      .digikit-card { padding: 24px; border: 1px solid #e2e6ec; border-radius: 16px; background: #fff; }
      .digikit-card-elevated { box-shadow: 0 12px 28px #1d273310; }
      .digikit-card-flat, .digikit-card-ghost { border-color: transparent; box-shadow: none; }
      .digikit-card-ghost { background: transparent; }
      .digikit-card-none { padding: 0; } .digikit-card-sm { padding: 12px; } .digikit-card-lg { padding: 36px; }
      ${EXPORT_BUTTON_STYLES}
      .digikit-hero { padding: 48px; border-radius: 24px; background: #ef394e; color: #fff; }
      .digikit-hero-dark { background: #25384e; } .digikit-hero-success { background: #157754; } .digikit-hero-cream { background: #faf0db; color: #283748; }
      .digikit-section-header { display: flex; justify-content: space-between; align-items: center; gap: 16px; }
      .digikit-alert { display: grid; gap: 6px; padding: 16px; border-radius: 12px; background: #eef6ff; }
      .digikit-alert-success { background: #e8f7ef; } .digikit-alert-warning { background: #fff3df; } .digikit-alert-danger { background: #ffebeb; }
      .digikit-price { display: inline-flex; flex-wrap: wrap; align-items: baseline; gap: 8px; } .digikit-price del { color: #8791a0; font-size: .8em; }
      .digikit-price-sm { font-size: 13px; } .digikit-price-lg { font-size: 22px; }
      .digikit-product-grid { display: grid; grid-template-columns: repeat(var(--product-columns, 4), minmax(0, 1fr)); gap: 12px; }
      .digikit-product-grid-bare { gap: 1px; background: #e2e6ec; }
      .digikit-product-card { position: relative; display: grid; align-content: start; gap: 8px; min-width: 0; padding: 12px; border: 1px solid #e2e6ec; border-radius: 12px; background: #fff; }
      .digikit-product-grid-bare .digikit-product-card { border: 0; border-radius: 0; }
      .digikit-product-card > a:first-child { display: block; aspect-ratio: 1; overflow: hidden; border-radius: 8px; }
      .digikit-product-card img, .digikit-product-image { display: grid; width: 100%; height: 100%; place-items: center; object-fit: cover; }
      .digikit-product-image { background: linear-gradient(135deg, #f1f3f6, #dce6f1); color: #526176; font-size: 24px; font-weight: 700; }
      .digikit-product-discount { position: absolute; top: 16px; right: 16px; padding: 3px 7px; border-radius: 8px; background: #ef394e; color: #fff; font-size: 12px; }
      .digikit-product-title { min-height: 2.8em; overflow: hidden; color: inherit; font-size: 13px; line-height: 1.4; text-decoration: none; }
      .digikit-product-price { display: grid; gap: 3px; text-align: left; }
      .digikit-product-price del { color: #8791a0; font-size: 11px; }
      .digikit-product-price strong { font-size: 13px; }
      @media (max-width: 1024px) { .digikit-product-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
      @media (max-width: 640px) { body { padding: 12px; } .digikit-hero { padding: 24px; } .digikit-product-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
      ${responsiveCss(outputDocument)}
    </style>
  </head>
  <body>${body}</body>
</html>`;
}

export function downloadText(filename: string, content: string, type: string): void {
  if (typeof document === 'undefined') return;
  downloadBlob(filename, new Blob([content], { type }));
}

export function downloadBlob(filename: string, blob: Blob): void {
  if (typeof document === 'undefined') return;
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

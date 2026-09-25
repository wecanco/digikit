import { createInitialDocument, createNode, makePageId } from './builder-storage';
import { LOCAL_IMAGE_PLACEHOLDER } from './builder-registry';
import type { BuilderDocument } from './builder.types';

export interface BuilderTemplate {
  id: string;
  title: string;
  description: string;
  icon: string;
  create(title: string, slug: string): BuilderDocument;
}

function documentWithNodes(title: string, slug: string, nodes: ReturnType<typeof createNode>[]): BuilderDocument {
  const nestedIds = new Set(nodes.flatMap((node) => Object.values(node.slots).flat()));
  const root = createNode('builder/root', {}, { children: nodes.filter((node) => !nestedIds.has(node.id)).map((node) => node.id) });
  const timestamp = new Date().toISOString();
  return { schemaVersion: 1, id: makePageId(), title, slug, description: 'صفحه‌ی محلی ساخته‌شده با صفحه‌ساز دیجی‌کیت.', rootId: root.id, nodes: Object.fromEntries([root, ...nodes].map((node) => [node.id, node])), createdAt: timestamp, updatedAt: timestamp };
}

export const BUILDER_TEMPLATES: BuilderTemplate[] = [
  {
    id: 'landing',
    title: 'صفحه فرود فروشگاهی',
    description: 'Hero، مزیت‌ها و گرید محصول برای صفحه اصلی.',
    icon: '✦',
    create: (title, slug) => createInitialDocument(title, slug),
  },
  {
    id: 'campaign',
    title: 'کمپین ویژه',
    description: 'ساختار مناسب کمپین و پیشنهاد محدود.',
    icon: '⚡',
    create: (title, slug) => {
      const hero = createNode('builder/hero', { eyebrow: 'پیشنهاد محدود', title: 'کمپین تازه‌ی ما', description: 'یک پیام روشن و یک اقدام مشخص برای کمپین خود بساز.', actionLabel: 'مشاهده پیشنهاد', href: '/products', tone: 'dark' });
      const section = createNode('builder/section', { background: '#fff8e7', padding: 48, maxWidth: 1200 }, { children: [] });
      const heading = createNode('builder/heading', { text: 'پیشنهادهای منتخب این کمپین', level: 'h2', align: 'center' });
      const grid = createNode('builder/product-grid', { variant: 'grid', columns: 4 });
      section.slots.children.push(heading.id, grid.id);
      return documentWithNodes(title, slug, [hero, section, heading, grid]);
    },
  },
  {
    id: 'product',
    title: 'صفحه معرفی محصول',
    description: 'عنوان، تصویر، توضیح و قیمت برای شروع صفحه محصول.',
    icon: '▣',
    create: (title, slug) => {
      const section = createNode('builder/section', { background: '#ffffff', padding: 40, maxWidth: 1000 }, { children: [] });
      const heading = createNode('builder/heading', { text: 'نام محصول شما', level: 'h1', align: 'right' });
      const image = createNode('builder/image', { src: LOCAL_IMAGE_PLACEHOLDER, alt: 'تصویر محصول', radius: 20 });
      const text = createNode('builder/text', { text: 'توضیحات محصول را اینجا وارد کنید.', align: 'right' });
      const price = createNode('builder/price', { price: 1290000, oldPrice: 1490000, size: 'lg' });
      section.slots.children.push(heading.id, image.id, text.id, price.id);
      return documentWithNodes(title, slug, [section, heading, image, text, price]);
    },
  },
  {
    id: 'service',
    title: 'معرفی خدمات',
    description: 'ناوبری، معرفی، مزیت‌ها، پرسش‌وپاسخ و پاورقی.',
    icon: '◈',
    create: (title, slug) => {
      const navigation = createNode('builder/navigation', { brand: title, firstLabel: 'خانه', firstHref: '/', secondLabel: 'خدمات', secondHref: '#services', thirdLabel: 'تماس', thirdHref: '#contact' });
      const hero = createNode('builder/hero', { eyebrow: 'به دنیای ما خوش آمدید', title: 'خدماتی برای کارهای مهم شما', description: 'در چند جمله مشخص کن چه مشکلی را برای مخاطب حل می‌کنی.', actionLabel: 'آشنایی با خدمات', href: '#services', tone: 'cream' });
      const section = createNode('builder/section', { background: '#ffffff', padding: 40, maxWidth: 1100, anchor: 'services' }, { children: [] });
      const heading = createNode('builder/heading', { text: 'چرا ما را انتخاب می‌کنید؟', level: 'h2', align: 'right' });
      const grid = createNode('builder/grid', { columns: 2, gap: 16 }, { children: [] });
      const firstFeature = createNode('builder/feature', { eyebrow: '۰۱ / کیفیت', title: 'کاری که با دقت انجام می‌شود', description: 'نقطه قوت واقعی خدمات خود را جایگزین این متن کن.' });
      const secondFeature = createNode('builder/feature', { eyebrow: '۰۲ / همراهی', title: 'پشتیبانی در تمام مسیر', description: 'مراحل کار و آنچه مشتری دریافت می‌کند را توضیح بده.' });
      const faq = createNode('builder/faq', { question: 'چطور می‌توانم شروع کنم؟', answer: 'راه ارتباط و مراحل شروع همکاری را اینجا بنویس.' });
      const footer = createNode('builder/footer', { brand: title, description: 'برای گفتگو درباره خدمات، راه ارتباط خود را اینجا قرار بده.', anchor: 'contact' });
      section.slots.children.push(heading.id, grid.id, faq.id);
      grid.slots.children.push(firstFeature.id, secondFeature.id);
      return documentWithNodes(title, slug, [navigation, hero, section, heading, grid, firstFeature, secondFeature, faq, footer]);
    },
  },
];

'use client';

import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Product } from '../../types';
import { PlaceholderImage } from '../PlaceholderImage';
import { Price } from '../Price';
import { ProductCard } from '../ReferenceProduct';
import { ScrollCarousel } from '../ScrollCarousel';
import type { ReferenceBannerItem } from '../ReferenceBanners';
import styles from './styles.module.css';

export interface BannerCarouselProps {
  items: ReferenceBannerItem[];
  autoplay?: boolean;
  interval?: number;
  initialIndex?: number;
  onChange?(index: number): void;
  className?: string;
}

function BannerMedia({ item }: { item: ReferenceBannerItem }) {
  if (item.src.startsWith('ph:')) return <PlaceholderImage seed={item.src.slice(3)} label={item.alt} ratio="16:9" />;
  return <img src={item.src} alt={item.alt} loading="lazy" />;
}

export function BannerCarousel({ items, autoplay = true, interval = 4500, initialIndex = 0, onChange, className }: BannerCarouselProps) {
  const [active, setActive] = useState(Math.min(Math.max(initialIndex, 0), Math.max(items.length - 1, 0)));
  const [paused, setPaused] = useState(!autoplay);
  useEffect(() => {
    if (items.length < 2 || paused) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % items.length), interval);
    return () => window.clearInterval(timer);
  }, [interval, items.length, paused]);
  useEffect(() => {
    onChange?.(active);
  }, [active, onChange]);
  if (!items.length) return null;
  const current = items[active] || items[0];
  const update = (index: number) => setActive((index + items.length) % items.length);
  return <section className={[styles.banner, className].filter(Boolean).join(' ')} aria-roledescription="carousel" aria-label="بنرها" onMouseEnter={() => autoplay && setPaused(true)} onMouseLeave={() => autoplay && setPaused(false)}><div className={styles.bannerMedia}>{current.href ? <a href={current.href} className={styles.bannerLink}>{<BannerMedia item={current} />}</a> : <BannerMedia item={current} />}<button type="button" className={[styles.bannerArrow, styles.bannerPrev].join(' ')} onClick={() => update(active - 1)} aria-label="بنر قبلی"><ChevronRight size={20} aria-hidden="true" /></button><button type="button" className={[styles.bannerArrow, styles.bannerNext].join(' ')} onClick={() => update(active + 1)} aria-label="بنر بعدی"><ChevronLeft size={20} aria-hidden="true" /></button></div><div className={styles.bannerControls}><div className={styles.dots}>{items.map((item, index) => <button type="button" key={item.id ?? `${item.src}-${index}`} className={index === active ? styles.dotActive : styles.dot} aria-label={`نمایش بنر ${index + 1}`} aria-current={index === active ? 'true' : undefined} onClick={() => update(index)} />)}</div>{autoplay && <button type="button" className={styles.pause} onClick={() => setPaused((currentPaused) => !currentPaused)} aria-label={paused ? 'ادامه پخش بنرها' : 'توقف پخش بنرها'}>{paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}</button>}</div></section>;
}

export interface ProductCarouselProps {
  products: Product[];
  title?: string;
  showArrows?: boolean;
  onAddToCart?(product: Product): void;
  className?: string;
}

export function ProductCarousel({ products, title, showArrows = true, onAddToCart, className }: ProductCarouselProps) {
  if (!products.length) return null;
  return <section className={[styles.productSection, className].filter(Boolean).join(' ')}>{title && <h2>{title}</h2>}<ScrollCarousel arrows={showArrows}>{products.map((product) => <div className={styles.productSlide} key={product.id}><ProductCard product={product} slide onAddToCart={onAddToCart ? () => onAddToCart(product) : undefined} /></div>)}</ScrollCarousel></section>;
}

export interface RankingCarouselProps {
  products: Product[];
  title?: string;
  className?: string;
}

export function RankingCarousel({ products, title = 'پرفروش‌ترین کالاها', className }: RankingCarouselProps) {
  if (!products.length) return null;
  return <section className={[styles.rankingSection, className].filter(Boolean).join(' ')}><h2>{title}</h2><ScrollCarousel>{products.map((product, index) => <a href={product.href || `/product?id=${product.id}`} className={styles.rankingItem} key={product.id}><span className={styles.rank}>{index + 1}</span><span className={styles.rankingMedia}>{product.image.startsWith('ph:') ? <PlaceholderImage seed={product.image.slice(3)} label={product.brand || product.title} /> : <img src={product.image} alt={product.title} loading="lazy" />}</span><span className={styles.rankingCopy}><strong>{product.title}</strong><Price price={product.price} size="sm" /></span></a>)}</ScrollCarousel></section>;
}

export interface DiscountCarouselProps extends ProductCarouselProps {
  badgeLabel?: string;
}

export function DiscountCarousel({ products, title = 'پیشنهادهای تخفیف‌دار', badgeLabel = 'فروش ویژه', ...props }: DiscountCarouselProps) {
  const discounted = products.filter((product) => product.discount > 0);
  if (!discounted.length) return null;
  return <section className={styles.discountSection}><div className={styles.discountHead}><span>{badgeLabel}</span><h2>{title}</h2></div><ProductCarousel {...props} products={discounted} title={undefined} /></section>;
}

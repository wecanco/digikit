import type { ReactNode } from 'react';
import { PlaceholderImage } from '../PlaceholderImage';
import styles from './styles.module.css';

export interface ReferenceBannerItem {
  id?: string | number;
  src: string;
  alt: string;
  href?: string;
  title?: string;
}

export interface ReferenceBannersProps {
  items: ReferenceBannerItem[];
  className?: string;
}

function BannerImage({ item, className }: { item: ReferenceBannerItem; className?: string }) {
  const image: ReactNode = item.src.startsWith('ph:') ? <PlaceholderImage className={className} seed={item.src.slice(3)} label={item.alt} ratio="16:9" /> : <img className={className} src={item.src} alt={item.alt} loading="lazy" />;
  return item.href ? <a className={styles.link} href={item.href}>{image}</a> : image;
}

export function LargeBanner({ items, className }: ReferenceBannersProps) {
  if (!items.length) return null;
  return (
    <section className={[styles.large, className].filter(Boolean).join(' ')} aria-label="بنرهای اصلی">
      {items.slice(0, 4).map((item, index) => <BannerImage key={item.id ?? `${item.src}-${index}`} item={item} className={styles.largeImage} />)}
      <span className={styles.centerMarker} aria-hidden="true" />
    </section>
  );
}

export function SmallBanner({ items, className }: ReferenceBannersProps) {
  if (!items.length) return null;
  return (
    <section className={[styles.small, className].filter(Boolean).join(' ')} aria-label="بنرهای کوچک">
      {items.slice(0, 4).map((item, index) => <BannerImage key={item.id ?? `${item.src}-${index}`} item={item} className={styles.smallImage} />)}
    </section>
  );
}

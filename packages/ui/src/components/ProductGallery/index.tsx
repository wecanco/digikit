'use client';

import { useState } from 'react';
import { Heart, ZoomIn } from 'lucide-react';
import type { GalleryImage } from '../../types';
import { IconButton } from '../IconButton';
import { PlaceholderImage } from '../PlaceholderImage';
import styles from './styles.module.css';

export interface ProductGalleryProps {
  images: GalleryImage[];
  initialIndex?: number;
  onFavorite?(): void;
  onZoom?(): void;
  favorite?: boolean;
  className?: string;
}

function GalleryMedia({ image, main }: { image: GalleryImage; main?: boolean }) {
  if (image.src.startsWith('ph:')) return <PlaceholderImage seed={image.src.slice(3)} label={image.label} ratio={main ? '1:1' : '1:1'} />;
  return <img src={image.src} alt={image.alt || image.label || ''} />;
}

export function ProductGallery({ images, initialIndex = 0, onFavorite, onZoom, favorite, className }: ProductGalleryProps) {
  const [active, setActive] = useState(Math.min(initialIndex, Math.max(images.length - 1, 0)));
  const current = images[active] || images[0];
  if (!current) return null;
  return <div className={[styles.gallery, className].filter(Boolean).join(' ')}><div className={styles.main}><GalleryMedia image={current} main /><div className={styles.actions}>{onFavorite && <IconButton label={favorite ? 'حذف از علاقه‌مندی' : 'افزودن به علاقه‌مندی'} variant={favorite ? 'danger' : 'neutral'} onClick={onFavorite}><Heart size={18} fill={favorite ? 'currentColor' : 'none'} /></IconButton>}{onZoom && <IconButton label="بزرگ‌نمایی" onClick={onZoom}><ZoomIn size={18} /></IconButton>}</div></div><div className={styles.thumbs} role="tablist" aria-label="تصاویر محصول">{images.map((image, index) => <button type="button" role="tab" aria-selected={index === active} aria-label={image.alt || image.label || `تصویر ${index + 1}`} className={[styles.thumb, index === active && styles.selected].filter(Boolean).join(' ')} key={`${image.src}-${index}`} onClick={() => setActive(index)}><GalleryMedia image={image} /></button>)}</div></div>;
}

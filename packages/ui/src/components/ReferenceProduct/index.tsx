'use client';

import { ArrowLeft, Bell, Check, ChevronDown, Filter, PackageCheck, Plus, Trash2 } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { BadgeCircle } from '../BadgeCircle';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import { Price } from '../Price';
import { PlaceholderImage } from '../PlaceholderImage';
import { Rating } from '../Rating';
import type { GalleryImage, Product } from '../../types';
import { faNum, fmt } from '../../utils/format';
import styles from './styles.module.css';

export interface ProductDiscountTagProps {
  discount: number;
  className?: string;
}

export function ProductDiscountTag({ discount, className }: ProductDiscountTagProps) {
  if (discount <= 0) return null;
  return <span className={[styles.discountTag, className].filter(Boolean).join(' ')} dir="ltr">{discount}%</span>;
}

export interface ProductPriceDisplayProps {
  price: number;
  discount?: number;
  inStock?: number;
  singleProduct?: boolean;
  className?: string;
}

export function ProductPriceDisplay({ price, discount = 0, inStock = 1, singleProduct, className }: ProductPriceDisplayProps) {
  const finalPrice = Math.max(0, Math.round(price - (discount * price) / 100));
  return <div className={[styles.priceDisplay, singleProduct && styles.singlePrice, className].filter(Boolean).join(' ')}><Price price={finalPrice} size={singleProduct ? 'lg' : 'md'} />{discount > 0 && <div className={styles.priceOld}><del>{fmt(price)}</del>{singleProduct && inStock !== 0 && <ProductDiscountTag discount={discount} />}</div>}</div>;
}

export function ProductSpecialOffer({ discount = 0, inStock = 1, label = 'فروش ویژه', className }: { discount?: number; inStock?: number; label?: string; className?: string }) {
  return discount > 0 && inStock !== 0 ? <span className={[styles.specialOffer, className].filter(Boolean).join(' ')}><span aria-hidden="true">٪</span>{label}</span> : <span className={[styles.specialOfferPlaceholder, className].filter(Boolean).join(' ')} aria-hidden="true" />;
}

export function ProductStockIndicator({ inStock, className }: { inStock?: number; className?: string }) {
  if (inStock == null || inStock === 0) return null;
  if (inStock < 10) return <span className={[styles.stockLow, className].filter(Boolean).join(' ')}>تنها {faNum(inStock)} عدد در انبار باقی مانده</span>;
  return <span className={[styles.stockAvailable, className].filter(Boolean).join(' ')}><PackageCheck size={15} aria-hidden="true" />موجود در انبار</span>;
}

export function ProductOutOfStockMessage({ title = 'ناموجود', description = 'این کالا فعلاً موجود نیست. می‌توانید اعلان موجودی را فعال کنید.', onNotify, className }: { title?: string; description?: string; onNotify?(): void; className?: string }) {
  return <section className={[styles.outOfStock, className].filter(Boolean).join(' ')}><div className={styles.outOfStockTitle}><i aria-hidden="true" /><strong>{title}</strong><i aria-hidden="true" /></div><p>{description}</p>{onNotify && <Button size="sm" variant="outline" startIcon={<Bell size={15} aria-hidden="true" />} onClick={onNotify}>خبرم کن</Button>}</section>;
}

export interface ProductBreadcrumbItem {
  id?: string;
  label: string;
  href?: string;
}

export function ProductBreadcrumb({ items, separator = <span aria-hidden="true">/</span>, className }: { items: ProductBreadcrumbItem[]; separator?: ReactNode; className?: string }) {
  return <nav className={[styles.breadcrumb, className].filter(Boolean).join(' ')} aria-label="مسیر صفحه">{items.map((item, index) => <span key={item.id || `${item.label}-${index}`}>{item.href ? <a href={item.href}>{item.label}</a> : <strong aria-current={index === items.length - 1 ? 'page' : undefined}>{item.label}</strong>}{index < items.length - 1 && separator}</span>)}</nav>;
}

export function ProductDescription({ description, title = 'معرفی محصول', maxLength = 300, className }: { description: string; title?: string; maxLength?: number; className?: string }) {
  const [expanded, setExpanded] = useState(false);
  const canExpand = description.length > maxLength;
  return <section className={[styles.description, className].filter(Boolean).join(' ')}><h2>{title}</h2><p>{expanded || !canExpand ? description : `${description.slice(0, maxLength).trim()}…`}</p>{canExpand && <button type="button" onClick={() => setExpanded((current) => !current)}>{expanded ? 'بستن' : 'مشاهده بیشتر'}<ArrowLeft size={15} aria-hidden="true" /></button>}</section>;
}

export interface ProductAttributeRow {
  id: string;
  label: string;
  value?: string;
  featured?: boolean;
}

export interface ProductAttributesTableProps {
  rows: ProductAttributeRow[];
  title?: string;
  editable?: boolean;
  onChange?(rows: ProductAttributeRow[]): void;
  onAdd?(): void;
  onRemove?(id: string): void;
  className?: string;
}

export function ProductAttributesTable({ rows, title = 'ویژگی‌ها و مشخصات', editable, onChange, onAdd, onRemove, className }: ProductAttributesTableProps) {
  const update = (id: string, key: 'label' | 'value', value: string) => onChange?.(rows.map((row) => row.id === id ? { ...row, [key]: value } : row));
  return <section className={[styles.attributes, className].filter(Boolean).join(' ')}><div className={styles.attributesHead}><h2>{title}</h2>{editable && onAdd && <Button size="sm" variant="outline" startIcon={<Plus size={15} aria-hidden="true" />} onClick={onAdd}>افزودن ویژگی</Button>}</div><div className={styles.attributesTable}><div className={styles.attributesRow}><strong>نام</strong><strong>مقدار</strong>{editable && <span />}</div>{rows.map((row) => <div className={styles.attributesRow} key={row.id}><span className={row.featured ? styles.featured : undefined}>{editable ? <input value={row.label} onChange={(event) => update(row.id, 'label', event.target.value)} aria-label="نام ویژگی" /> : row.label}</span><span>{editable ? <input value={row.value || ''} onChange={(event) => update(row.id, 'value', event.target.value)} aria-label="مقدار ویژگی" /> : row.value || '—'}</span>{editable && onRemove && <IconButton label={`حذف ${row.label}`} size="sm" variant="ghost" onClick={() => onRemove(row.id)}><Trash2 size={16} aria-hidden="true" /></IconButton>}</div>)}</div></section>;
}

export function ProductSpecificationList({ specs, title = 'مشخصات محصول', className }: { specs: ProductAttributeRow[]; title?: string; className?: string }) {
  return <ProductAttributesTable rows={specs} title={title} className={className} />;
}

export function ProductSubCategoriesList({ items, title = 'دسته‌بندی‌های مرتبط', className }: { items: ProductBreadcrumbItem[]; title?: string; className?: string }) {
  return <section className={[styles.subCategories, className].filter(Boolean).join(' ')}><h2>{title}</h2><div>{items.map((item) => item.href ? <a key={item.id || item.label} href={item.href}>{item.label}<ArrowLeft size={14} aria-hidden="true" /></a> : <span key={item.id || item.label} className={styles.subCategoryLabel}>{item.label}</span>)}</div></section>;
}

export function ProductImageList({ images, activeIndex = 0, onChange, className }: { images: GalleryImage[]; activeIndex?: number; onChange?(index: number): void; className?: string }) {
  return <div className={[styles.imageList, className].filter(Boolean).join(' ')} role="tablist" aria-label="تصاویر محصول">{images.map((image, index) => <button type="button" role="tab" aria-selected={activeIndex === index} aria-label={image.alt || image.label || `تصویر ${index + 1}`} className={activeIndex === index ? styles.imageActive : undefined} key={`${image.src}-${index}`} onClick={() => onChange?.(index)}>{image.src.startsWith('ph:') ? <PlaceholderImage seed={image.src.slice(3)} label={image.label} ratio="1:1" /> : <img src={image.src} alt="" loading="lazy" />}</button>)}</div>;
}

export interface ProductSortOption {
  value: string;
  label: string;
}

export function ProductSort({ value, options, onChange, label = 'مرتب‌سازی', className }: { value: string; options: ProductSortOption[]; onChange?(value: string): void; label?: string; className?: string }) {
  return <label className={[styles.sort, className].filter(Boolean).join(' ')}><span>{label}</span><span className={styles.sortControl}><select value={value} onChange={(event) => onChange?.(event.target.value)}>{options.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}</select><ChevronDown size={15} aria-hidden="true" /></span></label>;
}

export interface ProductFilterControlsProps {
  inStock?: boolean;
  discountOnly?: boolean;
  minPrice?: string;
  maxPrice?: string;
  onChange?(change: { inStock?: boolean; discountOnly?: boolean; minPrice?: string; maxPrice?: string }): void;
  onReset?(): void;
  className?: string;
}

export function ProductFilterControls({ inStock = false, discountOnly = false, minPrice = '', maxPrice = '', onChange, onReset, className }: ProductFilterControlsProps) {
  return <section className={[styles.filters, className].filter(Boolean).join(' ')}><div className={styles.filterHead}><strong><Filter size={16} aria-hidden="true" /> فیلترها</strong>{onReset && <button type="button" onClick={onReset}>حذف فیلترها</button>}</div><label><input type="checkbox" checked={inStock} onChange={(event) => onChange?.({ inStock: event.target.checked })} />فقط کالاهای موجود</label><label><input type="checkbox" checked={discountOnly} onChange={(event) => onChange?.({ discountOnly: event.target.checked })} />فقط فروش ویژه</label><div className={styles.priceFilter}><span>محدوده قیمت</span><div><input inputMode="numeric" value={minPrice} onChange={(event) => onChange?.({ minPrice: event.target.value })} placeholder="حداقل" aria-label="حداقل قیمت" /><span>تا</span><input inputMode="numeric" value={maxPrice} onChange={(event) => onChange?.({ maxPrice: event.target.value })} placeholder="حداکثر" aria-label="حداکثر قیمت" /></div></div></section>;
}

export interface ProductColorOption {
  id: string;
  name: string;
  color: string;
}

export function ProductColorSelector({ colors, value, onChange, className }: { colors: ProductColorOption[]; value?: string; onChange?(id: string): void; className?: string }) {
  const selected = colors.find((color) => color.id === value) || colors[0];
  return <section className={[styles.variantSelector, className].filter(Boolean).join(' ')}><div className={styles.variantHead}><span>رنگ: {selected?.name || 'انتخاب نشده'}</span><small>{faNum(colors.length)} رنگ</small></div><div className={styles.variantChoices}>{colors.map((color) => <button type="button" key={color.id} className={selected?.id === color.id ? styles.variantActive : undefined} aria-pressed={selected?.id === color.id} onClick={() => onChange?.(color.id)}><span style={{ background: color.color }} aria-hidden="true">{selected?.id === color.id && <Check size={14} />}</span>{color.name}</button>)}</div></section>;
}

export function ProductSizeSelector({ sizes, value, onChange, className }: { sizes: string[]; value?: string; onChange?(value: string): void; className?: string }) {
  return <section className={[styles.variantSelector, className].filter(Boolean).join(' ')}><div className={styles.variantHead}><span>اندازه: {value || 'انتخاب نشده'}</span><small>{faNum(sizes.length)} اندازه</small></div><div className={styles.variantChoices}>{sizes.map((size) => <button type="button" key={size} className={value === size ? styles.variantActive : undefined} aria-pressed={value === size} onClick={() => onChange?.(size)}>{size}</button>)}</div></section>;
}

export interface ReferenceProductCardProps {
  product: Product;
  slide?: boolean;
  onAddToCart?(): void;
  href?: string;
  className?: string;
}

function productImage(product: Product) {
  const source = product.images?.[0] || product.image;
  if (source.startsWith('ph:')) return <PlaceholderImage seed={source.slice(3)} label={product.brand || product.title} ratio="1:1" className={styles.productImage} />;
  return <img src={source} alt={product.title} loading="lazy" className={styles.productImage} />;
}

export function ProductCard({ product, slide, onAddToCart, href = product.href || `/product?id=${product.id}`, className }: ReferenceProductCardProps) {
  return <article className={[styles.productCard, slide && styles.productSlide, className].filter(Boolean).join(' ')}><ProductSpecialOffer discount={product.discount} inStock={product.stock ?? 1} /><a href={href} className={styles.productMedia}>{productImage(product)}{product.discount > 0 && <span className={styles.productBadge}><BadgeCircle discount={product.discount} size="sm" /></span>}</a><a href={href} className={styles.productTitle}>{product.title}</a><div className={styles.productMeta}><ProductStockIndicator inStock={product.stock} /><Rating rating={product.rating} count={product.ratingCount} single /></div><div className={styles.productFooter}><ProductPriceDisplay price={product.price} discount={product.discount} inStock={product.stock} />{onAddToCart && <IconButton label="افزودن به سبد" size="sm" variant="primary" onClick={onAddToCart}><Plus size={16} aria-hidden="true" /></IconButton>}</div></article>;
}

export function ProductCardWithActions({ product, onAddToCart, className }: ReferenceProductCardProps) {
  return <ProductCard product={product} onAddToCart={onAddToCart} className={className} />;
}

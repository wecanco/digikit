/* ─── تایپ‌های مشترک کیت — قرارداد داده بین کامپوننت‌ها ─── */

export interface Product {
  id: number;
  /** مقصد صفحه‌ی محصول؛ اگر تعیین نشود کارت‌ها به مسیر عمومی محصولات می‌روند. */
  href?: string;
  title: string;
  brand?: string;
  cat: string;
  price: number;
  /** قیمت قبل از تخفیف (بالا نمایش داده می‌شود اگر > price) */
  oldPrice?: number | null;
  /** درصد تخفیف 0–100 */
  discount: number;
  rating: number;
  ratingCount: number;
  seller?: string;
  warranty?: string;
  /** URL تصویر — یا از PlaceholderImage با seed ساخته می‌شود */
  image: string;
  images?: string[];
  stock?: number;
  isExpress?: boolean;
  isFeatured?: boolean;
}

export interface Category {
  id: string;
  title: string;
  /** ایموجی/گلیف آیکون */
  icon: string;
  /** رنگ پس‌زمینه کاشی (hex) */
  color: string;
  subs: string[];
}

export interface ServiceItem {
  /** ایموجی/گلیف */
  icon: string;
  title: string;
  desc?: string;
  color?: string;
  /** مقصد سرویس؛ برای جلوگیری از لینک‌های بی‌اثر همیشه مقدار واقعی بدهید. */
  href?: string;
}

export interface NavTab {
  id: string;
  title: string;
  href: string;
  /** نام آیکون lucide */
  icon?: string;
  badge?: boolean;
}

export interface CartEntry {
  product: Product;
  qty: number;
}

export interface GalleryImage {
  src: string;
  alt?: string;
  label?: string;
}

export interface Seller {
  name: string;
  rating?: number;
  ratingCount?: number;
  positiveRate?: number;
  location?: string;
  verified?: boolean;
}

export interface Address {
  id: string;
  title: string;
  recipient: string;
  phone?: string;
  province: string;
  city: string;
  details: string;
  plaque?: string;
  unit?: string;
  postalCode?: string;
  isDefault?: boolean;
}

export interface FilterOption {
  id: string;
  label: string;
  count?: number;
  disabled?: boolean;
}

export interface FilterSection {
  id: string;
  title: string;
  options?: FilterOption[];
  type?: 'checkbox' | 'radio';
}

export interface CartLine extends CartEntry {
  selectedVariant?: string;
  selectedColor?: string;
}

import type { ComponentType } from 'react';
import { Accordion, AddressCard, AddressSkeleton, AddToCartButton, Alert, ArrowLink, AuthLinks, Avatar, BadgeCircle, BannerCarousel, BottomNav, BottomSheet, BrandCard, Breadcrumb, Button, CampaignStrip, Card, CartDiscountItem, CartDisplay, CartDropdown, CartIconBadge, CartItem, CartItemActions, CartOperations, CartPreview, CartSummary, CategoryCard, CategoryList, CategorySelector, Checkbox, CheckoutSteps, Chip, Combobox, ConfirmDialog, Countdown, CouponField, DataStateDisplay, DataTable, DiscountCarousel, Divider, DropdownMenu, EmptyComment, EmptyCommentsList, EmptyCustomList, EmptyOrdersList, EmptySearchList, EmptyState, EmptyUsersList, ErrorAction, ErrorState, FilterDialog, FilterSidebar, Footer, FormField, FreeShippingIndicator, FullScreenLoading, Header, HeroBanner, IconButton, InlineLoading, Input, LargeBanner, Layout, MegaMenu, MobileUserButton, Modal, NavbarSkeleton, OrderCard, OrderSkeleton, OrdersSummary, OrdersTable, OrderStatus, PageContainer, Pagination, PlaceholderImage, Price, ProductAttributesTable, ProductBreadcrumb, ProductCard, ProductCardAmazing, ProductCardGrid, ProductCardMobile, ProductCardRow, ProductCardSuper, ProductCardWithActions, ProductCarousel, ProductColorSelector, ProductDescription, ProductDiscountTag, ProductFilterControls, ProductGallery, ProductGrid, ProductImageList, ProductInfo, ProductOutOfStockMessage, ProductPriceDisplay, ProductSizeSelector, ProductSkeleton, ProductSort, ProductSpecialOffer, ProductSpecificationList, ProductSpecs, ProductStockIndicator, ProductSubCategoriesList, Progress, RadioGroup, RankingCarousel, Rating, ReferenceCartItem, ReviewCard, ReviewProductCard, ReviewSkeleton, ReviewsList, ReviewsTable, ReviewStatusBadge, ReviewSummary, ScrollCarousel, SearchDialog, SearchOverlay, SearchPill, SectionHeader, Select, SellerCard, ServiceList, ServicesStrip, ServiceTiles, ShippingMethod, SidebarSkeleton, Skeleton, SmallBanner, SortBar, Spinner, Stepper, SubCategoriesSkeleton, Switch, TableContainer, TableSkeleton, Tabs, Textarea, ToastProvider, Tooltip, UploadImage, UserMenu } from '@digikit/ui';


export type KitControlType = 'text' | 'number' | 'boolean' | 'select' | 'json' | 'color';
export type KitControlValue = string | number | boolean;

export interface KitControl {
  key: string;
  label: string;
  type: KitControlType;
  defaultValue: KitControlValue;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  description?: string;
  placeholder?: string;
}

export interface KitComponentEntry {
  slug: string;
  exportName: string;
  folder: string;
  label: string;
  group: string;
  description: string;
  tags: string[];
  source: string;
  importStatement: string;
  controls: KitControl[];
  defaultProps: Record<string, unknown>;
  hasCustomDemo: boolean;
  renderable: boolean;
}

export const COMPONENT_REGISTRY: KitComponentEntry[] = [
  {
    "slug": "accordion",
    "exportName": "Accordion",
    "folder": "Accordion",
    "label": "آکاردئون",
    "group": "فرم و تعامل",
    "description": "کامپوننت آکاردئون برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "Accordion",
      "فرم و تعامل",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/Accordion/index.tsx",
    "importStatement": "import { Accordion } from '@digikit/ui';",
    "controls": [
      {
        "key": "items",
        "label": "آیتم‌ها",
        "type": "json",
        "defaultValue": "[\n  {\n    \"id\": \"one\",\n    \"title\": \"ویژگی‌های اصلی\",\n    \"content\": \"این محتوای نمونه‌ی آکاردئون است.\"\n  },\n  {\n    \"id\": \"two\",\n    \"title\": \"جزئیات ارسال\",\n    \"content\": \"ارسال سریع و استاندارد قابل انتخاب است.\"\n  }\n]",
        "placeholder": "JSON معتبر وارد کنید"
      },
      {
        "key": "multiple",
        "label": "باز شدن چندگانه",
        "type": "boolean",
        "defaultValue": false
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "address-card",
    "exportName": "AddressCard",
    "folder": "AddressCard",
    "label": "کارت آدرس",
    "group": "سبد و پرداخت",
    "description": "کامپوننت کارت آدرس برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "AddressCard",
      "سبد و پرداخت",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/AddressCard/index.tsx",
    "importStatement": "import { AddressCard } from '@digikit/ui';",
    "controls": [
      {
        "key": "address",
        "label": "آدرس",
        "type": "json",
        "defaultValue": "{\n  \"id\": \"home\",\n  \"title\": \"خانه\",\n  \"recipient\": \"کاربر دیجی‌کیت\",\n  \"phone\": \"۰۹۱۲۱۲۳۴۵۶۷\",\n  \"province\": \"تهران\",\n  \"city\": \"تهران\",\n  \"details\": \"خیابان ولیعصر، کوچه نمونه، پلاک ۱۲\",\n  \"postalCode\": \"۱۲۳۴۵۶۷۸۹۰\",\n  \"isDefault\": true\n}",
        "placeholder": "JSON معتبر وارد کنید"
      },
      {
        "key": "selected",
        "label": "انتخاب شده",
        "type": "boolean",
        "defaultValue": true
      },
      {
        "key": "selectable",
        "label": "قابل انتخاب",
        "type": "boolean",
        "defaultValue": true
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "alert",
    "exportName": "Alert",
    "folder": "Alert",
    "label": "هشدار",
    "group": "پایه و نمایش",
    "description": "کامپوننت هشدار برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "Alert",
      "پایه و نمایش",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/Alert/index.tsx",
    "importStatement": "import { Alert } from '@digikit/ui';",
    "controls": [
      {
        "key": "title",
        "label": "عنوان",
        "type": "text",
        "defaultValue": "اطلاعیه مهم"
      },
      {
        "key": "children",
        "label": "متن",
        "type": "text",
        "defaultValue": "کد تخفیف روی سفارش شما اعمال شد."
      },
      {
        "key": "tone",
        "label": "لحن",
        "type": "select",
        "defaultValue": "info",
        "options": [
          "info",
          "success",
          "warning",
          "danger"
        ]
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "avatar",
    "exportName": "Avatar",
    "folder": "Avatar",
    "label": "آواتار",
    "group": "پایه و نمایش",
    "description": "کامپوننت آواتار برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "Avatar",
      "پایه و نمایش",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/Avatar/index.tsx",
    "importStatement": "import { Avatar } from '@digikit/ui';",
    "controls": [
      {
        "key": "name",
        "label": "نام",
        "type": "text",
        "defaultValue": "دیجی‌کیت"
      },
      {
        "key": "size",
        "label": "اندازه",
        "type": "select",
        "defaultValue": "lg",
        "options": [
          "xs",
          "sm",
          "md",
          "lg",
          "xl"
        ]
      },
      {
        "key": "status",
        "label": "وضعیت",
        "type": "select",
        "defaultValue": "online",
        "options": [
          "online",
          "offline",
          "busy"
        ]
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "badge-circle",
    "exportName": "BadgeCircle",
    "folder": "BadgeCircle",
    "label": "نشان تخفیف",
    "group": "پایه و نمایش",
    "description": "کامپوننت نشان تخفیف برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "BadgeCircle",
      "پایه و نمایش",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/BadgeCircle/index.tsx",
    "importStatement": "import { BadgeCircle } from '@digikit/ui';",
    "controls": [
      {
        "key": "discount",
        "label": "درصد تخفیف",
        "type": "number",
        "defaultValue": 35,
        "min": 0,
        "max": 99
      },
      {
        "key": "size",
        "label": "اندازه",
        "type": "select",
        "defaultValue": "md",
        "options": [
          "sm",
          "md"
        ]
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "bottom-nav",
    "exportName": "BottomNav",
    "folder": "BottomNav",
    "label": "ناوبری پایین",
    "group": "ناوبری و پوسته",
    "description": "کامپوننت ناوبری پایین برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "BottomNav",
      "ناوبری و پوسته",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/BottomNav/index.tsx",
    "importStatement": "import { BottomNav } from '@digikit/ui';",
    "controls": [
      {
        "key": "active",
        "label": "صفحه فعال",
        "type": "select",
        "defaultValue": "home",
        "options": [
          "home",
          "categories",
          "cart",
          "profile",
          "mag"
        ]
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "bottom-sheet",
    "exportName": "BottomSheet",
    "folder": "BottomSheet",
    "label": "بات‌شیت",
    "group": "ناوبری و پوسته",
    "description": "کامپوننت بات‌شیت برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "BottomSheet",
      "ناوبری و پوسته",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/BottomSheet/index.tsx",
    "importStatement": "import { BottomSheet } from '@digikit/ui';",
    "controls": [
      {
        "key": "open",
        "label": "باز",
        "type": "boolean",
        "defaultValue": false
      },
      {
        "key": "title",
        "label": "عنوان",
        "type": "text",
        "defaultValue": "انتخاب فیلتر"
      },
      {
        "key": "description",
        "label": "توضیح",
        "type": "text",
        "defaultValue": "در این پنل، فیلترهای موبایل قرار می‌گیرند."
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "brand-card",
    "exportName": "BrandCard",
    "folder": "BrandCard",
    "label": "کارت برند",
    "group": "تجارت و محصول",
    "description": "کامپوننت کارت برند برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "BrandCard",
      "تجارت و محصول",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/BrandCard/index.tsx",
    "importStatement": "import { BrandCard } from '@digikit/ui';",
    "controls": [
      {
        "key": "name",
        "label": "نام برند",
        "type": "text",
        "defaultValue": "سامسونگ"
      },
      {
        "key": "count",
        "label": "تعداد کالا",
        "type": "number",
        "defaultValue": 128,
        "min": 0
      },
      {
        "key": "featured",
        "label": "ویژه",
        "type": "boolean",
        "defaultValue": true
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "breadcrumb",
    "exportName": "Breadcrumb",
    "folder": "Breadcrumb",
    "label": "بردکرامب",
    "group": "ناوبری و پوسته",
    "description": "کامپوننت بردکرامب برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "Breadcrumb",
      "ناوبری و پوسته",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/Breadcrumb/index.tsx",
    "importStatement": "import { Breadcrumb } from '@digikit/ui';",
    "controls": [
      {
        "key": "items",
        "label": "مسیر",
        "type": "json",
        "defaultValue": "[\n  {\n    \"label\": \"خانه\",\n    \"href\": \"/\"\n  },\n  {\n    \"label\": \"موبایل\",\n    \"href\": \"/search?cat=mobile\"\n  },\n  {\n    \"label\": \"گوشی موبایل\"\n  }\n]",
        "placeholder": "JSON معتبر وارد کنید"
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "button",
    "exportName": "Button",
    "folder": "Button",
    "label": "دکمه",
    "group": "پایه و نمایش",
    "description": "کامپوننت دکمه برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "Button",
      "پایه و نمایش",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/Button/index.tsx",
    "importStatement": "import { Button } from '@digikit/ui';",
    "controls": [
      {
        "key": "children",
        "label": "متن",
        "type": "text",
        "defaultValue": "افزودن به سبد"
      },
      {
        "key": "variant",
        "label": "نوع",
        "type": "select",
        "defaultValue": "primary",
        "options": [
          "primary",
          "secondary",
          "outline",
          "ghost",
          "danger",
          "amazing",
          "white"
        ]
      },
      {
        "key": "size",
        "label": "اندازه",
        "type": "select",
        "defaultValue": "md",
        "options": [
          "sm",
          "md",
          "lg"
        ]
      },
      {
        "key": "pill",
        "label": "گرد کامل",
        "type": "boolean",
        "defaultValue": false
      },
      {
        "key": "fullWidth",
        "label": "تمام عرض",
        "type": "boolean",
        "defaultValue": false
      },
      {
        "key": "loading",
        "label": "در حال پردازش",
        "type": "boolean",
        "defaultValue": false
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "campaign-strip",
    "exportName": "CampaignStrip",
    "folder": "CampaignStrip",
    "label": "نوار کمپین",
    "group": "ناوبری و پوسته",
    "description": "کامپوننت نوار کمپین برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "CampaignStrip",
      "ناوبری و پوسته",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/CampaignStrip/index.tsx",
    "importStatement": "import { CampaignStrip } from '@digikit/ui';",
    "controls": [
      {
        "key": "message",
        "label": "پیام",
        "type": "text",
        "defaultValue": "جشنواره خرید پاییزی شروع شد"
      },
      {
        "key": "href",
        "label": "لینک",
        "type": "text",
        "defaultValue": "/products"
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "card",
    "exportName": "Card",
    "folder": "Card",
    "label": "کارت",
    "group": "پایه و نمایش",
    "description": "کامپوننت کارت برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "Card",
      "پایه و نمایش",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/Card/index.tsx",
    "importStatement": "import { Card } from '@digikit/ui';",
    "controls": [
      {
        "key": "variant",
        "label": "نوع",
        "type": "select",
        "defaultValue": "elevated",
        "options": [
          "elevated",
          "outlined",
          "flat"
        ]
      },
      {
        "key": "padding",
        "label": "فاصله داخلی",
        "type": "select",
        "defaultValue": "md",
        "options": [
          "none",
          "sm",
          "md",
          "lg"
        ]
      },
      {
        "key": "interactive",
        "label": "تعاملی",
        "type": "boolean",
        "defaultValue": false
      },
      {
        "key": "children",
        "label": "متن",
        "type": "text",
        "defaultValue": "محتوای کارت دیجی‌کیت"
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "cart-item",
    "exportName": "CartItem",
    "folder": "CartItem",
    "label": "آیتم سبد",
    "group": "سبد و پرداخت",
    "description": "کامپوننت آیتم سبد برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "CartItem",
      "سبد و پرداخت",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/CartItem/index.tsx",
    "importStatement": "import { CartItem } from '@digikit/ui';",
    "controls": [
      {
        "key": "item",
        "label": "آیتم سبد",
        "type": "json",
        "defaultValue": "{\n  \"product\": {\n    \"id\": 1,\n    \"href\": \"/product?id=1\",\n    \"title\": \"گوشی موبایل سامسونگ مدل Galaxy S24 Ultra ظرفیت ۲۵۶ گیگابایت\",\n    \"brand\": \"سامسونگ\",\n    \"cat\": \"mobile\",\n    \"price\": 61990000,\n    \"oldPrice\": 67380000,\n    \"discount\": 8,\n    \"rating\": 4.6,\n    \"ratingCount\": 2541,\n    \"seller\": \"دیجی‌کیت\",\n    \"warranty\": \"۱۸ ماه گارانتی شرکتی\",\n    \"image\": \"ph:1\",\n    \"stock\": 12,\n    \"isExpress\": true,\n    \"isFeatured\": true\n  },\n  \"qty\": 2,\n  \"selectedColor\": \"#111827\",\n  \"selectedVariant\": \"۲۵۶ گیگابایت\"\n}",
        "placeholder": "JSON معتبر وارد کنید"
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "cart-summary",
    "exportName": "CartSummary",
    "folder": "CartSummary",
    "label": "خلاصه سبد",
    "group": "سبد و پرداخت",
    "description": "کامپوننت خلاصه سبد برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "CartSummary",
      "سبد و پرداخت",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/CartSummary/index.tsx",
    "importStatement": "import { CartSummary } from '@digikit/ui';",
    "controls": [
      {
        "key": "itemsCount",
        "label": "تعداد کالا",
        "type": "number",
        "defaultValue": 2,
        "min": 0
      },
      {
        "key": "subtotal",
        "label": "جمع جزء",
        "type": "number",
        "defaultValue": 123980000,
        "min": 0,
        "step": 1000
      },
      {
        "key": "discount",
        "label": "تخفیف",
        "type": "number",
        "defaultValue": 9900000,
        "min": 0,
        "step": 1000
      },
      {
        "key": "shipping",
        "label": "هزینه ارسال",
        "type": "number",
        "defaultValue": 0,
        "min": 0,
        "step": 1000
      },
      {
        "key": "freeShippingThreshold",
        "label": "حد ارسال رایگان",
        "type": "number",
        "defaultValue": 70000000,
        "min": 0,
        "step": 1000
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "category-card",
    "exportName": "CategoryCard",
    "folder": "CategoryCard",
    "label": "کارت دسته‌بندی",
    "group": "تجارت و محصول",
    "description": "کامپوننت کارت دسته‌بندی برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "CategoryCard",
      "تجارت و محصول",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/CategoryCard/index.tsx",
    "importStatement": "import { CategoryCard } from '@digikit/ui';",
    "controls": [
      {
        "key": "category",
        "label": "دسته",
        "type": "json",
        "defaultValue": "{\n  \"id\": \"digital\",\n  \"title\": \"کالای دیجیتال\",\n  \"icon\": \"💻\",\n  \"color\": \"#5b46e5\",\n  \"subs\": [\n    \"لپ‌تاپ\",\n    \"تبلت\",\n    \"هدفون\"\n  ]\n}",
        "placeholder": "JSON معتبر وارد کنید"
      },
      {
        "key": "count",
        "label": "تعداد کالا",
        "type": "number",
        "defaultValue": 234,
        "min": 0
      },
      {
        "key": "compact",
        "label": "فشرده",
        "type": "boolean",
        "defaultValue": false
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "checkbox",
    "exportName": "Checkbox",
    "folder": "Checkbox",
    "label": "چک‌باکس",
    "group": "فرم و تعامل",
    "description": "کامپوننت چک‌باکس برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "Checkbox",
      "فرم و تعامل",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/Checkbox/index.tsx",
    "importStatement": "import { Checkbox } from '@digikit/ui';",
    "controls": [
      {
        "key": "label",
        "label": "برچسب",
        "type": "text",
        "defaultValue": "فقط کالاهای موجود"
      },
      {
        "key": "description",
        "label": "توضیح",
        "type": "text",
        "defaultValue": "کالاهای آماده ارسال"
      },
      {
        "key": "checked",
        "label": "انتخاب شده",
        "type": "boolean",
        "defaultValue": true
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "checkout-steps",
    "exportName": "CheckoutSteps",
    "folder": "CheckoutSteps",
    "label": "مراحل پرداخت",
    "group": "سبد و پرداخت",
    "description": "کامپوننت مراحل پرداخت برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "CheckoutSteps",
      "سبد و پرداخت",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/CheckoutSteps/index.tsx",
    "importStatement": "import { CheckoutSteps } from '@digikit/ui';",
    "controls": [
      {
        "key": "steps",
        "label": "مراحل",
        "type": "json",
        "defaultValue": "[\n  {\n    \"id\": \"cart\",\n    \"title\": \"سبد خرید\"\n  },\n  {\n    \"id\": \"shipping\",\n    \"title\": \"آدرس و ارسال\"\n  },\n  {\n    \"id\": \"payment\",\n    \"title\": \"پرداخت\"\n  }\n]",
        "placeholder": "JSON معتبر وارد کنید"
      },
      {
        "key": "current",
        "label": "مرحله فعال",
        "type": "select",
        "defaultValue": "shipping",
        "options": [
          "cart",
          "shipping",
          "payment"
        ]
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "chip",
    "exportName": "Chip",
    "folder": "Chip",
    "label": "چیپ",
    "group": "پایه و نمایش",
    "description": "کامپوننت چیپ برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "Chip",
      "پایه و نمایش",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/Chip/index.tsx",
    "importStatement": "import { Chip } from '@digikit/ui';",
    "controls": [
      {
        "key": "children",
        "label": "متن",
        "type": "text",
        "defaultValue": "پیشنهاد ویژه"
      },
      {
        "key": "tone",
        "label": "لحن",
        "type": "select",
        "defaultValue": "success",
        "options": [
          "neutral",
          "primary",
          "success",
          "warning",
          "danger"
        ]
      },
      {
        "key": "active",
        "label": "فعال",
        "type": "boolean",
        "defaultValue": false
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "countdown",
    "exportName": "Countdown",
    "folder": "Countdown",
    "label": "شمارش معکوس",
    "group": "عملیات و وضعیت",
    "description": "کامپوننت شمارش معکوس برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "Countdown",
      "عملیات و وضعیت",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/Countdown/index.tsx",
    "importStatement": "import { Countdown } from '@digikit/ui';",
    "controls": [
      {
        "key": "hoursAhead",
        "label": "ساعت تا پایان",
        "type": "number",
        "defaultValue": 5,
        "min": 0.1,
        "max": 48,
        "step": 0.1
      },
      {
        "key": "theme",
        "label": "پوسته",
        "type": "select",
        "defaultValue": "onRed",
        "options": [
          "default",
          "onRed",
          "heroWhite",
          "white"
        ]
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "coupon-field",
    "exportName": "CouponField",
    "folder": "CouponField",
    "label": "فیلد کد تخفیف",
    "group": "سبد و پرداخت",
    "description": "کامپوننت فیلد کد تخفیف برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "CouponField",
      "سبد و پرداخت",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/CouponField/index.tsx",
    "importStatement": "import { CouponField } from '@digikit/ui';",
    "controls": [
      {
        "key": "value",
        "label": "کد واردشده",
        "type": "text",
        "defaultValue": ""
      },
      {
        "key": "appliedCode",
        "label": "کد اعمال‌شده",
        "type": "text",
        "defaultValue": ""
      },
      {
        "key": "message",
        "label": "پیام",
        "type": "text",
        "defaultValue": "کد نمونه را وارد کنید."
      },
      {
        "key": "loading",
        "label": "در حال پردازش",
        "type": "boolean",
        "defaultValue": false
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "data-table",
    "exportName": "DataTable",
    "folder": "DataTable",
    "label": "جدول داده",
    "group": "عملیات و وضعیت",
    "description": "کامپوننت جدول داده برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "DataTable",
      "عملیات و وضعیت",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/DataTable/index.tsx",
    "importStatement": "import { DataTable } from '@digikit/ui';",
    "controls": [
      {
        "key": "columns",
        "label": "ستون‌ها",
        "type": "json",
        "defaultValue": "[\n  {\n    \"key\": \"id\",\n    \"title\": \"شماره سفارش\"\n  },\n  {\n    \"key\": \"customer\",\n    \"title\": \"مشتری\"\n  },\n  {\n    \"key\": \"amount\",\n    \"title\": \"مبلغ\"\n  },\n  {\n    \"key\": \"status\",\n    \"title\": \"وضعیت\"\n  }\n]",
        "placeholder": "JSON معتبر وارد کنید"
      },
      {
        "key": "rows",
        "label": "ردیف‌ها",
        "type": "json",
        "defaultValue": "[\n  {\n    \"id\": \"۱۲۳۴۵\",\n    \"customer\": \"سارا احمدی\",\n    \"amount\": \"۶۱٬۹۹۰٬۰۰۰\",\n    \"status\": \"تحویل‌شده\"\n  },\n  {\n    \"id\": \"۱۲۳۴۶\",\n    \"customer\": \"مهدی رضایی\",\n    \"amount\": \"۹٬۴۹۰٬۰۰۰\",\n    \"status\": \"در حال پردازش\"\n  }\n]",
        "placeholder": "JSON معتبر وارد کنید"
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "divider",
    "exportName": "Divider",
    "folder": "Divider",
    "label": "جداکننده",
    "group": "پایه و نمایش",
    "description": "کامپوننت جداکننده برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "Divider",
      "پایه و نمایش",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/Divider/index.tsx",
    "importStatement": "import { Divider } from '@digikit/ui';",
    "controls": [
      {
        "key": "orientation",
        "label": "جهت",
        "type": "select",
        "defaultValue": "horizontal",
        "options": [
          "horizontal",
          "vertical"
        ]
      },
      {
        "key": "children",
        "label": "متن",
        "type": "text",
        "defaultValue": ""
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "dropdown-menu",
    "exportName": "DropdownMenu",
    "folder": "DropdownMenu",
    "label": "منوی بازشونده",
    "group": "فرم و تعامل",
    "description": "کامپوننت منوی بازشونده برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "DropdownMenu",
      "فرم و تعامل",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/DropdownMenu/index.tsx",
    "importStatement": "import { DropdownMenu } from '@digikit/ui';",
    "controls": [
      {
        "key": "label",
        "label": "برچسب",
        "type": "text",
        "defaultValue": "باز کردن منو"
      },
      {
        "key": "align",
        "label": "تراز",
        "type": "select",
        "defaultValue": "end",
        "options": [
          "start",
          "end"
        ]
      },
      {
        "key": "items",
        "label": "آیتم‌ها",
        "type": "json",
        "defaultValue": "[\n  {\n    \"id\": \"edit\",\n    \"label\": \"ویرایش\"\n  },\n  {\n    \"id\": \"duplicate\",\n    \"label\": \"ساخت کپی\"\n  },\n  {\n    \"id\": \"delete\",\n    \"label\": \"حذف\",\n    \"danger\": true\n  }\n]",
        "placeholder": "JSON معتبر وارد کنید"
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "empty-state",
    "exportName": "EmptyState",
    "folder": "EmptyState",
    "label": "وضعیت خالی",
    "group": "عملیات و وضعیت",
    "description": "کامپوننت وضعیت خالی برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "EmptyState",
      "عملیات و وضعیت",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/EmptyState/index.tsx",
    "importStatement": "import { EmptyState } from '@digikit/ui';",
    "controls": [
      {
        "key": "title",
        "label": "عنوان",
        "type": "text",
        "defaultValue": "موردی پیدا نشد"
      },
      {
        "key": "description",
        "label": "توضیح",
        "type": "text",
        "defaultValue": "برای شروع، یک گزینه را انتخاب کنید."
      },
      {
        "key": "actionLabel",
        "label": "متن اقدام",
        "type": "text",
        "defaultValue": "شروع کنید"
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "error-state",
    "exportName": "ErrorState",
    "folder": "ErrorState",
    "label": "وضعیت خطا",
    "group": "عملیات و وضعیت",
    "description": "کامپوننت وضعیت خطا برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "ErrorState",
      "عملیات و وضعیت",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ErrorState/index.tsx",
    "importStatement": "import { ErrorState } from '@digikit/ui';",
    "controls": [
      {
        "key": "title",
        "label": "عنوان",
        "type": "text",
        "defaultValue": "خطایی رخ داد"
      },
      {
        "key": "description",
        "label": "توضیح",
        "type": "text",
        "defaultValue": "لطفاً دوباره تلاش کنید."
      },
      {
        "key": "actionLabel",
        "label": "متن اقدام",
        "type": "text",
        "defaultValue": "تلاش دوباره"
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "filter-sidebar",
    "exportName": "FilterSidebar",
    "folder": "FilterSidebar",
    "label": "سایدبار فیلتر",
    "group": "تجارت و محصول",
    "description": "کامپوننت سایدبار فیلتر برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "FilterSidebar",
      "تجارت و محصول",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/FilterSidebar/index.tsx",
    "importStatement": "import { FilterSidebar } from '@digikit/ui';",
    "controls": [
      {
        "key": "sections",
        "label": "بخش‌ها",
        "type": "json",
        "defaultValue": "[\n  {\n    \"id\": \"brand\",\n    \"title\": \"برند\",\n    \"options\": [\n      {\n        \"id\": \"samsung\",\n        \"label\": \"سامسونگ\",\n        \"count\": 128\n      },\n      {\n        \"id\": \"apple\",\n        \"label\": \"اپل\",\n        \"count\": 84\n      },\n      {\n        \"id\": \"xiaomi\",\n        \"label\": \"شیائومی\",\n        \"count\": 61\n      }\n    ]\n  },\n  {\n    \"id\": \"availability\",\n    \"title\": \"وضعیت موجودی\",\n    \"options\": [\n      {\n        \"id\": \"in-stock\",\n        \"label\": \"فقط کالاهای موجود\",\n        \"count\": 216\n      }\n    ]\n  }\n]",
        "placeholder": "JSON معتبر وارد کنید"
      },
      {
        "key": "values",
        "label": "مقادیر انتخاب‌شده",
        "type": "json",
        "defaultValue": "{\n  \"brand\": [\n    \"samsung\"\n  ]\n}",
        "placeholder": "JSON معتبر وارد کنید"
      },
      {
        "key": "mobileOpen",
        "label": "نمایش موبایل",
        "type": "boolean",
        "defaultValue": true
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "footer",
    "exportName": "Footer",
    "folder": "Footer",
    "label": "فوتر",
    "group": "ناوبری و پوسته",
    "description": "کامپوننت فوتر برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "Footer",
      "ناوبری و پوسته",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/Footer/index.tsx",
    "importStatement": "import { Footer } from '@digikit/ui';",
    "controls": [
      {
        "key": "about",
        "label": "متن درباره",
        "type": "text",
        "defaultValue": "دیجی‌کیت؛ کیت رابط کاربری فارسی برای تجربه‌های فروشگاهی مدرن."
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "form-field",
    "exportName": "FormField",
    "folder": "FormField",
    "label": "فیلد فرم",
    "group": "فرم و تعامل",
    "description": "کامپوننت فیلد فرم برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "FormField",
      "فرم و تعامل",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/FormField/index.tsx",
    "importStatement": "import { FormField } from '@digikit/ui';",
    "controls": [
      {
        "key": "label",
        "label": "برچسب",
        "type": "text",
        "defaultValue": "شماره موبایل"
      },
      {
        "key": "hint",
        "label": "راهنما",
        "type": "text",
        "defaultValue": "شماره را با ارقام انگلیسی وارد کنید."
      },
      {
        "key": "error",
        "label": "خطا",
        "type": "text",
        "defaultValue": ""
      },
      {
        "key": "required",
        "label": "اجباری",
        "type": "boolean",
        "defaultValue": true
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "header",
    "exportName": "Header",
    "folder": "Header",
    "label": "هدر",
    "group": "ناوبری و پوسته",
    "description": "کامپوننت هدر برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "Header",
      "ناوبری و پوسته",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/Header/index.tsx",
    "importStatement": "import { Header } from '@digikit/ui';",
    "controls": [
      {
        "key": "active",
        "label": "لینک فعال",
        "type": "select",
        "defaultValue": "home",
        "options": [
          "home",
          "amazing",
          "supermarket",
          "style",
          "mag",
          "sell"
        ]
      },
      {
        "key": "categories",
        "label": "دسته‌ها",
        "type": "json",
        "defaultValue": "[\n  {\n    \"id\": \"digital\",\n    \"title\": \"کالای دیجیتال\",\n    \"icon\": \"💻\",\n    \"color\": \"#5b46e5\",\n    \"subs\": [\n      \"لپ‌تاپ\",\n      \"تبلت\",\n      \"هدفون\"\n    ]\n  },\n  {\n    \"id\": \"mobile\",\n    \"title\": \"موبایل\",\n    \"icon\": \"📱\",\n    \"color\": \"#e8453c\",\n    \"subs\": [\n      \"گوشی موبایل\",\n      \"قاب و کاور\"\n    ]\n  },\n  {\n    \"id\": \"fashion\",\n    \"title\": \"مد و پوشاک\",\n    \"icon\": \"👕\",\n    \"color\": \"#f27a1a\",\n    \"subs\": [\n      \"کفش\",\n      \"کیف\"\n    ]\n  }\n]",
        "placeholder": "JSON معتبر وارد کنید"
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "hero-banner",
    "exportName": "HeroBanner",
    "folder": "HeroBanner",
    "label": "بنر قهرمان",
    "group": "تجارت و محصول",
    "description": "کامپوننت بنر قهرمان برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "HeroBanner",
      "تجارت و محصول",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/HeroBanner/index.tsx",
    "importStatement": "import { HeroBanner } from '@digikit/ui';",
    "controls": [
      {
        "key": "eyebrow",
        "label": "پیش‌عنوان",
        "type": "text",
        "defaultValue": "فصل تازه خرید آنلاین"
      },
      {
        "key": "title",
        "label": "عنوان",
        "type": "text",
        "defaultValue": "تجربه‌ای تازه برای خرید آنلاین"
      },
      {
        "key": "description",
        "label": "توضیح",
        "type": "text",
        "defaultValue": "الگوهای آماده برای ساخت صفحه‌های سریع و قابل اعتماد."
      },
      {
        "key": "actionLabel",
        "label": "متن اقدام",
        "type": "text",
        "defaultValue": "مشاهده محصولات"
      },
      {
        "key": "tone",
        "label": "پوسته",
        "type": "select",
        "defaultValue": "primary",
        "options": [
          "primary",
          "dark",
          "cream"
        ]
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "icon-button",
    "exportName": "IconButton",
    "folder": "IconButton",
    "label": "دکمه آیکونی",
    "group": "پایه و نمایش",
    "description": "کامپوننت دکمه آیکونی برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "IconButton",
      "پایه و نمایش",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/IconButton/index.tsx",
    "importStatement": "import { IconButton } from '@digikit/ui';",
    "controls": [
      {
        "key": "label",
        "label": "برچسب دسترسی‌پذیری",
        "type": "text",
        "defaultValue": "افزودن به علاقه‌مندی"
      },
      {
        "key": "variant",
        "label": "نوع",
        "type": "select",
        "defaultValue": "outline",
        "options": [
          "primary",
          "outline",
          "ghost",
          "danger"
        ]
      },
      {
        "key": "size",
        "label": "اندازه",
        "type": "select",
        "defaultValue": "md",
        "options": [
          "sm",
          "md",
          "lg"
        ]
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "input",
    "exportName": "Input",
    "folder": "Input",
    "label": "ورودی",
    "group": "فرم و تعامل",
    "description": "کامپوننت ورودی برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "Input",
      "فرم و تعامل",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/Input/index.tsx",
    "importStatement": "import { Input } from '@digikit/ui';",
    "controls": [
      {
        "key": "placeholder",
        "label": "راهنما",
        "type": "text",
        "defaultValue": "جستجو در دیجی‌کیت"
      },
      {
        "key": "variant",
        "label": "نوع",
        "type": "select",
        "defaultValue": "base",
        "options": [
          "base",
          "search",
          "searchMuted"
        ]
      },
      {
        "key": "size",
        "label": "اندازه",
        "type": "select",
        "defaultValue": "md",
        "options": [
          "sm",
          "md",
          "lg"
        ]
      },
      {
        "key": "disabled",
        "label": "غیرفعال",
        "type": "boolean",
        "defaultValue": false
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "search-pill",
    "exportName": "SearchPill",
    "folder": "Input",
    "label": "پیل جستجو",
    "group": "فرم و تعامل",
    "description": "کامپوننت پیل جستجو برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "SearchPill",
      "فرم و تعامل",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/Input/index.tsx",
    "importStatement": "import { SearchPill } from '@digikit/ui';",
    "controls": [
      {
        "key": "placeholder",
        "label": "راهنما",
        "type": "text",
        "defaultValue": "جستجو در دیجی‌کیت"
      },
      {
        "key": "aria-label",
        "label": "برچسب",
        "type": "text",
        "defaultValue": "جستجو"
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "layout",
    "exportName": "Layout",
    "folder": "Layout",
    "label": "پوسته صفحه",
    "group": "ناوبری و پوسته",
    "description": "کامپوننت پوسته صفحه برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "Layout",
      "ناوبری و پوسته",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/Layout/index.tsx",
    "importStatement": "import { Layout } from '@digikit/ui';",
    "controls": [
      {
        "key": "active",
        "label": "صفحه فعال",
        "type": "select",
        "defaultValue": "home",
        "options": [
          "home",
          "amazing",
          "supermarket",
          "mag"
        ]
      },
      {
        "key": "maxWidth",
        "label": "حداکثر عرض",
        "type": "number",
        "defaultValue": 1352,
        "min": 960,
        "max": 1800,
        "step": 8
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "mega-menu",
    "exportName": "MegaMenu",
    "folder": "MegaMenu",
    "label": "مگامنو",
    "group": "ناوبری و پوسته",
    "description": "کامپوننت مگامنو برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "MegaMenu",
      "ناوبری و پوسته",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/MegaMenu/index.tsx",
    "importStatement": "import { MegaMenu } from '@digikit/ui';",
    "controls": [
      {
        "key": "open",
        "label": "باز",
        "type": "boolean",
        "defaultValue": true
      },
      {
        "key": "categories",
        "label": "دسته‌ها",
        "type": "json",
        "defaultValue": "[\n  {\n    \"id\": \"digital\",\n    \"title\": \"کالای دیجیتال\",\n    \"icon\": \"💻\",\n    \"color\": \"#5b46e5\",\n    \"subs\": [\n      \"لپ‌تاپ\",\n      \"تبلت\",\n      \"هدفون\"\n    ]\n  },\n  {\n    \"id\": \"mobile\",\n    \"title\": \"موبایل\",\n    \"icon\": \"📱\",\n    \"color\": \"#e8453c\",\n    \"subs\": [\n      \"گوشی موبایل\",\n      \"قاب و کاور\"\n    ]\n  },\n  {\n    \"id\": \"fashion\",\n    \"title\": \"مد و پوشاک\",\n    \"icon\": \"👕\",\n    \"color\": \"#f27a1a\",\n    \"subs\": [\n      \"کفش\",\n      \"کیف\"\n    ]\n  }\n]",
        "placeholder": "JSON معتبر وارد کنید"
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "modal",
    "exportName": "Modal",
    "folder": "Modal",
    "label": "مودال",
    "group": "ناوبری و پوسته",
    "description": "کامپوننت مودال برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "Modal",
      "ناوبری و پوسته",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/Modal/index.tsx",
    "importStatement": "import { Modal } from '@digikit/ui';",
    "controls": [
      {
        "key": "open",
        "label": "باز",
        "type": "boolean",
        "defaultValue": false
      },
      {
        "key": "title",
        "label": "عنوان",
        "type": "text",
        "defaultValue": "تأیید حذف کالا"
      },
      {
        "key": "description",
        "label": "توضیح",
        "type": "text",
        "defaultValue": "آیا از ادامه این عملیات مطمئن هستید؟"
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "order-status",
    "exportName": "OrderStatus",
    "folder": "OrderStatus",
    "label": "وضعیت سفارش",
    "group": "عملیات و وضعیت",
    "description": "کامپوننت وضعیت سفارش برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "OrderStatus",
      "عملیات و وضعیت",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/OrderStatus/index.tsx",
    "importStatement": "import { OrderStatus } from '@digikit/ui';",
    "controls": [
      {
        "key": "status",
        "label": "وضعیت",
        "type": "select",
        "defaultValue": "processing",
        "options": [
          "pending",
          "processing",
          "shipped",
          "delivered",
          "cancelled"
        ]
      },
      {
        "key": "compact",
        "label": "فشرده",
        "type": "boolean",
        "defaultValue": false
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "pagination",
    "exportName": "Pagination",
    "folder": "Pagination",
    "label": "صفحه‌بندی",
    "group": "ناوبری و پوسته",
    "description": "کامپوننت صفحه‌بندی برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "Pagination",
      "ناوبری و پوسته",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/Pagination/index.tsx",
    "importStatement": "import { Pagination } from '@digikit/ui';",
    "controls": [
      {
        "key": "page",
        "label": "صفحه فعلی",
        "type": "number",
        "defaultValue": 2,
        "min": 1,
        "max": 9
      },
      {
        "key": "totalPages",
        "label": "تعداد صفحات",
        "type": "number",
        "defaultValue": 8,
        "min": 2,
        "max": 20
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "placeholder-image",
    "exportName": "PlaceholderImage",
    "folder": "PlaceholderImage",
    "label": "تصویر جایگزین",
    "group": "پایه و نمایش",
    "description": "کامپوننت تصویر جایگزین برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "PlaceholderImage",
      "پایه و نمایش",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/PlaceholderImage/index.tsx",
    "importStatement": "import { PlaceholderImage } from '@digikit/ui';",
    "controls": [
      {
        "key": "seed",
        "label": "شناسه تصویر",
        "type": "text",
        "defaultValue": "s24-ultra"
      },
      {
        "key": "label",
        "label": "برچسب",
        "type": "text",
        "defaultValue": "سامسونگ"
      },
      {
        "key": "ratio",
        "label": "نسبت تصویر",
        "type": "select",
        "defaultValue": "1:1",
        "options": [
          "1:1",
          "4:3",
          "16:9",
          "wide"
        ]
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "price",
    "exportName": "Price",
    "folder": "Price",
    "label": "قیمت",
    "group": "پایه و نمایش",
    "description": "کامپوننت قیمت برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "Price",
      "پایه و نمایش",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/Price/index.tsx",
    "importStatement": "import { Price } from '@digikit/ui';",
    "controls": [
      {
        "key": "price",
        "label": "قیمت",
        "type": "number",
        "defaultValue": 1290000,
        "min": 0,
        "step": 1000
      },
      {
        "key": "oldPrice",
        "label": "قیمت قبلی",
        "type": "number",
        "defaultValue": 1890000,
        "min": 0,
        "step": 1000
      },
      {
        "key": "size",
        "label": "اندازه",
        "type": "select",
        "defaultValue": "md",
        "options": [
          "sm",
          "md",
          "lg"
        ]
      },
      {
        "key": "unit",
        "label": "نمایش تومان",
        "type": "boolean",
        "defaultValue": true
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "product-card-amazing",
    "exportName": "ProductCardAmazing",
    "folder": "ProductCardAmazing",
    "label": "کارت شگفت‌انگیز",
    "group": "تجارت و محصول",
    "description": "کامپوننت کارت شگفت‌انگیز برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "ProductCardAmazing",
      "تجارت و محصول",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ProductCardAmazing/index.tsx",
    "importStatement": "import { ProductCardAmazing } from '@digikit/ui';",
    "controls": [
      {
        "key": "product",
        "label": "محصول",
        "type": "json",
        "defaultValue": "{\n  \"id\": 1,\n  \"href\": \"/product?id=1\",\n  \"title\": \"گوشی موبایل سامسونگ مدل Galaxy S24 Ultra ظرفیت ۲۵۶ گیگابایت\",\n  \"brand\": \"سامسونگ\",\n  \"cat\": \"mobile\",\n  \"price\": 61990000,\n  \"oldPrice\": 67380000,\n  \"discount\": 8,\n  \"rating\": 4.6,\n  \"ratingCount\": 2541,\n  \"seller\": \"دیجی‌کیت\",\n  \"warranty\": \"۱۸ ماه گارانتی شرکتی\",\n  \"image\": \"ph:1\",\n  \"stock\": 12,\n  \"isExpress\": true,\n  \"isFeatured\": true\n}",
        "placeholder": "JSON معتبر وارد کنید"
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "product-card-grid",
    "exportName": "ProductCardGrid",
    "folder": "ProductCardGrid",
    "label": "کارت گرید محصول",
    "group": "تجارت و محصول",
    "description": "کامپوننت کارت گرید محصول برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "ProductCardGrid",
      "تجارت و محصول",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ProductCardGrid/index.tsx",
    "importStatement": "import { ProductCardGrid } from '@digikit/ui';",
    "controls": [
      {
        "key": "product",
        "label": "محصول",
        "type": "json",
        "defaultValue": "{\n  \"id\": 1,\n  \"href\": \"/product?id=1\",\n  \"title\": \"گوشی موبایل سامسونگ مدل Galaxy S24 Ultra ظرفیت ۲۵۶ گیگابایت\",\n  \"brand\": \"سامسونگ\",\n  \"cat\": \"mobile\",\n  \"price\": 61990000,\n  \"oldPrice\": 67380000,\n  \"discount\": 8,\n  \"rating\": 4.6,\n  \"ratingCount\": 2541,\n  \"seller\": \"دیجی‌کیت\",\n  \"warranty\": \"۱۸ ماه گارانتی شرکتی\",\n  \"image\": \"ph:1\",\n  \"stock\": 12,\n  \"isExpress\": true,\n  \"isFeatured\": true\n}",
        "placeholder": "JSON معتبر وارد کنید"
      },
      {
        "key": "bare",
        "label": "حالت hairline",
        "type": "boolean",
        "defaultValue": false
      },
      {
        "key": "hideTitle",
        "label": "حذف عنوان",
        "type": "boolean",
        "defaultValue": false
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "product-card-mobile",
    "exportName": "ProductCardMobile",
    "folder": "ProductCardMobile",
    "label": "کارت موبایل محصول",
    "group": "تجارت و محصول",
    "description": "کامپوننت کارت موبایل محصول برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "ProductCardMobile",
      "تجارت و محصول",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ProductCardMobile/index.tsx",
    "importStatement": "import { ProductCardMobile } from '@digikit/ui';",
    "controls": [
      {
        "key": "product",
        "label": "محصول",
        "type": "json",
        "defaultValue": "{\n  \"id\": 1,\n  \"href\": \"/product?id=1\",\n  \"title\": \"گوشی موبایل سامسونگ مدل Galaxy S24 Ultra ظرفیت ۲۵۶ گیگابایت\",\n  \"brand\": \"سامسونگ\",\n  \"cat\": \"mobile\",\n  \"price\": 61990000,\n  \"oldPrice\": 67380000,\n  \"discount\": 8,\n  \"rating\": 4.6,\n  \"ratingCount\": 2541,\n  \"seller\": \"دیجی‌کیت\",\n  \"warranty\": \"۱۸ ماه گارانتی شرکتی\",\n  \"image\": \"ph:1\",\n  \"stock\": 12,\n  \"isExpress\": true,\n  \"isFeatured\": true\n}",
        "placeholder": "JSON معتبر وارد کنید"
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "product-card-row",
    "exportName": "ProductCardRow",
    "folder": "ProductCardRow",
    "label": "کارت ردیفی محصول",
    "group": "تجارت و محصول",
    "description": "کامپوننت کارت ردیفی محصول برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "ProductCardRow",
      "تجارت و محصول",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ProductCardRow/index.tsx",
    "importStatement": "import { ProductCardRow } from '@digikit/ui';",
    "controls": [
      {
        "key": "product",
        "label": "محصول",
        "type": "json",
        "defaultValue": "{\n  \"id\": 1,\n  \"href\": \"/product?id=1\",\n  \"title\": \"گوشی موبایل سامسونگ مدل Galaxy S24 Ultra ظرفیت ۲۵۶ گیگابایت\",\n  \"brand\": \"سامسونگ\",\n  \"cat\": \"mobile\",\n  \"price\": 61990000,\n  \"oldPrice\": 67380000,\n  \"discount\": 8,\n  \"rating\": 4.6,\n  \"ratingCount\": 2541,\n  \"seller\": \"دیجی‌کیت\",\n  \"warranty\": \"۱۸ ماه گارانتی شرکتی\",\n  \"image\": \"ph:1\",\n  \"stock\": 12,\n  \"isExpress\": true,\n  \"isFeatured\": true\n}",
        "placeholder": "JSON معتبر وارد کنید"
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "product-card-super",
    "exportName": "ProductCardSuper",
    "folder": "ProductCardSuper",
    "label": "کارت سوپرمارکت",
    "group": "تجارت و محصول",
    "description": "کامپوننت کارت سوپرمارکت برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "ProductCardSuper",
      "تجارت و محصول",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ProductCardSuper/index.tsx",
    "importStatement": "import { ProductCardSuper } from '@digikit/ui';",
    "controls": [
      {
        "key": "product",
        "label": "محصول",
        "type": "json",
        "defaultValue": "{\n  \"id\": 1,\n  \"href\": \"/product?id=1\",\n  \"title\": \"برنج ایرانی هاشمی درجه یک ۱۰ کیلوگرمی\",\n  \"brand\": \"سامسونگ\",\n  \"cat\": \"super\",\n  \"price\": 61990000,\n  \"oldPrice\": 67380000,\n  \"discount\": 8,\n  \"rating\": 4.6,\n  \"ratingCount\": 2541,\n  \"seller\": \"دیجی‌کیت\",\n  \"warranty\": \"۱۸ ماه گارانتی شرکتی\",\n  \"image\": \"ph:1\",\n  \"stock\": 12,\n  \"isExpress\": true,\n  \"isFeatured\": true\n}",
        "placeholder": "JSON معتبر وارد کنید"
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "product-gallery",
    "exportName": "ProductGallery",
    "folder": "ProductGallery",
    "label": "گالری محصول",
    "group": "تجارت و محصول",
    "description": "کامپوننت گالری محصول برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "ProductGallery",
      "تجارت و محصول",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ProductGallery/index.tsx",
    "importStatement": "import { ProductGallery } from '@digikit/ui';",
    "controls": [
      {
        "key": "images",
        "label": "تصاویر",
        "type": "json",
        "defaultValue": "[\n  {\n    \"src\": \"ph:1\",\n    \"alt\": \"نمای اصلی محصول\",\n    \"label\": \"نمای اصلی\"\n  },\n  {\n    \"src\": \"ph:1-side\",\n    \"alt\": \"نمای کناری\",\n    \"label\": \"نمای کناری\"\n  },\n  {\n    \"src\": \"ph:1-box\",\n    \"alt\": \"جعبه محصول\",\n    \"label\": \"جعبه\"\n  }\n]",
        "placeholder": "JSON معتبر وارد کنید"
      },
      {
        "key": "initialIndex",
        "label": "تصویر فعال",
        "type": "number",
        "defaultValue": 0,
        "min": 0,
        "max": 2
      },
      {
        "key": "favorite",
        "label": "علاقه‌مندی",
        "type": "boolean",
        "defaultValue": false
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "product-grid",
    "exportName": "ProductGrid",
    "folder": "ProductGrid",
    "label": "گرید محصول",
    "group": "تجارت و محصول",
    "description": "کامپوننت گرید محصول برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "ProductGrid",
      "تجارت و محصول",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ProductGrid/index.tsx",
    "importStatement": "import { ProductGrid } from '@digikit/ui';",
    "controls": [
      {
        "key": "products",
        "label": "محصولات",
        "type": "json",
        "defaultValue": "[\n  {\n    \"id\": 1,\n    \"href\": \"/product?id=1\",\n    \"title\": \"گوشی موبایل سامسونگ مدل Galaxy S24 Ultra ظرفیت ۲۵۶ گیگابایت\",\n    \"brand\": \"سامسونگ\",\n    \"cat\": \"mobile\",\n    \"price\": 61990000,\n    \"oldPrice\": 67380000,\n    \"discount\": 8,\n    \"rating\": 4.6,\n    \"ratingCount\": 2541,\n    \"seller\": \"دیجی‌کیت\",\n    \"warranty\": \"۱۸ ماه گارانتی شرکتی\",\n    \"image\": \"ph:1\",\n    \"stock\": 12,\n    \"isExpress\": true,\n    \"isFeatured\": true\n  },\n  {\n    \"id\": 2,\n    \"href\": \"/product?id=1\",\n    \"title\": \"گوشی موبایل اپل مدل iPhone 15 Pro Max\",\n    \"brand\": \"سامسونگ\",\n    \"cat\": \"mobile\",\n    \"price\": 89900000,\n    \"oldPrice\": 67380000,\n    \"discount\": 8,\n    \"rating\": 4.6,\n    \"ratingCount\": 2541,\n    \"seller\": \"دیجی‌کیت\",\n    \"warranty\": \"۱۸ ماه گارانتی شرکتی\",\n    \"image\": \"ph:2\",\n    \"stock\": 12,\n    \"isExpress\": true,\n    \"isFeatured\": true\n  },\n  {\n    \"id\": 3,\n    \"href\": \"/product?id=1\",\n    \"title\": \"گوشی موبایل شیائومی مدل Redmi Note 13 Pro\",\n    \"brand\": \"سامسونگ\",\n    \"cat\": \"mobile\",\n    \"price\": 16490000,\n    \"oldPrice\": 67380000,\n    \"discount\": 8,\n    \"rating\": 4.6,\n    \"ratingCount\": 2541,\n    \"seller\": \"دیجی‌کیت\",\n    \"warranty\": \"۱۸ ماه گارانتی شرکتی\",\n    \"image\": \"ph:3\",\n    \"stock\": 12,\n    \"isExpress\": true,\n    \"isFeatured\": true\n  }\n]",
        "placeholder": "JSON معتبر وارد کنید"
      },
      {
        "key": "variant",
        "label": "نوع گرید",
        "type": "select",
        "defaultValue": "bareGrid",
        "options": [
          "bareGrid",
          "grid"
        ]
      },
      {
        "key": "columns",
        "label": "ستون دسکتاپ",
        "type": "number",
        "defaultValue": 4,
        "min": 2,
        "max": 6
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "product-info",
    "exportName": "ProductInfo",
    "folder": "ProductInfo",
    "label": "اطلاعات محصول",
    "group": "تجارت و محصول",
    "description": "کامپوننت اطلاعات محصول برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "ProductInfo",
      "تجارت و محصول",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ProductInfo/index.tsx",
    "importStatement": "import { ProductInfo } from '@digikit/ui';",
    "controls": [
      {
        "key": "product",
        "label": "محصول",
        "type": "json",
        "defaultValue": "{\n  \"id\": 1,\n  \"href\": \"/product?id=1\",\n  \"title\": \"گوشی موبایل سامسونگ مدل Galaxy S24 Ultra ظرفیت ۲۵۶ گیگابایت\",\n  \"brand\": \"سامسونگ\",\n  \"cat\": \"mobile\",\n  \"price\": 61990000,\n  \"oldPrice\": 67380000,\n  \"discount\": 8,\n  \"rating\": 4.6,\n  \"ratingCount\": 2541,\n  \"seller\": \"دیجی‌کیت\",\n  \"warranty\": \"۱۸ ماه گارانتی شرکتی\",\n  \"image\": \"ph:1\",\n  \"stock\": 12,\n  \"isExpress\": true,\n  \"isFeatured\": true\n}",
        "placeholder": "JSON معتبر وارد کنید"
      },
      {
        "key": "colors",
        "label": "رنگ‌ها",
        "type": "json",
        "defaultValue": "[\n  \"مشکی\",\n  \"نقره‌ای\",\n  \"بنفش\"\n]",
        "placeholder": "JSON معتبر وارد کنید"
      },
      {
        "key": "sizes",
        "label": "تنوع‌ها",
        "type": "json",
        "defaultValue": "[\n  \"۲۵۶ گیگابایت\",\n  \"۵۱۲ گیگابایت\"\n]",
        "placeholder": "JSON معتبر وارد کنید"
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "product-specs",
    "exportName": "ProductSpecs",
    "folder": "ProductSpecs",
    "label": "مشخصات محصول",
    "group": "تجارت و محصول",
    "description": "کامپوننت مشخصات محصول برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "ProductSpecs",
      "تجارت و محصول",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ProductSpecs/index.tsx",
    "importStatement": "import { ProductSpecs } from '@digikit/ui';",
    "controls": [
      {
        "key": "title",
        "label": "عنوان",
        "type": "text",
        "defaultValue": "مشخصات محصول"
      },
      {
        "key": "specs",
        "label": "مشخصات",
        "type": "json",
        "defaultValue": "[\n  {\n    \"label\": \"حافظه داخلی\",\n    \"value\": \"۲۵۶ گیگابایت\",\n    \"featured\": true\n  },\n  {\n    \"label\": \"ظرفیت باتری\",\n    \"value\": \"۵۰۰۰ میلی‌آمپرساعت\"\n  },\n  {\n    \"label\": \"گارانتی\",\n    \"value\": \"۱۸ ماه شرکتی\"\n  }\n]",
        "placeholder": "JSON معتبر وارد کنید"
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "progress",
    "exportName": "Progress",
    "folder": "Progress",
    "label": "نوار پیشرفت",
    "group": "پایه و نمایش",
    "description": "کامپوننت نوار پیشرفت برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "Progress",
      "پایه و نمایش",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/Progress/index.tsx",
    "importStatement": "import { Progress } from '@digikit/ui';",
    "controls": [
      {
        "key": "value",
        "label": "مقدار",
        "type": "number",
        "defaultValue": 68,
        "min": 0,
        "max": 100
      },
      {
        "key": "max",
        "label": "حداکثر",
        "type": "number",
        "defaultValue": 100,
        "min": 1
      },
      {
        "key": "label",
        "label": "برچسب",
        "type": "text",
        "defaultValue": "تکمیل پروفایل"
      },
      {
        "key": "showValue",
        "label": "نمایش مقدار",
        "type": "boolean",
        "defaultValue": true
      },
      {
        "key": "tone",
        "label": "رنگ",
        "type": "select",
        "defaultValue": "success",
        "options": [
          "primary",
          "success",
          "warning",
          "danger"
        ]
      },
      {
        "key": "size",
        "label": "اندازه",
        "type": "select",
        "defaultValue": "md",
        "options": [
          "sm",
          "md",
          "lg"
        ]
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "radio-group",
    "exportName": "RadioGroup",
    "folder": "RadioGroup",
    "label": "گروه رادیویی",
    "group": "فرم و تعامل",
    "description": "کامپوننت گروه رادیویی برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "RadioGroup",
      "فرم و تعامل",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/RadioGroup/index.tsx",
    "importStatement": "import { RadioGroup } from '@digikit/ui';",
    "controls": [
      {
        "key": "name",
        "label": "نام گروه",
        "type": "text",
        "defaultValue": "shipping"
      },
      {
        "key": "value",
        "label": "انتخاب‌شده",
        "type": "select",
        "defaultValue": "standard",
        "options": [
          "standard",
          "express"
        ]
      },
      {
        "key": "options",
        "label": "گزینه‌ها",
        "type": "json",
        "defaultValue": "[\n  {\n    \"value\": \"standard\",\n    \"label\": \"ارسال عادی\",\n    \"description\": \"تحویل تا ۳ روز کاری\"\n  },\n  {\n    \"value\": \"express\",\n    \"label\": \"ارسال سریع\",\n    \"description\": \"تحویل امروز\"\n  }\n]",
        "placeholder": "JSON معتبر وارد کنید"
      },
      {
        "key": "orientation",
        "label": "چیدمان",
        "type": "select",
        "defaultValue": "vertical",
        "options": [
          "vertical",
          "horizontal"
        ]
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "rating",
    "exportName": "Rating",
    "folder": "Rating",
    "label": "امتیاز",
    "group": "پایه و نمایش",
    "description": "کامپوننت امتیاز برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "Rating",
      "پایه و نمایش",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/Rating/index.tsx",
    "importStatement": "import { Rating } from '@digikit/ui';",
    "controls": [
      {
        "key": "rating",
        "label": "امتیاز",
        "type": "number",
        "defaultValue": 4.6,
        "min": 0,
        "max": 5,
        "step": 0.1
      },
      {
        "key": "count",
        "label": "تعداد رأی",
        "type": "number",
        "defaultValue": 2541,
        "min": 0
      },
      {
        "key": "showCount",
        "label": "نمایش تعداد",
        "type": "boolean",
        "defaultValue": true
      },
      {
        "key": "single",
        "label": "حالت فشرده",
        "type": "boolean",
        "defaultValue": false
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "large-banner",
    "exportName": "LargeBanner",
    "folder": "ReferenceBanners",
    "label": "بنر بزرگ مرجع",
    "group": "تجارت و محصول",
    "description": "کامپوننت بنر بزرگ مرجع برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "LargeBanner",
      "تجارت و محصول",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceBanners/index.tsx",
    "importStatement": "import { LargeBanner } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {
      "items": [
        {
          "id": "hero-1",
          "src": "ph:hero-1",
          "alt": "بنر معرفی محصول",
          "href": "/products"
        },
        {
          "id": "hero-2",
          "src": "ph:hero-2",
          "alt": "بنر پیشنهاد ویژه",
          "href": "/products"
        }
      ]
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "small-banner",
    "exportName": "SmallBanner",
    "folder": "ReferenceBanners",
    "label": "بنرهای کوچک مرجع",
    "group": "تجارت و محصول",
    "description": "کامپوننت بنرهای کوچک مرجع برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "SmallBanner",
      "تجارت و محصول",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceBanners/index.tsx",
    "importStatement": "import { SmallBanner } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {
      "items": [
        {
          "id": "small-1",
          "src": "ph:small-1",
          "alt": "بنر کوچک اول"
        },
        {
          "id": "small-2",
          "src": "ph:small-2",
          "alt": "بنر کوچک دوم"
        },
        {
          "id": "small-3",
          "src": "ph:small-3",
          "alt": "بنر کوچک سوم"
        },
        {
          "id": "small-4",
          "src": "ph:small-4",
          "alt": "بنر کوچک چهارم"
        }
      ]
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "cart-display",
    "exportName": "CartDisplay",
    "folder": "ReferenceCart",
    "label": "نمایش responsive سبد",
    "group": "سبد و پرداخت",
    "description": "کامپوننت نمایش responsive سبد برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "CartDisplay",
      "سبد و پرداخت",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceCart/index.tsx",
    "importStatement": "import { CartDisplay } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {
      "count": 3,
      "items": [
        {
          "qty": 1,
          "product": {
            "id": 1,
            "title": "گوشی موبایل سامسونگ",
            "brand": "سامسونگ",
            "cat": "mobile",
            "price": 61990000,
            "discount": 8,
            "rating": 4.6,
            "ratingCount": 2541,
            "image": "ph:cart-display",
            "stock": 12
          }
        }
      ]
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "cart-dropdown",
    "exportName": "CartDropdown",
    "folder": "ReferenceCart",
    "label": "منوی بازشونده سبد",
    "group": "سبد و پرداخت",
    "description": "کامپوننت منوی بازشونده سبد برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "CartDropdown",
      "سبد و پرداخت",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceCart/index.tsx",
    "importStatement": "import { CartDropdown } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {
      "count": 3,
      "items": [
        {
          "qty": 1,
          "product": {
            "id": 1,
            "title": "گوشی موبایل سامسونگ",
            "brand": "سامسونگ",
            "cat": "mobile",
            "price": 61990000,
            "discount": 8,
            "rating": 4.6,
            "ratingCount": 2541,
            "image": "ph:cart-dropdown",
            "stock": 12
          }
        }
      ]
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "cart-preview",
    "exportName": "CartPreview",
    "folder": "ReferenceCart",
    "label": "پیش‌نمایش سبد مرجع",
    "group": "سبد و پرداخت",
    "description": "کامپوننت پیش‌نمایش سبد مرجع برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "CartPreview",
      "سبد و پرداخت",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceCart/index.tsx",
    "importStatement": "import { CartPreview } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {
      "items": [
        {
          "qty": 1,
          "product": {
            "id": 1,
            "title": "گوشی موبایل سامسونگ",
            "brand": "سامسونگ",
            "cat": "mobile",
            "price": 61990000,
            "discount": 8,
            "rating": 4.6,
            "ratingCount": 2541,
            "image": "ph:cart-phone",
            "stock": 12
          }
        },
        {
          "qty": 2,
          "product": {
            "id": 2,
            "title": "هدفون بی‌سیم",
            "brand": "شیائومی",
            "cat": "audio",
            "price": 2490000,
            "discount": 0,
            "rating": 4.2,
            "ratingCount": 384,
            "image": "ph:cart-headphone",
            "stock": 4
          }
        }
      ],
      "totalDiscount": 2500000
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "reference-cart-item",
    "exportName": "ReferenceCartItem",
    "folder": "ReferenceCart",
    "label": "آیتم سبد مرجع",
    "group": "سبد و پرداخت",
    "description": "کامپوننت آیتم سبد مرجع برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "ReferenceCartItem",
      "سبد و پرداخت",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceCart/index.tsx",
    "importStatement": "import { ReferenceCartItem } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {
      "item": {
        "qty": 2,
        "selectedColor": "#202124",
        "selectedVariant": "۲۵۶ گیگابایت",
        "product": {
          "id": 1,
          "title": "گوشی موبایل سامسونگ مدل Galaxy S24 Ultra",
          "brand": "سامسونگ",
          "cat": "mobile",
          "price": 61990000,
          "oldPrice": 67380000,
          "discount": 8,
          "rating": 4.6,
          "ratingCount": 2541,
          "image": "ph:cart-phone",
          "stock": 12
        }
      }
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "add-to-cart-button",
    "exportName": "AddToCartButton",
    "folder": "ReferenceCommerce",
    "label": "عملیات افزودن به سبد",
    "group": "سبد و پرداخت",
    "description": "کامپوننت عملیات افزودن به سبد برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "AddToCartButton",
      "سبد و پرداخت",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceCommerce/index.tsx",
    "importStatement": "import { AddToCartButton } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {
      "product": {
        "price": 61990000,
        "stock": 12
      },
      "quantity": 1,
      "maxQuantity": 5
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "cart-discount-item",
    "exportName": "CartDiscountItem",
    "folder": "ReferenceCommerce",
    "label": "آیتم تخفیف سبد",
    "group": "سبد و پرداخت",
    "description": "کامپوننت آیتم تخفیف سبد برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "CartDiscountItem",
      "سبد و پرداخت",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceCommerce/index.tsx",
    "importStatement": "import { CartDiscountItem } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {
      "code": "DIGI1405",
      "amount": 250000,
      "applied": false
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "cart-icon-badge",
    "exportName": "CartIconBadge",
    "folder": "ReferenceCommerce",
    "label": "نشان سبد خرید مرجع",
    "group": "سبد و پرداخت",
    "description": "کامپوننت نشان سبد خرید مرجع برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "CartIconBadge",
      "سبد و پرداخت",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceCommerce/index.tsx",
    "importStatement": "import { CartIconBadge } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {
      "count": 3
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "cart-item-actions",
    "exportName": "CartItemActions",
    "folder": "ReferenceCommerce",
    "label": "عملیات آیتم سبد",
    "group": "سبد و پرداخت",
    "description": "کامپوننت عملیات آیتم سبد برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "CartItemActions",
      "سبد و پرداخت",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceCommerce/index.tsx",
    "importStatement": "import { CartItemActions } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {
      "value": 2,
      "min": 1,
      "max": 5
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "cart-operations",
    "exportName": "CartOperations",
    "folder": "ReferenceCommerce",
    "label": "عملیات خرید مرجع",
    "group": "سبد و پرداخت",
    "description": "کامپوننت عملیات خرید مرجع برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "CartOperations",
      "سبد و پرداخت",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceCommerce/index.tsx",
    "importStatement": "import { CartOperations } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {
      "product": {
        "price": 61990000,
        "stock": 12
      },
      "quantity": 1,
      "maxQuantity": 5
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "category-list",
    "exportName": "CategoryList",
    "folder": "ReferenceCommerce",
    "label": "فهرست دسته‌بندی مرجع",
    "group": "تجارت و محصول",
    "description": "کامپوننت فهرست دسته‌بندی مرجع برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "CategoryList",
      "تجارت و محصول",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceCommerce/index.tsx",
    "importStatement": "import { CategoryList } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {
      "title": "خرید بر اساس دسته‌بندی",
      "items": [
        {
          "id": "mobile",
          "name": "موبایل",
          "image": "ph:mobile",
          "href": "/products"
        },
        {
          "id": "laptop",
          "name": "لپ‌تاپ",
          "image": "ph:laptop",
          "href": "/products"
        },
        {
          "id": "audio",
          "name": "هدفون",
          "image": "ph:audio",
          "href": "/products"
        }
      ]
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "category-selector",
    "exportName": "CategorySelector",
    "folder": "ReferenceCommerce",
    "label": "انتخابگر دسته‌بندی مرجع",
    "group": "تجارت و محصول",
    "description": "کامپوننت انتخابگر دسته‌بندی مرجع برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "CategorySelector",
      "تجارت و محصول",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceCommerce/index.tsx",
    "importStatement": "import { CategorySelector } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {
      "categories": [
        {
          "id": "digital",
          "name": "کالای دیجیتال",
          "level": 1
        },
        {
          "id": "mobile",
          "name": "موبایل",
          "parent": "digital",
          "level": 2
        },
        {
          "id": "phone",
          "name": "گوشی موبایل",
          "parent": "mobile",
          "level": 3
        }
      ],
      "value": {}
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "free-shipping-indicator",
    "exportName": "FreeShippingIndicator",
    "folder": "ReferenceCommerce",
    "label": "نشان ارسال رایگان",
    "group": "سبد و پرداخت",
    "description": "کامپوننت نشان ارسال رایگان برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "FreeShippingIndicator",
      "سبد و پرداخت",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceCommerce/index.tsx",
    "importStatement": "import { FreeShippingIndicator } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {
      "threshold": 70000000
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "service-list",
    "exportName": "ServiceList",
    "folder": "ReferenceCommerce",
    "label": "فهرست خدمات مرجع",
    "group": "تجارت و محصول",
    "description": "کامپوننت فهرست خدمات مرجع برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "ServiceList",
      "تجارت و محصول",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceCommerce/index.tsx",
    "importStatement": "import { ServiceList } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {
      "items": [
        {
          "icon": "bolt",
          "title": "ارسال سریع",
          "desc": "تحویل مطمئن",
          "color": "#ef394e"
        },
        {
          "icon": "credit",
          "title": "پرداخت امن",
          "desc": "با خیال راحت",
          "color": "#00a049"
        }
      ]
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "confirm-dialog",
    "exportName": "ConfirmDialog",
    "folder": "ReferenceModals",
    "label": "مودال تأیید عملیات",
    "group": "فرم و تعامل",
    "description": "کامپوننت مودال تأیید عملیات برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "ConfirmDialog",
      "فرم و تعامل",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceModals/index.tsx",
    "importStatement": "import { ConfirmDialog } from '@digikit/ui';",
    "controls": [
      {
        "key": "open",
        "label": "باز",
        "type": "boolean",
        "defaultValue": false
      }
    ],
    "defaultProps": {
      "open": false,
      "title": "حذف کالا",
      "description": "آیا از حذف این مورد مطمئن هستید؟"
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "filter-dialog",
    "exportName": "FilterDialog",
    "folder": "ReferenceModals",
    "label": "مودال فیلتر مرجع",
    "group": "فرم و تعامل",
    "description": "کامپوننت مودال فیلتر مرجع برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "FilterDialog",
      "فرم و تعامل",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceModals/index.tsx",
    "importStatement": "import { FilterDialog } from '@digikit/ui';",
    "controls": [
      {
        "key": "open",
        "label": "باز",
        "type": "boolean",
        "defaultValue": false
      }
    ],
    "defaultProps": {
      "open": false,
      "children": "کنترل‌های فیلتر در این بخش قرار می‌گیرند."
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "search-dialog",
    "exportName": "SearchDialog",
    "folder": "ReferenceModals",
    "label": "مودال جستجوی مرجع",
    "group": "فرم و تعامل",
    "description": "کامپوننت مودال جستجوی مرجع برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "SearchDialog",
      "فرم و تعامل",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceModals/index.tsx",
    "importStatement": "import { SearchDialog } from '@digikit/ui';",
    "controls": [
      {
        "key": "open",
        "label": "باز",
        "type": "boolean",
        "defaultValue": false
      }
    ],
    "defaultProps": {
      "open": false,
      "value": "گوشی",
      "results": [
        {
          "id": "1",
          "label": "گوشی موبایل سامسونگ",
          "description": "۱۲۸ نتیجه"
        },
        {
          "id": "2",
          "label": "قاب گوشی موبایل",
          "description": "۳۴ نتیجه"
        }
      ]
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "arrow-link",
    "exportName": "ArrowLink",
    "folder": "ReferenceNavigation",
    "label": "لینک پیکانی مرجع",
    "group": "ناوبری و پوسته",
    "description": "کامپوننت لینک پیکانی مرجع برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "ArrowLink",
      "ناوبری و پوسته",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceNavigation/index.tsx",
    "importStatement": "import { ArrowLink } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {
      "children": "مشاهده همه",
      "href": "/products"
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "combobox",
    "exportName": "Combobox",
    "folder": "ReferenceNavigation",
    "label": "کمبوباکس مرجع",
    "group": "فرم و تعامل",
    "description": "کامپوننت کمبوباکس مرجع برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "Combobox",
      "فرم و تعامل",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceNavigation/index.tsx",
    "importStatement": "import { Combobox } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {
      "label": "انتخاب برند",
      "options": [
        {
          "id": "samsung",
          "label": "سامسونگ",
          "meta": "۱۲۸ کالا"
        },
        {
          "id": "apple",
          "label": "اپل",
          "meta": "۸۴ کالا"
        }
      ]
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "page-container",
    "exportName": "PageContainer",
    "folder": "ReferenceNavigation",
    "label": "کانتینر صفحه مرجع",
    "group": "ناوبری و پوسته",
    "description": "کامپوننت کانتینر صفحه مرجع برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "PageContainer",
      "ناوبری و پوسته",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceNavigation/index.tsx",
    "importStatement": "import { PageContainer } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {
      "title": "مدیریت محصولات",
      "children": "محتوای صفحه در این بخش قرار می‌گیرد.",
      "backHref": "/products"
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "table-container",
    "exportName": "TableContainer",
    "folder": "ReferenceNavigation",
    "label": "کانتینر جدول مرجع",
    "group": "ناوبری و پوسته",
    "description": "کامپوننت کانتینر جدول مرجع برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "TableContainer",
      "ناوبری و پوسته",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceNavigation/index.tsx",
    "importStatement": "import { TableContainer } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {
      "headers": [
        "شناسه",
        "نام",
        "وضعیت"
      ],
      "children": "ردیف نمونه"
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "upload-image",
    "exportName": "UploadImage",
    "folder": "ReferenceNavigation",
    "label": "آپلود تصویر مرجع",
    "group": "فرم و تعامل",
    "description": "کامپوننت آپلود تصویر مرجع برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "UploadImage",
      "فرم و تعامل",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceNavigation/index.tsx",
    "importStatement": "import { UploadImage } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {
      "label": "تصویر محصول"
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "order-card",
    "exportName": "OrderCard",
    "folder": "ReferenceOrders",
    "label": "کارت سفارش مرجع",
    "group": "عملیات و وضعیت",
    "description": "کامپوننت کارت سفارش مرجع برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "OrderCard",
      "عملیات و وضعیت",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceOrders/index.tsx",
    "importStatement": "import { OrderCard } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {
      "order": {
        "id": "۱۲۳۴۵",
        "status": "processing",
        "total": 61990000,
        "date": "۱۴۰۵/۰۶/۲۴",
        "customer": "سارا احمدی",
        "items": [
          {
            "id": "phone",
            "title": "گوشی موبایل",
            "image": "ph:order-phone",
            "quantity": 1
          },
          {
            "id": "case",
            "title": "قاب موبایل",
            "image": "ph:order-case",
            "quantity": 2
          }
        ]
      }
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "orders-summary",
    "exportName": "OrdersSummary",
    "folder": "ReferenceOrders",
    "label": "خلاصه سفارش‌ها",
    "group": "عملیات و وضعیت",
    "description": "کامپوننت خلاصه سفارش‌ها برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "OrdersSummary",
      "عملیات و وضعیت",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceOrders/index.tsx",
    "importStatement": "import { OrdersSummary } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {
      "pending": 3,
      "delivered": 12,
      "total": 15
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "orders-table",
    "exportName": "OrdersTable",
    "folder": "ReferenceOrders",
    "label": "جدول سفارش‌ها مرجع",
    "group": "عملیات و وضعیت",
    "description": "کامپوننت جدول سفارش‌ها مرجع برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "OrdersTable",
      "عملیات و وضعیت",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceOrders/index.tsx",
    "importStatement": "import { OrdersTable } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {
      "orders": [
        {
          "id": "۱۲۳۴۵",
          "status": "delivered",
          "total": 61990000,
          "date": "۱۴۰۵/۰۶/۲۴",
          "customer": "سارا احمدی",
          "items": [
            {
              "id": "phone",
              "title": "گوشی موبایل",
              "image": "ph:order-phone"
            }
          ]
        },
        {
          "id": "۱۲۳۴۶",
          "status": "processing",
          "total": 9490000,
          "date": "۱۴۰۵/۰۶/۲۳",
          "customer": "مهدی رضایی",
          "items": [
            {
              "id": "headphone",
              "title": "هدفون",
              "image": "ph:order-headphone"
            }
          ]
        }
      ]
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "product-attributes-table",
    "exportName": "ProductAttributesTable",
    "folder": "ReferenceProduct",
    "label": "جدول ویژگی محصول مرجع",
    "group": "تجارت و محصول",
    "description": "کامپوننت جدول ویژگی محصول مرجع برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "ProductAttributesTable",
      "تجارت و محصول",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceProduct/index.tsx",
    "importStatement": "import { ProductAttributesTable } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {
      "rows": [
        {
          "id": "memory",
          "label": "حافظه داخلی",
          "value": "۲۵۶ گیگابایت",
          "featured": true
        },
        {
          "id": "warranty",
          "label": "گارانتی",
          "value": "۱۸ ماه شرکتی"
        }
      ]
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "product-breadcrumb",
    "exportName": "ProductBreadcrumb",
    "folder": "ReferenceProduct",
    "label": "مسیر محصول مرجع",
    "group": "تجارت و محصول",
    "description": "کامپوننت مسیر محصول مرجع برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "ProductBreadcrumb",
      "تجارت و محصول",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceProduct/index.tsx",
    "importStatement": "import { ProductBreadcrumb } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {
      "items": [
        {
          "label": "خانه",
          "href": "/"
        },
        {
          "label": "موبایل",
          "href": "/products"
        },
        {
          "label": "گوشی موبایل"
        }
      ]
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "product-card",
    "exportName": "ProductCard",
    "folder": "ReferenceProduct",
    "label": "کارت محصول مرجع",
    "group": "تجارت و محصول",
    "description": "کامپوننت کارت محصول مرجع برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "ProductCard",
      "تجارت و محصول",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceProduct/index.tsx",
    "importStatement": "import { ProductCard } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {
      "product": {
        "id": 1,
        "title": "گوشی موبایل سامسونگ مدل Galaxy S24 Ultra",
        "brand": "سامسونگ",
        "cat": "mobile",
        "price": 61990000,
        "oldPrice": 67380000,
        "discount": 8,
        "rating": 4.6,
        "ratingCount": 2541,
        "image": "ph:product-card",
        "stock": 12
      }
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "product-card-with-actions",
    "exportName": "ProductCardWithActions",
    "folder": "ReferenceProduct",
    "label": "کارت محصول با عملیات",
    "group": "تجارت و محصول",
    "description": "کامپوننت کارت محصول با عملیات برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "ProductCardWithActions",
      "تجارت و محصول",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceProduct/index.tsx",
    "importStatement": "import { ProductCardWithActions } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {
      "product": {
        "id": 2,
        "title": "لپ‌تاپ ایسوس مدل VivoBook",
        "brand": "ایسوس",
        "cat": "laptop",
        "price": 42990000,
        "oldPrice": 45990000,
        "discount": 6,
        "rating": 4.4,
        "ratingCount": 872,
        "image": "ph:product-card-2",
        "stock": 7
      }
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "product-color-selector",
    "exportName": "ProductColorSelector",
    "folder": "ReferenceProduct",
    "label": "انتخاب رنگ محصول",
    "group": "تجارت و محصول",
    "description": "کامپوننت انتخاب رنگ محصول برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "ProductColorSelector",
      "تجارت و محصول",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceProduct/index.tsx",
    "importStatement": "import { ProductColorSelector } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {
      "colors": [
        {
          "id": "black",
          "name": "مشکی",
          "color": "#202124"
        },
        {
          "id": "blue",
          "name": "آبی",
          "color": "#2563eb"
        }
      ],
      "value": "black"
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "product-description",
    "exportName": "ProductDescription",
    "folder": "ReferenceProduct",
    "label": "توضیحات محصول مرجع",
    "group": "تجارت و محصول",
    "description": "کامپوننت توضیحات محصول مرجع برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "ProductDescription",
      "تجارت و محصول",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceProduct/index.tsx",
    "importStatement": "import { ProductDescription } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {
      "description": "این محصول با طراحی دقیق، عملکرد قابل اعتماد و ضمانت اصالت برای استفاده روزمره آماده شده است."
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "product-discount-tag",
    "exportName": "ProductDiscountTag",
    "folder": "ReferenceProduct",
    "label": "نشان تخفیف محصول مرجع",
    "group": "تجارت و محصول",
    "description": "کامپوننت نشان تخفیف محصول مرجع برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "ProductDiscountTag",
      "تجارت و محصول",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceProduct/index.tsx",
    "importStatement": "import { ProductDiscountTag } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {
      "discount": 18
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "product-filter-controls",
    "exportName": "ProductFilterControls",
    "folder": "ReferenceProduct",
    "label": "فیلترهای محصول مرجع",
    "group": "تجارت و محصول",
    "description": "کامپوننت فیلترهای محصول مرجع برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "ProductFilterControls",
      "تجارت و محصول",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceProduct/index.tsx",
    "importStatement": "import { ProductFilterControls } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {
      "inStock": true,
      "discountOnly": false
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "product-image-list",
    "exportName": "ProductImageList",
    "folder": "ReferenceProduct",
    "label": "فهرست تصاویر محصول",
    "group": "تجارت و محصول",
    "description": "کامپوننت فهرست تصاویر محصول برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "ProductImageList",
      "تجارت و محصول",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceProduct/index.tsx",
    "importStatement": "import { ProductImageList } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {
      "images": [
        {
          "src": "ph:product-front",
          "alt": "نمای اصلی",
          "label": "نمای اصلی"
        },
        {
          "src": "ph:product-side",
          "alt": "نمای کناری",
          "label": "نمای کناری"
        }
      ]
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "product-out-of-stock-message",
    "exportName": "ProductOutOfStockMessage",
    "folder": "ReferenceProduct",
    "label": "پیام ناموجودی محصول",
    "group": "تجارت و محصول",
    "description": "کامپوننت پیام ناموجودی محصول برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "ProductOutOfStockMessage",
      "تجارت و محصول",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceProduct/index.tsx",
    "importStatement": "import { ProductOutOfStockMessage } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "product-price-display",
    "exportName": "ProductPriceDisplay",
    "folder": "ReferenceProduct",
    "label": "نمایش قیمت محصول مرجع",
    "group": "تجارت و محصول",
    "description": "کامپوننت نمایش قیمت محصول مرجع برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "ProductPriceDisplay",
      "تجارت و محصول",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceProduct/index.tsx",
    "importStatement": "import { ProductPriceDisplay } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {
      "price": 61990000,
      "discount": 8,
      "inStock": 12
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "product-size-selector",
    "exportName": "ProductSizeSelector",
    "folder": "ReferenceProduct",
    "label": "انتخاب اندازه محصول",
    "group": "تجارت و محصول",
    "description": "کامپوننت انتخاب اندازه محصول برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "ProductSizeSelector",
      "تجارت و محصول",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceProduct/index.tsx",
    "importStatement": "import { ProductSizeSelector } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {
      "sizes": [
        "۲۵۶ گیگابایت",
        "۵۱۲ گیگابایت"
      ],
      "value": "۲۵۶ گیگابایت"
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "product-sort",
    "exportName": "ProductSort",
    "folder": "ReferenceProduct",
    "label": "مرتب‌سازی محصول مرجع",
    "group": "تجارت و محصول",
    "description": "کامپوننت مرتب‌سازی محصول مرجع برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "ProductSort",
      "تجارت و محصول",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceProduct/index.tsx",
    "importStatement": "import { ProductSort } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {
      "value": "popular",
      "options": [
        {
          "value": "popular",
          "label": "پرفروش‌ترین"
        },
        {
          "value": "newest",
          "label": "جدیدترین"
        }
      ]
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "product-special-offer",
    "exportName": "ProductSpecialOffer",
    "folder": "ReferenceProduct",
    "label": "نشان فروش ویژه محصول",
    "group": "تجارت و محصول",
    "description": "کامپوننت نشان فروش ویژه محصول برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "ProductSpecialOffer",
      "تجارت و محصول",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceProduct/index.tsx",
    "importStatement": "import { ProductSpecialOffer } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {
      "discount": 8,
      "inStock": 12
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "product-specification-list",
    "exportName": "ProductSpecificationList",
    "folder": "ReferenceProduct",
    "label": "فهرست مشخصات محصول",
    "group": "تجارت و محصول",
    "description": "کامپوننت فهرست مشخصات محصول برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "ProductSpecificationList",
      "تجارت و محصول",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceProduct/index.tsx",
    "importStatement": "import { ProductSpecificationList } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {
      "specs": [
        {
          "id": "screen",
          "label": "اندازه صفحه",
          "value": "۶٫۸ اینچ"
        },
        {
          "id": "battery",
          "label": "ظرفیت باتری",
          "value": "۵۰۰۰ میلی‌آمپرساعت"
        }
      ]
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "product-stock-indicator",
    "exportName": "ProductStockIndicator",
    "folder": "ReferenceProduct",
    "label": "نشان موجودی محصول",
    "group": "تجارت و محصول",
    "description": "کامپوننت نشان موجودی محصول برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "ProductStockIndicator",
      "تجارت و محصول",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceProduct/index.tsx",
    "importStatement": "import { ProductStockIndicator } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {
      "inStock": 6
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "product-sub-categories-list",
    "exportName": "ProductSubCategoriesList",
    "folder": "ReferenceProduct",
    "label": "زیر‌دسته‌های محصول",
    "group": "تجارت و محصول",
    "description": "کامپوننت زیر‌دسته‌های محصول برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "ProductSubCategoriesList",
      "تجارت و محصول",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceProduct/index.tsx",
    "importStatement": "import { ProductSubCategoriesList } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {
      "items": [
        {
          "label": "گوشی موبایل",
          "href": "/products"
        },
        {
          "label": "لوازم جانبی",
          "href": "/products"
        }
      ]
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "review-card",
    "exportName": "ReviewCard",
    "folder": "ReferenceReviews",
    "label": "کارت دیدگاه مرجع",
    "group": "عملیات و وضعیت",
    "description": "کامپوننت کارت دیدگاه مرجع برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "ReviewCard",
      "عملیات و وضعیت",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceReviews/index.tsx",
    "importStatement": "import { ReviewCard } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {
      "review": {
        "id": "rev-1",
        "title": "تجربه خوب از محصول",
        "rating": 5,
        "comment": "کیفیت ساخت و سرعت ارسال رضایت‌بخش بود.",
        "status": "approved",
        "date": "۱۴۰۵/۰۶/۲۴",
        "userName": "سارا احمدی",
        "product": {
          "title": "گوشی موبایل سامسونگ",
          "image": "ph:review-product"
        },
        "positivePoints": [
          {
            "id": "p1",
            "title": "کیفیت ساخت بالا"
          }
        ],
        "negativePoints": [
          {
            "id": "n1",
            "title": "قیمت کمی بالا است"
          }
        ]
      }
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "review-product-card",
    "exportName": "ReviewProductCard",
    "folder": "ReferenceReviews",
    "label": "دیدگاه صفحه محصول",
    "group": "عملیات و وضعیت",
    "description": "کامپوننت دیدگاه صفحه محصول برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "ReviewProductCard",
      "عملیات و وضعیت",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceReviews/index.tsx",
    "importStatement": "import { ReviewProductCard } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {
      "review": {
        "id": "rev-2",
        "title": "ارزش خرید دارد",
        "rating": 4,
        "comment": "برای استفاده روزمره انتخاب خوبی است.",
        "status": "approved",
        "date": "۱۴۰۵/۰۶/۲۲",
        "userName": "مهدی رضایی"
      }
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "reviews-list",
    "exportName": "ReviewsList",
    "folder": "ReferenceReviews",
    "label": "فهرست دیدگاه‌ها مرجع",
    "group": "عملیات و وضعیت",
    "description": "کامپوننت فهرست دیدگاه‌ها مرجع برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "ReviewsList",
      "عملیات و وضعیت",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceReviews/index.tsx",
    "importStatement": "import { ReviewsList } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {
      "reviews": [
        {
          "id": "rev-1",
          "title": "تجربه خوب از محصول",
          "rating": 5,
          "comment": "کیفیت ساخت رضایت‌بخش بود.",
          "status": "approved",
          "date": "۱۴۰۵/۰۶/۲۴",
          "userName": "سارا احمدی"
        }
      ],
      "count": 128
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "reviews-table",
    "exportName": "ReviewsTable",
    "folder": "ReferenceReviews",
    "label": "جدول دیدگاه‌ها مرجع",
    "group": "عملیات و وضعیت",
    "description": "کامپوننت جدول دیدگاه‌ها مرجع برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "ReviewsTable",
      "عملیات و وضعیت",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceReviews/index.tsx",
    "importStatement": "import { ReviewsTable } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {
      "reviews": [
        {
          "id": "rev-1",
          "title": "تجربه خوب",
          "rating": 5,
          "comment": "رضایت‌بخش بود.",
          "status": "approved",
          "userName": "سارا احمدی",
          "product": {
            "title": "گوشی سامسونگ",
            "image": "ph:review-table"
          }
        },
        {
          "id": "rev-2",
          "title": "قابل قبول",
          "rating": 3,
          "comment": "متوسط بود.",
          "status": "pending",
          "userName": "مهدی رضایی",
          "product": {
            "title": "هدفون بی‌سیم",
            "image": "ph:review-table-2"
          }
        }
      ]
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "review-status-badge",
    "exportName": "ReviewStatusBadge",
    "folder": "ReferenceReviews",
    "label": "نشان وضعیت دیدگاه",
    "group": "عملیات و وضعیت",
    "description": "کامپوننت نشان وضعیت دیدگاه برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "ReviewStatusBadge",
      "عملیات و وضعیت",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceReviews/index.tsx",
    "importStatement": "import { ReviewStatusBadge } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {
      "status": "pending"
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "address-skeleton",
    "exportName": "AddressSkeleton",
    "folder": "ReferenceSkeletons",
    "label": "اسکلتون آدرس",
    "group": "عملیات و وضعیت",
    "description": "کامپوننت اسکلتون آدرس برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "AddressSkeleton",
      "عملیات و وضعیت",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceSkeletons/index.tsx",
    "importStatement": "import { AddressSkeleton } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "navbar-skeleton",
    "exportName": "NavbarSkeleton",
    "folder": "ReferenceSkeletons",
    "label": "اسکلتون ناوبری",
    "group": "عملیات و وضعیت",
    "description": "کامپوننت اسکلتون ناوبری برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "NavbarSkeleton",
      "عملیات و وضعیت",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceSkeletons/index.tsx",
    "importStatement": "import { NavbarSkeleton } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "order-skeleton",
    "exportName": "OrderSkeleton",
    "folder": "ReferenceSkeletons",
    "label": "اسکلتون سفارش",
    "group": "عملیات و وضعیت",
    "description": "کامپوننت اسکلتون سفارش برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "OrderSkeleton",
      "عملیات و وضعیت",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceSkeletons/index.tsx",
    "importStatement": "import { OrderSkeleton } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {
      "count": 2
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "product-skeleton",
    "exportName": "ProductSkeleton",
    "folder": "ReferenceSkeletons",
    "label": "اسکلتون محصول",
    "group": "عملیات و وضعیت",
    "description": "کامپوننت اسکلتون محصول برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "ProductSkeleton",
      "عملیات و وضعیت",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceSkeletons/index.tsx",
    "importStatement": "import { ProductSkeleton } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {
      "count": 4
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "review-skeleton",
    "exportName": "ReviewSkeleton",
    "folder": "ReferenceSkeletons",
    "label": "اسکلتون دیدگاه",
    "group": "عملیات و وضعیت",
    "description": "کامپوننت اسکلتون دیدگاه برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "ReviewSkeleton",
      "عملیات و وضعیت",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceSkeletons/index.tsx",
    "importStatement": "import { ReviewSkeleton } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {
      "count": 3
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "sidebar-skeleton",
    "exportName": "SidebarSkeleton",
    "folder": "ReferenceSkeletons",
    "label": "اسکلتون سایدبار",
    "group": "عملیات و وضعیت",
    "description": "کامپوننت اسکلتون سایدبار برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "SidebarSkeleton",
      "عملیات و وضعیت",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceSkeletons/index.tsx",
    "importStatement": "import { SidebarSkeleton } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {
      "count": 4
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "sub-categories-skeleton",
    "exportName": "SubCategoriesSkeleton",
    "folder": "ReferenceSkeletons",
    "label": "اسکلتون زیر‌دسته‌ها",
    "group": "عملیات و وضعیت",
    "description": "کامپوننت اسکلتون زیر‌دسته‌ها برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "SubCategoriesSkeleton",
      "عملیات و وضعیت",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceSkeletons/index.tsx",
    "importStatement": "import { SubCategoriesSkeleton } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {
      "count": 5
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "table-skeleton",
    "exportName": "TableSkeleton",
    "folder": "ReferenceSkeletons",
    "label": "اسکلتون جدول",
    "group": "عملیات و وضعیت",
    "description": "کامپوننت اسکلتون جدول برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "TableSkeleton",
      "عملیات و وضعیت",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceSkeletons/index.tsx",
    "importStatement": "import { TableSkeleton } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {
      "count": 5
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "banner-carousel",
    "exportName": "BannerCarousel",
    "folder": "ReferenceSliders",
    "label": "کاروسل بنر مرجع",
    "group": "تجارت و محصول",
    "description": "کامپوننت کاروسل بنر مرجع برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "BannerCarousel",
      "تجارت و محصول",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceSliders/index.tsx",
    "importStatement": "import { BannerCarousel } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {
      "items": [
        {
          "id": "banner-1",
          "src": "ph:banner-1",
          "alt": "بنر اول"
        },
        {
          "id": "banner-2",
          "src": "ph:banner-2",
          "alt": "بنر دوم"
        }
      ],
      "autoplay": false
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "discount-carousel",
    "exportName": "DiscountCarousel",
    "folder": "ReferenceSliders",
    "label": "کاروسل تخفیف مرجع",
    "group": "تجارت و محصول",
    "description": "کامپوننت کاروسل تخفیف مرجع برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "DiscountCarousel",
      "تجارت و محصول",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceSliders/index.tsx",
    "importStatement": "import { DiscountCarousel } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {
      "products": [
        {
          "id": 1,
          "title": "گوشی موبایل سامسونگ",
          "brand": "سامسونگ",
          "cat": "mobile",
          "price": 61990000,
          "discount": 8,
          "rating": 4.6,
          "ratingCount": 2541,
          "image": "ph:discount-1",
          "stock": 12
        },
        {
          "id": 2,
          "title": "لپ‌تاپ ایسوس",
          "brand": "ایسوس",
          "cat": "laptop",
          "price": 42990000,
          "discount": 6,
          "rating": 4.4,
          "ratingCount": 872,
          "image": "ph:discount-2",
          "stock": 7
        }
      ]
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "product-carousel",
    "exportName": "ProductCarousel",
    "folder": "ReferenceSliders",
    "label": "کاروسل محصول مرجع",
    "group": "تجارت و محصول",
    "description": "کامپوننت کاروسل محصول مرجع برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "ProductCarousel",
      "تجارت و محصول",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceSliders/index.tsx",
    "importStatement": "import { ProductCarousel } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {
      "title": "محبوب‌ترین کالاها",
      "products": [
        {
          "id": 1,
          "title": "گوشی موبایل سامسونگ",
          "brand": "سامسونگ",
          "cat": "mobile",
          "price": 61990000,
          "discount": 8,
          "rating": 4.6,
          "ratingCount": 2541,
          "image": "ph:carousel-1",
          "stock": 12
        },
        {
          "id": 2,
          "title": "هدفون بی‌سیم",
          "brand": "شیائومی",
          "cat": "audio",
          "price": 2490000,
          "discount": 0,
          "rating": 4.2,
          "ratingCount": 384,
          "image": "ph:carousel-2",
          "stock": 4
        }
      ]
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "ranking-carousel",
    "exportName": "RankingCarousel",
    "folder": "ReferenceSliders",
    "label": "کاروسل پرفروش‌ها",
    "group": "تجارت و محصول",
    "description": "کامپوننت کاروسل پرفروش‌ها برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "RankingCarousel",
      "تجارت و محصول",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceSliders/index.tsx",
    "importStatement": "import { RankingCarousel } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {
      "products": [
        {
          "id": 1,
          "title": "گوشی موبایل سامسونگ",
          "brand": "سامسونگ",
          "cat": "mobile",
          "price": 61990000,
          "discount": 8,
          "rating": 4.6,
          "ratingCount": 2541,
          "image": "ph:ranking-1",
          "stock": 12
        },
        {
          "id": 2,
          "title": "لپ‌تاپ ایسوس",
          "brand": "ایسوس",
          "cat": "laptop",
          "price": 42990000,
          "discount": 6,
          "rating": 4.4,
          "ratingCount": 872,
          "image": "ph:ranking-2",
          "stock": 7
        }
      ]
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "data-state-display",
    "exportName": "DataStateDisplay",
    "folder": "ReferenceStates",
    "label": "نمایش وضعیت داده مرجع",
    "group": "عملیات و وضعیت",
    "description": "کامپوننت نمایش وضعیت داده مرجع برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "DataStateDisplay",
      "عملیات و وضعیت",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceStates/index.tsx",
    "importStatement": "import { DataStateDisplay } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {
      "isError": false,
      "isFetching": false,
      "isSuccess": true,
      "dataLength": 2,
      "children": "داده‌های دریافت‌شده"
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "empty-comment",
    "exportName": "EmptyComment",
    "folder": "ReferenceStates",
    "label": "وضعیت خالی دیدگاه",
    "group": "عملیات و وضعیت",
    "description": "کامپوننت وضعیت خالی دیدگاه برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "EmptyComment",
      "عملیات و وضعیت",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceStates/index.tsx",
    "importStatement": "import { EmptyComment } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "empty-comments-list",
    "exportName": "EmptyCommentsList",
    "folder": "ReferenceStates",
    "label": "وضعیت فهرست دیدگاه",
    "group": "عملیات و وضعیت",
    "description": "کامپوننت وضعیت فهرست دیدگاه برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "EmptyCommentsList",
      "عملیات و وضعیت",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceStates/index.tsx",
    "importStatement": "import { EmptyCommentsList } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "empty-custom-list",
    "exportName": "EmptyCustomList",
    "folder": "ReferenceStates",
    "label": "وضعیت فهرست سفارشی",
    "group": "عملیات و وضعیت",
    "description": "کامپوننت وضعیت فهرست سفارشی برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "EmptyCustomList",
      "عملیات و وضعیت",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceStates/index.tsx",
    "importStatement": "import { EmptyCustomList } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "empty-orders-list",
    "exportName": "EmptyOrdersList",
    "folder": "ReferenceStates",
    "label": "وضعیت فهرست سفارش",
    "group": "عملیات و وضعیت",
    "description": "کامپوننت وضعیت فهرست سفارش برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "EmptyOrdersList",
      "عملیات و وضعیت",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceStates/index.tsx",
    "importStatement": "import { EmptyOrdersList } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "empty-search-list",
    "exportName": "EmptySearchList",
    "folder": "ReferenceStates",
    "label": "وضعیت نتیجه جستجو",
    "group": "عملیات و وضعیت",
    "description": "کامپوننت وضعیت نتیجه جستجو برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "EmptySearchList",
      "عملیات و وضعیت",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceStates/index.tsx",
    "importStatement": "import { EmptySearchList } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "empty-users-list",
    "exportName": "EmptyUsersList",
    "folder": "ReferenceStates",
    "label": "وضعیت فهرست کاربران",
    "group": "عملیات و وضعیت",
    "description": "کامپوننت وضعیت فهرست کاربران برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "EmptyUsersList",
      "عملیات و وضعیت",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceStates/index.tsx",
    "importStatement": "import { EmptyUsersList } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "error-action",
    "exportName": "ErrorAction",
    "folder": "ReferenceStates",
    "label": "اقدام خطا",
    "group": "عملیات و وضعیت",
    "description": "کامپوننت اقدام خطا برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "ErrorAction",
      "عملیات و وضعیت",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceStates/index.tsx",
    "importStatement": "import { ErrorAction } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "full-screen-loading",
    "exportName": "FullScreenLoading",
    "folder": "ReferenceStates",
    "label": "بارگذاری تمام‌صفحه مرجع",
    "group": "عملیات و وضعیت",
    "description": "کامپوننت بارگذاری تمام‌صفحه مرجع برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "FullScreenLoading",
      "عملیات و وضعیت",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceStates/index.tsx",
    "importStatement": "import { FullScreenLoading } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {
      "label": "در حال بارگذاری صفحه..."
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "inline-loading",
    "exportName": "InlineLoading",
    "folder": "ReferenceStates",
    "label": "بارگذاری درون‌خطی مرجع",
    "group": "عملیات و وضعیت",
    "description": "کامپوننت بارگذاری درون‌خطی مرجع برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "InlineLoading",
      "عملیات و وضعیت",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceStates/index.tsx",
    "importStatement": "import { InlineLoading } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {
      "label": "در حال دریافت اطلاعات..."
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "auth-links",
    "exportName": "AuthLinks",
    "folder": "ReferenceUser",
    "label": "لینک‌های احراز هویت",
    "group": "ناوبری و پوسته",
    "description": "کامپوننت لینک‌های احراز هویت برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "AuthLinks",
      "ناوبری و پوسته",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceUser/index.tsx",
    "importStatement": "import { AuthLinks } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {
      "authenticated": false,
      "name": "سارا احمدی"
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "mobile-user-button",
    "exportName": "MobileUserButton",
    "folder": "ReferenceUser",
    "label": "دکمه کاربر موبایل",
    "group": "ناوبری و پوسته",
    "description": "کامپوننت دکمه کاربر موبایل برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "MobileUserButton",
      "ناوبری و پوسته",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceUser/index.tsx",
    "importStatement": "import { MobileUserButton } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {
      "href": "/profile"
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "user-menu",
    "exportName": "UserMenu",
    "folder": "ReferenceUser",
    "label": "منوی کاربر مرجع",
    "group": "ناوبری و پوسته",
    "description": "کامپوننت منوی کاربر مرجع برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "UserMenu",
      "ناوبری و پوسته",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReferenceUser/index.tsx",
    "importStatement": "import { UserMenu } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {
      "name": "سارا احمدی",
      "profileHref": "/profile"
    },
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "review-summary",
    "exportName": "ReviewSummary",
    "folder": "ReviewSummary",
    "label": "خلاصه دیدگاه‌ها",
    "group": "تجارت و محصول",
    "description": "کامپوننت خلاصه دیدگاه‌ها برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "ReviewSummary",
      "تجارت و محصول",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ReviewSummary/index.tsx",
    "importStatement": "import { ReviewSummary } from '@digikit/ui';",
    "controls": [
      {
        "key": "rating",
        "label": "امتیاز",
        "type": "number",
        "defaultValue": 4.6,
        "min": 0,
        "max": 5,
        "step": 0.1
      },
      {
        "key": "count",
        "label": "تعداد دیدگاه",
        "type": "number",
        "defaultValue": 2541,
        "min": 0
      },
      {
        "key": "distribution",
        "label": "توزیع امتیاز",
        "type": "json",
        "defaultValue": "{\n  \"1\": 19,\n  \"2\": 32,\n  \"3\": 90,\n  \"4\": 480,\n  \"5\": 1920\n}",
        "placeholder": "JSON معتبر وارد کنید"
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "scroll-carousel",
    "exportName": "ScrollCarousel",
    "folder": "ScrollCarousel",
    "label": "کاروسل اسکرولی",
    "group": "ناوبری و پوسته",
    "description": "کامپوننت کاروسل اسکرولی برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "ScrollCarousel",
      "ناوبری و پوسته",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ScrollCarousel/index.tsx",
    "importStatement": "import { ScrollCarousel } from '@digikit/ui';",
    "controls": [
      {
        "key": "arrows",
        "label": "نمایش فلش",
        "type": "boolean",
        "defaultValue": true
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "search-overlay",
    "exportName": "SearchOverlay",
    "folder": "SearchOverlay",
    "label": "اورلی جستجو",
    "group": "ناوبری و پوسته",
    "description": "کامپوننت اورلی جستجو برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "SearchOverlay",
      "ناوبری و پوسته",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/SearchOverlay/index.tsx",
    "importStatement": "import { SearchOverlay } from '@digikit/ui';",
    "controls": [
      {
        "key": "open",
        "label": "باز",
        "type": "boolean",
        "defaultValue": false
      },
      {
        "key": "recents",
        "label": "جستجوهای اخیر",
        "type": "json",
        "defaultValue": "[\n  \"گوشی سامسونگ\",\n  \"لپ‌تاپ ایسوس\"\n]",
        "placeholder": "JSON معتبر وارد کنید"
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "section-header",
    "exportName": "SectionHeader",
    "folder": "SectionHeader",
    "label": "عنوان بخش",
    "group": "ناوبری و پوسته",
    "description": "کامپوننت عنوان بخش برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "SectionHeader",
      "ناوبری و پوسته",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/SectionHeader/index.tsx",
    "importStatement": "import { SectionHeader } from '@digikit/ui';",
    "controls": [
      {
        "key": "title",
        "label": "عنوان",
        "type": "text",
        "defaultValue": "محبوب‌ترین‌ها"
      },
      {
        "key": "seeAllHref",
        "label": "لینک مشاهده همه",
        "type": "text",
        "defaultValue": "/products"
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "select",
    "exportName": "Select",
    "folder": "Select",
    "label": "انتخابگر",
    "group": "فرم و تعامل",
    "description": "کامپوننت انتخابگر برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "Select",
      "فرم و تعامل",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/Select/index.tsx",
    "importStatement": "import { Select } from '@digikit/ui';",
    "controls": [
      {
        "key": "options",
        "label": "گزینه‌ها",
        "type": "json",
        "defaultValue": "[\n  {\n    \"value\": \"popular\",\n    \"label\": \"پرفروش‌ترین\"\n  },\n  {\n    \"value\": \"newest\",\n    \"label\": \"جدیدترین\"\n  },\n  {\n    \"value\": \"cheap\",\n    \"label\": \"ارزان‌ترین\"\n  }\n]",
        "placeholder": "JSON معتبر وارد کنید"
      },
      {
        "key": "placeholder",
        "label": "راهنما",
        "type": "text",
        "defaultValue": "یک گزینه انتخاب کنید"
      },
      {
        "key": "invalid",
        "label": "نامعتبر",
        "type": "boolean",
        "defaultValue": false
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "seller-card",
    "exportName": "SellerCard",
    "folder": "SellerCard",
    "label": "کارت فروشنده",
    "group": "تجارت و محصول",
    "description": "کامپوننت کارت فروشنده برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "SellerCard",
      "تجارت و محصول",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/SellerCard/index.tsx",
    "importStatement": "import { SellerCard } from '@digikit/ui';",
    "controls": [
      {
        "key": "seller",
        "label": "فروشنده",
        "type": "json",
        "defaultValue": "{\n  \"name\": \"فروشگاه رسمی دیجی‌کیت\",\n  \"rating\": 4.8,\n  \"ratingCount\": 1280,\n  \"positiveRate\": 96,\n  \"location\": \"تهران\",\n  \"verified\": true\n}",
        "placeholder": "JSON معتبر وارد کنید"
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "services-strip",
    "exportName": "ServicesStrip",
    "folder": "ServicesStrip",
    "label": "نوار خدمات",
    "group": "تجارت و محصول",
    "description": "کامپوننت نوار خدمات برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "ServicesStrip",
      "تجارت و محصول",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ServicesStrip/index.tsx",
    "importStatement": "import { ServicesStrip } from '@digikit/ui';",
    "controls": [
      {
        "key": "items",
        "label": "خدمات",
        "type": "json",
        "defaultValue": "[\n  {\n    \"icon\": \"bolt\",\n    \"title\": \"ارسال سریع\",\n    \"desc\": \"تحویل مطمئن\",\n    \"color\": \"#ef394e\",\n    \"href\": \"/products\"\n  },\n  {\n    \"icon\": \"book\",\n    \"title\": \"راهنمای خرید\",\n    \"desc\": \"انتخاب آسان\",\n    \"color\": \"#2563eb\",\n    \"href\": \"/kit\"\n  },\n  {\n    \"icon\": \"credit\",\n    \"title\": \"پرداخت امن\",\n    \"desc\": \"با خیال راحت\",\n    \"color\": \"#00a049\",\n    \"href\": \"/checkout\"\n  }\n]",
        "placeholder": "JSON معتبر وارد کنید"
      },
      {
        "key": "maxWidth",
        "label": "حداکثر عرض",
        "type": "number",
        "defaultValue": 1200,
        "min": 720,
        "max": 1800,
        "step": 8
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "service-tiles",
    "exportName": "ServiceTiles",
    "folder": "ServiceTiles",
    "label": "کاشی خدمات",
    "group": "تجارت و محصول",
    "description": "کامپوننت کاشی خدمات برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "ServiceTiles",
      "تجارت و محصول",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ServiceTiles/index.tsx",
    "importStatement": "import { ServiceTiles } from '@digikit/ui';",
    "controls": [
      {
        "key": "items",
        "label": "خدمات",
        "type": "json",
        "defaultValue": "[\n  {\n    \"icon\": \"bolt\",\n    \"title\": \"ارسال سریع\",\n    \"desc\": \"تحویل مطمئن\",\n    \"color\": \"#ef394e\",\n    \"href\": \"/products\"\n  },\n  {\n    \"icon\": \"book\",\n    \"title\": \"راهنمای خرید\",\n    \"desc\": \"انتخاب آسان\",\n    \"color\": \"#2563eb\",\n    \"href\": \"/kit\"\n  },\n  {\n    \"icon\": \"credit\",\n    \"title\": \"پرداخت امن\",\n    \"desc\": \"با خیال راحت\",\n    \"color\": \"#00a049\",\n    \"href\": \"/checkout\"\n  }\n]",
        "placeholder": "JSON معتبر وارد کنید"
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "shipping-method",
    "exportName": "ShippingMethod",
    "folder": "ShippingMethod",
    "label": "روش ارسال",
    "group": "سبد و پرداخت",
    "description": "کامپوننت روش ارسال برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "ShippingMethod",
      "سبد و پرداخت",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/ShippingMethod/index.tsx",
    "importStatement": "import { ShippingMethod } from '@digikit/ui';",
    "controls": [
      {
        "key": "name",
        "label": "نام گروه",
        "type": "text",
        "defaultValue": "shipping"
      },
      {
        "key": "value",
        "label": "انتخاب‌شده",
        "type": "select",
        "defaultValue": "standard",
        "options": [
          "standard",
          "express"
        ]
      },
      {
        "key": "options",
        "label": "گزینه‌ها",
        "type": "json",
        "defaultValue": "[\n  {\n    \"id\": \"standard\",\n    \"title\": \"ارسال عادی\",\n    \"description\": \"تحویل تا ۳ روز کاری\",\n    \"price\": 0\n  },\n  {\n    \"id\": \"express\",\n    \"title\": \"ارسال سریع\",\n    \"description\": \"تحویل امروز تا ساعت ۲۲\",\n    \"price\": 89000\n  }\n]",
        "placeholder": "JSON معتبر وارد کنید"
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "skeleton",
    "exportName": "Skeleton",
    "folder": "Skeleton",
    "label": "اسکلتون",
    "group": "پایه و نمایش",
    "description": "کامپوننت اسکلتون برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "Skeleton",
      "پایه و نمایش",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/Skeleton/index.tsx",
    "importStatement": "import { Skeleton } from '@digikit/ui';",
    "controls": [
      {
        "key": "variant",
        "label": "نوع",
        "type": "select",
        "defaultValue": "card",
        "options": [
          "text",
          "circle",
          "card",
          "rect"
        ]
      },
      {
        "key": "width",
        "label": "عرض",
        "type": "number",
        "defaultValue": 180,
        "min": 24,
        "max": 360
      },
      {
        "key": "height",
        "label": "ارتفاع",
        "type": "number",
        "defaultValue": 48,
        "min": 24,
        "max": 280
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "sort-bar",
    "exportName": "SortBar",
    "folder": "SortBar",
    "label": "نوار مرتب‌سازی",
    "group": "تجارت و محصول",
    "description": "کامپوننت نوار مرتب‌سازی برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "SortBar",
      "تجارت و محصول",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/SortBar/index.tsx",
    "importStatement": "import { SortBar } from '@digikit/ui';",
    "controls": [
      {
        "key": "value",
        "label": "مقدار فعال",
        "type": "text",
        "defaultValue": "popular"
      },
      {
        "key": "options",
        "label": "گزینه‌ها",
        "type": "json",
        "defaultValue": "[\n  {\n    \"value\": \"popular\",\n    \"label\": \"پرفروش‌ترین\"\n  },\n  {\n    \"value\": \"newest\",\n    \"label\": \"جدیدترین\"\n  },\n  {\n    \"value\": \"cheap\",\n    \"label\": \"ارزان‌ترین\"\n  }\n]",
        "placeholder": "JSON معتبر وارد کنید"
      },
      {
        "key": "total",
        "label": "تعداد نتایج",
        "type": "number",
        "defaultValue": 128,
        "min": 0
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "spinner",
    "exportName": "Spinner",
    "folder": "Spinner",
    "label": "اسپینر",
    "group": "پایه و نمایش",
    "description": "کامپوننت اسپینر برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "Spinner",
      "پایه و نمایش",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/Spinner/index.tsx",
    "importStatement": "import { Spinner } from '@digikit/ui';",
    "controls": [
      {
        "key": "size",
        "label": "اندازه",
        "type": "number",
        "defaultValue": 24,
        "min": 12,
        "max": 64,
        "step": 2
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "stepper",
    "exportName": "Stepper",
    "folder": "Stepper",
    "label": "استپر تعداد",
    "group": "فرم و تعامل",
    "description": "کامپوننت استپر تعداد برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "Stepper",
      "فرم و تعامل",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/Stepper/index.tsx",
    "importStatement": "import { Stepper } from '@digikit/ui';",
    "controls": [
      {
        "key": "value",
        "label": "مقدار",
        "type": "number",
        "defaultValue": 2,
        "min": 1,
        "max": 5
      },
      {
        "key": "min",
        "label": "کمینه",
        "type": "number",
        "defaultValue": 1,
        "min": 0,
        "max": 4
      },
      {
        "key": "max",
        "label": "بیشینه",
        "type": "number",
        "defaultValue": 5,
        "min": 1,
        "max": 20
      },
      {
        "key": "disabled",
        "label": "غیرفعال",
        "type": "boolean",
        "defaultValue": false
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "switch",
    "exportName": "Switch",
    "folder": "Switch",
    "label": "سوئیچ",
    "group": "فرم و تعامل",
    "description": "کامپوننت سوئیچ برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "Switch",
      "فرم و تعامل",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/Switch/index.tsx",
    "importStatement": "import { Switch } from '@digikit/ui';",
    "controls": [
      {
        "key": "label",
        "label": "برچسب",
        "type": "text",
        "defaultValue": "اعلان‌های سفارش"
      },
      {
        "key": "description",
        "label": "توضیح",
        "type": "text",
        "defaultValue": "اعلان‌های مهم را دریافت کن."
      },
      {
        "key": "checked",
        "label": "فعال",
        "type": "boolean",
        "defaultValue": true
      },
      {
        "key": "disabled",
        "label": "غیرفعال",
        "type": "boolean",
        "defaultValue": false
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "tabs",
    "exportName": "Tabs",
    "folder": "Tabs",
    "label": "تب‌ها",
    "group": "فرم و تعامل",
    "description": "کامپوننت تب‌ها برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "Tabs",
      "فرم و تعامل",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/Tabs/index.tsx",
    "importStatement": "import { Tabs } from '@digikit/ui';",
    "controls": [
      {
        "key": "items",
        "label": "تب‌ها",
        "type": "json",
        "defaultValue": "[\n  {\n    \"id\": \"overview\",\n    \"title\": \"نمای کلی\"\n  },\n  {\n    \"id\": \"specs\",\n    \"title\": \"مشخصات\"\n  },\n  {\n    \"id\": \"reviews\",\n    \"title\": \"دیدگاه‌ها\"\n  }\n]",
        "placeholder": "JSON معتبر وارد کنید"
      },
      {
        "key": "active",
        "label": "تب فعال",
        "type": "select",
        "defaultValue": "overview",
        "options": [
          "overview",
          "specs",
          "reviews"
        ]
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "textarea",
    "exportName": "Textarea",
    "folder": "Textarea",
    "label": "ناحیه متن",
    "group": "فرم و تعامل",
    "description": "کامپوننت ناحیه متن برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "Textarea",
      "فرم و تعامل",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/Textarea/index.tsx",
    "importStatement": "import { Textarea } from '@digikit/ui';",
    "controls": [
      {
        "key": "placeholder",
        "label": "راهنما",
        "type": "text",
        "defaultValue": "توضیحات سفارش..."
      },
      {
        "key": "rows",
        "label": "تعداد ردیف",
        "type": "number",
        "defaultValue": 4,
        "min": 2,
        "max": 10
      },
      {
        "key": "resize",
        "label": "تغییر اندازه",
        "type": "select",
        "defaultValue": "vertical",
        "options": [
          "none",
          "vertical",
          "horizontal",
          "both"
        ]
      },
      {
        "key": "disabled",
        "label": "غیرفعال",
        "type": "boolean",
        "defaultValue": false
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "toast-provider",
    "exportName": "ToastProvider",
    "folder": "Toast",
    "label": "سیستم توست",
    "group": "عملیات و وضعیت",
    "description": "کامپوننت سیستم توست برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "ToastProvider",
      "عملیات و وضعیت",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/Toast/index.tsx",
    "importStatement": "import { ToastProvider } from '@digikit/ui';",
    "controls": [],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  },
  {
    "slug": "tooltip",
    "exportName": "Tooltip",
    "folder": "Tooltip",
    "label": "تولتیپ",
    "group": "پایه و نمایش",
    "description": "کامپوننت تولتیپ برای ساخت تجربه‌های RTL دیجی‌کیت.",
    "tags": [
      "Tooltip",
      "پایه و نمایش",
      "RTL",
      "React"
    ],
    "source": "packages/ui/src/components/Tooltip/index.tsx",
    "importStatement": "import { Tooltip } from '@digikit/ui';",
    "controls": [
      {
        "key": "content",
        "label": "متن راهنما",
        "type": "text",
        "defaultValue": "برای مشاهده جزئیات کلیک کنید."
      },
      {
        "key": "side",
        "label": "جایگاه",
        "type": "select",
        "defaultValue": "top",
        "options": [
          "top",
          "bottom",
          "start",
          "end"
        ]
      }
    ],
    "defaultProps": {},
    "hasCustomDemo": false,
    "renderable": true
  }
];

export const COMPONENT_MAP: Record<string, ComponentType<any>> = {
  Accordion,
  AddressCard,
  AddressSkeleton,
  AddToCartButton,
  Alert,
  ArrowLink,
  AuthLinks,
  Avatar,
  BadgeCircle,
  BannerCarousel,
  BottomNav,
  BottomSheet,
  BrandCard,
  Breadcrumb,
  Button,
  CampaignStrip,
  Card,
  CartDiscountItem,
  CartDisplay,
  CartDropdown,
  CartIconBadge,
  CartItem,
  CartItemActions,
  CartOperations,
  CartPreview,
  CartSummary,
  CategoryCard,
  CategoryList,
  CategorySelector,
  Checkbox,
  CheckoutSteps,
  Chip,
  Combobox,
  ConfirmDialog,
  Countdown,
  CouponField,
  DataStateDisplay,
  DataTable,
  DiscountCarousel,
  Divider,
  DropdownMenu,
  EmptyComment,
  EmptyCommentsList,
  EmptyCustomList,
  EmptyOrdersList,
  EmptySearchList,
  EmptyState,
  EmptyUsersList,
  ErrorAction,
  ErrorState,
  FilterDialog,
  FilterSidebar,
  Footer,
  FormField,
  FreeShippingIndicator,
  FullScreenLoading,
  Header,
  HeroBanner,
  IconButton,
  InlineLoading,
  Input,
  LargeBanner,
  Layout,
  MegaMenu,
  MobileUserButton,
  Modal,
  NavbarSkeleton,
  OrderCard,
  OrderSkeleton,
  OrdersSummary,
  OrdersTable,
  OrderStatus,
  PageContainer,
  Pagination,
  PlaceholderImage,
  Price,
  ProductAttributesTable,
  ProductBreadcrumb,
  ProductCard,
  ProductCardAmazing,
  ProductCardGrid,
  ProductCardMobile,
  ProductCardRow,
  ProductCardSuper,
  ProductCardWithActions,
  ProductCarousel,
  ProductColorSelector,
  ProductDescription,
  ProductDiscountTag,
  ProductFilterControls,
  ProductGallery,
  ProductGrid,
  ProductImageList,
  ProductInfo,
  ProductOutOfStockMessage,
  ProductPriceDisplay,
  ProductSizeSelector,
  ProductSkeleton,
  ProductSort,
  ProductSpecialOffer,
  ProductSpecificationList,
  ProductSpecs,
  ProductStockIndicator,
  ProductSubCategoriesList,
  Progress,
  RadioGroup,
  RankingCarousel,
  Rating,
  ReferenceCartItem,
  ReviewCard,
  ReviewProductCard,
  ReviewSkeleton,
  ReviewsList,
  ReviewsTable,
  ReviewStatusBadge,
  ReviewSummary,
  ScrollCarousel,
  SearchDialog,
  SearchOverlay,
  SearchPill,
  SectionHeader,
  Select,
  SellerCard,
  ServiceList,
  ServicesStrip,
  ServiceTiles,
  ShippingMethod,
  SidebarSkeleton,
  Skeleton,
  SmallBanner,
  SortBar,
  Spinner,
  Stepper,
  SubCategoriesSkeleton,
  Switch,
  TableContainer,
  TableSkeleton,
  Tabs,
  Textarea,
  ToastProvider,
  Tooltip,
  UploadImage,
  UserMenu,
};

export const CUSTOM_DEMO_MAP: Record<string, ComponentType<any>> = {};

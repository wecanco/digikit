const product = {
  id: 1,
  href: '/product?id=1',
  title: 'گوشی موبایل سامسونگ مدل Galaxy S24 Ultra ظرفیت ۲۵۶ گیگابایت',
  brand: 'سامسونگ',
  cat: 'mobile',
  price: 61990000,
  oldPrice: 67380000,
  discount: 8,
  rating: 4.6,
  ratingCount: 2541,
  seller: 'دیجی‌کیت',
  warranty: '۱۸ ماه گارانتی شرکتی',
  image: 'ph:1',
  stock: 12,
  isExpress: true,
  isFeatured: true,
};

const categories = [
  { id: 'digital', title: 'کالای دیجیتال', icon: '💻', color: '#5b46e5', subs: ['لپ‌تاپ', 'تبلت', 'هدفون'] },
  { id: 'mobile', title: 'موبایل', icon: '📱', color: '#e8453c', subs: ['گوشی موبایل', 'قاب و کاور'] },
  { id: 'fashion', title: 'مد و پوشاک', icon: '👕', color: '#f27a1a', subs: ['کفش', 'کیف'] },
];

const address = {
  id: 'home',
  title: 'خانه',
  recipient: 'کاربر دیجی‌کیت',
  phone: '۰۹۱۲۱۲۳۴۵۶۷',
  province: 'تهران',
  city: 'تهران',
  details: 'خیابان ولیعصر، کوچه نمونه، پلاک ۱۲',
  postalCode: '۱۲۳۴۵۶۷۸۹۰',
  isDefault: true,
};

const filterSections = [
  { id: 'brand', title: 'برند', options: [{ id: 'samsung', label: 'سامسونگ', count: 128 }, { id: 'apple', label: 'اپل', count: 84 }, { id: 'xiaomi', label: 'شیائومی', count: 61 }] },
  { id: 'availability', title: 'وضعیت موجودی', options: [{ id: 'in-stock', label: 'فقط کالاهای موجود', count: 216 }] },
];

const sortOptions = [
  { value: 'popular', label: 'پرفروش‌ترین' },
  { value: 'newest', label: 'جدیدترین' },
  { value: 'cheap', label: 'ارزان‌ترین' },
];

const shippingOptions = [
  { id: 'standard', title: 'ارسال عادی', description: 'تحویل تا ۳ روز کاری', price: 0 },
  { id: 'express', title: 'ارسال سریع', description: 'تحویل امروز تا ساعت ۲۲', price: 89000 },
];

const serviceItems = [
  { icon: 'bolt', title: 'ارسال سریع', desc: 'تحویل مطمئن', color: '#ef394e', href: '/products' },
  { icon: 'book', title: 'راهنمای خرید', desc: 'انتخاب آسان', color: '#2563eb', href: '/kit' },
  { icon: 'credit', title: 'پرداخت امن', desc: 'با خیال راحت', color: '#00a049', href: '/checkout' },
];

const json = (key, label, value) => ({
  key,
  label,
  type: 'json',
  defaultValue: JSON.stringify(value, null, 2),
  placeholder: 'JSON معتبر وارد کنید',
});
const text = (key, label, defaultValue = '') => ({ key, label, type: 'text', defaultValue });
const number = (key, label, defaultValue, extra = {}) => ({ key, label, type: 'number', defaultValue, ...extra });
const boolean = (key, label, defaultValue = false) => ({ key, label, type: 'boolean', defaultValue });
const select = (key, label, defaultValue, options) => ({ key, label, type: 'select', defaultValue, options });

export const LABELS = {
  Accordion: 'آکاردئون',
  AddressCard: 'کارت آدرس',
  Alert: 'هشدار',
  Avatar: 'آواتار',
  BadgeCircle: 'نشان تخفیف',
  BottomNav: 'ناوبری پایین',
  BottomSheet: 'بات‌شیت',
  BrandCard: 'کارت برند',
  Breadcrumb: 'بردکرامب',
  Button: 'دکمه',
  CampaignStrip: 'نوار کمپین',
  Card: 'کارت',
  CartItem: 'آیتم سبد',
  CartSummary: 'خلاصه سبد',
  CategoryCard: 'کارت دسته‌بندی',
  Checkbox: 'چک‌باکس',
  CheckoutSteps: 'مراحل پرداخت',
  Chip: 'چیپ',
  Countdown: 'شمارش معکوس',
  CouponField: 'فیلد کد تخفیف',
  DataTable: 'جدول داده',
  Divider: 'جداکننده',
  DropdownMenu: 'منوی بازشونده',
  EmptyState: 'وضعیت خالی',
  ErrorState: 'وضعیت خطا',
  FilterSidebar: 'سایدبار فیلتر',
  Footer: 'فوتر',
  FormField: 'فیلد فرم',
  Header: 'هدر',
  HeroBanner: 'بنر قهرمان',
  IconButton: 'دکمه آیکونی',
  Input: 'ورودی',
  Layout: 'پوسته صفحه',
  MegaMenu: 'مگامنو',
  Modal: 'مودال',
  OrderStatus: 'وضعیت سفارش',
  Pagination: 'صفحه‌بندی',
  PlaceholderImage: 'تصویر جایگزین',
  Price: 'قیمت',
  ProductCardAmazing: 'کارت شگفت‌انگیز',
  ProductCardGrid: 'کارت گرید محصول',
  ProductCardMobile: 'کارت موبایل محصول',
  ProductCardRow: 'کارت ردیفی محصول',
  ProductCardSuper: 'کارت سوپرمارکت',
  ProductGallery: 'گالری محصول',
  ProductGrid: 'گرید محصول',
  ProductInfo: 'اطلاعات محصول',
  ProductSpecs: 'مشخصات محصول',
  Progress: 'نوار پیشرفت',
  RadioGroup: 'گروه رادیویی',
  Rating: 'امتیاز',
  ReviewSummary: 'خلاصه دیدگاه‌ها',
  ScrollCarousel: 'کاروسل اسکرولی',
  SearchOverlay: 'اورلی جستجو',
  SearchPill: 'پیل جستجو',
  SectionHeader: 'عنوان بخش',
  Select: 'انتخابگر',
  SellerCard: 'کارت فروشنده',
  ServiceTiles: 'کاشی خدمات',
  ServicesStrip: 'نوار خدمات',
  ShippingMethod: 'روش ارسال',
  Skeleton: 'اسکلتون',
  SortBar: 'نوار مرتب‌سازی',
  Spinner: 'اسپینر',
  Stepper: 'استپر تعداد',
  Switch: 'سوئیچ',
  Tabs: 'تب‌ها',
  Textarea: 'ناحیه متن',
  ToastProvider: 'سیستم توست',
  Tooltip: 'تولتیپ',
};

export const GROUPS = {
  'پایه و نمایش': ['Alert', 'Avatar', 'BadgeCircle', 'Button', 'Card', 'Chip', 'Divider', 'IconButton', 'PlaceholderImage', 'Price', 'Progress', 'Rating', 'Skeleton', 'Spinner', 'Tooltip'],
  'فرم و تعامل': ['Accordion', 'Checkbox', 'DropdownMenu', 'FormField', 'Input', 'RadioGroup', 'SearchPill', 'Select', 'Switch', 'Tabs', 'Textarea', 'Stepper'],
  'ناوبری و پوسته': ['BottomNav', 'BottomSheet', 'Breadcrumb', 'CampaignStrip', 'Footer', 'Header', 'Layout', 'MegaMenu', 'Modal', 'Pagination', 'ScrollCarousel', 'SearchOverlay', 'SectionHeader'],
  'تجارت و محصول': ['BrandCard', 'CategoryCard', 'FilterSidebar', 'HeroBanner', 'ProductCardAmazing', 'ProductCardGrid', 'ProductCardMobile', 'ProductCardRow', 'ProductCardSuper', 'ProductGallery', 'ProductGrid', 'ProductInfo', 'ProductSpecs', 'ReviewSummary', 'SellerCard', 'SortBar', 'ServiceTiles', 'ServicesStrip'],
  'سبد و پرداخت': ['AddressCard', 'CartItem', 'CartSummary', 'CheckoutSteps', 'CouponField', 'ShippingMethod'],
  'عملیات و وضعیت': ['DataTable', 'EmptyState', 'ErrorState', 'OrderStatus', 'Countdown', 'ToastProvider'],
};

export const CONTROL_PRESETS = {
  Accordion: [json('items', 'آیتم‌ها', [{ id: 'one', title: 'ویژگی‌های اصلی', content: 'این محتوای نمونه‌ی آکاردئون است.' }, { id: 'two', title: 'جزئیات ارسال', content: 'ارسال سریع و استاندارد قابل انتخاب است.' }]), boolean('multiple', 'باز شدن چندگانه', false)],
  AddressCard: [json('address', 'آدرس', address), boolean('selected', 'انتخاب شده', true), boolean('selectable', 'قابل انتخاب', true)],
  Alert: [text('title', 'عنوان', 'اطلاعیه مهم'), text('children', 'متن', 'کد تخفیف روی سفارش شما اعمال شد.'), select('tone', 'لحن', 'info', ['info', 'success', 'warning', 'danger'])],
  Avatar: [text('name', 'نام', 'دیجی‌کیت'), select('size', 'اندازه', 'lg', ['xs', 'sm', 'md', 'lg', 'xl']), select('status', 'وضعیت', 'online', ['online', 'offline', 'busy'])],
  BadgeCircle: [number('discount', 'درصد تخفیف', 35, { min: 0, max: 99 }), select('size', 'اندازه', 'md', ['sm', 'md'])],
  BottomNav: [select('active', 'صفحه فعال', 'home', ['home', 'categories', 'cart', 'profile', 'mag'])],
  BottomSheet: [boolean('open', 'باز', false), text('title', 'عنوان', 'انتخاب فیلتر'), text('description', 'توضیح', 'در این پنل، فیلترهای موبایل قرار می‌گیرند.')],
  BrandCard: [text('name', 'نام برند', 'سامسونگ'), number('count', 'تعداد کالا', 128, { min: 0 }), boolean('featured', 'ویژه', true)],
  Breadcrumb: [json('items', 'مسیر', [{ label: 'خانه', href: '/' }, { label: 'موبایل', href: '/search?cat=mobile' }, { label: 'گوشی موبایل' }])],
  Button: [text('children', 'متن', 'افزودن به سبد'), select('variant', 'نوع', 'primary', ['primary', 'secondary', 'outline', 'ghost', 'danger', 'amazing', 'white']), select('size', 'اندازه', 'md', ['sm', 'md', 'lg']), boolean('pill', 'گرد کامل', false), boolean('fullWidth', 'تمام عرض', false), boolean('loading', 'در حال پردازش', false)],
  CampaignStrip: [text('message', 'پیام', 'جشنواره خرید پاییزی شروع شد'), text('href', 'لینک', '/products')],
  Card: [select('variant', 'نوع', 'elevated', ['elevated', 'outlined', 'flat']), select('padding', 'فاصله داخلی', 'md', ['none', 'sm', 'md', 'lg']), boolean('interactive', 'تعاملی', false), text('children', 'متن', 'محتوای کارت دیجی‌کیت')],
  CartItem: [json('item', 'آیتم سبد', { product, qty: 2, selectedColor: '#111827', selectedVariant: '۲۵۶ گیگابایت' })],
  CartSummary: [number('itemsCount', 'تعداد کالا', 2, { min: 0 }), number('subtotal', 'جمع جزء', 123980000, { min: 0, step: 1000 }), number('discount', 'تخفیف', 9900000, { min: 0, step: 1000 }), number('shipping', 'هزینه ارسال', 0, { min: 0, step: 1000 }), number('freeShippingThreshold', 'حد ارسال رایگان', 70000000, { min: 0, step: 1000 })],
  CategoryCard: [json('category', 'دسته', categories[0]), number('count', 'تعداد کالا', 234, { min: 0 }), boolean('compact', 'فشرده', false)],
  Checkbox: [text('label', 'برچسب', 'فقط کالاهای موجود'), text('description', 'توضیح', 'کالاهای آماده ارسال'), boolean('checked', 'انتخاب شده', true)],
  CheckoutSteps: [json('steps', 'مراحل', [{ id: 'cart', title: 'سبد خرید' }, { id: 'shipping', title: 'آدرس و ارسال' }, { id: 'payment', title: 'پرداخت' }]), select('current', 'مرحله فعال', 'shipping', ['cart', 'shipping', 'payment'])],
  Chip: [text('children', 'متن', 'پیشنهاد ویژه'), select('tone', 'لحن', 'success', ['neutral', 'primary', 'success', 'warning', 'danger']), boolean('active', 'فعال', false)],
  Countdown: [number('hoursAhead', 'ساعت تا پایان', 5, { min: 0.1, max: 48, step: 0.1 }), select('theme', 'پوسته', 'onRed', ['default', 'onRed', 'heroWhite', 'white'])],
  CouponField: [text('value', 'کد واردشده', ''), text('appliedCode', 'کد اعمال‌شده', ''), text('message', 'پیام', 'کد نمونه را وارد کنید.'), boolean('loading', 'در حال پردازش', false)],
  DataTable: [json('columns', 'ستون‌ها', [{ key: 'id', title: 'شماره سفارش' }, { key: 'customer', title: 'مشتری' }, { key: 'amount', title: 'مبلغ' }, { key: 'status', title: 'وضعیت' }]), json('rows', 'ردیف‌ها', [{ id: '۱۲۳۴۵', customer: 'سارا احمدی', amount: '۶۱٬۹۹۰٬۰۰۰', status: 'تحویل‌شده' }, { id: '۱۲۳۴۶', customer: 'مهدی رضایی', amount: '۹٬۴۹۰٬۰۰۰', status: 'در حال پردازش' }])],
  Divider: [select('orientation', 'جهت', 'horizontal', ['horizontal', 'vertical']), text('children', 'متن', '')],
  DropdownMenu: [text('label', 'برچسب', 'باز کردن منو'), select('align', 'تراز', 'end', ['start', 'end']), json('items', 'آیتم‌ها', [{ id: 'edit', label: 'ویرایش' }, { id: 'duplicate', label: 'ساخت کپی' }, { id: 'delete', label: 'حذف', danger: true }])],
  EmptyState: [text('title', 'عنوان', 'موردی پیدا نشد'), text('description', 'توضیح', 'برای شروع، یک گزینه را انتخاب کنید.'), text('actionLabel', 'متن اقدام', 'شروع کنید')],
  ErrorState: [text('title', 'عنوان', 'خطایی رخ داد'), text('description', 'توضیح', 'لطفاً دوباره تلاش کنید.'), text('actionLabel', 'متن اقدام', 'تلاش دوباره')],
  FilterSidebar: [json('sections', 'بخش‌ها', filterSections), json('values', 'مقادیر انتخاب‌شده', { brand: ['samsung'] }), boolean('mobileOpen', 'نمایش موبایل', true)],
  Footer: [text('about', 'متن درباره', 'دیجی‌کیت؛ کیت رابط کاربری فارسی برای تجربه‌های فروشگاهی مدرن.')],
  FormField: [text('label', 'برچسب', 'شماره موبایل'), text('hint', 'راهنما', 'شماره را با ارقام انگلیسی وارد کنید.'), text('error', 'خطا', ''), boolean('required', 'اجباری', true)],
  Header: [select('active', 'لینک فعال', 'home', ['home', 'amazing', 'supermarket', 'style', 'mag', 'sell']), json('categories', 'دسته‌ها', categories)],
  HeroBanner: [text('eyebrow', 'پیش‌عنوان', 'فصل تازه خرید آنلاین'), text('title', 'عنوان', 'تجربه‌ای تازه برای خرید آنلاین'), text('description', 'توضیح', 'الگوهای آماده برای ساخت صفحه‌های سریع و قابل اعتماد.'), text('actionLabel', 'متن اقدام', 'مشاهده محصولات'), select('tone', 'پوسته', 'primary', ['primary', 'dark', 'cream'])],
  IconButton: [text('label', 'برچسب دسترسی‌پذیری', 'افزودن به علاقه‌مندی'), select('variant', 'نوع', 'outline', ['primary', 'outline', 'ghost', 'danger']), select('size', 'اندازه', 'md', ['sm', 'md', 'lg'])],
  Input: [text('placeholder', 'راهنما', 'جستجو در دیجی‌کیت'), select('variant', 'نوع', 'base', ['base', 'search', 'searchMuted']), select('size', 'اندازه', 'md', ['sm', 'md', 'lg']), boolean('disabled', 'غیرفعال', false)],
  Layout: [select('active', 'صفحه فعال', 'home', ['home', 'amazing', 'supermarket', 'mag']), number('maxWidth', 'حداکثر عرض', 1352, { min: 960, max: 1800, step: 8 })],
  MegaMenu: [boolean('open', 'باز', true), json('categories', 'دسته‌ها', categories)],
  Modal: [boolean('open', 'باز', false), text('title', 'عنوان', 'تأیید حذف کالا'), text('description', 'توضیح', 'آیا از ادامه این عملیات مطمئن هستید؟')],
  OrderStatus: [select('status', 'وضعیت', 'processing', ['pending', 'processing', 'shipped', 'delivered', 'cancelled']), boolean('compact', 'فشرده', false)],
  Pagination: [number('page', 'صفحه فعلی', 2, { min: 1, max: 9 }), number('totalPages', 'تعداد صفحات', 8, { min: 2, max: 20 })],
  PlaceholderImage: [text('seed', 'شناسه تصویر', 's24-ultra'), text('label', 'برچسب', 'سامسونگ'), select('ratio', 'نسبت تصویر', '1:1', ['1:1', '4:3', '16:9', 'wide'])],
  Price: [number('price', 'قیمت', 1290000, { min: 0, step: 1000 }), number('oldPrice', 'قیمت قبلی', 1890000, { min: 0, step: 1000 }), select('size', 'اندازه', 'md', ['sm', 'md', 'lg']), boolean('unit', 'نمایش تومان', true)],
  ProductCardAmazing: [json('product', 'محصول', product)],
  ProductCardGrid: [json('product', 'محصول', product), boolean('bare', 'حالت hairline', false), boolean('hideTitle', 'حذف عنوان', false)],
  ProductCardMobile: [json('product', 'محصول', product)],
  ProductCardRow: [json('product', 'محصول', product)],
  ProductCardSuper: [json('product', 'محصول', { ...product, cat: 'super', title: 'برنج ایرانی هاشمی درجه یک ۱۰ کیلوگرمی' })],
  ProductGallery: [json('images', 'تصاویر', [{ src: 'ph:1', alt: 'نمای اصلی محصول', label: 'نمای اصلی' }, { src: 'ph:1-side', alt: 'نمای کناری', label: 'نمای کناری' }, { src: 'ph:1-box', alt: 'جعبه محصول', label: 'جعبه' }]), number('initialIndex', 'تصویر فعال', 0, { min: 0, max: 2 }), boolean('favorite', 'علاقه‌مندی', false)],
  ProductGrid: [json('products', 'محصولات', [product, { ...product, id: 2, title: 'گوشی موبایل اپل مدل iPhone 15 Pro Max', image: 'ph:2', price: 89900000 }, { ...product, id: 3, title: 'گوشی موبایل شیائومی مدل Redmi Note 13 Pro', image: 'ph:3', price: 16490000 }]), select('variant', 'نوع گرید', 'bareGrid', ['bareGrid', 'grid']), number('columns', 'ستون دسکتاپ', 4, { min: 2, max: 6 })],
  ProductInfo: [json('product', 'محصول', product), json('colors', 'رنگ‌ها', ['مشکی', 'نقره‌ای', 'بنفش']), json('sizes', 'تنوع‌ها', ['۲۵۶ گیگابایت', '۵۱۲ گیگابایت'])],
  ProductSpecs: [text('title', 'عنوان', 'مشخصات محصول'), json('specs', 'مشخصات', [{ label: 'حافظه داخلی', value: '۲۵۶ گیگابایت', featured: true }, { label: 'ظرفیت باتری', value: '۵۰۰۰ میلی‌آمپرساعت' }, { label: 'گارانتی', value: '۱۸ ماه شرکتی' }])],
  Progress: [number('value', 'مقدار', 68, { min: 0, max: 100 }), number('max', 'حداکثر', 100, { min: 1 }), text('label', 'برچسب', 'تکمیل پروفایل'), boolean('showValue', 'نمایش مقدار', true), select('tone', 'رنگ', 'success', ['primary', 'success', 'warning', 'danger']), select('size', 'اندازه', 'md', ['sm', 'md', 'lg'])],
  RadioGroup: [text('name', 'نام گروه', 'shipping'), select('value', 'انتخاب‌شده', 'standard', ['standard', 'express']), json('options', 'گزینه‌ها', [{ value: 'standard', label: 'ارسال عادی', description: 'تحویل تا ۳ روز کاری' }, { value: 'express', label: 'ارسال سریع', description: 'تحویل امروز' }]), select('orientation', 'چیدمان', 'vertical', ['vertical', 'horizontal'])],
  Rating: [number('rating', 'امتیاز', 4.6, { min: 0, max: 5, step: 0.1 }), number('count', 'تعداد رأی', 2541, { min: 0 }), boolean('showCount', 'نمایش تعداد', true), boolean('single', 'حالت فشرده', false)],
  ReviewSummary: [number('rating', 'امتیاز', 4.6, { min: 0, max: 5, step: 0.1 }), number('count', 'تعداد دیدگاه', 2541, { min: 0 }), json('distribution', 'توزیع امتیاز', { 5: 1920, 4: 480, 3: 90, 2: 32, 1: 19 })],
  ScrollCarousel: [boolean('arrows', 'نمایش فلش', true)],
  SearchOverlay: [boolean('open', 'باز', false), json('recents', 'جستجوهای اخیر', ['گوشی سامسونگ', 'لپ‌تاپ ایسوس'])],
  SearchPill: [text('placeholder', 'راهنما', 'جستجو در دیجی‌کیت'), text('aria-label', 'برچسب', 'جستجو')],
  SectionHeader: [text('title', 'عنوان', 'محبوب‌ترین‌ها'), text('seeAllHref', 'لینک مشاهده همه', '/products')],
  Select: [json('options', 'گزینه‌ها', [{ value: 'popular', label: 'پرفروش‌ترین' }, { value: 'newest', label: 'جدیدترین' }, { value: 'cheap', label: 'ارزان‌ترین' }]), text('placeholder', 'راهنما', 'یک گزینه انتخاب کنید'), boolean('invalid', 'نامعتبر', false)],
  SellerCard: [json('seller', 'فروشنده', { name: 'فروشگاه رسمی دیجی‌کیت', rating: 4.8, ratingCount: 1280, positiveRate: 96, location: 'تهران', verified: true })],
  ServiceTiles: [json('items', 'خدمات', serviceItems)],
  ServicesStrip: [json('items', 'خدمات', serviceItems), number('maxWidth', 'حداکثر عرض', 1200, { min: 720, max: 1800, step: 8 })],
  ShippingMethod: [text('name', 'نام گروه', 'shipping'), select('value', 'انتخاب‌شده', 'standard', ['standard', 'express']), json('options', 'گزینه‌ها', shippingOptions)],
  Skeleton: [select('variant', 'نوع', 'card', ['text', 'circle', 'card', 'rect']), number('width', 'عرض', 180, { min: 24, max: 360 }), number('height', 'ارتفاع', 48, { min: 24, max: 280 })],
  SortBar: [text('value', 'مقدار فعال', 'popular'), json('options', 'گزینه‌ها', sortOptions), number('total', 'تعداد نتایج', 128, { min: 0 })],
  Spinner: [number('size', 'اندازه', 24, { min: 12, max: 64, step: 2 })],
  Stepper: [number('value', 'مقدار', 2, { min: 1, max: 5 }), number('min', 'کمینه', 1, { min: 0, max: 4 }), number('max', 'بیشینه', 5, { min: 1, max: 20 }), boolean('disabled', 'غیرفعال', false)],
  Switch: [text('label', 'برچسب', 'اعلان‌های سفارش'), text('description', 'توضیح', 'اعلان‌های مهم را دریافت کن.'), boolean('checked', 'فعال', true), boolean('disabled', 'غیرفعال', false)],
  Tabs: [json('items', 'تب‌ها', [{ id: 'overview', title: 'نمای کلی' }, { id: 'specs', title: 'مشخصات' }, { id: 'reviews', title: 'دیدگاه‌ها' }]), select('active', 'تب فعال', 'overview', ['overview', 'specs', 'reviews'])],
  Textarea: [text('placeholder', 'راهنما', 'توضیحات سفارش...'), number('rows', 'تعداد ردیف', 4, { min: 2, max: 10 }), select('resize', 'تغییر اندازه', 'vertical', ['none', 'vertical', 'horizontal', 'both']), boolean('disabled', 'غیرفعال', false)],
  Tooltip: [text('content', 'متن راهنما', 'برای مشاهده جزئیات کلیک کنید.'), select('side', 'جایگاه', 'top', ['top', 'bottom', 'start', 'end'])],
};

export function getFallbackGroup(exportName) {
  for (const [group, names] of Object.entries(GROUPS)) {
    if (names.includes(exportName)) return group;
  }
  return 'سایر کامپوننت‌ها';
}

export function getFallbackLabel(exportName) {
  return LABELS[exportName] || exportName.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
}

export function getFallbackControls(exportName) {
  return CONTROL_PRESETS[exportName] || [];
}

/* ─── قالب‌بندی اعداد — قوانین برند دیجی‌کیت ───
   قیمت‌ها: ارقام لاتین با جداکننده هزارگان (fmt)
   متن‌ها: ارقام فارسی با جداکننده هزارگان فارسی (faNum) */

/** 1234567 → «1,234,567» (لاتین — برای قیمت‌ها) */
export const fmt = (n: number): string => n.toLocaleString('en-US');

/** «1234567» → «۱۲۳۴۵۶۷» */
export const toFa = (input: string | number): string =>
  String(input).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);

/** 1234567 → «۱٬۲۳۴٬۵۶۷» (فارسی + جداکننده هزارگان فارسی) */
export const faNum = (n: number): string => toFa(fmt(n)).replace(/,/g, '٬');

/** 4.7 → «۴٫۷» */
export const toFaDecimal = (n: number, digits = 1): string =>
  toFa(n.toFixed(digits).replace('.', '٫'));

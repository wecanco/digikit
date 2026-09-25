import { ArrowLeft, CheckCircle2, Truck } from 'lucide-react';
import { Button } from '../Button';
import { Card } from '../Card';
import { Price } from '../Price';
import { toFa } from '../../utils/format';
import styles from './styles.module.css';

export interface CartSummaryProps {
  itemsCount: number;
  subtotal: number;
  discount?: number;
  shipping?: number;
  freeShippingThreshold?: number;
  onCheckout?(): void;
  checkoutLabel?: string;
  className?: string;
}

export function CartSummary({ itemsCount, subtotal, discount = 0, shipping = 0, freeShippingThreshold, onCheckout, checkoutLabel = 'ادامه فرایند خرید', className }: CartSummaryProps) {
  const qualifiesForFreeShipping = freeShippingThreshold != null && subtotal >= freeShippingThreshold;
  const effectiveShipping = qualifiesForFreeShipping ? 0 : shipping;
  const total = Math.max(0, subtotal - discount + effectiveShipping);
  const remaining = freeShippingThreshold ? Math.max(0, freeShippingThreshold - subtotal) : 0;
  return <Card className={[styles.summary, className].filter(Boolean).join(' ')}><h2>خلاصه سفارش</h2><div className={styles.row}><span>قیمت کالاها ({toFa(itemsCount)})</span><Price price={subtotal} /></div>{discount > 0 && <div className={[styles.row, styles.discount].join(' ')}><span>تخفیف</span><Price price={discount} /></div>}<div className={styles.row}><span>هزینه ارسال</span>{effectiveShipping > 0 ? <Price price={effectiveShipping} /> : <span className={styles.free}>رایگان</span>}</div>{freeShippingThreshold != null && <div className={styles.shipping}>{remaining > 0 ? <><Truck size={17} /><span>{toFa(remaining)} تومان تا ارسال رایگان</span></> : <><CheckCircle2 size={17} /><span>ارسال این سفارش رایگان است</span></>}</div>}<div className={styles.total}><span>مبلغ قابل پرداخت</span><Price price={total} size="lg" /></div>{onCheckout && <Button fullWidth size="lg" endIcon={<ArrowLeft size={18} />} onClick={onCheckout}>{checkoutLabel}</Button>}<p className={styles.note}>پرداخت امن و تضمین‌شده با درگاه‌های معتبر</p></Card>;
}

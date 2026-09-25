/* استپر تعداد — پورت stepperHTML/initSteppers از ui.js (خطوط 210-231) به کامپوننت کنترل‌شده
   (پیل گرد، دکمه‌های ۳۲px با آیکون‌های lucide، ارقام فارسی، قفل در کران‌ها) */
import { Minus, Plus } from 'lucide-react';
import { toFa } from '../../utils/format';
import styles from './styles.module.css';

export interface StepperProps {
  /** مقدار فعلی (کنترل‌شده) */
  value: number;
  /** کمینه — پیش‌فرض ۱ */
  min?: number;
  /** بیشینه — پیش‌فرض ۵ (مطابق سبد دمو) */
  max?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  className?: string;
}

/** استپر تعداد کالا — دکمه‌ها در کران‌ها غیرفعال می‌شوند و مقدار همیشه بین min و max نگه داشته می‌شود */
export function Stepper({ value, min = 1, max = 5, onChange, disabled, className }: StepperProps) {
  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  const qty = clamp(value);
  return (
    <div className={[styles.wrap, className].filter(Boolean).join(' ')} role="group" aria-label="تعداد">
      <button
        type="button"
        className={styles.btn}
        onClick={() => onChange(clamp(qty + 1))}
        disabled={disabled || qty >= max}
        aria-label="افزودن"
      >
        <Plus size={16} strokeWidth={2.2} aria-hidden />
      </button>
      <span className={styles.val}>{toFa(qty)}</span>
      <button
        type="button"
        className={styles.btn}
        onClick={() => onChange(clamp(qty - 1))}
        disabled={disabled || qty <= min}
        aria-label="کاهش"
      >
        <Minus size={16} strokeWidth={2.2} aria-hidden />
      </button>
    </div>
  );
}

import type { ReactNode } from 'react';
import styles from './styles.module.css';

export interface CampaignStripProps {
  /** پیام نوار — پیش‌فرض متن جشنواره پاییزه منبع (partials.js:44-55) */
  message?: ReactNode;
  /** مقصد دکمه «مشاهده» */
  href?: string;
}

/** نوار کمپین بالای هدر — گرادیان قرمز-نارنجی؛ دسکتاپ ۶۰px با پیام + CTA، موبایل ۳۶px تک‌خطی وسط‌چین */
export function CampaignStrip({ message, href }: CampaignStripProps) {
  return (
    <div className={styles.strip}>
      <div className={styles.inner}>
        <p className={styles.message}>
          {message ?? (
            <>
              🎁 جشنواره پاییزه دیجی‌کیت؛ تا <strong className={styles.strong}>۵۰٪</strong> تخفیف روی هزاران
              کالا + ارسال رایگان اعضای دیجی‌کیت پلاس
            </>
          )}
        </p>
        <a className={styles.cta} href={href ?? '/search?sort=discount'}>
          مشاهده
        </a>
      </div>
    </div>
  );
}

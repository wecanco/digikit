import type { ReactNode } from 'react';
import { ChevronLeft } from 'lucide-react';
import styles from './styles.module.css';

export interface SectionHeaderProps {
  /** عنوان بخش — ۱۶px extrabold (md: ۱۸px) */
  title: string;
  /** لینک «مشاهده همه» — فقط وقتی end داده نشده باشد رندر می‌شود */
  seeAllHref?: string;
  /** محتوای انتهای ردیف (جایگزین لینک مشاهده همه — مثل شمارش معکوس باند شگفت‌انگیز) */
  end?: ReactNode;
  className?: string;
}

/** سرتیتر بخش — پورت .section-title/.see-all (main.css:110-115). ردیف flex با justify-between */
export function SectionHeader({ title, seeAllHref, end, className }: SectionHeaderProps) {
  return (
    <div className={[styles.row, className].filter(Boolean).join(' ')}>
      <h2 className={styles.title}>{title}</h2>
      {end != null ? (
        end
      ) : seeAllHref ? (
        <a href={seeAllHref} className={styles.seeAll}>
          مشاهده همه
          <ChevronLeft size={14} aria-hidden />
        </a>
      ) : null}
    </div>
  );
}

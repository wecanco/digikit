import { Fragment } from 'react';
import { ChevronLeft } from 'lucide-react';
import styles from './styles.module.css';

export interface BreadcrumbItem {
  title: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

/* مسیر صفحه — برد کرامب RTL (d14 y142-154): آیتم ۱۲px، جداکننده شورون چپِ ۱۲px */
export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="مسیر صفحه" className={styles.nav}>
      <ol className={styles.list}>
        {items.map((item, i) => {
          const current = i === items.length - 1;
          return (
            <Fragment key={`${i}-${item.title}`}>
              <li>
                {current ? (
                  <span className={styles.current} aria-current="page">
                    {item.title}
                  </span>
                ) : item.href ? (
                  <a className={styles.link} href={item.href}>
                    {item.title}
                  </a>
                ) : (
                  <span className={styles.passive}>{item.title}</span>
                )}
              </li>
              {!current && (
                <li className={styles.sep} aria-hidden="true">
                  <ChevronLeft size={12} strokeWidth={1.7} />
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

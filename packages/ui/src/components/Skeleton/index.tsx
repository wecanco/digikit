/* اسکلتون — الگوهای بارگذاری صفحه پروفایل: text/card/circle/rect با پالس ملایم */
import styles from './styles.module.css';

export interface SkeletonProps {
  variant?: 'text' | 'card' | 'circle' | 'rect';
  width?: number | string;
  height?: number | string;
  className?: string;
}

/** جای‌نگهدار بارگذاری — width/height اینلاین مقدار پیش‌فرض واریانت را بازنویسی می‌کند */
export function Skeleton({ variant = 'text', width, height, className }: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={[styles.skeleton, styles[variant], className].filter(Boolean).join(' ')}
      style={{ width, height }}
    />
  );
}

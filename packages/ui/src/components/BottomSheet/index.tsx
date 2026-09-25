'use client';

import { useEffect, useId, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { useDialogFocus } from '../../hooks/useDialogFocus';
import styles from './styles.module.css';

export interface BottomSheetProps {
  open: boolean;
  onClose(): void;
  title?: string;
  description?: ReactNode;
  children?: ReactNode;
  closeOnBackdrop?: boolean;
}

/* شیت پایین موبایل (الگوی m22) — backdrop مشکی ۳۰٪، ورق سفید از پایین با
   گوشه‌های بالای گرد، دستگیره کشیدن و عنوان وسط؛ Escape/backdrop می‌بندد */
export function BottomSheet({ open, onClose, title, description, children, closeOnBackdrop = true }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useDialogFocus(open, sheetRef, onClose);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className={styles.backdrop} onClick={closeOnBackdrop ? onClose : undefined}>
      <div
        ref={sheetRef}
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        aria-label={title ? undefined : 'شیت پایین'}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.handle} aria-hidden="true" />
        <div className={styles.head}>
          {title != null ? (
            <>
              <span className={styles.headSpacer} aria-hidden="true" />
              <h3 id={titleId} className={styles.title}>{title}</h3>
              <button type="button" className={styles.close} onClick={onClose} aria-label="بستن">
                <X size={18} />
              </button>
            </>
          ) : (
            <>
              <span className={styles.headSpacer} aria-hidden="true" />
              <span className={styles.headSpacer} aria-hidden="true" />
              <button type="button" className={styles.close} onClick={onClose} aria-label="بستن">
                <X size={18} />
              </button>
            </>
          )}
        </div>
        {description && <p id={descriptionId} className={styles.description}>{description}</p>}
        {children}
      </div>
    </div>
  );
}

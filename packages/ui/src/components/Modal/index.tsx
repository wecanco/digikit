'use client';

import { useEffect, useId, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { useDialogFocus } from '../../hooks/useDialogFocus';
import styles from './styles.module.css';

export interface ModalProps {
  open: boolean;
  onClose(): void;
  title?: string;
  description?: ReactNode;
  children?: ReactNode;
  closeOnBackdrop?: boolean;
}

/* دیالوگ دسکتاپ — backdrop بنفشِ نیمه‌شفاف + پنل سفید وسط‌چین با گوشه ۱۶px؛
   Escape/کلیک بیرون می‌بندد؛ اسکرول body هنگام باز بودن قفل می‌شود */
export function Modal({ open, onClose, title, description, children, closeOnBackdrop = true }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useDialogFocus(open, panelRef, onClose);

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
    <div className={styles.overlay} onClick={closeOnBackdrop ? onClose : undefined}>
      <div
        ref={panelRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        aria-label={title ? undefined : 'دیالوگ'}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        {title != null ? (
          <div className={styles.head}>
            <h3 id={titleId} className={styles.title}>{title}</h3>
            <button type="button" className={styles.close} onClick={onClose} aria-label="بستن">
              <X size={18} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            className={`${styles.close} ${styles.closeFloat}`}
            onClick={onClose}
            aria-label="بستن"
          >
            <X size={18} />
          </button>
        )}
        {description && <p id={descriptionId} className={styles.description}>{description}</p>}
        {children}
      </div>
    </div>
  );
}

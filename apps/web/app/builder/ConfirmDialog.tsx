'use client';

import { useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import s from './builder.module.css';

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm(): void;
  onCancel(): void;
}

export function ConfirmDialog({ open, title, description, confirmLabel = 'تأیید', cancelLabel = 'انصراف', danger = true, onConfirm, onCancel }: ConfirmDialogProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    cancelButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCancel();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [onCancel, open]);

  if (!open) return null;

  return (
    <div className={s.confirmBackdrop} role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel(); }}>
      <div className={s.confirmDialog} role="dialog" aria-modal="true" aria-labelledby="builder-confirm-title" aria-describedby="builder-confirm-description" onMouseDown={(event) => event.stopPropagation()}>
        <div className={s.confirmIcon} aria-hidden="true"><AlertTriangle size={20} /></div>
        <div className={s.confirmContent}>
          <div className={s.confirmHeader}><h2 id="builder-confirm-title">{title}</h2><button type="button" className={s.confirmClose} onClick={onCancel} aria-label="بستن پنجره تأیید"><X size={16} /></button></div>
          <p id="builder-confirm-description">{description}</p>
          <div className={s.confirmActions}><button type="button" className={s.confirmCancel} ref={cancelButtonRef} onClick={onCancel}>{cancelLabel}</button><button type="button" className={danger ? s.confirmDanger : s.confirmPrimary} onClick={onConfirm}>{confirmLabel}</button></div>
        </div>
      </div>
    </div>
  );
}

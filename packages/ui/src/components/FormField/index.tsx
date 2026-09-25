import { cloneElement, isValidElement, useId, type ReactElement, type ReactNode } from 'react';
import styles from './styles.module.css';

export interface FormFieldProps {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  inputId?: string;
  children: ReactNode;
  className?: string;
}

export function FormField({ label, hint, error, required, inputId, children, className }: FormFieldProps) {
  const generatedId = useId().replace(/:/g, '');
  const controlId = inputId || (label ? `dk-field-${generatedId}` : undefined);
  const hintId = hint ? `${controlId || `dk-field-${generatedId}`}-hint` : undefined;
  const errorId = error ? `${controlId || `dk-field-${generatedId}`}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;
  const control = isValidElement(children)
    ? cloneElement(children as ReactElement<{ id?: string; 'aria-describedby'?: string; 'aria-invalid'?: boolean }>, {
        id: controlId,
        'aria-describedby': describedBy,
        'aria-invalid': error ? true : undefined,
      })
    : children;

  return (
    <div className={[styles.field, className].filter(Boolean).join(' ')}>
      {label && <label className={styles.label} htmlFor={controlId}>{label}{required && <span aria-hidden="true"> *</span>}</label>}
      <div>{control}</div>
      {error ? <p id={errorId} className={styles.error} role="alert">{error}</p> : hint ? <p id={hintId} className={styles.hint}>{hint}</p> : null}
    </div>
  );
}

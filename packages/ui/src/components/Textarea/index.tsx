import { forwardRef } from 'react';
import type { TextareaHTMLAttributes } from 'react';
import styles from './styles.module.css';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({ invalid, resize = 'vertical', className, ...rest }, ref) {
  return <textarea ref={ref} className={[styles.textarea, styles[resize], invalid && styles.invalid, className].filter(Boolean).join(' ')} aria-invalid={invalid || undefined} {...rest} />;
});

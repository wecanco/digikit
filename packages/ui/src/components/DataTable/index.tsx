import type { ReactNode } from 'react';
import styles from './styles.module.css';

export interface DataTableColumn<T extends Record<string, unknown>> { key: keyof T; title: string; render?(value: T[keyof T], row: T): ReactNode; align?: 'start' | 'center' | 'end'; }

export interface DataTableProps<T extends Record<string, unknown>> { columns: DataTableColumn<T>[]; rows: T[]; rowKey?(row: T, index: number): string | number; empty?: ReactNode; className?: string; }

export function DataTable<T extends Record<string, unknown>>({ columns, rows, rowKey, empty = 'داده‌ای برای نمایش وجود ندارد', className }: DataTableProps<T>) {
  return <div className={[styles.wrap, className].filter(Boolean).join(' ')}><table><thead><tr>{columns.map((column) => <th key={String(column.key)} style={{ textAlign: column.align }}>{column.title}</th>)}</tr></thead><tbody>{rows.length ? rows.map((row, index) => <tr key={rowKey?.(row, index) ?? index}>{columns.map((column) => <td key={String(column.key)} style={{ textAlign: column.align }}>{column.render ? column.render(row[column.key], row) : String(row[column.key] ?? '—')}</td>)}</tr>) : <tr><td colSpan={columns.length} className={styles.empty}>{empty}</td></tr>}</tbody></table></div>;
}

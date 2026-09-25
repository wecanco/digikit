import { Check, Edit3, MapPin, Trash2 } from 'lucide-react';
import type { Address } from '../../types';
import { toFa } from '../../utils/format';
import { Button } from '../Button';
import { Card } from '../Card';
import styles from './styles.module.css';

export interface AddressCardProps {
  address: Address;
  selected?: boolean;
  selectable?: boolean;
  onSelect?(): void;
  onEdit?(): void;
  onDelete?(): void;
  onSetDefault?(): void;
  className?: string;
}

export function AddressCard({ address, selected, selectable = true, onSelect, onEdit, onDelete, onSetDefault, className }: AddressCardProps) {
  const addressMeta = [address.plaque && `پلاک ${toFa(address.plaque)}`, address.unit && `واحد ${toFa(address.unit)}`].filter(Boolean).join('، ');
  return <Card variant={selected ? 'outlined' : 'flat'} padding="md" className={[styles.card, selectable && styles.interactive, selected && styles.selected, className].filter(Boolean).join(' ')} onClick={selectable ? onSelect : undefined} onKeyDown={selectable ? (event) => { if ((event.key === 'Enter' || event.key === ' ') && onSelect) { event.preventDefault(); onSelect(); } } : undefined} role={selectable ? 'button' : undefined} tabIndex={selectable ? 0 : undefined}><div className={styles.head}><span className={styles.title}><MapPin size={17} />{address.title}</span>{address.isDefault && <span className={styles.default}>پیش‌فرض</span>}{selected && <span className={styles.check}><Check size={14} /></span>}</div><div className={styles.details}><strong>{address.recipient}</strong>{address.phone && <span>{address.phone}</span>}<span>{address.province}، {address.city}، {address.details}</span>{addressMeta && <span>{addressMeta}</span>}{address.postalCode && <span>کد پستی: {toFa(address.postalCode)}</span>}</div>{(onSetDefault || onEdit || onDelete) && <div className={styles.actions}>{onSetDefault && !address.isDefault && <Button size="sm" variant="ghost" startIcon={<Check size={14} />} onClick={(event) => { event.stopPropagation(); onSetDefault(); }}>انتخاب به‌عنوان پیش‌فرض</Button>}{onEdit && <Button size="sm" variant="ghost" startIcon={<Edit3 size={14} />} onClick={(event) => { event.stopPropagation(); onEdit(); }}>ویرایش</Button>}{onDelete && <Button size="sm" variant="ghost" startIcon={<Trash2 size={14} />} onClick={(event) => { event.stopPropagation(); onDelete(); }}>حذف</Button>}</div>}</Card>;
}

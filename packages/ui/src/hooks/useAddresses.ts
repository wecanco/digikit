'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Address } from '../types';
import { DIGIKIT_STORAGE_EVENTS, DIGIKIT_STORAGE_KEYS } from '../utils/storage';

export type AddressInput = Omit<Address, 'id' | 'isDefault'>;

const text = (value: unknown) => (value === null || value === undefined ? '' : String(value).trim());
const latinDigits = (value: unknown) => text(value).replace(/[۰-۹]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit))).replace(/[٠-٩]/g, (digit) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)));

const normalizeAddress = (value: unknown, index: number): Address | null => {
  if (!value || typeof value !== 'object') return null;
  const candidate = value as Partial<Address> & { name?: unknown; line?: unknown; postal?: unknown };
  const legacyName = text(candidate.name);
  const title = text(candidate.title) || (candidate.recipient ? 'آدرس' : legacyName) || 'آدرس';
  const recipient = text(candidate.recipient) || (candidate.title ? 'کاربر دیجی‌کیت' : legacyName) || 'کاربر دیجی‌کیت';
  const details = text(candidate.details) || text(candidate.line);
  if (!details) return null;

  return {
    id: text(candidate.id) || `address-${index + 1}`,
    title,
    recipient,
    phone: text(candidate.phone) || undefined,
    province: text(candidate.province) || 'تهران',
    city: text(candidate.city) || 'تهران',
    details,
    plaque: latinDigits(candidate.plaque) || undefined,
    unit: latinDigits(candidate.unit) || undefined,
    postalCode: latinDigits(candidate.postalCode) || latinDigits(candidate.postal) || undefined,
    isDefault: Boolean(candidate.isDefault),
  };
};

const normalize = (value: unknown): Address[] => {
  if (!Array.isArray(value)) return [];
  const addresses = value.map(normalizeAddress).filter((address): address is Address => Boolean(address));
  if (!addresses.length) return addresses;
  const defaultIndex = addresses.findIndex((address) => address.isDefault);
  return addresses.map((address, index) => ({ ...address, isDefault: defaultIndex < 0 ? index === 0 : index === defaultIndex }));
};

const read = (fallback: Address[]): Address[] => {
  try {
    const raw = localStorage.getItem(DIGIKIT_STORAGE_KEYS.addresses);
    if (raw === null) return normalize(fallback);
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return normalize(fallback);
    const normalized = normalize(parsed);
    if (parsed.length && !normalized.length) return normalize(fallback);
    if (JSON.stringify(parsed) !== JSON.stringify(normalized)) {
      localStorage.setItem(DIGIKIT_STORAGE_KEYS.addresses, JSON.stringify(normalized));
    }
    return normalized;
  } catch {
    return normalize(fallback);
  }
};

const write = (addresses: Address[]) => {
  try {
    localStorage.setItem(DIGIKIT_STORAGE_KEYS.addresses, JSON.stringify(addresses));
  } catch {
    return;
  }
};

export function useAddresses(fallback: Address[] = []) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const syncFromStorage = () => {
      setAddresses(read(fallback));
      setHydrated(true);
    };
    syncFromStorage();
    window.addEventListener(DIGIKIT_STORAGE_EVENTS.addresses, syncFromStorage);
    window.addEventListener('storage', syncFromStorage);
    return () => {
      window.removeEventListener(DIGIKIT_STORAGE_EVENTS.addresses, syncFromStorage);
      window.removeEventListener('storage', syncFromStorage);
    };
  }, [fallback]);

  const commit = useCallback((next: Address[]) => {
    const normalized = normalize(next);
    setAddresses(normalized);
    write(normalized);
    window.dispatchEvent(new CustomEvent(DIGIKIT_STORAGE_EVENTS.addresses));
  }, []);

  const add = useCallback((input: AddressInput) => {
    const id = `address-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    commit([...addresses, { ...input, id, isDefault: addresses.length === 0 }]);
    return id;
  }, [addresses, commit]);

  const update = useCallback((id: string, input: AddressInput) => {
    commit(addresses.map((address) => address.id === id ? { ...address, ...input } : address));
  }, [addresses, commit]);

  const remove = useCallback((id: string) => {
    const removed = addresses.find((address) => address.id === id);
    const remaining = addresses.filter((address) => address.id !== id);
    if (removed?.isDefault && remaining.length) remaining[0] = { ...remaining[0], isDefault: true };
    commit(remaining);
  }, [addresses, commit]);

  const setDefault = useCallback((id: string) => {
    commit(addresses.map((address) => ({ ...address, isDefault: address.id === id })));
  }, [addresses, commit]);

  return { addresses, hydrated, add, update, remove, setDefault };
}

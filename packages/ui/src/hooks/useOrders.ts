'use client';

import { useCallback, useEffect, useState } from 'react';
import type { OrderStatusValue } from '../components/OrderStatus';
import type { Address } from '../types';
import { DIGIKIT_STORAGE_EVENTS, DIGIKIT_STORAGE_KEYS } from '../utils/storage';

export interface StoredOrderItem {
  id: number;
  title: string;
  qty: number;
  price: number;
  image: string;
}

export interface StoredOrder {
  id: string;
  createdAt: string;
  status: OrderStatusValue;
  items: StoredOrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  address: Pick<Address, 'title' | 'recipient' | 'city'>;
  shippingTitle: string;
}

const isOrder = (value: unknown): value is StoredOrder => {
  if (!value || typeof value !== 'object') return false;
  const order = value as Partial<StoredOrder>;
  return typeof order.id === 'string'
    && typeof order.createdAt === 'string'
    && Array.isArray(order.items)
    && typeof order.total === 'number'
    && Boolean(order.address)
    && typeof order.shippingTitle === 'string';
};

const read = (): StoredOrder[] => {
  try {
    const value = JSON.parse(localStorage.getItem(DIGIKIT_STORAGE_KEYS.orders) || '[]');
    return Array.isArray(value) ? value.filter(isOrder) : [];
  } catch {
    return [];
  }
};

export function useOrders() {
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const syncFromStorage = () => {
      setOrders(read());
      setHydrated(true);
    };
    syncFromStorage();
    window.addEventListener(DIGIKIT_STORAGE_EVENTS.orders, syncFromStorage);
    window.addEventListener('storage', syncFromStorage);
    return () => {
      window.removeEventListener(DIGIKIT_STORAGE_EVENTS.orders, syncFromStorage);
      window.removeEventListener('storage', syncFromStorage);
    };
  }, []);

  const add = useCallback((order: StoredOrder) => {
    const next = [order, ...read().filter((item) => item.id !== order.id)];
    try {
      localStorage.setItem(DIGIKIT_STORAGE_KEYS.orders, JSON.stringify(next));
    } catch {
      return;
    }
    setOrders(next);
    window.dispatchEvent(new CustomEvent(DIGIKIT_STORAGE_EVENTS.orders));
  }, []);

  return { orders, hydrated, add };
}

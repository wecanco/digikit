import { Suspense } from 'react';
import ProductClient from './ProductClient';

export default function ProductPage() {
  return <Suspense fallback={<div style={{ padding: 32, textAlign: 'center' }}>در حال بارگذاری محصول…</div>}><ProductClient /></Suspense>;
}

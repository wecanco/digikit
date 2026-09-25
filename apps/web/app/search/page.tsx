import { Suspense } from 'react';
import SearchClient from './SearchClient';

export default function SearchPage() {
  return <Suspense fallback={<div style={{ padding: 32, textAlign: 'center' }}>در حال بارگذاری نتایج…</div>}><SearchClient /></Suspense>;
}

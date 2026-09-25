'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';
import { FilterSidebar, Layout, Pagination, ProductGrid, SectionHeader, SortBar } from '@digikit/ui';
import { Button } from '@digikit/ui';
import { DEMO_ALL_PRODUCTS } from '../../lib/demo';
import s from '../showcase.module.css';

const sortOptions = [{ value: 'popular', label: 'پرفروش‌ترین' }, { value: 'newest', label: 'جدیدترین' }, { value: 'cheap', label: 'ارزان‌ترین' }, { value: 'discount', label: 'بیشترین تخفیف' }];
const brandOptions = [{ id: 'سامسونگ', label: 'سامسونگ', slug: 'samsung' }, { id: 'اپل', label: 'اپل', slug: 'apple' }, { id: 'شیائومی', label: 'شیائومی', slug: 'xiaomi' }, { id: 'سونی', label: 'سونی', slug: 'sony' }, { id: 'اسنوا', label: 'اسنوا', slug: 'snova' }];

export default function SearchClient() {
  const params = useSearchParams();
  const query = params.get('q') || '';
  const category = params.get('cat') || '';
  const brandParam = params.get('brand') || '';
  const sortParam = params.get('sort') || 'popular';
  const requestedBrand = brandOptions.find((option) => option.slug === brandParam)?.id || brandParam;
  const categoryIds = category === 'digital' ? ['digital', 'mobile'] : category === 'style' ? ['fashion'] : category ? [category] : [];
  const [sort, setSort] = useState(sortParam);
  const [page, setPage] = useState(1);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(requestedBrand ? [requestedBrand] : []);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const pageSize = 12;

  useEffect(() => {
    setSort(sortParam);
    setSelectedBrands(requestedBrand ? [requestedBrand] : []);
    setPage(1);
  }, [category, query, requestedBrand, sortParam]);

  const filtered = useMemo(() => DEMO_ALL_PRODUCTS.filter((product) => (!query || `${product.title} ${product.brand}`.toLocaleLowerCase().includes(query.toLocaleLowerCase())) && (!categoryIds.length || categoryIds.includes(product.cat)) && (!selectedBrands.length || selectedBrands.includes(product.brand || '')) && (!availableOnly || product.stock !== 0)).sort((a, b) => sort === 'cheap' ? a.price - b.price : sort === 'discount' ? b.discount - a.discount : sort === 'newest' ? b.id - a.id : b.ratingCount - a.ratingCount), [availableOnly, categoryIds, query, selectedBrands, sort]);
  const visibleProducts = filtered.slice((page - 1) * pageSize, page * pageSize);

  const closeFilters = filterOpen ? () => setFilterOpen(false) : undefined;

  return <Layout active="cats"><div className={s.page}>
    <SectionHeader title={query ? `نتایج جستجو برای «${query}»` : 'همه محصولات'} seeAllHref="/search" />
    <div className={s.productLayout}><FilterSidebar sections={[{ id: 'brand', title: 'برند', options: brandOptions.map(({ id, label }) => ({ id, label })) }, { id: 'availability', title: 'موجودی', options: [{ id: 'stock', label: 'فقط کالاهای موجود' }] }]} values={{ brand: selectedBrands, availability: availableOnly ? ['stock'] : [] }} onChange={(section, id, checked) => { if (section === 'availability') { setAvailableOnly(checked); setPage(1); return; } if (section !== 'brand') return; setSelectedBrands((current) => checked ? [...current.filter((item) => item !== id), id] : current.filter((item) => item !== id)); setPage(1); }} onClear={() => { setSelectedBrands([]); setAvailableOnly(false); setPage(1); }} mobileOpen={filterOpen} onMobileClose={closeFilters} onApply={closeFilters} /><div className={s.products}><div className={s.mobileToolbar}><Button size="sm" variant="outline" startIcon={<SlidersHorizontal size={16} />} onClick={() => setFilterOpen(true)}>فیلترها</Button></div><SortBar value={sort} options={sortOptions} onChange={(value) => { setSort(value); setPage(1); }} total={filtered.length} /><ProductGrid products={visibleProducts} variant="bareGrid" />{!visibleProducts.length && <p className={s.muted}>برای این جستجو کالایی پیدا نشد.</p>}<Pagination page={page} totalPages={Math.max(1, Math.ceil(filtered.length / pageSize))} onChange={setPage} /></div></div>
  </div></Layout>;
}

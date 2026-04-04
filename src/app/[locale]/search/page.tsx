'use client';

import { useEffect, useState } from 'react';
import { SearchFilters } from '@/components/SearchFilters';
import { PropertyGrid } from '@/components/PropertyGrid';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';

export default function SearchPage() {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const t = useTranslations('Nav');
  const searchParams = useSearchParams();

  useEffect(() => {
    const next: Record<string, string> = {};

    const q = searchParams.get('q');
    const type = searchParams.get('type');
    const priceMin = searchParams.get('priceMin');
    const priceMax = searchParams.get('priceMax');
    const surfaceMin = searchParams.get('surfaceMin');
    const isFurnished = searchParams.get('isFurnished');

    if (q) next.q = q;
    if (type) next.type = type;
    if (priceMin) next.priceMin = priceMin;
    if (priceMax) next.priceMax = priceMax;
    if (surfaceMin) next.surfaceMin = surfaceMin;
    if (isFurnished) next.isFurnished = isFurnished;

    setFilters(next);
  }, [searchParams.toString()]);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <aside className="lg:w-72 shrink-0">
        <SearchFilters filters={filters} onChange={setFilters} />
      </aside>
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-6">{t('search')}</h1>
        <PropertyGrid filters={filters} />
      </div>
    </div>
  );
}

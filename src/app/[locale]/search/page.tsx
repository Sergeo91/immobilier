'use client';

import { useState } from 'react';
import { SearchFilters } from '@/components/SearchFilters';
import { PropertyGrid } from '@/components/PropertyGrid';
import { useTranslations } from 'next-intl';

export default function SearchPage() {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const t = useTranslations('Nav');
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

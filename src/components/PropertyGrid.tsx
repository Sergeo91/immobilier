'use client';

import { useProperties } from '@/hooks/useProperties';
import { PropertyCard } from './PropertyCard';

interface PropertyGridProps {
  filters?: Record<string, string>;
}

export function PropertyGrid({ filters = {} }: PropertyGridProps) {
  const { properties, loading, error } = useProperties(filters);

  if (loading) return <div className="loading loading-spinner loading-lg mx-auto" />;
  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((p) => (
        <PropertyCard key={p.id} property={p} />
      ))}
    </div>
  );
}

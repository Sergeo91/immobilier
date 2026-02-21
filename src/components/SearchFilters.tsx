'use client';

import { PROPERTY_TYPES } from '@/lib/constants';

interface SearchFiltersProps {
  filters: Record<string, string>;
  onChange: (filters: Record<string, string>) => void;
}

export function SearchFilters({ filters, onChange }: SearchFiltersProps) {
  const update = (key: string, value: string) => {
    const next = { ...filters };
    if (value) next[key] = value;
    else delete next[key];
    onChange(next);
  };

  return (
    <div className="card bg-base-200 p-4 space-y-4">
      <h3 className="font-bold">Filtres</h3>
      <div className="form-control">
        <label className="label">Type</label>
        <select
          className="select select-bordered"
          value={filters.type || ''}
          onChange={(e) => update('type', e.target.value)}
        >
          <option value="">Tous</option>
          {Object.entries(PROPERTY_TYPES).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>
      <div className="form-control">
        <label className="label">Prix min</label>
        <input
          type="number"
          className="input input-bordered"
          placeholder="0"
          value={filters.priceMin || ''}
          onChange={(e) => update('priceMin', e.target.value)}
        />
      </div>
      <div className="form-control">
        <label className="label">Prix max</label>
        <input
          type="number"
          className="input input-bordered"
          placeholder="∞"
          value={filters.priceMax || ''}
          onChange={(e) => update('priceMax', e.target.value)}
        />
      </div>
      <div className="form-control">
        <label className="label">Surface min (m²)</label>
        <input
          type="number"
          className="input input-bordered"
          value={filters.surfaceMin || ''}
          onChange={(e) => update('surfaceMin', e.target.value)}
        />
      </div>
      <div className="form-control">
        <label className="label flex gap-2">
          <input
            type="checkbox"
            className="toggle toggle-sm"
            checked={filters.isFurnished === 'true'}
            onChange={(e) => update('isFurnished', e.target.checked ? 'true' : '')}
          />
          Meublé
        </label>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';

export interface Property {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: string;
  status: string;
  price: string;
  surfaceArea?: string;
  isFurnished: boolean;
  address: string;
  neighborhood?: string;
  latitude?: number;
  longitude?: number;
  media?: { url: string; type: string }[];
  city?: { name: string };
  country?: { name: string };
}

export function useProperties(filters?: Record<string, string>) {
  const [data, setData] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(filters).toString();
    fetch(`/api/properties?${params}`)
      .then((res) => res.json())
      .then((d) => {
        setData(d.properties || []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [JSON.stringify(filters)]);

  return { properties: data, loading, error };
}

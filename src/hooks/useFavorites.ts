'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';

export function useFavorites() {
  const { user } = useAuth();
  const [ids, setIds] = useState<Set<string>>(new Set());

  const fetchFavorites = useCallback(async () => {
    if (!user) return;
    const res = await fetch('/api/favorites');
    if (res.ok) {
      const data = await res.json();
      setIds(new Set((data.ids || []).map((p: { propertyId: string }) => p.propertyId)));
    }
  }, [user?.id]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const toggle = useCallback(
    async (propertyId: string) => {
      if (!user) return;
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId }),
      });
      if (res.ok) await fetchFavorites();
    },
    [user, fetchFavorites]
  );

  const has = useCallback((propertyId: string) => ids.has(propertyId), [ids]);

  return { favorites: ids, toggle, has };
}

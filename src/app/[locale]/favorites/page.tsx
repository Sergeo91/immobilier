'use client';

import { useAuth } from '@/context/AuthContext';
import { useFavorites } from '@/hooks/useFavorites';
import { useProperties } from '@/hooks/useProperties';
import { PropertyCard } from '@/components/PropertyCard';
import { Link } from '@/i18n/navigation';
import { useMemo } from 'react';
import { useTranslations } from 'next-intl';

export default function FavoritesPage() {
  const { user } = useAuth();
  const { favorites } = useFavorites();
  const favIds = useMemo(() => Array.from(favorites), [favorites]);
  const { properties, loading } = useProperties({ ids: favIds.join(',') });
  const t = useTranslations('Nav');

  if (!user) {
    return (
      <div className="text-center py-12">
        <p>Connectez-vous pour voir vos favoris.</p>
        <Link href="/login" className="btn btn-primary mt-4">{t('login')}</Link>
      </div>
    );
  }

  const favProperties = useMemo(() => {
    if (!favIds.length) return [];
    return properties.filter((p) => favIds.includes(p.id));
  }, [properties, favIds]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{t('favorites')}</h1>
      {loading ? (
        <div className="loading loading-spinner loading-lg" />
      ) : favProperties.length === 0 ? (
        <div className="alert alert-info">
          Aucun favori. <Link href="/search" className="link">{t('search')}</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favProperties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}
    </div>
  );
}

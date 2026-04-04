'use client';

import { Link } from '@/i18n/navigation';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { formatPrice } from '@/lib/utils';
import { useDisplayCurrency } from '@/context/CurrencyContext';
import { PROPERTY_TYPES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { Property } from '@/hooks/useProperties';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const displayCurrency = useDisplayCurrency();
  const { has, toggle } = useFavorites();
  const isFavorite = has(property.id);
  const imageUrl = property.media?.find((m) => m.type === 'IMAGE')?.url || 'https://placehold.co/400x200?text=Bien';

  return (
    <div className="card card-compact bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
      <figure className="relative h-48">
        <img
          src={imageUrl}
          alt={property.title}
          className="object-cover w-full h-full"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://placehold.co/400x200?text=Bien';
          }}
        />
        <button
          className="btn btn-circle btn-sm absolute top-2 right-2 bg-base-100/80"
          onClick={(e) => {
            e.preventDefault();
            toggle(property.id);
          }}
        >
          <Heart className={cn('h-5 w-5', isFavorite && 'fill-red-500 text-red-500')} />
        </button>
      </figure>
      <div className="card-body">
        <div className="flex justify-between text-sm opacity-70">
          <span>{PROPERTY_TYPES[property.type as keyof typeof PROPERTY_TYPES] || property.type}</span>
          {property.surfaceArea && <span>{property.surfaceArea} m²</span>}
        </div>
        <h2 className="card-title line-clamp-1">{property.title}</h2>
        <p className="line-clamp-2 text-sm opacity-80">{property.description}</p>
        <p className="font-bold text-primary">
          {formatPrice(parseFloat(property.price), property.currency || displayCurrency)}
        </p>
        <div className="card-actions justify-end">
          <Link href={`/property/${property.slug}`} className="btn btn-primary">
            Voir
          </Link>
        </div>
      </div>
    </div>
  );
}

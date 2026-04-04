'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Link } from '@/i18n/navigation';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { formatPrice } from '@/lib/utils';
import { useDisplayCurrency } from '@/context/CurrencyContext';

interface Property {
  id: string;
  slug: string;
  title: string;
  status: string;
  price: string;
  currency?: string;
}

export default function OwnerDashboardPage() {
  const displayCurrency = useDisplayCurrency();
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations('Nav');

  useEffect(() => {
    if (!user || user.role !== 'OWNER') return;
    fetch('/api/owner/properties')
      .then((r) => r.json())
      .then((d) => setProperties(d.properties || []))
      .finally(() => setLoading(false));
  }, [user?.id]);

  if (!user) {
    return (
      <div className="text-center py-12">
        <Link href="/login" className="btn btn-primary">{t('login')}</Link>
      </div>
    );
  }

  if (user.role !== 'OWNER') {
    return (
      <div className="alert alert-warning">
        Accès réservé aux propriétaires.
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t('myProperties')}</h1>
        <Link href="/dashboard/owner/new" className="btn btn-primary gap-2">
          <Plus className="h-5 w-5" />
          Nouveau bien
        </Link>
      </div>
      {loading ? (
        <div className="loading loading-spinner loading-lg" />
      ) : properties.length === 0 ? (
        <div className="alert alert-info">
          Aucun bien. <Link href="/dashboard/owner/new" className="link">Publier un bien</Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Titre</th>
                <th>Statut</th>
                <th>Prix</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {properties.map((p) => (
                <tr key={p.id}>
                  <td>{p.title}</td>
                  <td><span className="badge">{p.status}</span></td>
                  <td>{formatPrice(parseFloat(p.price), p.currency || displayCurrency)}</td>
                  <td>
                    <Link href={`/property/${p.slug}`} className="btn btn-ghost btn-sm">Voir</Link>
                    <Link href={`/dashboard/owner/${p.id}/edit`} className="btn btn-ghost btn-sm">Modifier</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

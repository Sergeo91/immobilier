'use client';

import { useState, useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';
import { PROPERTY_TYPES } from '@/lib/constants';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export default function NewPropertyPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState<{ id: string; name: string; cities: { id: string; name: string }[] }[]>([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'APARTMENT',
    price: '',
    surfaceArea: '',
    address: '',
    neighborhood: '',
    postalCode: '',
    cityId: '',
    countryId: '',
    isFurnished: false,
    durationType: 'LONG',
  });
  const t = useTranslations('Nav');

  useEffect(() => {
    fetch('/api/countries')
      .then((r) => r.json())
      .then((d) => setCountries(d.countries || []));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/owner/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Bien créé');
        router.push('/dashboard/owner');
      } else {
        toast.error(data.error || 'Erreur');
      }
    } catch {
      toast.error('Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'OWNER') {
    return (
      <div className="text-center py-12">
        <p>Accès réservé aux propriétaires.</p>
        <Link href="/login" className="btn btn-primary mt-4">{t('login')}</Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Nouveau bien</h1>
      <form onSubmit={submit} className="space-y-4 max-w-2xl">
        <div className="form-control">
          <label className="label">Titre *</label>
          <input
            type="text"
            className="input input-bordered"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>
        <div className="form-control">
          <label className="label">Description *</label>
          <textarea
            className="textarea textarea-bordered"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
        </div>
        <div className="form-control">
          <label className="label">Type *</label>
          <select
            className="select select-bordered"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            {Object.entries(PROPERTY_TYPES).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label">Prix *</label>
            <input
              type="number"
              className="input input-bordered"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
          </div>
          <div className="form-control">
            <label className="label">Surface (m²)</label>
            <input
              type="number"
              className="input input-bordered"
              value={form.surfaceArea}
              onChange={(e) => setForm({ ...form, surfaceArea: e.target.value })}
            />
          </div>
        </div>
        <div className="form-control">
          <label className="label">Adresse *</label>
          <input
            type="text"
            className="input input-bordered"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label">Quartier</label>
            <input
              type="text"
              className="input input-bordered"
              value={form.neighborhood}
              onChange={(e) => setForm({ ...form, neighborhood: e.target.value })}
            />
          </div>
          <div className="form-control">
            <label className="label">Code postal</label>
            <input
              type="text"
              className="input input-bordered"
              value={form.postalCode}
              onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label">Pays *</label>
            <select
              className="select select-bordered"
              value={form.countryId}
              onChange={(e) => setForm({ ...form, countryId: e.target.value, cityId: '' })}
            >
              <option value="">Sélectionner</option>
              {countries.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="form-control">
            <label className="label">Ville *</label>
            <select
              className="select select-bordered"
              value={form.cityId}
              onChange={(e) => setForm({ ...form, cityId: e.target.value })}
              disabled={!form.countryId}
            >
              <option value="">Sélectionner</option>
              {(countries.find((c) => c.id === form.countryId)?.cities || []).map((city) => (
                <option key={city.id} value={city.id}>{city.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-control">
          <label className="label flex gap-2">
            <input
              type="checkbox"
              className="checkbox"
              checked={form.isFurnished}
              onChange={(e) => setForm({ ...form, isFurnished: e.target.checked })}
            />
            Meublé
          </label>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Création...' : 'Créer'}
        </button>
      </form>
    </div>
  );
}

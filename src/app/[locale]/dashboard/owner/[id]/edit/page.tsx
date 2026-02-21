'use client';

import { useState, useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';
import { PROPERTY_TYPES, PROPERTY_STATUS } from '@/lib/constants';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export default function EditPropertyPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'AVAILABLE',
    price: '',
    surfaceArea: '',
    address: '',
    neighborhood: '',
  });
  const t = useTranslations('Nav');

  useEffect(() => {
    if (!user || user.role !== 'OWNER') return;
    fetch(`/api/owner/properties/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.property) {
          setForm({
            title: d.property.title,
            description: d.property.description,
            status: d.property.status,
            price: d.property.price,
            surfaceArea: d.property.surfaceArea || '',
            address: d.property.address,
            neighborhood: d.property.neighborhood || '',
          });
        }
      })
      .finally(() => setLoading(false));
  }, [user?.id, id]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/owner/properties/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Bien mis à jour');
        router.push('/dashboard/owner');
      } else {
        toast.error(data.error || 'Erreur');
      }
    } catch {
      toast.error('Erreur réseau');
    } finally {
      setSaving(false);
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

  if (loading) return <div className="loading loading-spinner loading-lg" />;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Modifier le bien</h1>
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
          <label className="label">Statut *</label>
          <select
            className="select select-bordered"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            {Object.entries(PROPERTY_STATUS).map(([k, v]) => (
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
        <div className="form-control">
          <label className="label">Quartier</label>
          <input
            type="text"
            className="input input-bordered"
            value={form.neighborhood}
            onChange={(e) => setForm({ ...form, neighborhood: e.target.value })}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </form>
    </div>
  );
}

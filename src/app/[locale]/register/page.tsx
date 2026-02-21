'use client';

import { useState } from 'react';
import { Link, useRouter } from '@/i18n/navigation';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'CLIENT' as 'CLIENT' | 'OWNER',
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { refreshUser } = useAuth();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        await refreshUser();
        toast.success('Inscription réussie');
        router.push(form.role === 'OWNER' ? '/dashboard/owner' : '/');
      } else {
        toast.error(data.error || 'Erreur inscription');
      }
    } catch {
      toast.error('Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-2xl">Inscription</h1>
          <form onSubmit={submit} className="space-y-4">
            <div className="form-control">
              <label className="label">Prénom</label>
              <input
                type="text"
                className="input input-bordered"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                required
              />
            </div>
            <div className="form-control">
              <label className="label">Nom</label>
              <input
                type="text"
                className="input input-bordered"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                required
              />
            </div>
            <div className="form-control">
              <label className="label">Email</label>
              <input
                type="email"
                className="input input-bordered"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="form-control">
              <label className="label">Mot de passe</label>
              <input
                type="password"
                className="input input-bordered"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={8}
              />
            </div>
            <div className="form-control">
              <label className="label">Je souhaite</label>
              <select
                className="select select-bordered"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as 'CLIENT' | 'OWNER' })}
              >
                <option value="CLIENT">Rechercher un bien (Client)</option>
                <option value="OWNER">Louer/Vendre (Propriétaire)</option>
              </select>
            </div>
            <div className="card-actions">
              <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                {loading ? 'Inscription...' : 'S\'inscrire'}
              </button>
            </div>
          </form>
          <p className="text-sm text-center mt-4">
            Déjà inscrit ? <Link href="/login" className="link">Connexion</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

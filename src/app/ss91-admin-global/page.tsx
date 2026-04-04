'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DISPLAY_CURRENCIES } from '@/lib/constants';

const CURRENCY_LABELS: Record<string, string> = {
  XOF: 'F CFA (XOF)',
  EUR: 'Euro (EUR)',
  USD: 'Dollar US (USD)',
  GBP: 'Livre sterling (GBP)',
  MAD: 'Dirham marocain (MAD)',
};

// Note: En prod, vérifier côté serveur. Ici check client + API protégée
export default function SuperAdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ role: string } | null>(null);
  const [stats, setStats] = useState<Record<string, number> | null>(null);
  const [defaultCurrency, setDefaultCurrency] = useState<string>('XOF');
  const [currencySaving, setCurrencySaving] = useState(false);
  const [currencyMessage, setCurrencyMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => {
        if (d.user?.role !== 'SUPER_ADMIN') {
          router.replace('/');
          return;
        }
        setUser(d.user);
      });
  }, [router]);

  useEffect(() => {
    if (!user) return;
    fetch('/api/super-admin/stats')
      .then((r) => r.json())
      .then((d) => setStats(d.stats || {}));
  }, [user]);

  useEffect(() => {
    if (!user) return;
    fetch('/api/super-admin/settings')
      .then((r) => r.json())
      .then((d) => {
        if (d.settings?.defaultCurrency) setDefaultCurrency(d.settings.defaultCurrency);
      })
      .catch(() => {});
  }, [user]);

  const saveDefaultCurrency = () => {
    setCurrencyMessage(null);
    setCurrencySaving(true);
    fetch('/api/super-admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ defaultCurrency }),
    })
      .then(async (r) => {
        const d = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(d.error || 'Erreur');
        if (d.defaultCurrency) setDefaultCurrency(d.defaultCurrency);
        setCurrencyMessage('Devise enregistrée. Les visiteurs verront les montants dans cette devise (rafraîchir si besoin).');
      })
      .catch((e) => setCurrencyMessage(e.message || 'Échec'))
      .finally(() => setCurrencySaving(false));
  };

  if (!user) return <div className="loading loading-spinner loading-lg" />;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Super Admin — Contrôle Global</h1>
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="stat bg-base-100 rounded-box">
          <div className="stat-title">Utilisateurs</div>
          <div className="stat-value text-primary">{stats?.users ?? '-'}</div>
        </div>
        <div className="stat bg-base-100 rounded-box">
          <div className="stat-title">Biens disponibles</div>
          <div className="stat-value text-primary">{stats?.available ?? '-'}</div>
        </div>
        <div className="stat bg-base-100 rounded-box">
          <div className="stat-title">Transactions</div>
          <div className="stat-value text-primary">{stats?.transactions ?? '-'}</div>
        </div>
        <div className="stat bg-base-100 rounded-box">
          <div className="stat-title">Trials actifs</div>
          <div className="stat-value text-primary">{stats?.trials ?? '-'}</div>
        </div>
      </div>
      <div className="card bg-base-100 mb-6">
        <div className="card-body">
          <h2 className="card-title">Devise d’affichage par défaut</h2>
          <p className="text-sm opacity-80 mb-4">
            Les montants sont affichés avec le séparateur de milliers « . » (ex. 1.234.567 F CFA). La valeur par défaut est le franc CFA (XOF) ; vous pouvez la modifier pour tout le site.
          </p>
          <div className="flex flex-wrap items-end gap-4">
            <div className="form-control">
              <label className="label"><span className="label-text">Devise</span></label>
              <select
                className="select select-bordered"
                value={defaultCurrency}
                onChange={(e) => setDefaultCurrency(e.target.value)}
              >
                {DISPLAY_CURRENCIES.map((c) => (
                  <option key={c} value={c}>{CURRENCY_LABELS[c] ?? c}</option>
                ))}
              </select>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              disabled={currencySaving}
              onClick={saveDefaultCurrency}
            >
              {currencySaving ? 'Enregistrement…' : 'Enregistrer'}
            </button>
          </div>
          {currencyMessage && (
            <p className={`text-sm mt-3 ${currencyMessage.includes('Échec') || currencyMessage.includes('Erreur') ? 'text-error' : 'text-success'}`}>
              {currencyMessage}
            </p>
          )}
        </div>
      </div>

      <div className="card bg-base-100">
        <div className="card-body">
          <h2 className="card-title">Actions rapides</h2>
          <div className="flex flex-wrap gap-2">
            <a href="/api/super-admin/users" className="btn btn-outline">Gérer utilisateurs</a>
            <a href="/api/super-admin/settings" className="btn btn-outline">Paramètres (JSON)</a>
            <a href="/api/super-admin/maintenance" className="btn btn-warning">Mode maintenance</a>
            <a href="/api/super-admin/audit-logs" className="btn btn-outline">Logs audit</a>
          </div>
        </div>
      </div>
    </div>
  );
}

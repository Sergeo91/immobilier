'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { verifyAccessToken, getSessionToken } from '@/lib/auth';

// Note: En prod, vérifier côté serveur. Ici check client + API protégée
export default function SuperAdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ role: string } | null>(null);
  const [stats, setStats] = useState<Record<string, number> | null>(null);

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
      <div className="card bg-base-100">
        <div className="card-body">
          <h2 className="card-title">Actions rapides</h2>
          <div className="flex flex-wrap gap-2">
            <a href="/api/super-admin/users" className="btn btn-outline">Gérer utilisateurs</a>
            <a href="/api/super-admin/settings" className="btn btn-outline">Paramètres</a>
            <a href="/api/super-admin/maintenance" className="btn btn-warning">Mode maintenance</a>
            <a href="/api/super-admin/audit-logs" className="btn btn-outline">Logs audit</a>
          </div>
        </div>
      </div>
    </div>
  );
}

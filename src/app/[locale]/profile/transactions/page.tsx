'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Link } from '@/i18n/navigation';
import { formatPrice, formatDate } from '@/lib/utils';
import { useDisplayCurrency } from '@/context/CurrencyContext';
import { useTranslations } from 'next-intl';

interface Transaction {
  id: string;
  type: string;
  status: string;
  amount: string;
  currency?: string;
  createdAt: string;
}

export default function TransactionsPage() {
  const displayCurrency = useDisplayCurrency();
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations('Nav');

  useEffect(() => {
    if (!user) return;
    fetch('/api/profile/transactions')
      .then((r) => r.json())
      .then((d) => setTransactions(d.transactions || []))
      .finally(() => setLoading(false));
  }, [user?.id]);

  if (!user) {
    return (
      <div className="text-center py-12">
        <Link href="/login" className="btn btn-primary">{t('login')}</Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{t('transactions')}</h1>
      {loading ? (
        <div className="loading loading-spinner loading-lg" />
      ) : transactions.length === 0 ? (
        <div className="alert alert-info">Aucune transaction.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Montant</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tr) => (
                <tr key={tr.id}>
                  <td>{formatDate(tr.createdAt)}</td>
                  <td>{tr.type}</td>
                  <td>{formatPrice(parseFloat(tr.amount), tr.currency || displayCurrency)}</td>
                  <td><span className="badge">{tr.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

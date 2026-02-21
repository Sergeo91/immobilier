'use client';

import { useAuth } from '@/context/AuthContext';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export default function ProfilePage() {
  const { user } = useAuth();
  const t = useTranslations('Nav');

  if (!user) {
    return (
      <div className="text-center py-12">
        <Link href="/login" className="btn btn-primary">{t('login')}</Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{t('profile')}</h1>
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <p><strong>Nom :</strong> {user.firstName} {user.lastName}</p>
          <p><strong>Email :</strong> {user.email}</p>
          <p><strong>Rôle :</strong> {user.role}</p>
          {user.role === 'OWNER' && (
            <p><strong>KYC :</strong> {user.kycVerified ? 'Vérifié' : 'Non vérifié'}</p>
          )}
          <Link href="/profile/transactions" className="btn btn-outline mt-4">{t('transactions')}</Link>
        </div>
      </div>
    </div>
  );
}

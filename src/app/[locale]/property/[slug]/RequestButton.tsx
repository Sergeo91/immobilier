'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Link } from '@/i18n/navigation';
import { toast } from 'react-toastify';

interface RequestButtonProps {
  propertyId: string;
  propertySlug: string;
  propertyStatus: string;
}

export function RequestButton({ propertyId, propertySlug, propertyStatus }: RequestButtonProps) {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <Link href={`/login?redirect=/property/${propertySlug}`} className="btn btn-primary">
        Connexion pour faire une demande
      </Link>
    );
  }

  if (['RENTED', 'SOLD'].includes(propertyStatus)) {
    return <p className="text-warning">Ce bien n&apos;est plus disponible pour de nouvelles demandes.</p>;
  }

  const submit = async () => {
    if (!message.trim()) {
      toast.error('Veuillez entrer un message');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/client-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId, message }),
      });
      if (res.ok) {
        toast.success('Demande envoyée');
        setMessage('');
      } else {
        const err = await res.json();
        toast.error(err.error || 'Erreur');
      }
    } catch {
      toast.error('Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <textarea
        className="textarea textarea-bordered w-full"
        placeholder="Votre message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
      />
      <button type="button" className="btn btn-primary" onClick={submit} disabled={loading}>
        {loading ? 'Envoi...' : 'Envoyer la demande'}
      </button>
    </div>
  );
}

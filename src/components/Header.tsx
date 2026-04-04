'use client';

import { Link } from '@/i18n/navigation';
import { useAuth } from '@/context/AuthContext';
import { Heart, Home, LogIn, LogOut, Menu, Search } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { ThemeSwitcher } from './ThemeSwitcher';
import { LocaleSwitcher } from './LocaleSwitcher';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';

export function Header() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = useTranslations('Nav');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const qFromUrl = searchParams.get('q') || '';
  const [navQuery, setNavQuery] = useState(qFromUrl);

  useEffect(() => {
    setNavQuery(qFromUrl);
  }, [qFromUrl]);

  /** Met à jour l’URL à chaque frappe pour que `/search` recharge les biens via `q` (sans attendre Enter). */
  const syncSearchUrl = (q: string) => {
    const onSearch = pathname === '/search';

    if (onSearch) {
      const params = new URLSearchParams(searchParams.toString());
      if (q) params.set('q', q);
      else params.delete('q');
      const qs = params.toString();
      router.replace(qs ? `/search?${qs}` : '/search');
    } else if (q) {
      router.replace(`/search?${new URLSearchParams({ q }).toString()}`);
    }
  };

  const handleNavSearchChange = (value: string) => {
    setNavQuery(value);
    syncSearchUrl(value);
  };

  const submitSearch = (e?: FormEvent) => {
    e?.preventDefault();
    syncSearchUrl(navQuery);
    setMobileOpen(false);
  };

  return (
    <header className="navbar bg-base-200 shadow-lg">
      <div className="navbar-start">
        <Link href="/" className="btn btn-ghost gap-2 text-xl">
          <Home className="h-6 w-6" />
          {t('home')}
        </Link>
        <div className="dropdown md:hidden">
          <label tabIndex={0} className="btn btn-ghost" onClick={() => setMobileOpen(!mobileOpen)}>
            <Menu className="h-5 w-5" />
          </label>
          {mobileOpen && (
            <ul className="menu dropdown-content rounded-box menu-sm z-50 mt-2 w-52 bg-base-100 p-2 shadow">
              <li className="p-2">
                <form onSubmit={submitSearch} className="flex items-center gap-2">
                  <input
                    type="text"
                    className="input input-bordered input-sm w-full"
                    placeholder={t('search')}
                    value={navQuery}
                    onChange={(e) => handleNavSearchChange(e.target.value)}
                    aria-label={t('search')}
                  />
                  <Search className="h-4 w-4 opacity-70" />
                </form>
              </li>
              {user?.role === 'OWNER' && <li><Link href="/dashboard/owner">{t('dashboard')}</Link></li>}
            </ul>
          )}
        </div>
      </div>
      <div className="navbar-center hidden md:flex">
        <ul className="menu menu-horizontal gap-2">
          <li className="w-64">
            <form onSubmit={submitSearch} className="flex items-center gap-2">
              <input
                type="text"
                className="input input-bordered input-sm w-full"
                placeholder={t('search')}
                value={navQuery}
                onChange={(e) => handleNavSearchChange(e.target.value)}
                aria-label={t('search')}
              />
              <Search className="h-4 w-4 opacity-70" />
            </form>
          </li>
          {user?.role === 'OWNER' && <li><Link href="/dashboard/owner">{t('dashboard')}</Link></li>}
        </ul>
      </div>
      <div className="navbar-end gap-1">
        <LocaleSwitcher />
        <ThemeSwitcher />
        {user ? (
          <>
            <Link href="/favorites" className="btn btn-ghost btn-circle" title={t('favorites')}>
              <Heart className="h-5 w-5" />
            </Link>
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-8 rounded-full bg-primary text-primary-content flex items-center justify-center">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </div>
              </label>
              <ul className="menu dropdown-content rounded-box menu-sm z-50 mt-2 w-52 bg-base-100 p-2 shadow">
                <li><Link href="/profile">{user.firstName} {user.lastName}</Link></li>
                {user.role === 'OWNER' && <li><Link href="/dashboard/owner">{t('myProperties')}</Link></li>}
                <li><Link href="/profile/transactions">{t('transactions')}</Link></li>
                <li><button type="button" onClick={logout}><LogOut /> {t('logout')}</button></li>
              </ul>
            </div>
          </>
        ) : (
          <Link href="/login" className="btn btn-primary gap-2">
            <LogIn className="h-5 w-5" />
            {t('login')}
          </Link>
        )}
      </div>
    </header>
  );
}

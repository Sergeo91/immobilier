import { Link } from '@/i18n/navigation';
import { Home, Search, Shield, Globe } from 'lucide-react';
import { PropertyGrid } from '@/components/PropertyGrid';
import { getTranslations } from 'next-intl/server';

export default async function HomePage() {
  const t = await getTranslations('Home');
  return (
    <div>
      <section className="hero min-h-[60vh] bg-gradient-to-br from-primary/20 to-secondary/20 rounded-box">
        <div className="hero-content text-center">
          <div>
            <h1 className="text-5xl font-bold">{t('title')}</h1>
            <p className="py-6 text-lg opacity-90">{t('subtitle')}</p>
            <Link href="/search" className="btn btn-primary btn-lg gap-2">
              <Search className="h-6 w-6" />
              {t('searchButton')}
            </Link>
          </div>
        </div>
      </section>
      <section className="py-12">
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="card bg-base-100 shadow">
            <div className="card-body items-center text-center">
              <Shield className="h-12 w-12 text-primary" />
              <h3 className="card-title">{t('secure')}</h3>
              <p>{t('secureDesc')}</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow">
            <div className="card-body items-center text-center">
              <Globe className="h-12 w-12 text-primary" />
              <h3 className="card-title">{t('global')}</h3>
              <p>{t('globalDesc')}</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow">
            <div className="card-body items-center text-center">
              <Home className="h-12 w-12 text-primary" />
              <h3 className="card-title">{t('allTypes')}</h3>
              <p>{t('allTypesDesc')}</p>
            </div>
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-6">{t('recent')}</h2>
        <PropertyGrid filters={{ limit: '6' }} />
        <div className="text-center mt-8">
          <Link href="/search" className="btn btn-outline">
            {t('seeAll')}
          </Link>
        </div>
      </section>
    </div>
  );
}

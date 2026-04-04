import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { PropertyMap } from '@/components/PropertyMap';
import { formatPrice } from '@/lib/utils';
import { getDefaultDisplayCurrency } from '@/lib/global-settings';
import { PROPERTY_TYPES, PROPERTY_STATUS } from '@/lib/constants';
import { RequestButton } from './RequestButton';

interface Props {
  params: { locale: string; slug: string };
}

export default async function PropertyPage({ params }: Props) {
  const property = await prisma.property.findUnique({
    where: { slug: params.slug, status: { not: 'ARCHIVED' }, isListed: true },
    include: {
      media: true,
      city: true,
      country: true,
      owner: { select: { firstName: true, lastName: true } },
    },
  });

  if (!property) notFound();

  const displayCurrency = await getDefaultDisplayCurrency();
  const priceCurrency = property.currency || displayCurrency;

  const lat = property.latitude ? Number(property.latitude) : null;
  const lng = property.longitude ? Number(property.longitude) : null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title,
    description: property.description,
    url: `${process.env.NEXT_PUBLIC_APP_URL}/property/${property.slug}`,
    ...(lat &&
      lng && {
        geo: {
          '@type': 'GeoCoordinates',
          latitude: lat,
          longitude: lng,
        },
      }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto">
        <div className="grid gap-6">
          <div>
            {property.media.filter((m) => m.type === 'IMAGE').length > 0 ? (
              <img
                src={property.media.find((m) => m.type === 'IMAGE')?.url || 'https://placehold.co/800x400?text=Bien'}
                alt={property.title}
                className="w-full h-96 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-96 bg-base-300 rounded-lg flex items-center justify-center">
                Image non disponible
              </div>
            )}
          </div>
          <div>
            <span className="badge badge-primary">{PROPERTY_TYPES[property.type] || property.type}</span>
            <span className="badge badge-ghost ml-2">{PROPERTY_STATUS[property.status] || property.status}</span>
            <h1 className="text-4xl font-bold mt-2">{property.title}</h1>
            <p className="text-2xl text-primary font-bold mt-2">
              {formatPrice(Number(property.price), priceCurrency)}
              {property.pricePerUnit && <span className="text-lg font-normal"> / {property.pricePerUnit}</span>}
            </p>
          </div>
          <div className="prose">
            <h2>Description</h2>
            <p className="whitespace-pre-wrap">{property.description}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {property.surfaceArea && (
              <div className="stat bg-base-100 rounded-box">
                <div className="stat-title">Surface</div>
                <div className="stat-value text-primary">{Number(property.surfaceArea)} m²</div>
              </div>
            )}
            <div className="stat bg-base-100 rounded-box">
              <div className="stat-title">Localisation</div>
              <div className="stat-desc">{property.city?.name}, {property.country?.name}</div>
            </div>
            {property.neighborhood && (
              <div className="stat bg-base-100 rounded-box">
                <div className="stat-title">Quartier</div>
                <div className="stat-desc">{property.neighborhood}</div>
              </div>
            )}
            <div className="stat bg-base-100 rounded-box">
              <div className="stat-title">Meublé</div>
              <div className="stat-desc">{property.isFurnished ? 'Oui' : 'Non'}</div>
            </div>
          </div>
          {lat && lng && (
            <div>
              <h2 className="text-xl font-bold mb-2">Carte</h2>
              <PropertyMap latitude={lat} longitude={lng} />
            </div>
          )}
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <h2 className="card-title">Intéressé ?</h2>
              <p>Contactez via la plateforme (identité propriétaire masquée jusqu&apos;à validation)</p>
              <RequestButton propertyId={property.id} propertySlug={property.slug} propertyStatus={property.status} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

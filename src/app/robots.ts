import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'https://achat-location.com';

  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/', '/ss91-admin-global', '/dashboard/'] },
      { userAgent: 'Googlebot', allow: '/', disallow: ['/api/', '/ss91-admin-global', '/dashboard/'] },
      { userAgent: 'Bingbot', allow: '/', disallow: ['/api/', '/ss91-admin-global', '/dashboard/'] },
      { userAgent: 'Yandex', allow: '/', disallow: ['/api/', '/ss91-admin-global', '/dashboard/'] },
      { userAgent: 'Baiduspider', allow: '/', disallow: ['/api/', '/ss91-admin-global', '/dashboard/'] },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}

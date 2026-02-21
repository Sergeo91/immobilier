/**
 * ElasticSearch - Recherche, autocomplete, géospatial (mock si pas configuré)
 */
const ELASTIC_URL = process.env.ELASTICSEARCH_URL;

let client: { index: (args: any) => Promise<any>; search: (args: any) => Promise<any> } | null = null;

async function getClient() {
  if (!ELASTIC_URL) return null;
  if (client) return client;
  const { Client } = await import('@elastic/elasticsearch');
  client = new Client({ node: ELASTIC_URL });
  return client;
}

export async function indexProperty(property: {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  price: number;
  surfaceArea?: number;
  countryId: string;
  cityId: string;
  neighborhood?: string;
  latitude?: number;
  longitude?: number;
  isFurnished: boolean;
}) {
  const es = await getClient();
  if (!es) return;
  await es.index({
    index: 'properties',
    id: property.id,
    document: { ...property, createdAt: new Date().toISOString() },
  });
}

export async function searchProperties(query: string, filters?: Record<string, unknown>) {
  const es = await getClient();
  if (!es) return { hits: [] };
  const res = await es.search({
    index: 'properties',
    body: {
      query: {
        bool: {
          must: [
            query ? { multi_match: { query, fields: ['title^2', 'description'] } } : { match_all: {} },
          ].filter(Boolean),
          filter: filters ? Object.entries(filters).map(([k, v]) => ({ term: { [k]: v } })) : [],
        },
      },
      size: 20,
    },
  });
  return res.body.hits;
}

/**
 * BullMQ Worker - Jobs asynchrones
 * Lancer avec: npm run worker
 */
import { Worker } from 'bullmq';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const url = new URL(redisUrl);
const connection = {
  host: url.hostname,
  port: parseInt(url.port) || 6379,
  password: url.password || undefined,
};

async function main() {
  try {
  const worker = new Worker(
    'default',
    async (job) => {
      console.log('[Worker] Job:', job.name, job.data);
      switch (job.name) {
        case 'indexProperty':
          // Indexer dans ElasticSearch
          break;
        case 'sendEmail':
          // Envoyer email
          break;
        case 'suspendExpiredSubscriptions':
          // Suspendre biens si abo expiré
          break;
        default:
          console.log('Job inconnu:', job.name);
      }
    },
    { connection }
  );

  worker.on('completed', (job) => console.log('[Worker] Complété:', job.id));
  worker.on('failed', (job, err) => console.error('[Worker] Échec:', job?.id, err));
  console.log('[Worker] En attente de jobs...');
  } catch (err) {
    console.warn('Redis/BullMQ non disponible:', err);
    process.exit(0);
  }
}

main();

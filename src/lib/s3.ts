/**
 * S3-compatible storage - upload fichiers (mock si pas configuré)
 */
const S3_ENDPOINT = process.env.S3_ENDPOINT;
const S3_BUCKET = process.env.S3_BUCKET || 'achat-location-uploads';
const S3_ACCESS = process.env.S3_ACCESS_KEY;
const S3_SECRET = process.env.S3_SECRET_KEY;

export async function uploadFile(
  buffer: Buffer,
  key: string,
  contentType: string
): Promise<string> {
  if (!S3_ACCESS || !S3_SECRET) {
    return `https://mock-s3.example.com/${S3_BUCKET}/${key}`;
  }
  const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3');
  const client = new S3Client({
    endpoint: S3_ENDPOINT,
    region: process.env.S3_REGION || 'eu-west-1',
    credentials: { accessKeyId: S3_ACCESS, secretAccessKey: S3_SECRET },
  });
  await client.send(
    new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );
  return `https://${S3_BUCKET}.s3.amazonaws.com/${key}`;
}

export function getUploadKey(prefix: string, filename: string): string {
  const ext = filename.split('.').pop() || 'bin';
  return `${prefix}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
}

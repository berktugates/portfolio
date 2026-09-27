import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

function r2Client(): S3Client | null {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  if (!accountId || !accessKeyId || !secretAccessKey) return null;
  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
}

function bucketName(): string {
  return process.env.R2_BUCKET_NAME ?? "portfolio-content";
}

export async function getR2Json<T>(key: string): Promise<T | null> {
  const client = r2Client();
  if (!client) return null;
  try {
    const out = await client.send(new GetObjectCommand({ Bucket: bucketName(), Key: key }));
    const body = await out.Body?.transformToString("utf8");
    if (!body) return null;
    return JSON.parse(body) as T;
  } catch {
    return null;
  }
}

export async function putR2Json(key: string, body: unknown): Promise<boolean> {
  const client = r2Client();
  if (!client) return false;
  await client.send(
    new PutObjectCommand({
      Bucket: bucketName(),
      Key: key,
      Body: JSON.stringify(body),
      ContentType: "application/json",
    }),
  );
  return true;
}

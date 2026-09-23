import fs from "node:fs/promises";
import { createReadStream, createWriteStream } from "node:fs";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import type { ReadableStream as WebReadableStream } from "node:stream/web";
import { env } from "./env.js";

/**
 * Case-document storage.
 *
 * Local disk in development; Supabase Storage in production. Render's
 * filesystem is ephemeral, so uploads kept on local disk there would
 * vanish on every deploy or restart. The switch is automatic: when
 * SUPABASE_URL + SUPABASE_SERVICE_KEY are set, Supabase is used.
 */
const useSupabase = Boolean(env.SUPABASE_URL && env.SUPABASE_SERVICE_KEY);

function sbHeaders(mimeType?: string): Record<string, string> {
  const key = env.SUPABASE_SERVICE_KEY as string;
  const headers: Record<string, string> = {
    apikey: key,
    Authorization: `Bearer ${key}`,
  };
  if (mimeType) headers["Content-Type"] = mimeType;
  return headers;
}

function sbObjectUrl(key: string): string {
  return `${env.SUPABASE_URL}/storage/v1/object/${env.SUPABASE_BUCKET}/${encodeURIComponent(key)}`;
}

function localPath(key: string): string {
  return path.join(path.resolve(env.UPLOAD_DIR, "booking-docs"), path.basename(key));
}

/** Persist an upload stream under `key`; resolves with bytes stored. */
export async function storeDocument(key: string, stream: Readable, mimeType: string): Promise<number> {
  if (!useSupabase) {
    const dest = localPath(key);
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await pipeline(stream, createWriteStream(dest));
    return (await fs.stat(dest)).size;
  }
  // Files are capped at MAX_UPLOAD_MB by the multipart plugin, so
  // buffering one upload in memory is bounded and safe.
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk as Uint8Array));
  const body = Buffer.concat(chunks);
  const res = await fetch(sbObjectUrl(key), {
    method: "POST",
    headers: { ...sbHeaders(mimeType), "x-upsert": "true" },
    body,
  });
  if (!res.ok) throw new Error(`Supabase storage upload failed (HTTP ${res.status})`);
  return body.length;
}

/** Remove a stored object. Best effort — never throws. */
export async function deleteDocument(key: string): Promise<void> {
  try {
    if (!useSupabase) {
      await fs.rm(localPath(key), { force: true });
      return;
    }
    await fetch(sbObjectUrl(key), { method: "DELETE", headers: sbHeaders() });
  } catch {
    /* best effort cleanup */
  }
}

/** Open a stored object for download, or null when it is missing. */
export async function openDocument(key: string): Promise<Readable | null> {
  if (!useSupabase) {
    try {
      await fs.access(localPath(key));
    } catch {
      return null;
    }
    return createReadStream(localPath(key));
  }
  const res = await fetch(sbObjectUrl(key), { headers: sbHeaders() });
  if (!res.ok || !res.body) return null;
  return Readable.fromWeb(res.body as WebReadableStream);
}

export const storageBackend = useSupabase ? "supabase" : "local-disk";

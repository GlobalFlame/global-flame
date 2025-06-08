import { supabase } from '@/lib/supabase';
import { alertAdmin } from '@/lib/alerts';

/** Allowed MIME types by category */
const VALID_TYPES: Record<string, string[]> = {
  book:    ['application/pdf'],
  guide:   ['application/pdf'],
  music:   ['audio/mpeg', 'audio/wav'],
  video:   ['video/mp4',  'video/webm'],
  general: ['application/pdf', 'audio/*', 'video/*', 'image/*'],
};

/**
 * Upload a browser File OR server-side Buffer to Supabase Storage.
 * Throws meaningful errors the UI can translate.
 */
export async function uploadFile(
  file: File | Buffer,
  category: string,
  fileName = file instanceof File ? file.name : 'upload',
): Promise<string> {
  // —— offline handling on the client ———————————————
  if (typeof window !== 'undefined' && !navigator.onLine) {
    localStorage.setItem(
      'pendingUpload',
      JSON.stringify({ file: fileName, ts: Date.now() }),
    );
    throw new Error('offline_upload_queued');
  }

  // —— validate MIME type ————————————————————————————
  const mime = file instanceof File ? file.type : guessMime(fileName);
  const allow = VALID_TYPES[category] ?? VALID_TYPES.general;
  const ok    = allow.some(t => t === mime || (t.includes('*') && mime.startsWith(t.split('*')[0])));
  if (!ok) throw new Error(`invalid_file_type_${category}`);

  // —— upload ——————————————————————————————————————
  const guid  = crypto.randomUUID();
  const ext   = fileName.split('.').pop() || 'bin';
  const path  = `flames/${category}/${guid}.${ext}`;

  const { data, error } =
    await supabase.storage.from('flames').upload(path, file);

  if (error) {
    alertAdmin(`Upload failed: ${error.message}`, 'critical');
    throw new Error('upload_failed');
  }
  return data.path;                     // relative path in the bucket
}

/* fallback when running on the server */
function guessMime(name: string): string {
  const ext = name.toLowerCase().split('.').pop()!;
  const m: Record<string, string> = {
    pdf:  'application/pdf',
    mp3:  'audio/mpeg',
    wav:  'audio/wav',
    mp4:  'video/mp4',
    webm: 'video/webm',
    jpg:  'image/jpeg',
    jpeg: 'image/jpeg',
    png:  'image/png',
  };
  return m[ext] ?? 'application/octet-stream';
}

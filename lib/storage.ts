import { supabase } from '@/lib/supabase';
import { alertAdmin } from '@/lib/alerts';

const VALID_TYPES: Record<string, string[]> = {
  book:   ['application/pdf'],
  guide:  ['application/pdf'],
  music:  ['audio/mpeg', 'audio/wav'],
  video:  ['video/mp4', 'video/webm'],
  general:['application/pdf','audio/*','video/*','image/*'],
};

export async function uploadFile(file: File, category = 'general'): Promise<string> {
  const valid = VALID_TYPES[category] ?? VALID_TYPES.general;
  if (!valid.some(t => t === file.type || (t.endsWith('*') && file.type.startsWith(t.split('*')[0])))) {
    throw new Error('invalid_file_type_' + category);
  }

  const path = \\/\-\\;
  const { error } = await supabase.storage.from('flames').upload(path, file);
  if (error) {
    alertAdmin('Upload failed: ' + error.message, 'critical');
    throw new Error('upload_failed');
  }
  return path;
}

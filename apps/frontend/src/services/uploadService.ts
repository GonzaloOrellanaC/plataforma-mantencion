import { API_URL } from '../config';

export interface UploadResult {
  url: string;
  path: string;
}

export async function uploadPhoto(file: File, companyId: string, token?: string): Promise<UploadResult> {
  const fd = new FormData();
  fd.append('file', file);

  const headers: Record<string,string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}/uploads/photos?companyId=${encodeURIComponent(companyId)}`, {
    method: 'POST',
    headers,
    body: fd,
  });

  if (!res.ok) throw new Error(`Upload failed: ${res.status} ${res.statusText}`);
  return res.json();
}

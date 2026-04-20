/* ═══════════════════════════════════════════════════════════════════════════
 * Client-side wrappers for the Vault admin API.
 *
 * Every UI component imports from here rather than calling `adminFetch`
 * directly — keeps auth / retry / JSON quirks in one place.
 * ═══════════════════════════════════════════════════════════════════════════ */

import { adminFetch } from '@/lib/adminFetch';
import type { VaultDocument, VaultDocumentDetail, DocumentStatus, DocumentKind } from './types';

const BASE = '/api/admin/vault/documents';

async function asJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export interface ListFilters {
  status?:   DocumentStatus | 'all';
  kind?:     DocumentKind   | 'all';
  category?: string         | 'all';
  search?:   string;
  limit?:    number;
}

export async function listDocuments(filters: ListFilters = {}): Promise<VaultDocument[]> {
  const qs = new URLSearchParams();
  if (filters.status   && filters.status   !== 'all') qs.set('status',   filters.status);
  if (filters.kind     && filters.kind     !== 'all') qs.set('kind',     filters.kind);
  if (filters.category && filters.category !== 'all') qs.set('category', filters.category);
  if (filters.search)                                 qs.set('search',   filters.search);
  if (filters.limit)                                  qs.set('limit',    String(filters.limit));

  const res = await adminFetch(`${BASE}?${qs.toString()}`);
  const { documents } = await asJson<{ documents: VaultDocument[] }>(res);
  return documents;
}

export async function getDocument(id: string): Promise<VaultDocumentDetail> {
  const res = await adminFetch(`${BASE}/${id}`);
  const { document } = await asJson<{ document: VaultDocumentDetail }>(res);
  return document;
}

export interface PasteInput {
  kind:     'paste';
  title:    string;
  content:  string;
  source?:  string;
  category: string;
  tags:     string[];
}

export interface UrlInput {
  kind:     'url';
  url:      string;
  title?:   string;
  category: string;
  tags:     string[];
}

/** Non-file variants: paste or URL. */
export async function createDocument(input: PasteInput | UrlInput): Promise<VaultDocument> {
  const res = await adminFetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const { document } = await asJson<{ document: VaultDocument }>(res);
  return document;
}

export interface FileUploadInput {
  file:     File;
  title?:   string;
  category: string;
  tags?:    string[];
}

/** Multipart variant: PDF / DOCX / TXT file. */
export async function uploadFile(input: FileUploadInput): Promise<VaultDocument> {
  const fd = new FormData();
  fd.append('file', input.file);
  if (input.title)    fd.append('title', input.title);
  fd.append('category', input.category);
  if (input.tags?.length) fd.append('tags', input.tags.join(','));

  const res = await adminFetch(BASE, { method: 'POST', body: fd });
  const { document } = await asJson<{ document: VaultDocument }>(res);
  return document;
}

export async function patchDocument(
  id: string,
  patch: { title?: string; category?: string; tags?: string[] },
): Promise<VaultDocument> {
  const res = await adminFetch(`${BASE}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  });
  const { document } = await asJson<{ document: VaultDocument }>(res);
  return document;
}

export async function deleteDocument(id: string): Promise<void> {
  const res = await adminFetch(`${BASE}/${id}`, { method: 'DELETE' });
  await asJson<{ ok: boolean }>(res);
}

export async function reindexDocument(id: string): Promise<VaultDocument> {
  const res = await adminFetch(`${BASE}/${id}/reindex`, { method: 'POST' });
  const { document } = await asJson<{ document: VaultDocument }>(res);
  return document;
}

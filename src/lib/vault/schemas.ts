/* ═══════════════════════════════════════════════════════════════════════════
 * Vault RAG — Zod schemas.
 *
 * Two boundaries enforce validation:
 *   1. API routes (here) — reject malformed clients before any work happens.
 *   2. DB CHECK constraints (migration) — defence in depth.
 * ═══════════════════════════════════════════════════════════════════════════ */

import { z } from 'zod';

const nonEmpty    = z.string().trim().min(1);
const titleSchema = nonEmpty.max(500);
const categorySchema = nonEmpty.max(100).default('general');
const tagsSchema  = z.array(z.string().trim().min(1).max(50)).max(20).default([]);

/** POST /api/admin/vault/documents — paste variant. */
export const PasteDocumentSchema = z.object({
  kind:     z.literal('paste'),
  title:    titleSchema,
  content:  nonEmpty.max(500_000),   // ~125k tokens, hard ceiling before chunking
  source:   z.string().trim().max(500).optional(),
  category: categorySchema,
  tags:     tagsSchema,
});

/** POST /api/admin/vault/documents — url variant (crawled via Firecrawl). */
export const UrlDocumentSchema = z.object({
  kind:     z.literal('url'),
  url:      z.string().url().max(2000),
  title:    titleSchema.optional(),   // auto-filled from the crawl if omitted
  category: categorySchema,
  tags:     tagsSchema,
});

export const CreateDocumentSchema = z.discriminatedUnion('kind', [
  PasteDocumentSchema,
  UrlDocumentSchema,
]);

/** Multipart form fields that accompany a file upload. */
export const FileUploadMetaSchema = z.object({
  title:    titleSchema.optional(),
  category: categorySchema,
  tags:     z.string().optional(),     // comma-separated in the form
});

/** PATCH /api/admin/vault/documents/[id] */
export const PatchDocumentSchema = z.object({
  title:    titleSchema.optional(),
  category: nonEmpty.max(100).optional(),
  tags:     tagsSchema.optional(),
}).strict();

/** Hard limits applied at the route layer. */
export const UPLOAD_LIMITS = {
  MAX_FILE_BYTES:      25 * 1024 * 1024,  // 25 MB
  MAX_FILES_PER_REQ:   10,
  ALLOWED_MIME: new Set([
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'text/markdown',
  ]),
} as const;

export const MIME_TO_KIND: Record<string, 'pdf' | 'docx' | 'txt'> = {
  'application/pdf': 'pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'text/plain':     'txt',
  'text/markdown':  'txt',
};

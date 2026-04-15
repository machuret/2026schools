import { z } from 'zod';
import { NextResponse } from 'next/server';

// ─── Reusable primitives ──────────────────────────────────────────────────────

const optStr = z.string().optional();
const optNullStr = z.string().nullable().optional();
const optBool = z.boolean().optional();
const optNum = z.number().optional();

// ─── Blog ─────────────────────────────────────────────────────────────────────

export const BlogPatchSchema = z.object({
  title:         optStr,
  slug:          optStr,
  excerpt:       optNullStr,
  content:       optNullStr,
  feature_image: optNullStr,
  author:        optNullStr,
  published:     optBool,
  published_at:  optNullStr,
  meta_title:    optNullStr,
  meta_desc:     optNullStr,
  og_image:      optNullStr,
});

// ─── Events ───────────────────────────────────────────────────────────────────

const SpeakerSchema = z.object({
  name:       z.string(),
  title:      z.string().optional(),
  bio:        z.string().optional(),
  photo:      z.string().optional(),
  sort_order: z.number().optional(),
}).passthrough();

export const EventPutSchema = z.object({
  slug:              z.string().min(1),
  title:             z.string().min(1),
  tagline:           optStr,
  description:       optStr,
  body:              optStr,
  event_date:        optNullStr,
  event_time:        optStr,
  event_end:         optStr,
  format:            z.enum(['webinar','in-person','hybrid','workshop','conference']).optional(),
  location:          optStr,
  feature_image:     optStr,
  is_free:           optBool,
  price:             optStr,
  register_url:      optStr,
  recording_url:     optStr,
  hubspot_form_id:   optStr,
  hubspot_portal_id: optStr,
  status:            z.enum(['draft','upcoming','live','past','cancelled']).optional(),
  published:         optBool,
  seo_title:         optStr,
  seo_desc:          optStr,
  speakers:          z.array(SpeakerSchema).optional(),
});

// ─── Ambassadors ──────────────────────────────────────────────────────────────

export const AmbassadorPatchSchema = z.object({
  name:        optStr,
  title:       optNullStr,
  bio:         optNullStr,
  photoUrl:    optNullStr,
  slug:        optStr,
  sortOrder:   optNum,
  active:      optBool,
  linkedinUrl: optNullStr,
  websiteUrl:  optNullStr,
  categoryId:  optNullStr,
  comment:     optNullStr,
  event_link:  optNullStr,
});

export const AmbassadorCategoryPatchSchema = z.object({
  name:        optStr,
  slug:        optStr,
  description: optStr,
  color:       optStr,
  icon:        optStr,
  sort_order:  optNum,
});

export const AmbassadorCategoryPostSchema = z.object({
  name:        z.string().min(1),
  slug:        z.string().min(1),
  description: z.string().optional().default(''),
  color:       z.string().optional().default('#7c3aed'),
  icon:        z.string().optional().default('diversity_3'),
  sort_order:  z.number().optional().default(0),
});

// ─── CMS Pages ────────────────────────────────────────────────────────────────

export const CmsPagePatchSchema = z.object({
  title:            optStr,
  slug:             optStr,
  meta_description: optNullStr,
  content:          optNullStr,
  published:        optBool,
  og_image:         optNullStr,
});

// ─── FAQ ──────────────────────────────────────────────────────────────────────

export const FaqPatchSchema = z.object({
  question:  optStr,
  answer:    optStr,
  category:  optNullStr,
  sortOrder: optNum,
  active:    optBool,
});

// ─── Partners ─────────────────────────────────────────────────────────────────

export const PartnerPatchSchema = z.object({
  name:        optStr,
  description: optNullStr,
  logoUrl:     optNullStr,
  url:         optNullStr,
  slug:        optStr,
  sortOrder:   optNum,
  active:      optBool,
});

export const PartnerPostSchema = z.object({
  name:        z.string().min(1),
  slug:        z.string().min(1),
  description: z.string().nullable().optional(),
  logoUrl:     z.string().nullable().optional(),
  url:         z.string().nullable().optional(),
  sortOrder:   z.number().optional().default(0),
  active:      z.boolean().optional().default(true),
});

// ─── Resources ────────────────────────────────────────────────────────────────

export const ResourcePatchSchema = z.object({
  name:         optStr,
  description:  optNullStr,
  content:      optNullStr,
  thumbnailUrl: optNullStr,
  url:          optNullStr,
  slug:         optStr,
  category:     optNullStr,
  sortOrder:    optNum,
  active:       optBool,
});

export const ResourcePostSchema = z.object({
  name:         z.string().min(1),
  slug:         z.string().min(1),
  description:  z.string().nullable().optional(),
  content:      z.string().nullable().optional(),
  thumbnailUrl: z.string().nullable().optional(),
  url:          z.string().nullable().optional(),
  category:     z.string().nullable().optional(),
  sortOrder:    z.number().optional().default(0),
  active:       z.boolean().optional().default(true),
});

// ─── Submissions ──────────────────────────────────────────────────────────────

export const SubmissionPatchSchema = z.object({
  status:      z.enum(['pending', 'approved', 'rejected', 'reviewed']).optional(),
  notes:       optNullStr,
  reviewed_at: optNullStr,
  reviewed_by: optNullStr,
});

// ─── Home Page — Hero ─────────────────────────────────────────────────────────

export const HeroPatchSchema = z.object({
  headline:            optStr,
  subheadline:         optNullStr,
  cta_text:            optNullStr,
  cta_url:             optNullStr,
  secondary_cta_text:  optNullStr,
  secondary_cta_url:   optNullStr,
  image_url:           optNullStr,
  video_url:           optNullStr,
  background_color:    optNullStr,
});

// ─── Home Page — CTA ─────────────────────────────────────────────────────────

export const CtaPatchSchema = z.object({
  headline:          optStr,
  subtext:           optNullStr,
  primary_cta_text:  optNullStr,
  primary_cta_url:   optNullStr,
  secondary_cta_text: optNullStr,
  secondary_cta_url:  optNullStr,
  background_color:  optNullStr,
  text_color:        optNullStr,
});

// ─── Home Page — Footer ───────────────────────────────────────────────────────

export const FooterPatchSchema = z.object({
  copyright_text:        optStr,
  tagline:               optNullStr,
  show_social_links:     optBool,
  show_newsletter:       optBool,
  newsletter_title:      optNullStr,
  newsletter_placeholder: optNullStr,
});

// ─── Home Page — Logos ────────────────────────────────────────────────────────

export const LogoPostSchema = z.object({
  name:          z.string().min(1),
  logo_url:      z.string().min(1),
  website_url:   z.string().nullable().optional(),
  alt_text:      z.string().nullable().optional(),
  display_order: z.number().optional().default(0),
  is_active:     z.boolean().optional().default(true),
});

export const LogoPatchSchema = z.object({
  name:          optStr,
  logo_url:      optStr,
  website_url:   optNullStr,
  alt_text:      optNullStr,
  display_order: optNum,
  is_active:     optBool,
});

// ─── Homepage Blocks ─────────────────────────────────────────────────────────

export const HomepageBlockPatchSchema = z.object({
  title:         optStr,
  content:       z.record(z.string(), z.unknown()).optional(),
  display_order: optNum,
  is_visible:    optBool,
});

// ─── Register Page ───────────────────────────────────────────────────────────

export const RegisterPagePatchSchema = z.object({
  heading:               optStr,
  subheading:            optNullStr,
  description:           optNullStr,
  right_column_content:  optNullStr,
  hubspot_form_id:       optNullStr,
  hubspot_portal_id:     optNullStr,
  seo_title:             optNullStr,
  seo_description:       optNullStr,
  background_color:      optNullStr,
});

// ─── Users ───────────────────────────────────────────────────────────────────

export const UserPatchSchema = z.union([
  z.object({ send_reset: z.literal(true), email: z.string().email() }),
  z.object({
    email:    z.string().email().optional(),
    password: z.string().min(8).optional(),
  }),
]);

// ─── Settings (site_settings) ────────────────────────────────────────────────

export const SettingsPatchSchema = z.record(z.string(), z.string());

// ─── Helper: parse or return 400 ─────────────────────────────────────────────

export function parseBody<T>(
  schema: z.ZodType<T>,
  body: unknown
): { ok: true; data: T } | { ok: false; response: NextResponse } {
  const result = schema.safeParse(body);
  if (!result.success) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Validation failed', issues: result.error.issues.map(i => ({ path: i.path, message: i.message })) },
        { status: 400 }
      ),
    };
  }
  return { ok: true, data: result.data };
}

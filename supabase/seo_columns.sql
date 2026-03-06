-- ── SEO columns for all content types ─────────────────────────
-- Safe to re-run

alter table issues
  add column if not exists seo_title text not null default '',
  add column if not exists seo_desc  text not null default '',
  add column if not exists og_image  text not null default '';

alter table states
  add column if not exists seo_title text not null default '',
  add column if not exists seo_desc  text not null default '',
  add column if not exists og_image  text not null default '';

alter table areas
  add column if not exists seo_title text not null default '',
  add column if not exists seo_desc  text not null default '',
  add column if not exists og_image  text not null default '';

-- pages table already has meta_title / meta_desc — add og_image
alter table pages
  add column if not exists og_image text not null default '';

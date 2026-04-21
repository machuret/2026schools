/* ═══════════════════════════════════════════════════════════════════════════
 * Edge Function: content-creator-generate — Stage 2
 *
 * Promotes an approved_idea row to a full draft. The pipeline is:
 *
 *   1. OpenAI   writes the first draft grounded in vault context.
 *   2. Anthropic improves the draft without introducing new claims.
 *   3. Persist as status='draft' with provenance + drift warnings.
 *
 * Two safety nets:
 *   - On any throw, we reset the row to 'approved_idea' and stash the
 *     error in ai_metadata.last_error so the admin can retry.
 *   - If Anthropic returns un-parseable JSON we fall back to the OpenAI
 *     draft verbatim rather than fail the stage (improvement is a
 *     nice-to-have, the OpenAI draft is already grounded).
 *
 * POST body: { draft_id: string }
 * Response:  { draft: ContentDraft }
 *
 * ENV: SUPABASE_URL · SUPABASE_SERVICE_ROLE_KEY · OPENAI_API_KEY · ANTHROPIC_API_KEY
 * ═══════════════════════════════════════════════════════════════════════════ */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  fetchVaultContext, formatVaultContext, type VaultEntry,
} from "../_shared/content-creator/vault.ts";
import {
  buildGeneratePrompt, buildImprovePrompt,
} from "../_shared/content-creator/prompts.ts";
import { callOpenAI } from "../_shared/content-creator/openai.ts";
import { callAnthropic } from "../_shared/content-creator/anthropic.ts";
import { resolveStylePrompt } from "../_shared/content-creator/styles.ts";
import { formatCitations } from "../_shared/content-creator/citations.ts";
import {
  corsHeaders, json, readCtx, requireAuth,
  safeParseJson, dedupUuids, type Ctx,
} from "../_shared/content-creator/common.ts";

/* Hard character budgets per social platform — mirrors the values in
 * prompts.ts' PLATFORM table. Duplicated here rather than exported because
 * keeping the table local to prompts.ts keeps the prompt concerns isolated,
 * and this is a five-line map that almost never changes. */
const SOCIAL_MAX_CHARS: Record<string, number> = {
  twitter:   280,
  linkedin:  3000,
  facebook:  2000,
  instagram: 2200,
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const authFail = requireAuth(req);
  if (authFail) return authFail;

  const ctxOrErr = readCtx({ requireOpenAI: true, requireAnthropic: true });
  if (ctxOrErr instanceof Response) return ctxOrErr;
  const ctx = ctxOrErr;

  try {
    const body = await req.json() as Record<string, unknown>;
    const result = await handleGenerate(body, ctx);
    return json(result);
  } catch (err) {
    console.error("[content-creator-generate]", err);
    return json({ error: err instanceof Error ? err.message : String(err) }, 500);
  }
});

async function handleGenerate(body: Record<string, unknown>, ctx: Ctx) {
  const draft_id = body.draft_id as string;
  if (!draft_id) throw new Error("draft_id is required.");

  const sb = createClient(ctx.sbUrl, ctx.sbKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // `regeneration: true` comes from the Request-improvement flow. When
  // present, we accept a broader set of source statuses (draft, verified,
  // rejected) — the Next.js route already enforced the transition rule,
  // we just need to not reject those here. On failure below, we reset to
  // the *original* status instead of 'approved_idea'.
  const isRegeneration = body.regeneration === true;

  // 1. Load.
  const { data: draft, error: loadErr } = await sb
    .from("content_drafts").select("*").eq("id", draft_id).single();
  if (loadErr || !draft) throw new Error(`load draft failed: ${loadErr?.message ?? "not found"}`);

  const validFromStatuses = isRegeneration
    ? ["approved_idea", "draft", "verified", "rejected"]
    : ["approved_idea"];
  if (!validFromStatuses.includes(draft.status)) {
    throw new Error(
      `draft must be in status ${validFromStatuses.map((s) => `'${s}'`).join(" or ")} (got '${draft.status}')`,
    );
  }
  const originalStatus = draft.status;

  // 2. Flip to 'generating' so the UI can show a spinner.
  await sb.from("content_drafts").update({ status: "generating" }).eq("id", draft_id);

  // 3-5. AI chain with try/catch that resets on failure.
  let openaiRes: Awaited<ReturnType<typeof callOpenAI>>;
  let anthroRes: Awaited<ReturnType<typeof callAnthropic>>;
  let openaiDraft: { title: string | null; body: string; vault_ids_used?: string[] };
  let improved:    { title: string | null; body: string; drift_warnings?: string[] };
  let vault: VaultEntry[];
  let vaultBlock: string;

  try {
    // Fetch vault + style concurrently — both are independent DB reads.
    const [vaultRes, style] = await Promise.all([
      fetchVaultContext(ctx.sbUrl, ctx.sbKey, {
        keywords:       draft.brief.keywords,
        vault_category: draft.brief.vault_category,
        topic:          draft.brief.topic,
      }),
      resolveStylePrompt(ctx.sbUrl, ctx.sbKey, draft.brief?.style_id),
    ]);
    vault      = vaultRes;
    vaultBlock = formatVaultContext(vault);

    // Stash the resolved style on the draft's ai_metadata for audit. We do
    // this on the "generate" pass (not ideas) because that's when a human
    // committed to the voice — ideas may have been generated style-less.
    if (style) {
      await sb.from("content_drafts").update({
        ai_metadata: {
          ...(draft.ai_metadata ?? {}),
          style_id:    style.id,
          style_title: style.title,
        },
      }).eq("id", draft_id);
    }

    // OpenAI draft. If the admin asked for an improvement, inject their
    // feedback + (when we have one) the previous draft body so the model
    // knows exactly what to fix. The prompts module reads both fields
    // out of `brief` / options and appends them to the user prompt.
    const gen = buildGeneratePrompt({
      content_type: draft.content_type,
      platform:     draft.platform ?? undefined,
      idea:         { title: draft.title ?? "(untitled idea)", summary: draft.body },
      brief:        draft.brief,
      vault_block:  vaultBlock,
      style_prompt: style?.prompt,
      regeneration_feedback: isRegeneration
        ? (draft.brief?.regeneration_feedback as string | undefined)
        : undefined,
      previous_draft: isRegeneration && originalStatus !== "approved_idea"
        ? { title: draft.title ?? null, body: draft.body ?? "" }
        : undefined,
      // A title toggle only makes sense for long-form. Social never has one.
      include_title: draft.content_type === "social"
        ? false
        : (draft.brief?.include_title ?? true),
    });

    openaiRes = await callOpenAI({
      apiKey: ctx.openaiKey!,
      system: gen.system, user: gen.user,
      temperature: 0.5, maxTokens: 3500,
    });
    openaiDraft = safeParseJson(openaiRes.content, "openai draft");

    // Anthropic improvement pass.
    const imp = buildImprovePrompt({
      content_type: draft.content_type,
      platform:     draft.platform ?? undefined,
      draft:        { title: openaiDraft.title, body: openaiDraft.body },
      vault_block:  vaultBlock,
    });

    anthroRes = await callAnthropic({
      apiKey: ctx.anthropicKey!,
      system: imp.system, user: imp.user,
      temperature: 0.3, maxTokens: 3500,
    });

    // Graceful degradation: if Claude returns unparseable JSON we keep the
    // OpenAI draft and surface a drift warning rather than fail the stage.
    try {
      improved = safeParseJson(anthroRes.content, "anthropic improve");
    } catch (parseErr) {
      console.warn("[content-creator-generate] improve parse failed, keeping OpenAI draft:",
        parseErr instanceof Error ? parseErr.message : parseErr);
      improved = {
        title:          openaiDraft.title,
        body:           openaiDraft.body,
        drift_warnings: [
          `Anthropic improve pass skipped: invalid JSON from model (${
            parseErr instanceof Error ? parseErr.message.slice(0, 120) : "parse error"
          }).`,
        ],
      };
    }
  } catch (err) {
    // Reset on failure so the admin can retry. For regenerations we roll
    // back to whatever the row was before — the admin's content is
    // preserved either way because the 'generating' flip doesn't clobber
    // body/title until the final update at the end of this function.
    await sb.from("content_drafts").update({
      status: originalStatus,
      ai_metadata: {
        ...(draft.ai_metadata ?? {}),
        last_error: err instanceof Error ? err.message : String(err),
        last_error_at: new Date().toISOString(),
        last_error_stage: "generate",
      },
    }).eq("id", draft_id);
    throw err;
  }

  // 6. Post-process: replace [vault:<uuid>] markers with reader-friendly
  //    [Source N] refs + append a Sources block for long-form. This runs
  //    once, right before persisting, so the verifier stage always sees
  //    the final shape the reader will see.
  const cited = formatCitations(improved.body, vault, draft.content_type);

  // Respect the include_title toggle on long-form. When false, force the
  // title to null even if the model returned one.
  const includeTitle = draft.content_type === "social"
    ? false
    : (draft.brief?.include_title ?? true);
  const newTitle = !includeTitle
    ? null
    : (draft.content_type === "social" ? null : (improved.title ?? openaiDraft.title));
  const newBody  = cited.body;

  // Char-limit enforcement for social posts. We don't truncate (that would
  // silently mangle the content); we surface a drift warning so the admin
  // sees it on the detail page and can edit down before publishing.
  const drift = [...(improved.drift_warnings ?? [])];
  const platformLimit = SOCIAL_MAX_CHARS[draft.platform ?? ""];
  if (platformLimit && newBody.length > platformLimit) {
    drift.push(
      `Body is ${newBody.length} chars — over the ${draft.platform} limit of ${platformLimit}. Trim before publishing.`,
    );
  }

  const ai_metadata = {
    ...(draft.ai_metadata ?? {}),
    openai_model:    openaiRes.model,
    anthropic_model: anthroRes.model,
    tokens: {
      prompt:     (openaiRes.tokens.prompt     + anthroRes.tokens.prompt),
      completion: (openaiRes.tokens.completion + anthroRes.tokens.completion),
      total:      (openaiRes.tokens.total      + anthroRes.tokens.total),
    },
    drift_warnings:        drift,
    generated_at:          new Date().toISOString(),
    // Record citation shape so the detail UI can render Sources links and
    // the verifier can map [Source N] back to vault ids if needed.
    citation_style:        cited.citation_style,
    ordered_vault_ids:     cited.ordered_vault_ids,
    char_count:            newBody.length,
    char_limit:            platformLimit ?? null,
    char_limit_exceeded:   platformLimit ? newBody.length > platformLimit : false,
  };

  // Clear one-shot fields after a successful run: regeneration_feedback
  // must not leak into the next generation, and a stale verification
  // verdict on a regen would mislead the admin.
  const nextBrief = isRegeneration
    ? { ...(draft.brief ?? {}), regeneration_feedback: undefined }
    : draft.brief;

  const { data: updated, error: upErr } = await sb
    .from("content_drafts")
    .update({
      status:     "draft",
      title:      newTitle,
      body:       newBody,
      brief:      nextBrief,
      verification: {},
      ai_metadata,
      vault_refs: dedupUuids([
        ...(draft.vault_refs ?? []),
        ...(openaiDraft.vault_ids_used ?? []),
        ...vault.map((v) => v.id),
      ]),
    })
    .eq("id", draft_id)
    .select().single();
  if (upErr) throw new Error(`update draft failed: ${upErr.message}`);

  return { draft: updated };
}

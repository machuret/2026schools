import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

export const runtime = "edge";

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

/**
 * POST /api/admin/ambassadors/generate-bio
 * Generates an ambassador bio using the prompt stored in prompt_templates
 * (page_type = "ambassador", section_key = "bio").
 */
export async function POST(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  // Auth check
  const token = (req.headers.get("authorization") ?? "").replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const sb = createClient(supabaseUrl, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { data: { user }, error: authErr } = await sb.auth.getUser();
  if (authErr || !user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  // Parse body
  let body: { name: string; title?: string; linkedinUrl?: string; websiteUrl?: string; notes?: string };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }

  const { name, title = "", linkedinUrl = "", websiteUrl = "", notes = "" } = body;
  if (!name?.trim()) return NextResponse.json({ error: "name is required." }, { status: 400 });

  // Load prompt from DB
  const admin = adminClient();
  const { data: promptRow } = await admin
    .from("prompt_templates")
    .select("prompt, model")
    .eq("page_type", "ambassador")
    .eq("section_key", "bio")
    .single();

  const defaultPrompt = `You are writing a professional ambassador biography for the Schools Wellbeing Australia website.

Ambassador details:
- Name: {{name}}
- Title / Role: {{title}}
- LinkedIn: {{linkedin}}
- Website: {{website}}
- Extra context: {{notes}}

Write a compelling, warm, and professional third-person biography (3–5 paragraphs, ~250–350 words) that:
1. Introduces who they are and their professional background
2. Highlights their passion for student wellbeing and education
3. Describes their relevant expertise and achievements
4. Explains why they are an ambassador for Schools Wellbeing Australia
5. Ends with a forward-looking statement about their goals

Use clear, accessible language suitable for a public-facing education website. Do not use bullet points. Write in flowing paragraphs only.`;

  const rawPrompt: string = promptRow?.prompt ?? defaultPrompt;
  const model: string = promptRow?.model ?? "gpt-4o";

  const filledPrompt = rawPrompt
    .replace("{{name}}", name)
    .replace("{{title}}", title || "Not specified")
    .replace("{{linkedin}}", linkedinUrl || "Not provided")
    .replace("{{website}}", websiteUrl || "Not provided")
    .replace("{{notes}}", notes || "None");

  // Call OpenAI
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  try {
    const completion = await openai.chat.completions.create({
      model,
      messages: [{ role: "user", content: filledPrompt }],
      temperature: 0.7,
      max_tokens: 800,
    });
    const bio = completion.choices[0]?.message?.content?.trim() ?? "";
    return NextResponse.json({ bio });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "OpenAI error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

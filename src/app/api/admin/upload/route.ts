import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const BUCKET = "avatars";

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

// POST /api/admin/upload — upload an image to Supabase Storage
export async function POST(req: NextRequest) {
  const sb = adminClient();

  // Ensure the bucket exists (idempotent)
  const { data: buckets } = await sb.storage.listBuckets();
  if (!buckets?.find((b) => b.name === BUCKET)) {
    const { error: createErr } = await sb.storage.createBucket(BUCKET, {
      public: true,
      fileSizeLimit: 5 * 1024 * 1024, // 5 MB
      allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    });
    if (createErr) {
      return NextResponse.json({ error: `Bucket error: ${createErr.message}` }, { status: 500 });
    }
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const folder = (formData.get("folder") as string) || "ambassadors";

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // Validate type
  if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
    return NextResponse.json({ error: "Invalid file type. Use JPG, PNG, WebP, or GIF." }, { status: 400 });
  }

  // Validate size
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large. Max 5 MB." }, { status: 400 });
  }

  const ext = file.name.split(".").pop() || "jpg";
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const { error: uploadErr } = await sb.storage
    .from(BUCKET)
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadErr) {
    return NextResponse.json({ error: `Upload failed: ${uploadErr.message}` }, { status: 500 });
  }

  const { data: urlData } = sb.storage.from(BUCKET).getPublicUrl(fileName);

  return NextResponse.json({ url: urlData.publicUrl });
}

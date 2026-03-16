import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Ambassadors — Schools Wellbeing Australia",
  description: "Meet the incredible people who champion student wellbeing across Australia.",
};

export default async function AmbassadorsPage() {
  const sb = await createClient();
  const { data } = await sb
    .from("Ambassador")
    .select("id, name, title, bio, photoUrl, slug, linkedinUrl, websiteUrl")
    .eq("active", true)
    .order("sortOrder", { ascending: true })
    .order("createdAt", { ascending: false });

  const ambassadors = data ?? [];

  return (
    <>
      {/* Hero */}
      <div className="page-hero page-hero--centered">
        <div className="page-hero__inner">
          <div className="hero-tag">🤝 Our People</div>
          <h1 className="page-hero__title">
            Ambassadors
          </h1>
          <p className="page-hero__subtitle">
            Meet the incredible people who represent and champion student wellbeing across Australia
          </p>
        </div>
      </div>

      <main className="inner-content inner-content--wide">
        {ambassadors.length === 0 && (
          <div className="empty-state">
            <p>Ambassadors will appear here once added.</p>
          </div>
        )}

        {ambassadors.length > 0 && (
          <div className="profile-grid">
            {ambassadors.map((a) => (
              <Link key={a.id} href={`/ambassadors/${a.slug}`} className="profile-card">
                <div className="profile-card__avatar">
                  {a.photoUrl ? (
                    <Image src={a.photoUrl} alt={a.name} width={120} height={120} unoptimized />
                  ) : (
                    <span className="profile-card__initials">
                      {a.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                    </span>
                  )}
                </div>
                <h2 className="profile-card__name">{a.name}</h2>
                {a.title && <p className="profile-card__role">{a.title}</p>}
                {a.bio && <p className="profile-card__bio">{a.bio}</p>}
                <span className="profile-card__cta">Read More →</span>
              </Link>
            ))}
          </div>
        )}
      </main>

    </>
  );
}

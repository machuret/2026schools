"use client";

const INPUT = "w-full rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500";
const IS = { background: "#0D1117", border: "1px solid #30363D", color: "#C9D1D9" };
const LABEL = "block text-xs font-semibold mb-1.5 uppercase tracking-wide";
const LS = { color: "#6E7681" };
const FIELD = "mb-4";

interface SeoPanelProps {
  seoTitle: string;
  seoDesc: string;
  ogImage: string;
  defaultTitle?: string;
  defaultDesc?: string;
  onChange: (field: "seo_title" | "seo_desc" | "og_image", value: string) => void;
}

export default function SeoPanel({ seoTitle, seoDesc, ogImage, defaultTitle = "", defaultDesc = "", onChange }: SeoPanelProps) {
  const titleLen = seoTitle.length;
  const descLen = seoDesc.length;
  const titleScore = titleLen === 0 ? "default" : titleLen < 30 ? "short" : titleLen > 60 ? "long" : "good";
  const descScore = descLen === 0 ? "default" : descLen < 70 ? "short" : descLen > 160 ? "long" : "good";

  const scoreColor = (s: string) => s === "good" ? "#6EE7B7" : s === "default" ? "#484F58" : "#F0883E";
  const scoreLabel = (s: string, len: number) => s === "default" ? "using page default" : `${len} chars — ${s}`;

  return (
    <div className="rounded-xl p-6" style={{ background: "#161B22", border: "1px solid #21262D" }}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#58A6FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <h2 className="text-sm font-semibold" style={{ color: "#E6EDF3" }}>SEO &amp; Social</h2>
      </div>

      {/* Live Google preview */}
      <div className="rounded-lg p-4 mb-5" style={{ background: "#0D1117", border: "1px solid #21262D" }}>
        <div className="text-xs mb-2 font-semibold uppercase tracking-wide" style={{ color: "#484F58" }}>Google Preview</div>
        <div className="text-xs mb-0.5" style={{ color: "#6E7681" }}>schoolswellbeing.com.au › ...</div>
        <div className="text-sm font-medium mb-0.5 truncate" style={{ color: "#58A6FF" }}>
          {seoTitle || defaultTitle || "Page Title"}
        </div>
        <div className="text-xs line-clamp-2" style={{ color: "#8B949E" }}>
          {seoDesc || defaultDesc || "Page description will appear here…"}
        </div>
      </div>

      {/* SEO Title */}
      <div className={FIELD}>
        <div className="flex items-center justify-between mb-1.5">
          <label className={LABEL} style={LS}>SEO Title</label>
          <span className="text-xs" style={{ color: scoreColor(titleScore) }}>{scoreLabel(titleScore, titleLen)}</span>
        </div>
        <input
          className={INPUT} style={IS}
          value={seoTitle}
          onChange={e => onChange("seo_title", e.target.value)}
          placeholder={defaultTitle || "Defaults to page title"}
          maxLength={80}
        />
        {/* Character bar */}
        <div className="mt-1.5 h-1 rounded-full overflow-hidden" style={{ background: "#21262D" }}>
          <div className="h-full rounded-full transition-all" style={{
            width: `${Math.min((titleLen / 60) * 100, 100)}%`,
            background: scoreColor(titleScore),
          }} />
        </div>
        <div className="flex justify-between text-xs mt-1" style={{ color: "#484F58" }}>
          <span>0</span><span style={{ color: "#6E7681" }}>ideal: 30–60</span><span>60</span>
        </div>
      </div>

      {/* SEO Description */}
      <div className={FIELD}>
        <div className="flex items-center justify-between mb-1.5">
          <label className={LABEL} style={LS}>Meta Description</label>
          <span className="text-xs" style={{ color: scoreColor(descScore) }}>{scoreLabel(descScore, descLen)}</span>
        </div>
        <textarea
          rows={3}
          className={INPUT} style={{ ...IS, resize: "none" }}
          value={seoDesc}
          onChange={e => onChange("seo_desc", e.target.value)}
          placeholder={defaultDesc || "A compelling 70–160 character summary of this page"}
          maxLength={200}
        />
        <div className="mt-1.5 h-1 rounded-full overflow-hidden" style={{ background: "#21262D" }}>
          <div className="h-full rounded-full transition-all" style={{
            width: `${Math.min((descLen / 160) * 100, 100)}%`,
            background: scoreColor(descScore),
          }} />
        </div>
        <div className="flex justify-between text-xs mt-1" style={{ color: "#484F58" }}>
          <span>0</span><span style={{ color: "#6E7681" }}>ideal: 70–160</span><span>160</span>
        </div>
      </div>

      {/* OG Image */}
      <div>
        <label className={LABEL} style={LS}>
          OG / Social Image URL
          <span className="ml-2 normal-case font-normal tracking-normal" style={{ color: "#484F58" }}>
            (shown when shared on Facebook, Twitter, LinkedIn)
          </span>
        </label>
        <input
          className={INPUT} style={IS}
          value={ogImage}
          onChange={e => onChange("og_image", e.target.value)}
          placeholder="https://yourcdn.com/image.jpg (1200×630px recommended)"
        />
        {ogImage && (
          <div className="mt-2 rounded overflow-hidden" style={{ border: "1px solid #21262D", maxWidth: "240px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ogImage} alt="OG preview" className="w-full object-cover" style={{ maxHeight: "126px" }}
              onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="mt-4 pt-4" style={{ borderTop: "1px solid #21262D" }}>
        <div className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: "#484F58" }}>Tips</div>
        <ul className="text-xs space-y-1" style={{ color: "#484F58" }}>
          <li>• Leave blank to use the page title/description as defaults</li>
          <li>• Include the primary keyword near the start of the SEO title</li>
          <li>• Meta description doesn't affect ranking — but affects click-through rate</li>
          <li>• OG image should be 1200×630px for best results across platforms</li>
        </ul>
      </div>
    </div>
  );
}

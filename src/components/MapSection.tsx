"use client";
import { useRouter } from "next/navigation";
import AusMap from "./AusMap";

const STATE_SLUGS: Record<string, string> = {
  "New South Wales":             "new-south-wales",
  "Victoria":                    "victoria",
  "Queensland":                  "queensland",
  "South Australia":             "south-australia",
  "Western Australia":           "western-australia",
  "Tasmania":                    "tasmania",
  "Northern Territory":          "northern-territory",
  "Australian Capital Territory":"australian-capital-territory",
};

export default function MapSection() {
  const router = useRouter();

  function handleStateSelect(name: string) {
    const slug = STATE_SLUGS[name];
    if (slug) router.push(`/states/${slug}`);
  }

  return (
    <section className="section section-alt" id="map">
      <div className="section-tag">Interactive Regional Data</div>
      <h2>Wellbeing Across Australia</h2>
      <p className="section-lead">
        Every state and territory faces a different mix of challenges. Click any region on the map to see the specific wellbeing issues documented there — from the NT&apos;s attendance and self-harm crisis to the ACT&apos;s hidden anxiety burden.
      </p>
      <div className="map-centered">
        <AusMap onSelectState={handleStateSelect} selectedState={null} />
      </div>
    </section>
  );
}

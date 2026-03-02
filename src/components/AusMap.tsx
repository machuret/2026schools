"use client";
import { useState } from "react";

interface StateConfig {
  name: string;
  abbr: string;
  severity: "critical" | "high" | "notable";
  path: string;
  labelX: number;
  labelY: number;
  labelSize?: number;
}

const SEVERITY_COLOR = {
  critical: "#B91C1C",
  high:     "#B45309",
  notable:  "#15803D",
};

const SEVERITY_HOVER = {
  critical: "#991B1B",
  high:     "#92400E",
  notable:  "#166534",
};

const STATES: StateConfig[] = [
  {
    name: "Western Australia",
    abbr: "WA",
    severity: "critical",
    labelX: 148, labelY: 295,
    path: "M 85,60 L 88,58 L 93,54 L 100,50 L 108,47 L 118,44 L 128,43 L 138,43 L 148,45 L 155,48 L 160,52 L 162,58 L 162,310 L 155,315 L 148,318 L 140,320 L 130,320 L 120,318 L 110,314 L 100,308 L 92,300 L 87,290 L 84,278 L 83,260 L 83,200 L 83,140 L 83,100 L 85,60 Z",
  },
  {
    name: "Northern Territory",
    abbr: "NT",
    severity: "critical",
    labelX: 233, labelY: 155,
    path: "M 162,43 L 245,43 L 245,232 L 162,232 L 162,43 Z",
  },
  {
    name: "South Australia",
    abbr: "SA",
    severity: "high",
    labelX: 238, labelY: 310,
    path: "M 162,232 L 245,232 L 320,232 L 320,258 L 318,272 L 314,282 L 308,290 L 300,296 L 291,300 L 282,300 L 274,296 L 268,290 L 264,282 L 262,272 L 162,272 L 162,232 Z M 162,272 L 262,272 L 258,310 L 252,325 L 244,336 L 234,344 L 222,348 L 210,348 L 199,344 L 189,336 L 182,325 L 176,310 L 172,292 L 162,292 L 162,272 Z",
  },
  {
    name: "Queensland",
    abbr: "QLD",
    severity: "critical",
    labelX: 370, labelY: 165,
    path: "M 245,43 L 430,43 L 430,52 L 428,62 L 424,74 L 418,88 L 410,102 L 400,116 L 388,128 L 374,138 L 360,146 L 348,152 L 338,158 L 330,164 L 324,170 L 320,178 L 318,186 L 318,194 L 320,202 L 324,210 L 330,218 L 336,224 L 342,228 L 348,230 L 320,230 L 320,232 L 245,232 L 245,43 Z",
  },
  {
    name: "New South Wales",
    abbr: "NSW",
    severity: "high",
    labelX: 388, labelY: 290,
    path: "M 320,232 L 348,230 L 356,232 L 364,236 L 372,242 L 380,250 L 386,260 L 390,270 L 392,280 L 392,290 L 390,300 L 386,310 L 380,318 L 372,324 L 362,328 L 352,330 L 342,330 L 332,328 L 324,324 L 316,318 L 310,310 L 306,300 L 304,290 L 304,280 L 306,270 L 310,260 L 316,252 L 320,244 L 320,232 Z",
  },
  {
    name: "Australian Capital Territory",
    abbr: "ACT",
    severity: "notable",
    labelX: 364, labelY: 310,
    labelSize: 8,
    path: "M 358,298 L 370,298 L 370,320 L 358,320 Z",
  },
  {
    name: "Victoria",
    abbr: "VIC",
    severity: "high",
    labelX: 320, labelY: 358,
    path: "M 248,330 L 390,330 L 388,340 L 384,350 L 378,358 L 370,364 L 360,368 L 348,370 L 336,370 L 324,368 L 312,364 L 302,358 L 294,350 L 288,340 L 284,332 L 248,332 L 248,330 Z",
  },
  {
    name: "Tasmania",
    abbr: "TAS",
    severity: "high",
    labelX: 326, labelY: 418,
    path: "M 296,388 L 316,382 L 334,382 L 350,386 L 360,394 L 364,404 L 362,416 L 356,426 L 346,434 L 334,438 L 320,438 L 308,434 L 298,426 L 292,416 L 290,404 L 296,388 Z",
  },
];

interface Props {
  onSelectState: (name: string) => void;
  selectedState: string | null;
}

export default function AusMap({ onSelectState, selectedState }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="map-wrapper">
      <div className="map-hint">Click a state or territory to explore regional data</div>
      <svg
        viewBox="0 0 520 470"
        style={{ width: "100%", height: "auto", display: "block" }}
        aria-label="Map of Australia — click a state to explore"
      >
        {/* Ocean background */}
        <rect x="0" y="0" width="520" height="470" fill="#EFF6FF" rx="8" />

        {/* State paths */}
        {STATES.map((s) => {
          const isSelected = selectedState === s.name;
          const isHovered = hovered === s.name;
          const baseColor = SEVERITY_COLOR[s.severity];
          const hoverColor = SEVERITY_HOVER[s.severity];
          const fill = isSelected ? hoverColor : isHovered ? hoverColor : baseColor;
          const opacity = isSelected ? 1 : isHovered ? 0.92 : 0.78;
          const strokeWidth = isSelected ? 2.5 : 1.5;
          const strokeColor = isSelected ? "#0B1D35" : "#ffffff";

          return (
            <g key={s.name}>
              <path
                d={s.path}
                fill={fill}
                fillOpacity={opacity}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeLinejoin="round"
                style={{ cursor: "pointer", transition: "fill 0.15s, fill-opacity 0.15s" }}
                onMouseEnter={() => setHovered(s.name)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => onSelectState(s.name)}
                aria-label={s.name}
              />
              <text
                x={s.labelX}
                y={s.labelY}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={s.labelSize ?? (s.abbr.length > 2 ? 10 : 12)}
                fontWeight="700"
                fontFamily="Inter, -apple-system, sans-serif"
                fill="#ffffff"
                style={{ pointerEvents: "none", userSelect: "none", textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}
                paintOrder="stroke"
                stroke="rgba(0,0,0,0.35)"
                strokeWidth="3"
              >
                {s.abbr}
              </text>
            </g>
          );
        })}

        {/* Tooltip on hover */}
        {hovered && (() => {
          const s = STATES.find(st => st.name === hovered)!;
          const tx = Math.min(Math.max(s.labelX, 60), 460);
          const ty = s.labelY - 28;
          const label = s.name;
          return (
            <g style={{ pointerEvents: "none" }}>
              <rect x={tx - label.length * 3.4} y={ty - 12} width={label.length * 6.8} height={22} rx="4" fill="#0B1D35" fillOpacity="0.92" />
              <text x={tx} y={ty + 1} textAnchor="middle" dominantBaseline="central" fontSize="10" fontWeight="600" fontFamily="Inter, sans-serif" fill="#ffffff">
                {label}
              </text>
            </g>
          );
        })()}
      </svg>

      <div className="map-legend">
        <div className="legend-item"><div className="legend-dot dot-critical" /> Critical</div>
        <div className="legend-item"><div className="legend-dot dot-high" /> Elevated</div>
        <div className="legend-item"><div className="legend-dot dot-notable" /> Notable</div>
      </div>
    </div>
  );
}

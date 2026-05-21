"use client";

import { useState } from "react";
import { logEvent } from "@/app/[slug]/actions";
import type { EnrichedClient, Session } from "@/lib/types";

type Props = {
  client: EnrichedClient;
  session: Session;
  showToast: (message: string, type: "success" | "info" | "error") => void;
};

const DEFAULT_TEXTS: Record<string, string> = {
  headline: "Spectacular realities built on open coordinates.",
  body: "The quick brown fox jumps over the lazy dog. Brand communication must remain legible, balanced, and structural.",
  mono: "const coordinates = { x: 42.10, y: 19.84 }; // Mythreal engine",
};

export function TypographyPlayground({ client, session, showToast }: Props) {
  const fonts = client.brand_fonts || [];
  const [customText, setCustomText] = useState("");

  if (fonts.length === 0) {
    return (
      <div className="border border-dashed border-neutral-300 rounded-2xl p-12 text-center text-neutral-400 bg-white">
        No brand fonts defined for this client.
      </div>
    );
  }

  function handleCopyCss(family: string, weight: number, role: string) {
    const cssText = `font-family: "${family}", sans-serif; font-weight: ${weight};`;
    navigator.clipboard.writeText(cssText);
    showToast(`Copied CSS: font-weight ${weight} for ${family}`, "success");

    logEvent({
      clientId: client.id,
      userLabel: session.userLabel,
      eventType: "copied_css",
      metadata: {
        font_family: family,
        weight,
        role,
      },
    });
  }

  const getWeightLabel = (weight: number) => {
    switch (weight) {
      case 100: return "Thin";
      case 200: return "Extra Light";
      case 300: return "Light";
      case 400: return "Regular";
      case 500: return "Medium";
      case 600: return "Semi Bold";
      case 700: return "Bold";
      case 800: return "Extra Bold";
      case 900: return "Black";
      default: return "";
    }
  };

  return (
    <div className="space-y-8">
      {/* Specimen customizer bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-sm">
        <div className="flex-1">
          <label htmlFor="specimen-input" className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
            Test custom specimen text
          </label>
          <input
            id="specimen-input"
            type="text"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Type anything to test weights live..."
            className="w-full text-sm bg-neutral-50 hover:bg-neutral-100/50 focus:bg-white border border-neutral-200/80 hover:border-neutral-300 focus:border-neutral-800 rounded-xl px-4 py-2.5 outline-none transition"
          />
        </div>
        {customText && (
          <button
            onClick={() => setCustomText("")}
            className="self-end md:self-center px-4 py-2.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition cursor-pointer"
          >
            Reset
          </button>
        )}
      </div>

      {/* Render font sections */}
      <div className="grid grid-cols-1 gap-8">
        {fonts.map((font) => {
          const defaultSpecimen = DEFAULT_TEXTS[font.role] || DEFAULT_TEXTS.body;
          const displayText = customText.trim() || defaultSpecimen;

          return (
            <div
              key={font.id}
              className="bg-white border border-neutral-200/80 rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-md/50 transition-all duration-300 relative overflow-hidden group"
            >
              {/* Premium Top Info Bar */}
              <div className="flex flex-wrap items-center justify-between border-b border-neutral-100 pb-6 mb-8 gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-medium tracking-tight text-neutral-900">
                      {font.family}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-neutral-100 text-neutral-600 border border-neutral-200/50">
                      {font.role}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1">
                    {font.css_import_url ? "Google Fonts CDN" : "Self-Hosted Storage Asset"}
                  </p>
                </div>
                {font.css_import_url && (
                  <a
                    href={font.css_import_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-medium text-neutral-500 hover:text-neutral-800 border border-neutral-200 rounded-full px-3.5 py-1.5 bg-neutral-50/50 hover:bg-neutral-50 transition"
                  >
                    View Source CSS
                  </a>
                )}
              </div>

              {/* Specimens list */}
              <div className="divide-y divide-neutral-100">
                {font.weights.map((weight) => (
                  <div
                    key={weight}
                    className="py-6 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-6 group/line transition-all duration-150"
                  >
                    {/* Weight badge & label */}
                    <div className="w-40 shrink-0">
                      <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                        {getWeightLabel(weight) || `${font.role}`}
                      </p>
                      <p className="text-sm font-medium text-neutral-700 mt-0.5">
                        Weight {weight}
                      </p>
                    </div>

                    {/* Specimen display block */}
                    <div className="flex-1 min-w-0 pr-4">
                      <p
                        className="text-2xl md:text-3xl lg:text-4xl text-neutral-900 leading-tight break-words transition-all duration-300"
                        style={{ fontFamily: `"${font.family}", sans-serif`, fontWeight: weight }}
                      >
                        {displayText}
                      </p>
                    </div>

                    {/* Hover copy button */}
                    <div className="md:opacity-0 group-hover/line:opacity-100 focus-within:opacity-100 transition-opacity duration-200 shrink-0 self-start md:self-center">
                      <button
                        onClick={() => handleCopyCss(font.family, weight, font.role)}
                        className="flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-200 hover:border-neutral-950 bg-white text-neutral-700 hover:text-black font-semibold text-xs transition cursor-pointer shadow-sm shadow-neutral-100"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                          />
                        </svg>
                        Copy CSS
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

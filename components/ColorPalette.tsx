"use client";

import { useState } from "react";
import { logEvent } from "@/app/[slug]/actions";
import type { EnrichedClient, Session, BrandColor } from "@/lib/types";

type Props = {
  client: EnrichedClient;
  session: Session;
  showToast: (message: string, type: "success" | "info" | "error") => void;
};

const ROLE_LABELS = {
  primary: "Primary Anchor",
  secondary: "Secondary Accent",
  accent: "Tension & CTA Accent",
  neutral: "Neutral Foundation",
};

export function ColorPalette({ client, session, showToast }: Props) {
  const [pulseColorId, setPulseColorId] = useState<string | null>(null);

  const colors = client.brand_colors || [];

  // Group colors by role
  const groups = {
    primary: colors.filter((c) => c.role === "primary"),
    secondary: colors.filter((c) => c.role === "secondary"),
    accent: colors.filter((c) => c.role === "accent"),
    neutral: colors.filter((c) => c.role === "neutral"),
  };

  const handleCopy = (color: BrandColor, format: "hex" | "rgb" | "hsl", value: string) => {
    navigator.clipboard.writeText(value);
    
    // Trigger success toast
    showToast(`Copied ${format.toUpperCase()}: ${value}`, "success");
    
    // Trigger card pulse animation
    setPulseColorId(color.id);
    setTimeout(() => {
      setPulseColorId(null);
    }, 300);

    // Log tracking event
    logEvent({
      clientId: client.id,
      userLabel: session.userLabel,
      eventType: "copied_color",
      metadata: {
        color_name: color.name,
        format: format,
        value: value,
      },
    });
  };

  if (colors.length === 0) {
    return (
      <div className="border border-dashed border-neutral-300 rounded-xl p-12 text-center text-neutral-400">
        No brand colors have been added to this portal yet.
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {(Object.keys(groups) as Array<keyof typeof groups>).map((role) => {
        const roleColors = groups[role];
        if (roleColors.length === 0) return null;

        return (
          <div key={role} className="space-y-4">
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
                {ROLE_LABELS[role]}
              </h3>
              <span className="h-[1px] flex-grow bg-neutral-200" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {roleColors.map((color) => {
                const isPulsing = pulseColorId === color.id;
                
                return (
                  <div
                    key={color.id}
                    className={`bg-white rounded-xl border border-neutral-200/60 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col ${
                      isPulsing ? "animate-[pulseOnce_0.3s_ease-out]" : "hover:-translate-y-1"
                    }`}
                  >
                    {/* Color Swatch */}
                    <div className="relative group/swatch h-32 w-full border-b border-neutral-100 flex-shrink-0">
                      <div
                        className="absolute inset-0 transition-opacity duration-300"
                        style={{ backgroundColor: color.hex }}
                      />
                      
                      {/* Subtle checkerboard overlay just in case color is transparent/white */}
                      {color.hex.toLowerCase() === "#ffffff" && (
                        <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] bg-neutral-50" />
                      )}

                      {/* Overly subtle inset shadow for very light colors */}
                      <div className="absolute inset-0 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] pointer-events-none" />
                    </div>

                    {/* Content */}
                    <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
                      <div>
                        <h4 className="font-semibold text-neutral-800 text-base">
                          {color.name}
                        </h4>
                        <p className="text-xs uppercase tracking-wider text-neutral-400 font-medium mt-0.5">
                          {color.role}
                        </p>
                      </div>

                      {/* Color Formats Panel */}
                      <div className="space-y-1.5 pt-2 border-t border-neutral-100">
                        {/* HEX Format */}
                        <button
                          onClick={() => handleCopy(color, "hex", color.hex)}
                          className="flex items-center justify-between text-xs px-2.5 py-1.5 rounded-md hover:bg-neutral-50 border border-transparent hover:border-neutral-200/50 text-neutral-600 hover:text-neutral-900 transition duration-150 text-left w-full cursor-pointer group"
                        >
                          <span className="font-semibold text-neutral-400">HEX</span>
                          <span className="font-mono">{color.hex}</span>
                          <svg
                            className="w-3.5 h-3.5 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity"
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
                        </button>

                        {/* RGB Format */}
                        <button
                          onClick={() => handleCopy(color, "rgb", color.rgb)}
                          className="flex items-center justify-between text-xs px-2.5 py-1.5 rounded-md hover:bg-neutral-50 border border-transparent hover:border-neutral-200/50 text-neutral-600 hover:text-neutral-900 transition duration-150 text-left w-full cursor-pointer group"
                        >
                          <span className="font-semibold text-neutral-400">RGB</span>
                          <span className="font-mono text-[10px] truncate max-w-[130px]" title={color.rgb}>
                            {color.rgb}
                          </span>
                          <svg
                            className="w-3.5 h-3.5 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity"
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
                        </button>

                        {/* HSL Format */}
                        <button
                          onClick={() => handleCopy(color, "hsl", color.hsl)}
                          className="flex items-center justify-between text-xs px-2.5 py-1.5 rounded-md hover:bg-neutral-50 border border-transparent hover:border-neutral-200/50 text-neutral-600 hover:text-neutral-900 transition duration-150 text-left w-full cursor-pointer group"
                        >
                          <span className="font-semibold text-neutral-400">HSL</span>
                          <span className="font-mono text-[10px] truncate max-w-[130px]" title={color.hsl}>
                            {color.hsl}
                          </span>
                          <svg
                            className="w-3.5 h-3.5 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity"
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
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

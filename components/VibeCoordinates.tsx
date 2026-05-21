"use client";

import type { EnrichedClient, Session } from "@/lib/types";

type Props = {
  client: EnrichedClient;
  session: Session;
  showToast: (message: string, type: "success" | "info" | "error") => void;
};

export function VibeCoordinates({ client, session, showToast }: Props) {
  const vibe = client.vibe_coordinates;

  if (!vibe) {
    return (
      <div className="border border-dashed border-neutral-300 rounded-xl p-12 text-center text-neutral-400">
        No vibe coordinates have been added to this portal yet.
      </div>
    );
  }

  // Dynamically map colors from client.brand_colors matching the vibe surface/weight/accent names
  const colors = client.brand_colors || [];

  const findColorHex = (name: string, role: string) => {
    const matched = colors.find((c) => c.name.toLowerCase() === name.toLowerCase());
    if (matched) return matched.hex;
    const byRole = colors.find((c) => c.role === role);
    if (byRole) return byRole.hex;

    // Elegant fallback hexes based on standard Waypoint palette
    if (role === "primary") return "#F4EFE6"; // Cream
    if (role === "secondary") return "#2B1F1A"; // Ember
    return "#D97706"; // Amber
  };

  const surfaceHex = findColorHex(vibe.surface_name, "primary");
  const weightHex = findColorHex(vibe.weight_name, "secondary");
  const accentHex = findColorHex(vibe.accent_name, "accent");

  return (
    <div className="relative overflow-hidden bg-white rounded-2xl border border-neutral-200/80 shadow-sm p-6 sm:p-8">
      {/* CSS-only premium animated liquid mesh background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none opacity-[0.14]">
        {/* Base dominant surface color */}
        <div className="absolute inset-0" style={{ backgroundColor: surfaceHex }} />
        {/* Weight undercurrent blob */}
        <div
          className="absolute -top-1/2 -left-1/2 w-[120%] h-[120%] rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-[driftWeight_25s_ease-in-out_infinite]"
          style={{ backgroundColor: weightHex }}
        />
        {/* Accent spark blob */}
        <div
          className="absolute -bottom-1/2 -right-1/2 w-[90%] h-[90%] rounded-full mix-blend-color-burn filter blur-3xl opacity-80 animate-[driftAccent_18s_ease-in-out_infinite]"
          style={{ backgroundColor: accentHex }}
        />
      </div>

      {/* CSS Keyframes for smooth drift */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes driftWeight {
            0% {
              transform: translate(0px, 0px) scale(1);
            }
            33% {
              transform: translate(12%, 8%) scale(1.1);
            }
            66% {
              transform: translate(-8%, 15%) scale(0.95);
            }
            100% {
              transform: translate(0px, 0px) scale(1);
            }
          }
          @keyframes driftAccent {
            0% {
              transform: translate(0px, 0px) scale(1);
            }
            50% {
              transform: translate(-15%, -12%) scale(1.15);
            }
            100% {
              transform: translate(0px, 0px) scale(1);
            }
          }
        `
      }} />

      {/* Content wrapper ensuring it sits above the mesh */}
      <div className="relative z-10 flex flex-col space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100/80 pb-4">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 font-semibold bg-neutral-100 px-2 py-0.5 rounded">
              {vibe.code}
            </span>
            <h3 className="text-lg font-semibold text-neutral-950 font-serif">
              {vibe.label}
            </h3>
          </div>
          <span className="text-xs text-neutral-400 font-medium font-mono">
            Vibe Signature · Activated
          </span>
        </div>

        {/* Big Ratios Grid */}
        <div className="grid grid-cols-3 gap-4 py-4 border-b border-neutral-100/80">
          <div className="space-y-1">
            <p className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 font-mono">
              {vibe.surface_pct}%
            </p>
            <p className="text-[10px] sm:text-xs uppercase tracking-wider text-neutral-500 font-semibold">
              Surface · <span className="font-medium text-neutral-400">{vibe.surface_name}</span>
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 font-mono">
              {vibe.weight_pct}%
            </p>
            <p className="text-[10px] sm:text-xs uppercase tracking-wider text-neutral-500 font-semibold">
              Weight · <span className="font-medium text-neutral-400">{vibe.weight_name}</span>
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 font-mono">
              {vibe.accent_pct}%
            </p>
            <p className="text-[10px] sm:text-xs uppercase tracking-wider text-neutral-500 font-semibold">
              Accent · <span className="font-medium text-neutral-400">{vibe.accent_name}</span>
            </p>
          </div>
        </div>

        {/* Description */}
        {vibe.description && (
          <p className="text-sm text-neutral-600 leading-relaxed max-w-2xl">
            {vibe.description}
          </p>
        )}

        {/* Applied Examples Table */}
        <div className="space-y-3">
          <h4 className="text-xs uppercase tracking-widest text-neutral-400 font-semibold">
            Operational Ratio Applications
          </h4>
          <div className="border border-neutral-200/60 rounded-xl overflow-hidden bg-white/80 backdrop-blur-sm shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-neutral-50/60 border-b border-neutral-200/60 text-neutral-400 font-semibold">
                    <th className="px-4 py-3 font-semibold tracking-wider uppercase text-[10px]">Ratio</th>
                    <th className="px-4 py-3 font-semibold tracking-wider uppercase text-[10px]">Meaning</th>
                    <th className="px-4 py-3 font-semibold tracking-wider uppercase text-[10px]">Example</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-neutral-700">
                  {vibe.applied_examples && Array.isArray(vibe.applied_examples) && vibe.applied_examples.length > 0 ? (
                    vibe.applied_examples.map((row, idx) => (
                      <tr key={idx} className="hover:bg-neutral-50/40 transition duration-150">
                        <td className="px-4 py-3 font-mono font-semibold text-neutral-900 whitespace-nowrap">
                          {row.ratio}
                        </td>
                        <td className="px-4 py-3 leading-relaxed">
                          {row.meaning}
                        </td>
                        <td className="px-4 py-3 text-neutral-500 leading-relaxed">
                          {row.example}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-4 py-6 text-center text-neutral-400 italic">
                        No applied examples defined for this vibe formula.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

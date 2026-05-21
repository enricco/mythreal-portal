"use client";

import { useEffect, useState } from "react";
import { logEvent } from "@/app/[slug]/actions";
import { Toast } from "./Toast";
import { QuickActionsBar } from "./QuickActionsBar";
import { ColorPalette } from "./ColorPalette";
import { LogoVault } from "./LogoVault";
import { TypographyPlayground } from "./TypographyPlayground";
import { DeveloperTokens } from "./DeveloperTokens";
import { VibeCoordinates } from "./VibeCoordinates";
import { VerbalSoundboard } from "./VerbalSoundboard";
import { SectionErrorBoundary } from "./SectionErrorBoundary";
import { SectionTracker } from "./SectionTracker";
import type { EnrichedClient, Session } from "@/lib/types";

type Props = {
  client: EnrichedClient;
  session: Session;
};

const SECTIONS = [
  { id: "colors", label: "Colors" },
  { id: "logos", label: "Logos" },
  { id: "typography", label: "Typography" },
  { id: "vibe", label: "Vibe Coordinates" },
  { id: "verbal", label: "Verbal" },
  { id: "tokens", label: "Developer Tokens" },
];

export function PortalShell({ client, session }: Props) {
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "info" | "error";
  } | null>(null);

  useEffect(() => {
    logEvent({
      clientId: client.id,
      userLabel: session.userLabel,
      eventType: "portal_opened",
    });
  }, [client.id, session.userLabel]);

  const showToast = (message: string, type: "success" | "info" | "error" = "success") => {
    setToast({ message, type });
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="border-b border-neutral-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
              Mythreal
            </p>
            <h1 className="text-lg font-medium mt-1">{client.name}</h1>
          </div>
          {session.userLabel && (
            <p className="text-sm text-neutral-500">Hi, {session.userLabel}</p>
          )}
        </div>
      </header>

      {/* Sticky Quick Actions Bar */}
      <QuickActionsBar client={client} session={session} showToast={showToast} />

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-16">
        {SECTIONS.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-20">
            <SectionTracker
              sectionId={section.id}
              clientId={client.id}
              userLabel={session.userLabel}
            >
              <SectionErrorBoundary sectionLabel={section.label}>
                <h2 className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-4 font-semibold">
                  {section.label}
                </h2>
                {section.id === "colors" ? (
                  <ColorPalette client={client} session={session} showToast={showToast} />
                ) : section.id === "logos" ? (
                  <LogoVault client={client} session={session} showToast={showToast} />
                ) : section.id === "typography" ? (
                  <TypographyPlayground client={client} session={session} showToast={showToast} />
                ) : section.id === "vibe" ? (
                  <VibeCoordinates client={client} session={session} showToast={showToast} />
                ) : section.id === "verbal" ? (
                  <VerbalSoundboard client={client} session={session} showToast={showToast} />
                ) : section.id === "tokens" ? (
                  <DeveloperTokens client={client} session={session} showToast={showToast} />
                ) : (
                  <div className="border border-dashed border-neutral-300 rounded-lg p-12 text-center text-neutral-400">
                    {section.label} module — coming in next phase.
                  </div>
                )}
              </SectionErrorBoundary>
            </SectionTracker>
          </section>
        ))}
      </main>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <footer className="border-t border-neutral-200 mt-20">
        <div className="max-w-6xl mx-auto px-6 py-6 text-xs text-neutral-500">
          Mythreal · Operational brand system
        </div>
      </footer>
    </div>
  );
}

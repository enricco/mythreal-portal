"use client";

import { useEffect } from "react";
import { logEvent } from "@/app/[slug]/actions";
import type { Client, Session } from "@/lib/types";

type Props = {
  client: Pick<Client, "id" | "name" | "slug">;
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
  useEffect(() => {
    logEvent({
      clientId: client.id,
      userLabel: session.userLabel,
      eventType: "portal_opened",
    });
  }, [client.id, session.userLabel]);

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

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-16">
        {SECTIONS.map((section) => (
          <section key={section.id} id={section.id}>
            <h2 className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-4">
              {section.label}
            </h2>
            <div className="border border-dashed border-neutral-300 rounded-lg p-12 text-center text-neutral-400">
              {section.label} module — coming in next phase.
            </div>
          </section>
        ))}
      </main>

      <footer className="border-t border-neutral-200 mt-20">
        <div className="max-w-6xl mx-auto px-6 py-6 text-xs text-neutral-500">
          Mythreal · Operational brand system
        </div>
      </footer>
    </div>
  );
}

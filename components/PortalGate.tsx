"use client";

import { useEffect, useState } from "react";
import { LockScreen } from "./LockScreen";
import { PortalShell } from "./PortalShell";
import { readSession } from "@/lib/session";
import type { EnrichedClient, Session } from "@/lib/types";

type Props = {
  client: EnrichedClient;
};

export function PortalGate({ client }: Props) {
  const [session, setSession] = useState<Session | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Reads localStorage, which is only available client-side; safe inside effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSession(readSession(client.slug));
    setHydrated(true);
  }, [client.slug]);

  if (!hydrated) {
    // Render a high-fidelity animated skeleton shell mimicking the real Portal layout
    return (
      <div className="min-h-screen bg-neutral-50 text-neutral-900 select-none pointer-events-none" aria-hidden>
        {/* Shimmer Keyframes */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes skeletonShimmer {
              0% { background-position: -200% 0; }
              100% { background-position: 200% 0; }
            }
            .shimmer {
              background: linear-gradient(90deg, #f5f5f5 25%, #e9e9e9 50%, #f5f5f5 75%);
              background-size: 200% 100%;
              animation: skeletonShimmer 1.5s infinite linear;
            }
            .shimmer-dark {
              background: linear-gradient(90deg, #1c1c1e 25%, #2a2a2d 50%, #1c1c1e 75%);
              background-size: 200% 100%;
              animation: skeletonShimmer 1.5s infinite linear;
            }
          `
        }} />

        {/* Skeleton Header */}
        <header className="border-b border-neutral-200 bg-white">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="space-y-2">
              <div className="w-16 h-3 rounded shimmer" />
              <div className="w-36 h-5 rounded shimmer" />
            </div>
            <div className="w-24 h-4 rounded shimmer" />
          </div>
        </header>

        {/* Skeleton Sticky Quick Actions Bar */}
        <div className="border-b border-neutral-200/80 bg-white/70 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
            <div className="w-20 h-4 rounded shimmer" />
            <div className="flex gap-2.5">
              <div className="w-28 h-7.5 rounded-full shimmer" />
              <div className="w-32 h-7.5 rounded-full shimmer" />
              <div className="w-28 h-7.5 rounded-full shimmer" />
              <div className="w-24 h-7.5 rounded-full shimmer" />
            </div>
          </div>
        </div>

        {/* Skeleton Modules Container */}
        <main className="max-w-6xl mx-auto px-6 py-10 space-y-16">
          
          {/* 1. Colors Module Skeleton */}
          <section className="space-y-4">
            <div className="w-24 h-3.5 rounded shimmer" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-xl border border-neutral-200/60 overflow-hidden shadow-sm flex flex-col h-[264px] p-4 space-y-4">
                  <div className="w-full h-32 rounded-lg shimmer" />
                  <div className="w-2/3 h-4 rounded shimmer" />
                  <div className="w-1/3 h-3 rounded shimmer" />
                  <span className="h-[1px] bg-neutral-100" />
                  <div className="w-full h-8 rounded shimmer" />
                </div>
              ))}
            </div>
          </section>

          {/* 2. Logos Module Skeleton */}
          <section className="space-y-4">
            <div className="w-20 h-3.5 rounded shimmer" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-xl border border-neutral-200/60 overflow-hidden shadow-sm flex flex-col h-72 p-4 space-y-4">
                  <div className="w-full h-44 rounded-lg shimmer" />
                  <div className="flex justify-between items-center">
                    <div className="w-1/3 h-4 rounded shimmer" />
                    <div className="w-1/4 h-8 rounded-lg shimmer" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 3. Typography Skeleton */}
          <section className="space-y-4">
            <div className="w-28 h-3.5 rounded shimmer" />
            <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
              <div className="flex justify-between pb-4 border-b border-neutral-100">
                <div className="space-y-2">
                  <div className="w-32 h-5 rounded shimmer" />
                  <div className="w-24 h-3 rounded shimmer" />
                </div>
                <div className="w-24 h-7 rounded-full shimmer" />
              </div>
              {[1, 2, 3].map((w) => (
                <div key={w} className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-3 border-b border-neutral-50 last:border-0">
                  <div className="w-32 h-4 rounded shimmer" />
                  <div className="flex-1 h-8 rounded shimmer max-w-lg" />
                  <div className="w-24 h-7 rounded-full shimmer" />
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    );
  }

  if (!session) {
    return (
      <LockScreen
        slug={client.slug}
        clientName={client.name}
        onUnlock={(s) => setSession(s)}
      />
    );
  }

  return <PortalShell client={client} session={session} />;
}

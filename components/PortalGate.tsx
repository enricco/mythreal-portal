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
    return <div className="min-h-screen bg-[#0a0a0a]" aria-hidden />;
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

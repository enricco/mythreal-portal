import "server-only";

import { supabaseServer } from "./supabase/server";
import type { EventType } from "./types";

export async function track(params: {
  clientId: string;
  userLabel: string | null;
  eventType: EventType;
  metadata?: Record<string, unknown>;
}) {
  const { clientId, userLabel, eventType, metadata } = params;
  const { error } = await supabaseServer.from("analytics_events").insert({
    client_id: clientId,
    user_label: userLabel,
    event_type: eventType,
    metadata: metadata ?? {},
  });
  if (error) {
    console.error("[analytics] failed", { eventType, error: error.message });
  }
}

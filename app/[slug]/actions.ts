"use server";

import { supabaseServer } from "@/lib/supabase/server";
import { track } from "@/lib/analytics";
import type { EventType } from "@/lib/types";

export async function verifyPasscode(params: {
  slug: string;
  passcode: string;
}): Promise<{ ok: boolean; clientId?: string }> {
  const { data, error } = await supabaseServer
    .from("clients")
    .select("id, passcode")
    .eq("slug", params.slug)
    .maybeSingle();

  if (error || !data) return { ok: false };
  if (data.passcode !== params.passcode) return { ok: false };
  return { ok: true, clientId: data.id };
}

export async function logEvent(params: {
  clientId: string;
  userLabel: string | null;
  eventType: EventType;
  metadata?: Record<string, unknown>;
}) {
  await track(params);
}

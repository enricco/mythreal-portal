import type { Session } from "./types";

const key = (slug: string) => `mythreal:session:${slug}`;

export function readSession(slug: string): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key(slug));
    if (!raw) return null;
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export function writeSession(slug: string, session: Session): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key(slug), JSON.stringify(session));
}

export function clearSession(slug: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(key(slug));
}

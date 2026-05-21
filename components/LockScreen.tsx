"use client";

import { useState, useTransition } from "react";
import { verifyPasscode } from "@/app/[slug]/actions";
import { writeSession } from "@/lib/session";
import type { Session } from "@/lib/types";

type Props = {
  slug: string;
  clientName: string;
  onUnlock: (session: Session, clientId: string) => void;
};

export function LockScreen({ slug, clientName, onUnlock }: Props) {
  const [stage, setStage] = useState<"passcode" | "label">("passcode");
  const [passcode, setPasscode] = useState("");
  const [userLabel, setUserLabel] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submitPasscode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await verifyPasscode({ slug, passcode: passcode.trim() });
      if (!result.ok || !result.clientId) {
        setError("That passcode doesn't match. Try again.");
        return;
      }
      setClientId(result.clientId);
      setStage("label");
    });
  }

  function submitLabel(e: React.FormEvent) {
    e.preventDefault();
    if (!clientId) return;
    const label = userLabel.trim() || null;
    const session: Session = { unlockedAt: Date.now(), userLabel: label };
    writeSession(slug, session);
    onUnlock(session, clientId);
  }

  function skipLabel() {
    if (!clientId) return;
    const session: Session = { unlockedAt: Date.now(), userLabel: null };
    writeSession(slug, session);
    onUnlock(session, clientId);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-neutral-100 p-6">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-3">
            Mythreal
          </p>
          <h1 className="text-2xl font-medium">{clientName}</h1>
          <p className="text-sm text-neutral-400 mt-2">
            Operational brand system
          </p>
        </div>

        {stage === "passcode" ? (
          <form onSubmit={submitPasscode} className="space-y-4">
            <label className="block">
              <span className="text-xs uppercase tracking-wider text-neutral-400">
                Portal passcode
              </span>
              <input
                type="password"
                autoFocus
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="mt-2 w-full bg-neutral-900 border border-neutral-800 rounded-md px-4 py-3 text-base focus:outline-none focus:border-neutral-600 transition"
                placeholder="Enter passcode"
              />
            </label>
            {error && (
              <p className="text-sm text-red-400" role="alert">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={pending || !passcode.trim()}
              className="w-full bg-neutral-100 text-neutral-900 rounded-md py-3 font-medium disabled:opacity-40 transition hover:bg-white"
            >
              {pending ? "Unlocking…" : "Unlock portal"}
            </button>
            <p className="text-xs text-neutral-500 text-center pt-4">
              Share this passcode with your team. One credential, everyone in.
            </p>
          </form>
        ) : (
          <form onSubmit={submitLabel} className="space-y-4">
            <label className="block">
              <span className="text-xs uppercase tracking-wider text-neutral-400">
                Who&apos;s using the portal today?
              </span>
              <input
                type="text"
                autoFocus
                value={userLabel}
                onChange={(e) => setUserLabel(e.target.value)}
                className="mt-2 w-full bg-neutral-900 border border-neutral-800 rounded-md px-4 py-3 text-base focus:outline-none focus:border-neutral-600 transition"
                placeholder="e.g. Sarah — Marketing"
              />
              <span className="block text-xs text-neutral-500 mt-2">
                Optional. Used for your team&apos;s monthly usage report.
              </span>
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={skipLabel}
                className="flex-1 border border-neutral-800 rounded-md py-3 text-neutral-300 hover:border-neutral-700 transition"
              >
                Skip
              </button>
              <button
                type="submit"
                className="flex-1 bg-neutral-100 text-neutral-900 rounded-md py-3 font-medium hover:bg-white transition"
              >
                Enter
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

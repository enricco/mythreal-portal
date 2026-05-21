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
    <div className="min-h-screen flex items-center justify-center bg-[#070708] text-neutral-100 p-6 relative overflow-hidden font-sans">
      {/* Animated fluid mesh background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0 opacity-40">
        {/* Core glowing blobs */}
        <div className="absolute -top-[40%] -left-[30%] w-[100%] h-[100%] rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.25)_0%,transparent_70%)] filter blur-3xl animate-[spin_40s_linear_infinite]" />
        <div className="absolute -bottom-[35%] -right-[25%] w-[90%] h-[90%] rounded-full bg-[radial-gradient(circle_at_center,rgba(217,119,6,0.22)_0%,transparent_65%)] filter blur-3xl animate-[spin_30s_linear_infinite]" />
        <div className="absolute top-[20%] right-[10%] w-[60%] h-[60%] rounded-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.15)_0%,transparent_60%)] filter blur-3xl animate-[driftBlob_20s_ease-in-out_infinite]" />
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes driftBlob {
            0%, 100% { transform: translate(0px, 0px) scale(1); }
            50% { transform: translate(-30px, 20px) scale(1.08); }
          }
        `
      }} />

      {/* Main Glassmorphic Wrapper */}
      <div className="w-full max-w-md z-10 relative">
        <div className="bg-neutral-950/45 backdrop-blur-2xl border border-white/[0.07] rounded-3xl p-8 sm:p-10 shadow-[0_24px_80px_rgba(0,0,0,0.7)] text-center relative overflow-hidden transition-all duration-500">
          
          {/* Subtle glowing top border edge */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          
          <div className="mb-8 select-none">
            <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-bold">
              Mythreal System
            </p>
            <h1 className="text-3xl font-semibold mt-3 tracking-tight bg-gradient-to-b from-white to-neutral-350 bg-clip-text text-transparent font-serif">
              {clientName}
            </h1>
            <div className="w-8 h-[1px] bg-neutral-800 mx-auto mt-4" />
            <p className="text-xs text-neutral-400 mt-3 font-medium tracking-wide">
              Private Operational Brand Space
            </p>
          </div>

          {/* Stage 1: Passcode Form */}
          {stage === "passcode" ? (
            <form onSubmit={submitPasscode} className="space-y-6 text-left animate-[slideUp_0.35s_ease-out]">
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
                  Secret passcode
                </label>
                <div className="relative">
                  <input
                    type="password"
                    autoFocus
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="w-full bg-white/[0.04] hover:bg-white/[0.06] focus:bg-neutral-950/80 border border-white/[0.08] hover:border-white/[0.12] focus:border-neutral-500 rounded-xl px-4 py-3.5 text-base focus:outline-none transition duration-200 placeholder-neutral-600 font-mono"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>
              
              {error && (
                <div className="flex items-center gap-2 bg-red-950/30 border border-red-900/40 px-3 py-2.5 rounded-xl animate-[slideUp_0.15s_ease-out]" role="alert">
                  <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-xs text-red-300 font-medium">
                    {error}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={pending || !passcode.trim()}
                className="w-full bg-neutral-100 hover:bg-white active:scale-[0.99] text-neutral-950 rounded-xl py-3.5 text-sm font-semibold disabled:opacity-30 transition-all duration-200 cursor-pointer shadow-md select-none"
              >
                {pending ? "Decrypting Space..." : "Enter Brand Portal"}
              </button>
              
              <div className="pt-2 text-center">
                <span className="text-[10px] text-neutral-500 font-medium leading-relaxed max-w-xs inline-block">
                  Shared passcode. Anyone on your team can use their credentials to gain access.
                </span>
              </div>
            </form>
          ) : (
            /* Stage 2: User Identity Label Form */
            <form onSubmit={submitLabel} className="space-y-6 text-left animate-[slideUp_0.35s_ease-out]">
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
                  Who is entering today?
                </label>
                <input
                  type="text"
                  autoFocus
                  value={userLabel}
                  onChange={(e) => setUserLabel(e.target.value)}
                  className="w-full bg-white/[0.04] hover:bg-white/[0.06] focus:bg-neutral-950/80 border border-white/[0.08] hover:border-white/[0.12] focus:border-neutral-500 rounded-xl px-4 py-3.5 text-base focus:outline-none transition duration-200 placeholder-neutral-600"
                  placeholder="e.g. Marcus — Design Lead"
                />
                <span className="block text-[10px] text-neutral-500 leading-normal pt-1">
                  Optional. Used solely for your team's monthly operational usage reports.
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={skipLabel}
                  className="flex-1 border border-white/[0.08] hover:border-white/[0.2] hover:bg-white/[0.02] text-neutral-300 rounded-xl py-3.5 text-xs font-semibold transition cursor-pointer select-none"
                >
                  Skip Identifier
                </button>
                <button
                  type="submit"
                  disabled={!userLabel.trim()}
                  className="flex-1 bg-neutral-100 hover:bg-white active:scale-[0.99] text-neutral-950 rounded-xl py-3.5 text-xs font-semibold disabled:opacity-40 transition-all cursor-pointer select-none shadow-md"
                >
                  Confirm & Enter
                </button>
              </div>
            </form>
          )}
        </div>
        
        {/* Subtle decorative absolute coordinates marker */}
        <div className="absolute -bottom-10 inset-x-0 text-center select-none opacity-40">
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-neutral-600">
            [ Lat: 37.7749 // Lng: -122.4194 ]
          </span>
        </div>
      </div>
    </div>
  );
}

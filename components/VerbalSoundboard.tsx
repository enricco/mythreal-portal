"use client";

import { useState } from "react";
import { logEvent } from "@/app/[slug]/actions";
import type { EnrichedClient, Session, VerbalContext, VerbalExample } from "@/lib/types";

type Props = {
  client: EnrichedClient;
  session: Session;
  showToast: (message: string, type: "success" | "info" | "error") => void;
};

const CONTEXTS: { id: VerbalContext; label: string }[] = [
  { id: "email", label: "Email" },
  { id: "headline", label: "Headline" },
  { id: "cta", label: "CTA" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "error", label: "Error / System UI" },
];

export function VerbalSoundboard({ client, session, showToast }: Props) {
  const [activeTab, setActiveTab] = useState<VerbalContext>("email");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const examples = client.verbal_examples || [];
  const filteredExamples = examples.filter((ex) => ex.context === activeTab);

  const handleCopy = (ex: VerbalExample) => {
    navigator.clipboard.writeText(ex.say_this);
    showToast("Copied verbal example!", "success");

    setCopiedId(ex.id);
    setTimeout(() => {
      setCopiedId(null);
    }, 1500);

    logEvent({
      clientId: client.id,
      userLabel: session.userLabel,
      eventType: "copied_tone_example",
      metadata: {
        context: ex.context,
        example_id: ex.id,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Context Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-neutral-200 pb-4">
        {CONTEXTS.map((tab) => {
          const isActive = activeTab === tab.id;
          const count = examples.filter((ex) => ex.context === tab.id).length;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-xs font-semibold tracking-wider uppercase rounded-lg border transition duration-200 cursor-pointer flex items-center gap-2 ${
                isActive
                  ? "bg-neutral-900 border-neutral-900 text-white shadow-sm"
                  : "bg-white border-neutral-200 text-neutral-500 hover:text-neutral-900 hover:border-neutral-300"
              }`}
            >
              {tab.label}
              <span
                className={`inline-flex items-center justify-center w-4 h-4 text-[9px] rounded-full font-bold ${
                  isActive ? "bg-neutral-800 text-neutral-300" : "bg-neutral-100 text-neutral-400"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Examples Grid */}
      {filteredExamples.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {filteredExamples.map((ex) => {
            const isJustCopied = copiedId === ex.id;

            return (
              <div
                key={ex.id}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch"
              >
                {/* Say This (Interactive Copy Card) */}
                <button
                  onClick={() => handleCopy(ex)}
                  title="Copy tone example (⌘C)"
                  className={`group relative text-left p-5 rounded-xl border flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer hover:-translate-y-0.5 ${
                    isJustCopied
                      ? "bg-emerald-50/70 border-emerald-400/80 shadow-emerald-100/50"
                      : "bg-white border-emerald-100 hover:border-emerald-300"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-700">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-700">
                        SAY THIS
                      </span>
                    </div>
                    <p className="text-sm font-medium text-neutral-800 font-serif leading-relaxed">
                      "{ex.say_this}"
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between w-full border-t border-emerald-100/40 pt-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-400 group-hover:text-emerald-700 transition">
                    <span className="font-mono text-[9px] uppercase text-neutral-400 group-hover:text-neutral-600">
                      Click to copy (⌘C)
                    </span>
                    <span className="flex items-center gap-1">
                      {isJustCopied ? (
                        <>
                          <svg
                            className="w-3.5 h-3.5 text-emerald-600 animate-bounce"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                            />
                          </svg>
                          Copy
                        </>
                      )}
                    </span>
                  </div>
                </button>

                {/* Don't Say This (Non-interactive) */}
                <div className="bg-neutral-50/60 border border-neutral-200/60 rounded-xl p-5 flex flex-col justify-start opacity-75">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-5 h-5 rounded-full bg-neutral-200 text-neutral-600">
                        <svg
                          className="w-2.5 h-2.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-500">
                        DON'T SAY THIS
                      </span>
                    </div>
                    <p className="text-sm text-neutral-500 italic leading-relaxed">
                      "{ex.dont_say_this}"
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="border border-dashed border-neutral-300 rounded-xl p-12 text-center text-neutral-400">
          No verbal examples defined for the "{CONTEXTS.find((c) => c.id === activeTab)?.label}" context.
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { logEvent } from "@/app/[slug]/actions";
import type { EnrichedClient, Session } from "@/lib/types";

type Props = {
  client: EnrichedClient;
  session: Session;
  showToast: (message: string, type: "success" | "info" | "error") => void;
};

export function DeveloperTokens({ client, session, showToast }: Props) {
  const [copied, setCopied] = useState(false);
  const tokenBlock = client.developer_tokens?.token_block || "";

  if (!tokenBlock.trim()) {
    return (
      <div className="border border-dashed border-neutral-300 rounded-3xl p-12 text-center text-neutral-400 bg-white">
        No developer token stylesheet block configured for this client.
      </div>
    );
  }

  function handleCopyAll() {
    navigator.clipboard.writeText(tokenBlock);
    setCopied(true);
    showToast("All developer tokens copied to clipboard!", "success");

    logEvent({
      clientId: client.id,
      userLabel: session.userLabel,
      eventType: "copied_token_block",
    });

    setTimeout(() => setCopied(false), 2000);
  }

  // Pure TypeScript premium regex syntax highlighter for CSS
  const renderHighlightedLine = (line: string, index: number) => {
    // 1. Comments
    if (line.trim().startsWith("/*") || line.trim().endsWith("*/")) {
      return (
        <span key={index} className="text-neutral-500 italic block">
          {line}
        </span>
      );
    }

    // 2. Selectors and brackets (e.g. :root {, })
    if (line.includes(":root") || line.trim() === "{" || line.trim() === "}") {
      const parts = line.split(/(:root|\{|\})/g);
      return (
        <span key={index} className="block text-neutral-100">
          {parts.map((p, i) => {
            if (p === ":root") {
              return <span key={i} className="text-sky-400 font-semibold">{p}</span>;
            }
            if (p === "{" || p === "}") {
              return <span key={i} className="text-neutral-400">{p}</span>;
            }
            return p;
          })}
        </span>
      );
    }

    // 3. Variable declarations:   --color-cream: #F4EFE6; /* primary */
    // Split into prefix, variable name, value, optional comment
    const match = line.match(/^(\s*)(--[a-zA-Z0-9_-]+)\s*:\s*([^;]+);(.*)$/);
    if (match) {
      const leadingSpaces = match[1];
      const varName = match[2];
      const val = match[3].trim();
      const tail = match[4]; // includes semicolon + optional comment

      // Detect hex code in value
      const hexMatch = val.match(/#[a-fA-F0-9]{3,8}/);
      const hexColor = hexMatch ? hexMatch[0] : null;

      // Detect if value is a string font name
      const isString = val.includes('"') || val.includes("'");

      return (
        <span key={index} className="block">
          <span className="text-neutral-500">{leadingSpaces}</span>
          <span className="text-emerald-400 font-medium">{varName}</span>
          <span className="text-neutral-400">: </span>
          <span className="inline-flex items-center">
            {hexColor && (
              <span
                className="w-2.5 h-2.5 rounded-full mr-1.5 border border-white/20 inline-block shrink-0 shadow-sm"
                style={{ backgroundColor: hexColor }}
              />
            )}
            <span className={hexColor ? "text-amber-300 font-semibold" : isString ? "text-rose-300" : "text-neutral-200"}>
              {val}
            </span>
          </span>
          <span className="text-neutral-400">;</span>
          {tail && (
            <span className="text-neutral-500 italic">
              {tail}
            </span>
          )}
        </span>
      );
    }

    // Default fallback line
    return (
      <span key={index} className="block text-neutral-300">
        {line}
      </span>
    );
  };

  const lines = tokenBlock.split("\n");

  return (
    <div className="bg-neutral-900 rounded-3xl overflow-hidden border border-neutral-850 shadow-xl relative group">
      {/* Premium IDE Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-neutral-950/80 border-b border-neutral-800 backdrop-blur-sm select-none">
        <div className="flex items-center gap-6">
          {/* OS Windows controls */}
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] block" />
            <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] block" />
            <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] block" />
          </div>
          {/* File Tab */}
          <div className="flex items-center gap-2 px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-neutral-300 font-medium">
            <svg className="w-3.5 h-3.5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            variables.css
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block ml-1.5 animate-pulse" />
          </div>
        </div>

        {/* Copy All Button */}
        <button
          onClick={handleCopyAll}
          title="Copy all tokens (⌘C)"
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide border cursor-pointer transition duration-300 ${
            copied
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-white/10 hover:bg-white/20 border-white/10 hover:border-white/20 text-neutral-200 hover:text-white"
          }`}
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              Copy all tokens
            </>
          )}
        </button>
      </div>

      {/* Editor Content Area */}
      <div className="flex font-mono text-sm leading-relaxed p-6 overflow-x-auto select-text min-h-[220px]">
        {/* Line Numbers Column */}
        <div className="w-10 shrink-0 text-right pr-4 text-neutral-600 select-none border-r border-neutral-800/60 pb-1">
          {lines.map((_, i) => (
            <span key={i} className="block text-[11px] font-semibold leading-[24px]">
              {i + 1}
            </span>
          ))}
        </div>

        {/* Highlighted Code Column */}
        <div className="flex-1 pl-6 overflow-x-auto whitespace-pre pb-1 text-left">
          {lines.map((line, index) => (
            <div key={index} className="min-h-[24px] flex items-center leading-[24px]">
              {renderHighlightedLine(line, index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

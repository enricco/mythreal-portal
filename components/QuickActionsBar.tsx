"use client";

import { useState } from "react";
import JSZip from "jszip";
import { logEvent } from "@/app/[slug]/actions";
import type { EnrichedClient, Session } from "@/lib/types";

type Props = {
  client: EnrichedClient;
  session: Session;
  showToast: (message: string, type: "success" | "info" | "error") => void;
};

export function QuickActionsBar({ client, session, showToast }: Props) {
  const [zipping, setZipping] = useState(false);

  const colors = client.brand_colors || [];
  const logos = client.logos || [];
  const primaryColor = colors.find((c) => c.role === "primary") || colors[0];

  // 1. Copy Primary Color
  function handleCopyPrimaryColor() {
    if (!primaryColor) {
      showToast("No brand colors defined for this client.", "error");
      return;
    }

    navigator.clipboard.writeText(primaryColor.hex);
    showToast(`Copied Primary Color: ${primaryColor.name} (${primaryColor.hex})`, "success");

    logEvent({
      clientId: client.id,
      userLabel: session.userLabel,
      eventType: "copied_color",
      metadata: {
        color_name: primaryColor.name,
        format: "hex",
        is_quick_action: true,
      },
    });
  }

  // 2. Download Logo Pack (Zips on-the-fly)
  async function handleDownloadLogoPack() {
    if (logos.length === 0) {
      showToast("No logos uploaded for this client yet.", "info");
      return;
    }

    setZipping(true);
    showToast("Preparing your logo pack... Please wait.", "info");

    try {
      const zip = new JSZip();
      const folder = zip.folder(`${client.slug}-logos`);

      const downloadPromises = logos.map(async (logo) => {
        const url = logo.signedUrl || logo.storage_url;
        try {
          const res = await fetch(url);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const blob = await res.blob();
          
          // E.g., primary-logo.svg
          const ext = logo.format === "svg" ? "svg" : "png";
          const fileName = `${logo.variant}-logo.${ext}`;
          
          if (folder) {
            folder.file(fileName, blob);
          } else {
            zip.file(fileName, blob);
          }
        } catch (err) {
          console.error(`Failed to fetch logo variant ${logo.variant} from ${url}`, err);
        }
      });

      await Promise.all(downloadPromises);

      const content = await zip.generateAsync({ type: "blob" });
      const downloadUrl = URL.createObjectURL(content);

      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `${client.slug}-logos.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);

      showToast("Logo pack downloaded successfully!", "success");

      logEvent({
        clientId: client.id,
        userLabel: session.userLabel,
        eventType: "downloaded_logo",
        metadata: {
          variant: "all_pack",
          format: "zip",
        },
      });
    } catch (error: any) {
      showToast("Failed to generate logo pack. Please try again.", "error");
      console.error("[jszip] failed to generate pack", error);
    } finally {
      setZipping(false);
    }
  }

  // 3. Copy CSS variables
  function handleCopyCssVariables() {
    const tokenBlock = client.developer_tokens?.token_block;

    if (tokenBlock && tokenBlock.trim()) {
      navigator.clipboard.writeText(tokenBlock);
      showToast("Developer CSS tokens copied to clipboard!", "success");

      logEvent({
        clientId: client.id,
        userLabel: session.userLabel,
        eventType: "copied_token_block",
        metadata: {
          is_quick_action: true,
        },
      });
      return;
    }

    // Fallback if token block is missing
    if (colors.length === 0) {
      showToast("No developer tokens or brand colors defined to generate CSS variables.", "error");
      return;
    }

    const cssContent = `:root {
${colors
  .map(
    (c) =>
      `  --color-${c.name.toLowerCase().replace(/\s+/g, "-")}: ${c.hex}; /* ${c.role} */`
  )
  .join("\n")}
}`;

    navigator.clipboard.writeText(cssContent);
    showToast("Dynamic CSS Variables copied to clipboard!", "success");

    logEvent({
      clientId: client.id,
      userLabel: session.userLabel,
      eventType: "copied_css",
      metadata: {
        generated_count: colors.length,
        is_quick_action: true,
      },
    });
  }

  // 4. Copy Brand Bio
  function handleCopyBrandBio() {
    if (!client.brand_bio || !client.brand_bio.trim()) {
      showToast("No brand bio configured for this client.", "info");
      return;
    }

    navigator.clipboard.writeText(client.brand_bio.trim());
    showToast("Brand bio copied to clipboard!", "success");

    logEvent({
      clientId: client.id,
      userLabel: session.userLabel,
      eventType: "copied_brand_bio",
    });
  }

  return (
    <div className="sticky top-0 z-30 w-full bg-white/70 backdrop-blur-md border-b border-neutral-200/80 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-sm">
        <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">
          Quick Actions
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {/* Action 1: Copy Primary Color */}
          <button
            onClick={handleCopyPrimaryColor}
            disabled={!primaryColor}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-neutral-200 hover:border-neutral-800 bg-white text-neutral-800 hover:text-black font-medium transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span
              className="w-2.5 h-2.5 rounded-full border border-neutral-300 inline-block"
              style={{ backgroundColor: primaryColor?.hex || "#ccc" }}
            />
            Copy primary color
          </button>

          {/* Action 2: Download Logo Pack */}
          <button
            onClick={handleDownloadLogoPack}
            disabled={zipping || logos.length === 0}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-neutral-200 hover:border-neutral-800 bg-white text-neutral-800 hover:text-black font-medium transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg
              className={`w-3.5 h-3.5 ${zipping ? "animate-spin" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {zipping ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              )}
            </svg>
            {zipping ? "Creating ZIP..." : "Download logo pack"}
          </button>

          {/* Action 3: Copy CSS Variables */}
          <button
            onClick={handleCopyCssVariables}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-neutral-200 hover:border-neutral-800 bg-white text-neutral-800 hover:text-black font-medium transition cursor-pointer"
          >
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
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
            Copy CSS variables
          </button>

          {/* Action 4: Copy Brand Bio */}
          <button
            onClick={handleCopyBrandBio}
            disabled={!client.brand_bio}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-neutral-200 hover:border-neutral-800 bg-white text-neutral-800 hover:text-black font-medium transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Copy brand bio
          </button>
        </div>
      </div>
    </div>
  );
}

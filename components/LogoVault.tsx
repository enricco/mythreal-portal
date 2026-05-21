"use client";

import { useState } from "react";
import JSZip from "jszip";
import { logEvent } from "@/app/[slug]/actions";
import type { EnrichedClient, Session, Logo } from "@/lib/types";

type Props = {
  client: EnrichedClient;
  session: Session;
  showToast: (message: string, type: "success" | "info" | "error") => void;
};

const VARIANT_LABELS = {
  primary: "Primary Brand Logo",
  reversed: "Reversed Logo (Light on Dark)",
  mono: "Monochrome Logo",
  icon: "Brand Icon / Mark",
  favicon: "Favicon / App Icon",
} as const;

export function LogoVault({ client, session, showToast }: Props) {
  const [zipping, setZipping] = useState(false);
  const logos = client.logos || [];

  // Group logos by variant
  const grouped = logos.reduce((acc, logo) => {
    if (!acc[logo.variant]) {
      acc[logo.variant] = [];
    }
    acc[logo.variant].push(logo);
    return acc;
  }, {} as Record<string, Logo[]>);

  const variants = Object.keys(grouped) as Array<keyof typeof VARIANT_LABELS>;

  // Download All
  async function handleDownloadAll() {
    if (logos.length === 0) {
      showToast("No logos uploaded for this client yet.", "info");
      return;
    }

    setZipping(true);
    showToast("Compiling zip file... Please wait.", "info");

    try {
      const zip = new JSZip();
      const folder = zip.folder(`${client.slug}-logos`);

      const downloadPromises = logos.map(async (logo) => {
        const url = logo.signedUrl || logo.storage_url;
        try {
          const res = await fetch(url);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const blob = await res.blob();
          
          const ext = logo.format === "svg" ? "svg" : "png";
          const fileName = `${logo.variant}-logo.${ext}`;
          
          if (folder) {
            folder.file(fileName, blob);
          } else {
            zip.file(fileName, blob);
          }
        } catch (err) {
          console.error(`Failed to fetch logo ${logo.variant} from ${url}`, err);
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

      showToast("Logo archive downloaded successfully!", "success");

      logEvent({
        clientId: client.id,
        userLabel: session.userLabel,
        eventType: "downloaded_logo",
        metadata: {
          variant: "all_pack",
          format: "zip",
          source: "logo_vault",
        },
      });
    } catch (error) {
      showToast("Could not download logo archive.", "error");
      console.error(error);
    } finally {
      setZipping(false);
    }
  }

  // Single file download helper
  const handleSingleDownload = (logo: Logo) => {
    // We log the download event
    logEvent({
      clientId: client.id,
      userLabel: session.userLabel,
      eventType: "downloaded_logo",
      metadata: {
        variant: logo.variant,
        format: logo.format,
      },
    });

    showToast(`Downloading ${logo.variant} logo (${logo.format.toUpperCase()})`, "success");
  };

  if (logos.length === 0) {
    return (
      <div className="border border-dashed border-neutral-300 rounded-xl p-12 text-center text-neutral-400">
        No logos have been uploaded to this portal yet.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-neutral-50 border border-neutral-200/60 p-4 rounded-xl">
        <div>
          <h3 className="font-semibold text-neutral-800 text-sm">
            Asset Exports ({logos.length} files available)
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Vector SVGs for print/web layouts, optimized transparent PNGs for presentations.
          </p>
        </div>

        <button
          onClick={handleDownloadAll}
          disabled={zipping}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 disabled:hover:bg-neutral-900 text-white rounded-lg text-xs font-semibold tracking-wide transition shadow cursor-pointer"
        >
          <svg
            className={`w-4 h-4 ${zipping ? "animate-spin" : ""}`}
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
          {zipping ? "Generating ZIP..." : "Download Logo Pack (.zip)"}
        </button>
      </div>

      {/* Grid of Variants */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {variants.map((variant) => {
          const groupLogos = grouped[variant];
          if (!groupLogos || groupLogos.length === 0) return null;

          // Select preview file (prefer SVG for crispness, fallback to PNG)
          const previewFile = groupLogos.find((l) => l.format === "svg") || groupLogos[0];
          const isReversed = variant === "reversed";
          const previewUrl = previewFile.signedUrl || previewFile.storage_url;

          return (
            <div
              key={variant}
              className="bg-white rounded-xl border border-neutral-200/60 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-72"
            >
              {/* Preview Swatch Area */}
              <div
                className={`relative flex items-center justify-center p-6 h-48 border-b border-neutral-100 flex-shrink-0 select-none overflow-hidden ${
                  isReversed ? "bg-checkerboard-dark" : "bg-checkerboard-light"
                }`}
              >
                {/* Logo Image Preview */}
                <div className="relative w-full h-full flex items-center justify-center max-w-[80%] max-h-[80%] transition-transform duration-300 hover:scale-105">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt={`${client.name} ${variant} logo preview`}
                    className="object-contain max-w-full max-h-full"
                    style={{
                      filter: isReversed
                        ? "drop-shadow(0 2px 8px rgba(0,0,0,0.5))"
                        : "drop-shadow(0 1px 2px rgba(0,0,0,0.03))",
                    }}
                    onError={(e) => {
                      // fallback UI if image fails to render
                      e.currentTarget.style.display = "none";
                      const p = e.currentTarget.parentElement;
                      if (p) {
                        const errorNode = document.createElement("div");
                        errorNode.className = "text-xs font-mono text-neutral-400";
                        errorNode.innerText = `${variant} preview`;
                        p.appendChild(errorNode);
                      }
                    }}
                  />
                </div>
              </div>

              {/* Logo Specifications & Direct Download Actions */}
              <div className="p-4 flex-grow flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <h4 className="font-semibold text-neutral-800 text-sm">
                    {VARIANT_LABELS[variant] || variant}
                  </h4>
                  <div className="flex items-center gap-1.5 pt-0.5">
                    {groupLogos.map((logo) => (
                      <span
                        key={logo.id}
                        className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-neutral-100 text-neutral-500 border border-neutral-200/40"
                      >
                        {logo.format}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Individual Download Buttons */}
                <div className="flex items-center gap-2">
                  {groupLogos.map((logo) => {
                    const dlUrl = logo.signedUrl || logo.storage_url;
                    return (
                      <a
                        key={logo.id}
                        href={dlUrl}
                        download={`${client.slug}-${logo.variant}.${logo.format}`}
                        onClick={() => handleSingleDownload(logo)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-neutral-200 hover:border-neutral-800 rounded-lg text-xs font-semibold text-neutral-700 hover:text-black bg-white transition cursor-pointer select-none"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                        {logo.format.toUpperCase()}
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

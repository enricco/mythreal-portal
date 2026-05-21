import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070708] text-neutral-100 p-6 relative overflow-hidden font-sans">
      {/* Premium ambient mesh gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0 opacity-30">
        <div className="absolute -top-[30%] -right-[20%] w-[90%] h-[90%] rounded-full bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.18)_0%,transparent_60%)] filter blur-3xl animate-[driftBlob_25s_ease-in-out_infinite]" />
        <div className="absolute -bottom-[30%] -left-[20%] w-[90%] h-[90%] rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15)_0%,transparent_60%)] filter blur-3xl animate-[driftBlob_20s_ease-in-out_infinite]" />
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes driftBlob {
            0%, 100% { transform: translate(0px, 0px) scale(1); }
            50% { transform: translate(30px, -20px) scale(1.05); }
          }
        `
      }} />

      {/* Glassmorphic Dead-End Card */}
      <div className="w-full max-w-md z-10 relative">
        <div className="bg-neutral-950/45 backdrop-blur-2xl border border-white/[0.07] rounded-3xl p-8 sm:p-10 shadow-[0_24px_80px_rgba(0,0,0,0.7)] text-center relative overflow-hidden">
          
          {/* Subtle top indicator border */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/25 to-transparent" />
          
          {/* Broken coordinates logo graphic */}
          <div className="mb-8 flex justify-center">
            <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-red-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {/* Pulsing error rings */}
              <span className="absolute inset-0 rounded-2xl border border-red-500/20 animate-ping opacity-60" style={{ animationDuration: "3s" }} />
            </div>
          </div>

          <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-red-400 font-bold bg-red-950/30 border border-red-900/30 px-3 py-1 rounded-full inline-block mb-3 select-none">
            Error Code // 404
          </p>

          <h1 className="text-2xl font-semibold tracking-tight text-white mb-3 font-serif">
            Portal Coordinates Lost
          </h1>
          
          <p className="text-xs text-neutral-400 leading-relaxed mb-8 max-w-sm mx-auto font-medium">
            This brand space doesn't exist, is temporarily locked for maintenance, or the slug in the URL is misspelled.
          </p>

          <Link
            href="/"
            className="w-full bg-neutral-100 hover:bg-white active:scale-[0.99] text-neutral-950 rounded-xl py-3.5 text-xs font-semibold shadow-md transition-all duration-200 inline-flex items-center justify-center gap-2 select-none cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Return to Gateway
          </Link>

          <div className="w-full h-[1px] bg-white/[0.05] my-6" />

          <p className="text-[10px] text-neutral-500 font-medium">
            Need access? Contact support at <span className="text-neutral-450 font-semibold">studio@mythreal.co</span>
          </p>
        </div>

        {/* Decorative absolute border anchor */}
        <div className="absolute -bottom-10 inset-x-0 text-center select-none opacity-40">
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-neutral-600">
            [ Portal Offline // Null Address ]
          </span>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-neutral-100 p-6">
      <div className="max-w-md text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-3">
          Mythreal
        </p>
        <h1 className="text-3xl font-medium mb-3">Portal not found</h1>
        <p className="text-neutral-400 mb-8">
          This portal doesn&apos;t exist, or the URL is mistyped.
        </p>
        <Link
          href="/"
          className="inline-block border border-neutral-800 hover:border-neutral-700 rounded-md px-5 py-2 text-sm text-neutral-300 transition"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}

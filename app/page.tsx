export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-neutral-100 p-6">
      <div className="max-w-lg text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-4">
          Mythreal
        </p>
        <h1 className="text-3xl font-medium mb-3">Operational Brand System</h1>
        <p className="text-neutral-400">
          Each client gets a private portal at{" "}
          <code className="text-neutral-200">
            portal.mythreal.studio/[your-slug]
          </code>
          .
        </p>
      </div>
    </div>
  );
}

import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { PortalGate } from "@/components/PortalGate";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const { data } = await supabaseServer
    .from("clients")
    .select("name")
    .eq("slug", slug)
    .maybeSingle();
  if (!data) return { title: "Mythreal" };
  return { title: `${data.name} · Mythreal` };
}

export default async function PortalPage({ params }: { params: Params }) {
  const { slug } = await params;

  const { data: client, error } = await supabaseServer
    .from("clients")
    .select("id, slug, name")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !client) {
    notFound();
  }

  return <PortalGate client={client} />;
}

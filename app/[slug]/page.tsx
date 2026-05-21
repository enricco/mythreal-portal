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
    .select(`
      id,
      slug,
      name,
      passcode,
      brand_bio,
      created_at,
      brand_colors (
        id,
        client_id,
        name,
        hex,
        rgb,
        hsl,
        role,
        sort_order
      ),
      logos (
        id,
        client_id,
        variant,
        format,
        storage_url
      ),
      brand_fonts (
        id,
        client_id,
        role,
        family,
        weights,
        css_import_url,
        storage_url
      ),
      developer_tokens (
        id,
        client_id,
        token_block
      )
    `)
    .eq("slug", slug)
    .maybeSingle();

  if (error || !client) {
    notFound();
  }

  // Sort colors by sort_order
  const colors = (client.brand_colors || []).sort(
    (a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0)
  );

  // Generate signed storage URLs for logos with a public URL fallback
  let enrichedLogos = client.logos || [];
  if (enrichedLogos.length > 0) {
    const paths = enrichedLogos.map((l: any) => l.storage_url);
    const { data: signedUrls, error: signError } = await supabaseServer
      .storage
      .from("logos")
      .createSignedUrls(paths, 86400); // 24 hours expiry

    if (!signError && signedUrls) {
      enrichedLogos = enrichedLogos.map((l: any) => {
        const signedInfo = signedUrls.find((su) => su.path === l.storage_url);
        return {
          ...l,
          signedUrl: signedInfo?.signedUrl || undefined,
        };
      });
    } else {
      console.warn("[storage] failed to sign URLs, using public URLs as fallback", signError);
      enrichedLogos = enrichedLogos.map((l: any) => ({
        ...l,
        signedUrl: supabaseServer.storage.from("logos").getPublicUrl(l.storage_url).data.publicUrl,
      }));
    }
  }

  const enrichedClient = {
    ...client,
    brand_colors: colors,
    logos: enrichedLogos,
    brand_fonts: client.brand_fonts || [],
    developer_tokens: (client.developer_tokens && client.developer_tokens[0]) || null,
  };

  return <PortalGate client={enrichedClient} />;
}

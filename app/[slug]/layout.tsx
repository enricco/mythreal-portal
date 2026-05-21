import { supabaseServer } from "@/lib/supabase/server";

type Params = Promise<{ slug: string }>;

export default async function ClientPortalLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Params;
}) {
  const { slug } = await params;

  const { data: client } = await supabaseServer
    .from("clients")
    .select(`
      id,
      brand_fonts (
        id,
        role,
        family,
        weights,
        css_import_url,
        storage_url
      )
    `)
    .eq("slug", slug)
    .maybeSingle();

  const fonts = client?.brand_fonts || [];

  return (
    <>
      {fonts.length > 0 && (
        <>
          {fonts.map((font) => {
            if (font.css_import_url) {
              return (
                <link
                  key={font.id}
                  rel="stylesheet"
                  href={font.css_import_url}
                />
              );
            }
            return null;
          })}

          {fonts.some((font) => font.storage_url) && (
            <style
              dangerouslySetInnerHTML={{
                __html: fonts
                  .filter((font) => font.storage_url)
                  .map((font) => {
                    const url = font.storage_url!.startsWith("http")
                      ? font.storage_url
                      : supabaseServer.storage.from("fonts").getPublicUrl(font.storage_url!).data.publicUrl;

                    const weights = font.weights && font.weights.length > 0 ? font.weights : [400];
                    return weights
                      .map((w: any) => `
                        @font-face {
                          font-family: '${font.family}';
                          src: url('${url}') format('woff2');
                          font-weight: ${w};
                          font-style: normal;
                          font-display: swap;
                        }
                      `)
                      .join("\n");
                  })
                  .join("\n")
              }}
            />
          )}
        </>
      )}
      {children}
    </>
  );
}

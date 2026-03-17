import { seoConfig } from "@/config/seo";

interface JsonLdProps {
    path: string;
}

export function JsonLd({ path }: JsonLdProps) {
    const config = seoConfig[path];
    if (!config?.jsonLd) return null;

  return (
        <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                          __html: JSON.stringify(config.jsonLd),
                }}
              />
      );
}

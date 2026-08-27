import { profile } from "@/lib/content";
import { siteDescription, siteTitle, siteUrl } from "@/lib/site";

export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: profile.name,
        jobTitle: profile.role,
        email: profile.email,
        telephone: profile.phone,
        url: siteUrl,
        sameAs: [profile.github, profile.linkedin, profile.instagram, profile.x],
        address: {
          "@type": "PostalAddress",
          addressLocality: profile.city,
          addressCountry: "SE",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#site`,
        name: siteTitle,
        url: siteUrl,
        description: siteDescription,
        author: { "@id": `${siteUrl}/#person` },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

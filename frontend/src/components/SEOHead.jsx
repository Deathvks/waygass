import { useEffect } from "react";

export default function SEOHead({
  title,
  description,
  canonical,
  image = "https://waygass.es/logo.png",
  type = "website",
  publishedTime,
  modifiedTime,
  author = "Equipo Editorial de WayGass",
  breadcrumbs = [],
  extraSchemas = []
}) {
  useEffect(() => {
    if (title) document.title = title;

    const setMeta = (name, content, isProperty = false) => {
      const attr = isProperty ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    if (description) setMeta("description", description);

    if (canonical) {
      let canonicalEl = document.querySelector('link[rel="canonical"]');
      if (!canonicalEl) {
        canonicalEl = document.createElement("link");
        canonicalEl.setAttribute("rel", "canonical");
        document.head.appendChild(canonicalEl);
      }
      canonicalEl.setAttribute("href", canonical);
    }

    if (title) setMeta("og:title", title, true);
    if (description) setMeta("og:description", description, true);
    if (canonical) setMeta("og:url", canonical, true);
    setMeta("og:type", type, true);
    if (image) setMeta("og:image", image, true);

    setMeta("twitter:card", "summary_large_image");
    if (title) setMeta("twitter:title", title);
    if (description) setMeta("twitter:description", description);
    if (image) setMeta("twitter:image", image);

    const scriptId = "seo-structured-data";
    let scriptEl = document.getElementById(scriptId);
    if (!scriptEl) {
      scriptEl = document.createElement("script");
      scriptEl.id = scriptId;
      scriptEl.type = "application/ld+json";
      document.head.appendChild(scriptEl);
    }

    const schemas = [];

    if (type === "article") {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        headline: title,
        description: description,
        image: [image],
        datePublished: publishedTime || "2026-09-20T08:00:00+02:00",
        dateModified: modifiedTime || publishedTime || "2026-09-20T08:00:00+02:00",
        author: [{
          "@type": "Organization",
          name: author,
          url: "https://waygass.es"
        }],
        publisher: {
          "@type": "Organization",
          name: "WayGass",
          logo: {
            "@type": "ImageObject",
            url: "https://waygass.es/logo.png"
          }
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": canonical || window.location.href
        }
      });
    }

    if (breadcrumbs && breadcrumbs.length > 0) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((crumb, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: crumb.name,
          item: crumb.url
        }))
      });
    }

    if (Array.isArray(extraSchemas) && extraSchemas.length > 0) {
      extraSchemas.forEach(s => {
        if (s) schemas.push(s);
      });
    }

    if (schemas.length > 0) {
      scriptEl.textContent = JSON.stringify(schemas.length === 1 ? schemas[0] : schemas);
    }

    window.scrollTo(0, 0);
  }, [title, description, canonical, image, type, publishedTime, modifiedTime, author, breadcrumbs, JSON.stringify(extraSchemas)]);

  return null;
}

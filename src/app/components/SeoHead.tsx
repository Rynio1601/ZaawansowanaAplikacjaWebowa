// src/app/components/SeoHead.tsx
import { seoConfig, SeoPageKey } from '../seo/seoConfig';

interface SeoHeadProps {
  pageKey?: SeoPageKey;
  title?: string;
  description?: string;
  pathname?: string;
  ogImage?: string;
  noIndex?: boolean;
}

export function SeoHead({ 
  pageKey,
  title: customTitle,
  description: customDescription,
  pathname: customPathname,
  ogImage: customOgImage,
  noIndex = false
}: SeoHeadProps) {
  // Użyj danych z konfiguracji lub wartości niestandardowych
  const pageData = pageKey ? seoConfig.pages[pageKey] : null;
  
  const title = customTitle || (pageData ? pageData.title : seoConfig.siteTitle);
  const description = customDescription || (pageData ? pageData.description : seoConfig.siteDescription);
  const pathname = customPathname || (pageData ? pageData.pathname : '');
  const ogImage = customOgImage || (pageData ? pageData.ogImage : '/og-default.png');
  
  const fullTitle = title.includes(seoConfig.siteTitle) ? title : `${title} | ${seoConfig.siteTitle}`;
  const url = `${seoConfig.siteUrl}${pathname}`;
  const image = ogImage.startsWith('http') ? ogImage : `${seoConfig.siteUrl}${ogImage}`;

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={seoConfig.siteName} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Canonical */}
      <link rel="canonical" href={url} />
      
      {/* No Index */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Favicon - nowa metoda SVG */}
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    </>
  );
}

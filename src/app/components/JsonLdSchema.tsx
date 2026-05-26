// src/app/components/JsonLdSchema.tsx
export function JsonLdSchema() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "TrainerPro",
    "url": "https://trainerpro.pl",
    "logo": "https://trainerpro.pl/favicon-512.png",
    "description": "Aplikacja SaaS dla trenerów personalnych do zarządzania klientami, planami treningowymi, płatnościami i komunikacją.",
    "sameAs": [
      // Social media links - do uzupełnienia
    ]
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "TrainerPro",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "description": "Wszystko, czego potrzebuje trener personalny – w jednym systemie",
    "offers": {
      "@type": "Offer",
      "price": "79",
      "priceCurrency": "PLN",
      "description": "Plan Basic od 79 zł miesięcznie"
    },
    "featureList": [
      "Zarządzanie klientami",
      "Kreator planów treningowych",
      "Monitoring postępów",
      "Automatyczne płatności",
      "Raporty biznesowe",
      "Grafik i rezerwacje"
    ]
  };

  return (
    <>
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} 
      />
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} 
      />
    </>
  );
}

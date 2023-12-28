import React from "react";
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  type DocumentContext,
} from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return {
      ...initialProps,
      styles: React.Children.toArray([initialProps.styles]),
    };
  }

  render() {
    return (
      <Html lang="sv">
        <Head>
          <meta
            name="title"
            content="Matminnet Receptbyggare - Dela dina kulinariska skapelser"
          />
          <meta
            name="description"
            content="Matminnet - din plats för kulinarisk kreativitet! Skapa, dela och organisera dina unika recept med vårt moderna Receptbokslagringssystem."
          />

          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://matminne.com" />
          <meta
            property="og:title"
            content="Matminnet Receptbyggare - Dela dina kulinariska skapelser"
          />
          <meta
            property="og:description"
            content="Matminnet - din plats för kulinarisk kreativitet! Skapa, dela och organisera dina unika recept med vårt moderna Receptbokslagringssystem."
          />
          <meta
            property="og:image"
            content="https://www.matminnet.se/hero-preview.png"
          />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:url" content="https://www.matminnet.se" />
          <meta
            name="twitter:title"
            content="Matminnet Receptbyggare - Dela dina kulinariska skapelser"
          />
          <meta
            name="twitter:description"
            content="Matminnet - din plats för kulinarisk kreativitet! Skapa, dela och organisera dina unika recept med vårt moderna Receptbokslagringssystem."
          />
          <meta
            name="twitter:image"
            content="https://www.matminnet.se/hero-preview.png"
          />

          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" href="/icon.png" />

          <meta name="robots" content="index, follow" />
          <meta name="author" content="Filip Johansson" />

          <meta
            name="keywords"
            content="vad ska vi äta?, matlagning, recept, mat, tips, matlagningsråd, spara recept, kokbok, mat idag?"
          />
          <meta name="application-name" content="Receptlagring" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="apple-mobile-web-app-title" content="Receptlagring" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="msapplication-TileColor" content="#FFFFFF" />
          <meta name="msapplication-tap-highlight" content="no" />
          <meta name="theme-color" content="#FFFFFF" />

          <meta property="og:type" content="website" />
          <meta property="og:title" content="Receptapplikation" />
          <meta
            property="og:description"
            content="Skapa och spara läckra recept med vår Receptapplikation. Hitta olika recept och matlagningsråd för att förbättra dina kulinariska färdigheter."
          />
          <meta property="og:site_name" content="Receptapplikation" />
          <meta property="og:url" content="https://www.matminnet.se" />
          <meta
            property="og:image"
            content="https://www.matminnet.se/icons/icon-512x512.png"
          />
        </Head>
        <body className="h-full overflow-y-scroll">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;

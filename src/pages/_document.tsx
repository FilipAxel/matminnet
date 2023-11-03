/* eslint-disable @next/next/no-title-in-document-head */
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
      <Html lang="en">
        <Head>
          <title>
            Matminnet Recipe Builder - Share Your Culinary Creations
          </title>
          <meta
            name="title"
            content="Matminnet Recipe Builder - Share Your Culinary Creations"
          />
          <meta
            name="description"
            content="Matminnet Recipe Builder - Unleash Your Culinary Creativity! Design, craft, and share your unique recipes effortlessly. Say goodbye to that old recipe book and hello to a modern way of keeping your culinary creations organized. Share your passion for cooking with the world!"
          />

          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://matminne.com" />
          <meta
            property="og:title"
            content="Matminnet Recipe Builder - Share Your Culinary Creations"
          />
          <meta
            property="og:description"
            content="Matminnet Recipe Builder - Unleash Your Culinary Creativity! Design, craft, and share your unique recipes effortlessly. Say goodbye to that old recipe book and hello to a modern way of keeping your culinary creations organized. Share your passion for cooking with the world!"
          />
          <meta
            property="og:image"
            content="https://metatags.io/images/meta-tags.png"
          />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:url" content="https://matminne.com" />
          <meta
            name="twitter:title"
            content="Matminnet Recipe Builder - Share Your Culinary Creations"
          />
          <meta
            name="twitter:description"
            content="Matminnet Recipe Builder - Unleash Your Culinary Creativity! Design, craft, and share your unique recipes effortlessly. Say goodbye to that old recipe book and hello to a modern way of keeping your culinary creations organized. Share your passion for cooking with the world!"
          />
          <meta
            name="twitter:image"
            content="https://metatags.io/images/meta-tags.png"
          />

          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" href="/icon.png" />

          <meta name="robots" content="index, follow" />
          <meta name="author" content="Filip Johansson" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1"
          />

          <meta
            name="keywords"
            content="recipe application, cooking, recipes, food, culinary, cooking tips"
          />
          <meta name="application-name" content="Recipe Application" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta
            name="apple-mobile-web-app-title"
            content="Recipe Application"
          />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta
            name="msapplication-config"
            content="/icons/browserconfig.xml"
          />
          <meta name="msapplication-TileColor" content="#FFFFFF" />
          <meta name="msapplication-tap-highlight" content="no" />
          <meta name="theme-color" content="#FFFFFF" />

          <meta property="og:type" content="website" />
          <meta property="og:title" content="Recipe Application" />
          <meta
            property="og:description"
            content="Create and store delicious recipes with our Recipe Application. Find a variety of recipes and cooking tips to enhance your culinary skills."
          />
          <meta property="og:site_name" content="Recipe Application" />
          <meta property="og:url" content="https://matminnet.vercel.app" />
          <meta
            property="og:image"
            content="https://matminnet.vercel.app/icons/apple-touch-icon.png"
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

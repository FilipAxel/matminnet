/* eslint-disable @next/next/no-title-in-document-head */
import React from "react";
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  type DocumentContext,
} from "next/document";
import { CssBaseline } from "@nextui-org/react";

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
          {CssBaseline.flush()}
          <link rel="manifest" href="../../public/manifest/manifest.json" />
          <link rel="apple-touch-icon" href="../icon.png"></link>
          <title>Matminne</title>
          <meta name="robots" content="index, follow" />
          <meta name="author" content="Filip Johansson" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <meta
            name="description"
            content="Create and store delicious recipes with our Recipe Application. Find a variety of recipes and cooking tips to enhance your culinary skills."
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
          <meta name="msapplication-TileColor" content="#2B5797" />
          <meta name="msapplication-tap-highlight" content="no" />
          <meta name="theme-color" content="#9FC4E7" />

          <meta property="og:type" content="website" />
          <meta property="og:title" content="Recipe Application" />
          <meta
            property="og:description"
            content="Create and store delicious recipes with our Recipe Application. Find a variety of recipes and cooking tips to enhance your culinary skills."
          />
          <meta property="og:site_name" content="Recipe Application" />
          <meta property="og:url" content="https://matminne.com" />
          <meta
            property="og:image"
            content="https://matminne.com/icons/apple-touch-icon.png"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;

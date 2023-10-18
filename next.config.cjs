// eslint-disable-next-line @typescript-eslint/no-var-requires
const withPWA = require("next-pwa")({
  dest: "discover",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

module.exports = (phase, { defaultConfig }) => {
  /**
   * @type {import('next').NextConfig}
   */
  const nextConfig = {
    // Add your PWA configuration here
    pwa: {
      dest: "discover",
      register: true,
      skipWaiting: true,
      disable: process.env.NODE_ENV === "development",
    },
    // next.js config
    i18n: {
      locales: ["en"],
      defaultLocale: "en",
    },
    images: {
      domains: [process.env.NEXT_PUBLIC_CLOUDFRONT_URL || ""],
      remotePatterns: [
        {
          protocol: "https",
          hostname: process.env.NEXT_PUBLIC_CLOUDFRONT_URL || "",
          port: "",
          pathname: "/**",
        },
      ],
    },
  };
  // Merge the nextConfig with the withPWA configuration
  return withPWA(nextConfig);
};

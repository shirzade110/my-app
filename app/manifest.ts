// app/manifest.ts
import type { MetadataRoute } from "next";

const manifest: MetadataRoute.Manifest = {
  name: "Crypto Prices App",
  short_name: "CryptoApp",
  description: "Track cryptocurrency prices",
  start_url: "/",
  display: "standalone",
  background_color: "#ffffff",
  theme_color: "#facc15",
  icons: [
    { src: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    { src: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
  ],
};

export default manifest;

import path from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    // Avoids Next.js picking up the unrelated package-lock.json in the
    // user's home directory when resolving the workspace root.
    root: path.resolve(import.meta.dirname),
  },
};

export default nextConfig;

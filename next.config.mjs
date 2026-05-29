import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const projectRoot = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
  reactCompiler: true,
  // Pin the workspace root to this project. Without this, Next infers the root
  // from the nearest lockfile and picks the stray ~/package-lock.json, which
  // breaks module resolution (tailwindcss) and CSS compilation.
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;

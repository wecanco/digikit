import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const appDirectory = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // کیت به‌صورت سورس TS + CSS Modules شیپ می‌شود — Next خودش ترنسپایل می‌کند
  transpilePackages: ['@digikit/ui'],
  turbopack: {
    root: resolve(appDirectory, '../..'),
  },
};

export default nextConfig;

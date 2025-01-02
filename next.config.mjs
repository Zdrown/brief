/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true, // Enables styled-components support via SWC
  },
  eslint: {
    ignoreDuringBuilds: true, // Disables ESLint checks during builds
  },
};

export default nextConfig;

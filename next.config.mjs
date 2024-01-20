/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        hostname: "d35aaqx5ub95lt.cloudfront.net",
        pathname: "/**",
        port: "",
        protocol: "https",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/hsk/1",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

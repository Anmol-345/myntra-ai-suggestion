/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
          protocol: "https",
          hostname: "upload.wikimedia.org",
      },
      {
          protocol: "https",
          hostname: "fakestoreapi.com",
      },
    ],
  },
};

export default nextConfig;

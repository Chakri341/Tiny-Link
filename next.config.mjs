// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable static generation for API routes
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost'],
    },
  },
  output: 'standalone',

  // Mark API routes as dynamic => no pre-rendering
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store' },
        ],
      },
    ];
  },
};

export default nextConfig;

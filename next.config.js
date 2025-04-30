const withSerwistInit = require('@serwist/next');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rkdykaeilrlrtrowawoe.supabase.co',
      },
      {
        protocol: 'http',
        hostname: 'k.kakaocdn.net',
      },
      {
        protocol: 'http',
        hostname: 't1.kakaocdn.net',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  experimental: {
    serverActions: true,
    scrollRestoration: true,
  },
  webpack(config) {
    const fileLoaderRule = config.module.rules.find((rule) => rule.test?.test?.('.svg'));

    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/,
      },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
        use: ['@svgr/webpack'],
      },
    );

    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
};

const isProd = process.env.NODE_ENV === 'production';
const noWrapper = (config) => config;
// const revision = crypto.randomUUID();

const serwistConfig = {
  swSrc: 'app/sw.ts',
  swDest: 'public/sw.js',
  // cacheOnNavigation: true,
  // additionalPrecacheEntries: [{ url: '/~offline', revision }],
};

const withPWA = isProd ? withSerwistInit(serwistConfig) : noWrapper;

module.exports = withPWA(nextConfig);

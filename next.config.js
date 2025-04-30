const { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD } = require('next/constants');

/** @type {(phase: string, defaultConfig: import("next").NextConfig) => Promise<import("next").NextConfig>} */
module.exports = async (phase) => {
  /** @type {import("next").NextConfig} */
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

  if (phase === PHASE_DEVELOPMENT_SERVER || phase === PHASE_PRODUCTION_BUILD) {
    const withSerwist = (await import('@serwist/next')).default({
      swSrc: 'app/sw.ts',
      swDest: 'public/sw.js',
      disable: process.env.NODE_ENV === 'development',
      // cacheOnNavigation: true,
      // additionalPrecacheEntries: [{ url: '/~offline', revision }],
    });
    return withSerwist(nextConfig);
  }

  return nextConfig;
};

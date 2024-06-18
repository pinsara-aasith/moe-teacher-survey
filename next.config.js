

// This file sets a custom webpack configuration to use your Next.js app
const { i18n } = require('./next-i18next.config');

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: i18n,
  reactStrictMode: true,
  swcMinify: true,
  // Allow images from unsplash.com
  experimental: {
		instrumentationHook: true,
	}
}

module.exports = nextConfig;

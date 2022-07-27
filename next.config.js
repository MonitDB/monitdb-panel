const withSvgr = require('next-plugin-svgr')

const nextConfig = {
  reactStrictMode: true,
  env: {
    siteUrl: process.env.SITE_URL,
    apiBaseUrl: process.env.API_BASE_URL,
    gtmId: process.env.GTM_ID,
  },
  i18n: {
    localeDetection: false,
    locales: ['pt', 'en'],
    defaultLocale: 'pt',
  },
  trailingSlash: true,
  images: {
    domains: ['example.com', 'picsum.photos'],
  },
  experimental: {
    images: {
      layoutRaw: true,
    },
  },
  svgrOptions: {
    titleProp: true,
    icon: true,
  },
}

module.exports = withSvgr(nextConfig)

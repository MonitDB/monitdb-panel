const withSvgr = require('next-plugin-svgr')
const removeImports = require("next-remove-imports")();
const nextConfig = removeImports({
  reactStrictMode: true,
  env: {
    siteUrl: process.env.SITE_URL,
    apiBaseUrl: process.env.API_BASE_URL,
    apiV2: process.env.API_V2,
    apiKey: process.env.API_KEY,
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
    esmExternals: true,
    images: {
      layoutRaw: true,
    },
  },
  svgrOptions: {
    titleProp: true,
    icon: true,
  },
})

module.exports = withSvgr(nextConfig)

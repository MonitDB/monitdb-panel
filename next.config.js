const withSvgr = require('next-plugin-svgr')
const removeImports = require('next-remove-imports')()
const webpack = require('webpack')

const nextConfig = removeImports({
  reactStrictMode: true,
  env: {
    siteUrl: process.env.SITE_URL,
    apiBaseUrl: process.env.API_BASE_URL,
    apiV2: process.env.API_V2,
    apiLocalLLM: process.env.API_LOCAL_LLM,
    localLLMCollectionName: process.env.LOCAL_LLM_COLLECTION_NAME,
    apiKey: process.env.API_KEY,
    gtmId: process.env.GTM_ID,
    // SEC-3: cipherKey/cipherIv NÃO são mais expostos ao bundle (cifra de app removida).
    socket: process.env.SOCKET,
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

import '~/styles/global.css'
import 'xterm/css/xterm.css'

import { ConfigProvider } from 'antd'
import { KBarProvider } from 'kbar'
import Head from 'next/head'
import { DefaultSeo } from 'next-seo'
import { useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import { setLocale } from 'yup'
import { pt } from 'yup-locales'

import KBarSearchComponent from '~/components/kbar/search'
import Main from '~/helpers/main'
import { useConfigStore } from '~/services/state-manager/config-store'

setLocale(pt)

// Tema do MonitDB. Antes disto o AntD entrava com o azul de fabrica (#1890ff) em
// paginacao, links, passos do wizard e toggles, ao lado do indigo da marca no resto
// do produto. Uma cor por papel, definida num sitio so.
const monitTheme = {
  token: {
    colorPrimary: '#5046e5',
    colorInfo: '#5046e5',
    colorLink: '#4338ca',
    colorLinkHover: '#5046e5',
    colorSuccess: '#409d66',
    colorWarning: '#fc9003',
    colorError: '#ff4e4e',
    fontFamily: '"IBM Plex Sans", system-ui, -apple-system, sans-serif',
  },
}

export default function MyApp({ Component, pageProps }) {
  const { loaded, fetchConfig } = useConfigStore()

  useEffect(() => {
    if (!loaded) {
      fetchConfig()
    }
  }, [fetchConfig, loaded])

  if (!loaded) {
    return (
      <>
        <Head>
          <link rel="icon" href={'/images/logos/monitdb.png'} />
        </Head>
      </>
    )
  }

  return (
    <>
      <Head>
        <link rel="icon" href={'/ico.png'} />
      </Head>
      <ConfigProvider theme={monitTheme}>
        <DefaultSeo
          defaultTitle="MonitDB"
          openGraph={{
            type: 'website',
            locale: 'pt-BR',
            url: process.env.siteUrl,
            site_name: 'MonitDB',
          }}
          twitter={{
            handle: '@handle',
            site: '@site',
            cardType: 'summary_large_image',
          }}
        />
        <Main>
          <KBarProvider>
            <KBarSearchComponent />
            <Component {...pageProps} />
          </KBarProvider>
        </Main>
        <ToastContainer position="top-right" />
      </ConfigProvider>
    </>
  )
}

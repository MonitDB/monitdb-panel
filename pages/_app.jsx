import '~/styles/global.css'

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

// token: { colorPrimary: '#5046e5' },

export default function MyApp({ Component, pageProps }) {
  const { loaded, fetchConfig, config } = useConfigStore()

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
        <link rel="icon" href={config.logo ?? '/images/logos/monitdb.png'} />
      </Head>
      <ConfigProvider>
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

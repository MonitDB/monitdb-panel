import '~/styles/global.css'

import { DefaultSeo } from 'next-seo'
import { ToastContainer } from 'react-toastify'
import { setLocale } from 'yup'
import { pt } from 'yup-locales'

import Main from '~/helpers/main'

setLocale(pt)

export default function MyApp({ Component, pageProps }) {
  return (
    <>
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
        <Component {...pageProps} />
      </Main>
      <ToastContainer position="bottom-right" />
    </>
  )
}

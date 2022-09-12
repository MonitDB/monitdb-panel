import '~/styles/global.css'

import { DefaultSeo } from 'next-seo'
import { setLocale } from 'yup'
import { pt } from 'yup-locales'

import Main from '~/helpers/main'

setLocale(pt)

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Main>
        <DefaultSeo
          title="MonitDB"
          titleTemplate="MonitDB"
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
        <Component {...pageProps} />
      </Main>
    </>
  )
}

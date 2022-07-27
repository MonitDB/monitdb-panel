import Router from 'next/router'
import { useEffect, useState } from 'react'
import TagManager from 'react-gtm-module'

import Contexts from '~/contexts/index'

const Main = ({ children }) => {
  const [isLoadingPage, setIsLoadingPage] = useState(false)

  Router.events.on('routeChangeStart', () => {
    setIsLoadingPage(true)
  })

  Router.events.on('routeChangeComplete', () => {
    setIsLoadingPage(false)
  })

  useEffect(() => {
    // How to create a history event change trigger
    // https://morganfeeney.com/how-to/integrate-google-tag-manager-with-next-js#create-a-history-event-change-trigger
    TagManager.initialize({
      gtmId: process.env.gtmId,
    })
  }, [])

  return (
    <Contexts>
      <div
        className={[
          'fixed inset-0 z-50 bg-white bg-opacity-20 transition-all duration-200 ease-in-out',
          !isLoadingPage ? 'invisible opacity-0' : '',
        ].join(' ')}
      />
      {children}
    </Contexts>
  )
}

export default Main
